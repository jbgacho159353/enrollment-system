const router = require('express').Router();
const auth = require('../middleware/auth');
const { getAllCourses, getCourseById, createCourse, updateCourse, deleteCourse } = require('../controllers/courseController');

router.get('/',    auth, getAllCourses);
router.get('/:id', auth, getCourseById);
router.post('/',   auth, createCourse);
router.put('/:id', auth, updateCourse);
router.delete('/:id', auth, deleteCourse);

module.exports = router;
