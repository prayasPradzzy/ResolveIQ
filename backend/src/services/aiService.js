const AI_PROVIDER = (process.env.AI_PROVIDER || 'openai').toLowerCase()

function normalizeJsonContent(text) {
	const trimmed = String(text || '').trim()

	if (!trimmed) {
		throw new Error('AI returned empty content.')
	}

	const withoutCodeFence = trimmed
		.replace(/^```json\s*/i, '')
		.replace(/^```\s*/i, '')
		.replace(/```$/i, '')
		.trim()

	return JSON.parse(withoutCodeFence)
}

function buildStructuredPrompt(task, outputContract, text) {
	return [
		'You are an assistant for complaint intelligence analysis.',
		task,
		`Output Contract: ${outputContract}`,
		'Return ONLY valid JSON with no explanation.',
		'Do not include markdown, code fences, or extra keys.',
		`Complaint Text: ${text}`,
	].join('\n')
}

async function callOpenAI(prompt) {
	const apiKey = process.env.OPENAI_API_KEY

	if (!apiKey) {
		throw new Error('Missing OPENAI_API_KEY.')
	}

	const response = await fetch('https://api.openai.com/v1/chat/completions', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
			temperature: 0.1,
			response_format: { type: 'json_object' },
			messages: [
				{
					role: 'system',
					content:
						'You must return strict JSON only. Never include prose, markdown, or comments.',
				},
				{ role: 'user', content: prompt },
			],
		}),
	})

	if (!response.ok) {
		const errorText = await response.text()
		throw new Error(`OpenAI request failed: ${response.status} ${errorText}`)
	}

	const data = await response.json()
	const content = data?.choices?.[0]?.message?.content
	return normalizeJsonContent(content)
}

async function callGemini(prompt) {
	const apiKey = process.env.GEMINI_API_KEY

	if (!apiKey) {
		throw new Error('Missing GEMINI_API_KEY.')
	}

	const model = process.env.GEMINI_MODEL || 'gemini-1.5-flash'
	const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			generationConfig: {
				temperature: 0.1,
			},
			contents: [
				{
					role: 'user',
					parts: [
						{
							text: `${prompt}\nReturn ONLY valid JSON with no explanation.`,
						},
					],
				},
			],
		}),
	})

	if (!response.ok) {
		const errorText = await response.text()
		throw new Error(`Gemini request failed: ${response.status} ${errorText}`)
	}

	const data = await response.json()
	const content =
		data?.candidates?.[0]?.content?.parts?.map((part) => part.text).join('') || ''

	return normalizeJsonContent(content)
}

async function callAiForJson(prompt) {
	if (AI_PROVIDER === 'gemini') {
		return callGemini(prompt)
	}

	return callOpenAI(prompt)
}

function normalizeVector(vector) {
	if (!Array.isArray(vector) || vector.length === 0) {
		return []
	}

	return vector.map((value) => Number(value) || 0)
}

function embeddingFallback(text, dimensions = 64) {
	const vector = new Array(dimensions).fill(0)
	const normalized = String(text || '').toLowerCase()

	for (let index = 0; index < normalized.length; index += 1) {
		const code = normalized.charCodeAt(index)
		vector[code % dimensions] += 1
	}

	return vector
}

async function createOpenAIEmbedding(text) {
	const apiKey = process.env.OPENAI_API_KEY

	if (!apiKey) {
		throw new Error('Missing OPENAI_API_KEY.')
	}

	const response = await fetch('https://api.openai.com/v1/embeddings', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${apiKey}`,
		},
		body: JSON.stringify({
			model: process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small',
			input: text,
		}),
	})

	if (!response.ok) {
		const errorText = await response.text()
		throw new Error(`OpenAI embedding request failed: ${response.status} ${errorText}`)
	}

	const payload = await response.json()
	const embedding = payload?.data?.[0]?.embedding

	if (!Array.isArray(embedding)) {
		throw new Error('OpenAI embedding response was empty.')
	}

	return normalizeVector(embedding)
}

async function createGeminiEmbedding(text) {
	const apiKey = process.env.GEMINI_API_KEY

	if (!apiKey) {
		throw new Error('Missing GEMINI_API_KEY.')
	}

	const model = process.env.GEMINI_EMBEDDING_MODEL || 'text-embedding-004'
	const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:embedContent?key=${apiKey}`

	const response = await fetch(endpoint, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			model: `models/${model}`,
			content: {
				parts: [{ text }],
			},
		}),
	})

	if (!response.ok) {
		const errorText = await response.text()
		throw new Error(`Gemini embedding request failed: ${response.status} ${errorText}`)
	}

	const payload = await response.json()
	const embedding = payload?.embedding?.values

	if (!Array.isArray(embedding)) {
		throw new Error('Gemini embedding response was empty.')
	}

	return normalizeVector(embedding)
}

async function generateEmbedding(text) {
	try {
		if (AI_PROVIDER === 'gemini') {
			return await createGeminiEmbedding(text)
		}

		return await createOpenAIEmbedding(text)
	} catch (_error) {
		return embeddingFallback(text)
	}
}

function classifyFallback(text) {
	const normalized = String(text || '').toLowerCase()
	const isCritical = /danger|unsafe|fire|fraud|threat|injury/.test(normalized)
	const isBilling = /bill|charge|refund|invoice|payment/.test(normalized)

	return {
		category: isBilling ? 'billing' : 'general',
		subcategory: isBilling ? 'double_charge' : 'other',
		severity: isCritical ? 'critical' : 'medium',
		sentiment: isCritical ? 'angry' : 'neutral',
		priority_score: isCritical ? 0.95 : 0.5,
	}
}

function entitiesFallback() {
	return {
		product: null,
		issue_type: 'unknown',
		amount: null,
		date: null,
	}
}

function summaryFallback(text) {
	return {
		summary: String(text || '').slice(0, 180),
	}
}

function responseFallback() {
	return {
		response:
			'Thank you for sharing your complaint. We are reviewing this issue and will provide an update shortly.',
	}
}

async function classifyComplaint(text) {
	try {
		const prompt = buildStructuredPrompt(
			'Classify the complaint intent and urgency.',
			'{"category":"string","subcategory":"string","severity":"low|medium|high|critical","sentiment":"happy|neutral|frustrated|angry","priority_score":"number between 0 and 1"}',
			text,
		)

		const result = await callAiForJson(prompt)

		return {
			category: result.category || 'general',
			subcategory: result.subcategory || 'other',
			severity: result.severity || 'medium',
			sentiment: result.sentiment || 'neutral',
			priority_score: Number(result.priority_score ?? 0.5),
		}
	} catch (_error) {
		return classifyFallback(text)
	}
}

async function extractEntities(text) {
	try {
		const prompt = buildStructuredPrompt(
			'Extract complaint entities used for operations and reporting.',
			'{"product":"string|null","issue_type":"string","amount":"number|null","date":"YYYY-MM-DD|string|null"}',
			text,
		)

		const result = await callAiForJson(prompt)

		return {
			product: result.product || null,
			issue_type: result.issue_type || 'unknown',
			amount: result.amount ?? null,
			date: result.date || null,
		}
	} catch (_error) {
		return entitiesFallback()
	}
}

async function summarizeComplaint(text) {
	try {
		const prompt = buildStructuredPrompt(
			'Create a concise summary for dashboard display.',
			'{"summary":"string"}',
			text,
		)

		const result = await callAiForJson(prompt)

		return {
			summary: result.summary || String(text || '').slice(0, 180),
		}
	} catch (_error) {
		return summaryFallback(text)
	}
}

async function generateResponse(text) {
	try {
		const prompt = buildStructuredPrompt(
			'Write an empathetic, professional customer response draft.',
			'{"response":"string"}',
			text,
		)

		const result = await callAiForJson(prompt)

		return {
			response:
				result.response ||
				'Thank you for sharing your complaint. We are reviewing this issue and will provide an update shortly.',
		}
	} catch (_error) {
		return responseFallback()
	}
}

module.exports = {
	classifyComplaint,
	extractEntities,
	summarizeComplaint,
	generateResponse,
	generateEmbedding,
}
