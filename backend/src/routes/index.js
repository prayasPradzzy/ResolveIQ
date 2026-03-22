const { Router } = require('express')

const healthRoutes = require('./healthRoutes')
const complaintRoutes = require('./complaintRoutes')
const alertRoutes = require('./alertRoutes')

const router = Router()

router.use('/health', healthRoutes)
router.use('/complaints', complaintRoutes)
router.use('/alerts', alertRoutes)

module.exports = router
