const { Course } = require('../models');
const { Op } = require('sequelize');

exports.getAllCourses = async (req, res) => {
  try {
    const { search = '' } = req.query;
    const where = search
      ? { course_name: { [Op.like]: `%${search}%` } }
      : {};
    const courses = await Course.findAll({ where, order: [['course_id', 'ASC']] });
    res.json(courses);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createCourse = async (req, res) => {
  try {
    const { course_name, grade_level, description, duration, status } = req.body;
    if (!course_name) return res.status(400).json({ message: 'Course name is required' });
    const course = await Course.create({ course_name, grade_level, description, duration, status });
    res.status(201).json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    await course.update(req.body);
    res.json(course);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteCourse = async (req, res) => {
  try {
    const course = await Course.findByPk(req.params.id);
    if (!course) return res.status(404).json({ message: 'Course not found' });
    await course.destroy();
    res.json({ message: 'Course deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
