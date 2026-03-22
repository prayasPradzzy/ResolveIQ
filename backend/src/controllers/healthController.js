function getHealth(_req, res) {
	res.json({
		ok: true,
		service: 'complaint-intelligence-api',
		timestamp: new Date().toISOString(),
	})
}

module.exports = {
	getHealth,
}
