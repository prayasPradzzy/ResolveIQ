const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

export async function getComplaints(filters = {}) {
	const params = new URLSearchParams()

	if (filters.severity) {
		params.set('severity', filters.severity)
	}

	if (filters.category) {
		params.set('category', filters.category)
	}

	const queryString = params.toString()
	const url = queryString
		? `${API_BASE_URL}/complaints?${queryString}`
		: `${API_BASE_URL}/complaints`

	const response = await fetch(url)
	const payload = await response.json().catch(() => [])

	if (!response.ok) {
		const message = payload?.error || 'Failed to fetch complaints.'
		throw new Error(message)
	}

	return Array.isArray(payload) ? payload : []
}

export async function getComplaintById(id) {
	const response = await fetch(`${API_BASE_URL}/complaints/${id}`)
	const payload = await response.json().catch(() => ({}))

	if (!response.ok) {
		throw new Error(payload.error || 'Failed to fetch complaint detail.')
	}

	return payload
}

export async function getAlerts() {
	const response = await fetch(`${API_BASE_URL}/alerts`)
	const payload = await response.json().catch(() => [])

	if (!response.ok) {
		const message = payload?.error || 'Failed to fetch alerts.'
		throw new Error(message)
	}

	return Array.isArray(payload) ? payload : []
}

export async function submitComplaint(text) {
	const response = await fetch(`${API_BASE_URL}/complaints`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({ text }),
	})

	const payload = await response.json().catch(() => ({}))

	if (!response.ok) {
		throw new Error(payload.error || 'Failed to submit complaint.')
	}

	return payload
}
