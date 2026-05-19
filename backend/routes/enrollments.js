const router = require('express').Router();
const auth = require('../middleware/auth');
const {
  getAllEnrollments, getEnrollmentById,
  createEnrollment, updateEnrollment,
  deleteEnrollment, getDashboardStats
} = require('../controllers/enrollmentController');

router.get('/stats', auth, getDashboardStats);
router.get('/',      auth, getAllEnrollments);
router.get('/:id',   auth, getEnrollmentById);
router.post('/',     auth, createEnrollment);
router.put('/:id',   auth, updateEnrollment);
router.delete('/:id',auth, deleteEnrollment);

module.exports = router;
