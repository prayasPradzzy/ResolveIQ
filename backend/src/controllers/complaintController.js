const {
	cleanComplaintText,
	classifyComplaintData,
	extractComplaintEntities,
	summarizeComplaintText,
	generateComplaintResponse,
	detectDuplicateGroup,
	fetchComplaints,
	fetchComplaintById,
} = require('../services/complaintService')
const {
	insertComplaint,
	insertEntities,
	insertResponse,
	getComplaintById,
} = require('../models/complaintModel')

function normalizeFilterValue(value) {
	if (typeof value !== 'string') {
		return undefined
	}

	const trimmed = value.trim()
	return trimmed.length > 0 ? trimmed : undefined
}

async function createComplaint(req, res, next) {
	try {
		const inputText = req.body?.text

		if (!inputText || typeof inputText !== 'string') {
			return res.status(400).json({ error: 'Complaint text is required.' })
		}

		const cleanedText = cleanComplaintText(inputText)

		if (!cleanedText) {
			return res.status(400).json({ error: 'Complaint text cannot be empty.' })
		}

		const classification = await classifyComplaintData(cleanedText)
		const entitiesResult = await extractComplaintEntities(cleanedText)
		const summaryResult = await summarizeComplaintText(cleanedText)
		const responseResult = await generateComplaintResponse(cleanedText)
		const duplicateResult = await detectDuplicateGroup(cleanedText)

		const complaintId = await insertComplaint({
			raw_text: inputText,
			clean_text: cleanedText,
			category: classification.category,
			subcategory: classification.subcategory,
			severity: classification.severity,
			sentiment: classification.sentiment,
			priority_score: classification.priority_score,
			status: 'open',
			summary: summaryResult.summary,
			duplicate_group_id: duplicateResult.duplicate_group_id,
			embedding_vector: JSON.stringify(duplicateResult.embedding),
		})

		await insertEntities({
			complaint_id: complaintId,
			entities: [
				{
					product: entitiesResult.product,
					issue_type: entitiesResult.issue_type,
					amount: entitiesResult.amount,
					date: entitiesResult.date,
				},
			],
		})

		await insertResponse({
			complaint_id: complaintId,
			generated_response: responseResult.response,
			edited_response: null,
		})

		const savedRecord = await getComplaintById(complaintId)
		const { entities, response, ...complaint } = savedRecord

		return res.status(201).json({
			complaint,
			entities,
			response,
			duplicate: {
				duplicate_group_id: complaint.duplicate_group_id,
				similarity: duplicateResult.similarity,
			},
		})
	} catch (error) {
		return next(error)
	}
}

async function listComplaints(req, res, next) {
	try {
		const filters = {
			severity: normalizeFilterValue(req.query.severity),
			category: normalizeFilterValue(req.query.category),
			status: normalizeFilterValue(req.query.status),
		}

		const complaints = await fetchComplaints(filters)
		return res.json(complaints)
	} catch (error) {
		return next(error)
	}
}

async function getComplaintDetail(req, res, next) {
	try {
		const complaintId = Number(req.params.id)

		if (!Number.isInteger(complaintId) || complaintId <= 0) {
			return res.status(400).json({ error: 'Invalid complaint id.' })
		}

		const complaint = await fetchComplaintById(complaintId)

		if (!complaint) {
			return res.status(404).json({ error: 'Complaint not found.' })
		}

		return res.json(complaint)
	} catch (error) {
		return next(error)
	}
}

module.exports = {
	createComplaint,
	listComplaints,
	getComplaintDetail,
}
