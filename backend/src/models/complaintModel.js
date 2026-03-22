const { runQuery, getQuery, allQuery } = require('../config/database')

async function insertComplaint(data) {
	const result = await runQuery(
		`
			INSERT INTO complaints (
				raw_text,
				clean_text,
				category,
				subcategory,
				severity,
				sentiment,
				priority_score,
				status,
				summary,
				duplicate_group_id,
				embedding_vector
			) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
		`,
		[
			data.raw_text,
			data.clean_text,
			data.category,
			data.subcategory || null,
			data.severity,
			data.sentiment,
			Number(data.priority_score ?? 0),
			data.status || 'open',
			data.summary || null,
			data.duplicate_group_id || null,
			data.embedding_vector || null,
		],
	)

	return result.lastID
}

async function insertEntities(data) {
 	const complaintId = data.complaint_id
 	const entities = data.entities

	if (!complaintId || !Array.isArray(entities) || entities.length === 0) {
		return
	}

	for (const entity of entities) {
		if (!entity) {
			continue
		}

		await runQuery(
			`
				INSERT INTO entities (complaint_id, product, issue_type, amount, date)
				VALUES (?, ?, ?, ?, ?)
			`,
			[
				complaintId,
				entity.product || null,
				entity.issue_type || null,
				entity.amount ?? null,
				entity.date || null,
			],
		)
	}
}

async function insertResponse(data) {
	await runQuery(
		`
			INSERT INTO responses (complaint_id, generated_response, edited_response)
			VALUES (?, ?, ?)
		`,
		[data.complaint_id, data.generated_response, data.edited_response || null],
	)
}

async function getAllComplaints(filters = {}) {
	const whereClauses = []
	const params = []

	if (filters.severity) {
		whereClauses.push('severity = ?')
		params.push(filters.severity)
	}

	if (filters.category) {
		whereClauses.push('category = ?')
		params.push(filters.category)
	}

	if (filters.status) {
		whereClauses.push('status = ?')
		params.push(filters.status)
	}

	const whereSql = whereClauses.length > 0 ? `WHERE ${whereClauses.join(' AND ')}` : ''

	return allQuery(
		`
			SELECT
				id,
				raw_text,
				clean_text,
				category,
				subcategory,
				severity,
				sentiment,
				priority_score,
				status,
				summary,
				created_at AS createdAt
			FROM complaints
			${whereSql}
			ORDER BY created_at DESC
		`,
		params,
	)
}

async function getAlertComplaints() {
	return allQuery(
		`
			SELECT
				id,
				summary,
				severity,
				sentiment,
				priority_score,
				status,
				created_at AS createdAt,
				CASE
					WHEN severity = 'critical' AND sentiment = 'angry' AND (priority_score > 80 OR priority_score > 0.8)
						THEN 'Critical severity and angry high-priority complaint'
					WHEN severity = 'critical'
						THEN 'Severity is critical'
					WHEN sentiment = 'angry' AND (priority_score > 80 OR priority_score > 0.8)
						THEN 'Angry sentiment with high priority score'
				END AS alert_reason
			FROM complaints
			WHERE severity = 'critical'
				OR (sentiment = 'angry' AND (priority_score > 80 OR priority_score > 0.8))
			ORDER BY created_at DESC
		`,
	)
}

async function getStoredEmbeddings(limit = 200) {
	return allQuery(
		`
			SELECT
				id,
				duplicate_group_id,
				embedding_vector
			FROM complaints
			WHERE embedding_vector IS NOT NULL
			ORDER BY created_at DESC
			LIMIT ?
		`,
		[limit],
	)
}

async function setDuplicateGroupId(complaintId, duplicateGroupId) {
	await runQuery(
		`
			UPDATE complaints
			SET duplicate_group_id = ?
			WHERE id = ?
		`,
		[duplicateGroupId, complaintId],
	)
}

async function getComplaintById(complaintId) {
	const complaint = await getQuery(
		`
			SELECT
				id,
				raw_text,
				clean_text,
				category,
				subcategory,
				severity,
				sentiment,
				priority_score,
				status,
				summary,
				duplicate_group_id,
				created_at AS createdAt
			FROM complaints
			WHERE id = ?
		`,
		[complaintId],
	)

	if (!complaint) {
		return null
	}

	const entities = await allQuery(
		`
			SELECT
				id,
				product,
				issue_type,
				amount,
				date
			FROM entities
			WHERE complaint_id = ?
			ORDER BY id ASC
		`,
		[complaintId],
	)

	const response = await getQuery(
		`
			SELECT
				id,
				generated_response,
				edited_response,
				created_at AS createdAt
			FROM responses
			WHERE complaint_id = ?
			ORDER BY id DESC
			LIMIT 1
		`,
		[complaintId],
	)

	const normalizedResponse = response || {
		id: null,
		generated_response: null,
		edited_response: null,
		createdAt: null,
	}

	return {
		...complaint,
		entities,
		response: normalizedResponse,
	}
}

module.exports = {
	insertComplaint,
	insertEntities,
	insertResponse,
	getAllComplaints,
	getAlertComplaints,
	getStoredEmbeddings,
	setDuplicateGroupId,
	getComplaintById,
}
