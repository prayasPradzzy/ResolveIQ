const { fetchAlerts } = require('../services/complaintService')

async function getAlerts(_req, res, next) {
  try {
    const alerts = await fetchAlerts()
    return res.json(alerts)
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  getAlerts,
}
