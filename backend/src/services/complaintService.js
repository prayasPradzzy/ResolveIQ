const {
	classifyComplaint,
	extractEntities,
	summarizeComplaint,
	generateResponse,
	generateEmbedding,
} = require('./aiService')
const {
	getAllComplaints,
	getAlertComplaints,
	getComplaintById,
	getStoredEmbeddings,
	setDuplicateGroupId,
} = require('../models/complaintModel')

const DUPLICATE_SIMILARITY_THRESHOLD = Number(process.env.DUPLICATE_THRESHOLD || 0.85)

function cleanComplaintText(input) {
	return String(input || '')
		.replace(/\s+/g, ' ')
		.trim()
}

async function classifyComplaintData(cleanedText) {
	const classification = await classifyComplaint(cleanedText)

	return {
		category: classification.category || 'general',
		subcategory: classification.subcategory || 'other',
		severity: classification.severity || 'medium',
		sentiment: classification.sentiment || 'neutral',
		priority_score: Number(classification.priority_score ?? 0.5),
	}
}

async function extractComplaintEntities(cleanedText) {
	const entities = await extractEntities(cleanedText)

	return {
		product: entities.product || null,
		issue_type: entities.issue_type || 'unknown',
		amount: entities.amount ?? null,
		date: entities.date || null,
	}
}

async function summarizeComplaintText(cleanedText) {
	const summary = await summarizeComplaint(cleanedText)

	return {
		summary: summary.summary || cleanedText.slice(0, 180),
	}
}

async function generateComplaintResponse(cleanedText) {
	const response = await generateResponse(cleanedText)

	return {
		response:
			response.response ||
			'Thank you for sharing your complaint. We are reviewing this issue and will provide an update shortly.',
	}
}

function cosineSimilarity(vectorA, vectorB) {
	if (!Array.isArray(vectorA) || !Array.isArray(vectorB)) {
		return 0
	}

	const dimensions = Math.min(vectorA.length, vectorB.length)

	if (dimensions === 0) {
		return 0
	}

	let dotProduct = 0
	let magnitudeA = 0
	let magnitudeB = 0

	for (let index = 0; index < dimensions; index += 1) {
		const valueA = Number(vectorA[index]) || 0
		const valueB = Number(vectorB[index]) || 0

		dotProduct += valueA * valueB
		magnitudeA += valueA * valueA
		magnitudeB += valueB * valueB
	}

	if (magnitudeA === 0 || magnitudeB === 0) {
		return 0
	}

	return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB))
}

async function detectDuplicateGroup(cleanedText) {
	const embedding = await generateEmbedding(cleanedText)
	const previousRows = await getStoredEmbeddings(300)

	let bestMatch = null
	let bestScore = -1

	for (const row of previousRows) {
		if (!row.embedding_vector) {
			continue
		}

		let previousVector

		try {
			previousVector = JSON.parse(row.embedding_vector)
		} catch (_error) {
			continue
		}

		const score = cosineSimilarity(embedding, previousVector)

		if (score > bestScore) {
			bestScore = score
			bestMatch = row
		}
	}

	if (!bestMatch || bestScore < DUPLICATE_SIMILARITY_THRESHOLD) {
		return {
			embedding,
			duplicate_group_id: null,
			similarity: bestScore,
		}
	}

	const duplicateGroupId = bestMatch.duplicate_group_id || `dup-${bestMatch.id}`

	if (!bestMatch.duplicate_group_id) {
		await setDuplicateGroupId(bestMatch.id, duplicateGroupId)
	}

	return {
		embedding,
		duplicate_group_id: duplicateGroupId,
		similarity: bestScore,
	}
}

async function fetchComplaints(filters) {
	return getAllComplaints(filters)
}

async function fetchComplaintById(id) {
	return getComplaintById(id)
}

async function fetchAlerts() {
	return getAlertComplaints()
}

module.exports = {
	cleanComplaintText,
	classifyComplaintData,
	extractComplaintEntities,
	summarizeComplaintText,
	generateComplaintResponse,
	detectDuplicateGroup,
	fetchComplaints,
	fetchComplaintById,
	fetchAlerts,
}
