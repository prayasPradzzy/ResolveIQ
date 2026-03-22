const { Router } = require('express')

const {
	createComplaint,
	listComplaints,
	getComplaintDetail,
} = require('../controllers/complaintController')

const router = Router()

router.post('/', createComplaint)
router.get('/', listComplaints)
router.get('/:id', getComplaintDetail)

module.exports = router
