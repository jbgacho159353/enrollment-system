const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAllStudents, getStudentById, createStudent, updateStudent, deleteStudent } = require('../controllers/studentController');

router.get('/',    auth, getAllStudents);
router.get('/:id', auth, getStudentById);
router.post('/',   auth, createStudent);
router.put('/:id', auth, updateStudent);
router.delete('/:id', auth, deleteStudent);

module.exports = router;
