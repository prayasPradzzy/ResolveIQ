const fs = require('fs')
const path = require('path')
const sqlite3 = require('sqlite3').verbose()

const dbFilePath = path.resolve(
	__dirname,
	'..',
	'..',
	'data',
	process.env.SQLITE_DB_FILE || 'complaints.db',
)

const schemaPath = path.resolve(__dirname, 'schema.sql')
const db = new sqlite3.Database(dbFilePath)

function runQuery(query, params = []) {
	return new Promise((resolve, reject) => {
		db.run(query, params, function onRun(error) {
			if (error) {
				return reject(error)
			}

			return resolve({ lastID: this.lastID, changes: this.changes })
		})
	})
}

function getQuery(query, params = []) {
	return new Promise((resolve, reject) => {
		db.get(query, params, (error, row) => {
			if (error) {
				return reject(error)
			}

			return resolve(row || null)
		})
	})
}

function allQuery(query, params = []) {
	return new Promise((resolve, reject) => {
		db.all(query, params, (error, rows) => {
			if (error) {
				return reject(error)
			}

			return resolve(rows || [])
		})
	})
}

function execQuery(query) {
	return new Promise((resolve, reject) => {
		db.exec(query, (error) => {
			if (error) {
				return reject(error)
			}

			return resolve()
		})
	})
}

async function tableExists(tableName) {
	const row = await getQuery(
		`
			SELECT name
			FROM sqlite_master
			WHERE type = 'table' AND name = ?
		`,
		[tableName],
	)

	return Boolean(row)
}

async function getTableColumns(tableName) {
	const rows = await allQuery(`PRAGMA table_info(${tableName})`)
	return rows.map((row) => row.name)
}

function selectExpr(columns, preferredName, fallbackSql) {
 if (columns.includes(preferredName)) {
  return preferredName
 }

 return fallbackSql
}

async function migrateComplaintsTable() {
 const exists = await tableExists('complaints')

 if (!exists) {
  return
 }

 const columns = await getTableColumns('complaints')
 const targetColumns = [
  'id',
  'raw_text',
  'clean_text',
  'category',
  'subcategory',
  'severity',
  'sentiment',
  'priority_score',
  'summary',
  'status',
  'duplicate_group_id',
	'embedding_vector',
  'created_at',
 ]
 const alreadyCurrent = targetColumns.every((column) => columns.includes(column))

 if (alreadyCurrent) {
  return
 }

 await execQuery('ALTER TABLE complaints RENAME TO complaints_legacy;')

 const schemaSql = fs.readFileSync(schemaPath, 'utf8')
 await execQuery(schemaSql)

 const legacyColumns = await getTableColumns('complaints_legacy')
 const rawExpr = selectExpr(legacyColumns, 'raw_text', "COALESCE(complaint_text, '')")
 const cleanExpr = selectExpr(
  legacyColumns,
  'clean_text',
  selectExpr(legacyColumns, 'cleaned_text', rawExpr),
 )
 const categoryExpr = selectExpr(legacyColumns, 'category', "'general'")
 const subcategoryExpr = selectExpr(legacyColumns, 'subcategory', 'NULL')
 const severityExpr = selectExpr(
  legacyColumns,
  'severity',
  selectExpr(legacyColumns, 'priority', "'medium'"),
 )
 const sentimentExpr = selectExpr(
  legacyColumns,
  'sentiment',
  selectExpr(legacyColumns, 'sentiment_label', "'neutral'"),
 )
 const priorityScoreExpr = selectExpr(
  legacyColumns,
  'priority_score',
  selectExpr(legacyColumns, 'sentiment_score', '0'),
 )
 const summaryExpr = selectExpr(legacyColumns, 'summary', 'NULL')
 const statusExpr = selectExpr(legacyColumns, 'status', "'open'")
 const duplicateGroupExpr = selectExpr(legacyColumns, 'duplicate_group_id', 'NULL')
 const embeddingExpr = selectExpr(legacyColumns, 'embedding_vector', 'NULL')
 const createdAtExpr = selectExpr(legacyColumns, 'created_at', 'CURRENT_TIMESTAMP')

 await runQuery(
  `
   INSERT INTO complaints (
	id,
	raw_text,
	clean_text,
	category,
	subcategory,
	severity,
	sentiment,
	priority_score,
	summary,
	status,
	duplicate_group_id,
	embedding_vector,
	created_at
   )
   SELECT
	id,
	${rawExpr},
	${cleanExpr},
	${categoryExpr},
	${subcategoryExpr},
	${severityExpr},
	${sentimentExpr},
	${priorityScoreExpr},
	${summaryExpr},
	${statusExpr},
	${duplicateGroupExpr},
	${embeddingExpr},
	${createdAtExpr}
   FROM complaints_legacy
  `,
 )

 await execQuery('DROP TABLE complaints_legacy;')
}

async function migrateEntitiesTable() {
 const exists = await tableExists('entities')

 if (!exists) {
  return
 }

 const columns = await getTableColumns('entities')
 const targetColumns = ['id', 'complaint_id', 'product', 'issue_type', 'amount', 'date']
 const alreadyCurrent = targetColumns.every((column) => columns.includes(column))

 if (alreadyCurrent) {
  return
 }

 await execQuery('ALTER TABLE entities RENAME TO entities_legacy;')
 const schemaSql = fs.readFileSync(schemaPath, 'utf8')
 await execQuery(schemaSql)

 const legacyColumns = await getTableColumns('entities_legacy')
 const productExpr = selectExpr(legacyColumns, 'product', selectExpr(legacyColumns, 'entity_value', 'NULL'))
 const issueTypeExpr = selectExpr(legacyColumns, 'issue_type', selectExpr(legacyColumns, 'entity_type', 'NULL'))
 const amountExpr = selectExpr(legacyColumns, 'amount', 'NULL')
 const dateExpr = selectExpr(legacyColumns, 'date', 'NULL')

 await runQuery(
  `
   INSERT INTO entities (id, complaint_id, product, issue_type, amount, date)
   SELECT id, complaint_id, ${productExpr}, ${issueTypeExpr}, ${amountExpr}, ${dateExpr}
   FROM entities_legacy
  `,
 )

 await execQuery('DROP TABLE entities_legacy;')
}

async function migrateResponsesTable() {
 const exists = await tableExists('responses')

 if (!exists) {
  return
 }

 const columns = await getTableColumns('responses')
 const targetColumns = ['id', 'complaint_id', 'generated_response', 'edited_response', 'created_at']
 const alreadyCurrent = targetColumns.every((column) => columns.includes(column))

 if (alreadyCurrent) {
  return
 }

 await execQuery('ALTER TABLE responses RENAME TO responses_legacy;')
 const schemaSql = fs.readFileSync(schemaPath, 'utf8')
 await execQuery(schemaSql)

 const legacyColumns = await getTableColumns('responses_legacy')
 const generatedExpr = selectExpr(
  legacyColumns,
  'generated_response',
  selectExpr(legacyColumns, 'response_text', "''"),
 )
 const editedExpr = selectExpr(legacyColumns, 'edited_response', 'NULL')
 const createdExpr = selectExpr(legacyColumns, 'created_at', 'CURRENT_TIMESTAMP')

 await runQuery(
  `
   INSERT INTO responses (id, complaint_id, generated_response, edited_response, created_at)
   SELECT id, complaint_id, ${generatedExpr}, ${editedExpr}, ${createdExpr}
   FROM responses_legacy
  `,
 )

 await execQuery('DROP TABLE responses_legacy;')
}

async function repairChildForeignKeys() {
	const entitiesFk = await allQuery('PRAGMA foreign_key_list(entities)')
	const responsesFk = await allQuery('PRAGMA foreign_key_list(responses)')

	const entitiesNeedsRepair = entitiesFk.some((row) => row.table !== 'complaints')
	const responsesNeedsRepair = responsesFk.some((row) => row.table !== 'complaints')

	if (entitiesNeedsRepair) {
		await execQuery('ALTER TABLE entities RENAME TO entities_stale_fk;')
		const schemaSql = fs.readFileSync(schemaPath, 'utf8')
		await execQuery(schemaSql)
		await runQuery(
			`
				INSERT INTO entities (id, complaint_id, product, issue_type, amount, date)
				SELECT id, complaint_id, product, issue_type, amount, date
				FROM entities_stale_fk
			`,
		)
		await execQuery('DROP TABLE entities_stale_fk;')
	}

	if (responsesNeedsRepair) {
		await execQuery('ALTER TABLE responses RENAME TO responses_stale_fk;')
		const schemaSql = fs.readFileSync(schemaPath, 'utf8')
		await execQuery(schemaSql)
		await runQuery(
			`
				INSERT INTO responses (id, complaint_id, generated_response, edited_response, created_at)
				SELECT id, complaint_id, generated_response, edited_response, created_at
				FROM responses_stale_fk
			`,
		)
		await execQuery('DROP TABLE responses_stale_fk;')
	}
}

async function initializeDatabase() {
 await execQuery('PRAGMA foreign_keys = OFF;')

 const schemaSql = fs.readFileSync(schemaPath, 'utf8')
 await execQuery(schemaSql)

 await migrateComplaintsTable()
 await migrateEntitiesTable()
 await migrateResponsesTable()
	await repairChildForeignKeys()

 await execQuery(schemaSql)
 await execQuery('PRAGMA foreign_keys = ON;')
}

module.exports = {
	db,
	initializeDatabase,
	runQuery,
	getQuery,
	allQuery,
}
