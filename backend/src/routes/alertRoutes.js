const { Router } = require('express')
const { getAlerts } = require('../controllers/alertController')

const router = Router()

router.get('/', getAlerts)

module.exports = router
