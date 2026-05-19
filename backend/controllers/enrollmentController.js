const { Enrollment, Student, Course } = require('../models');
const { Op } = require('sequelize');

const includeStudentCourse = [
  { model: Student, attributes: ['student_id', 'first_name', 'last_name', 'email'] },
  { model: Course,  attributes: ['course_id', 'course_name'] }
];

exports.getAllEnrollments = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const where = status ? { status } : {};

    const { count, rows } = await Enrollment.findAndCountAll({
      where,
      include: includeStudentCourse,
      limit: parseInt(limit),
      offset,
      order: [['enrollment_date', 'DESC']]
    });

    res.json({ enrollments: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getEnrollmentById = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id, { include: includeStudentCourse });
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    res.json(enrollment);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createEnrollment = async (req, res) => {
  try {
    const { student_id, course_id, enrollment_date, status } = req.body;
    if (!student_id || !course_id) {
      return res.status(400).json({ message: 'Student ID and Course ID are required' });
    }

    const student = await Student.findByPk(student_id);
    if (!student) return res.status(404).json({ message: 'Student not found' });

    const course = await Course.findByPk(course_id);
    if (!course) return res.status(404).json({ message: 'Course not found' });

    const existing = await Enrollment.findOne({ where: { student_id, course_id } });
    if (existing) return res.status(400).json({ message: 'Student is already enrolled in this course' });

    const enrollment = await Enrollment.create({
      student_id,
      course_id,
      enrollment_date: enrollment_date || new Date().toISOString().split('T')[0],
      status: status || 'Active'
    });

    const full = await Enrollment.findByPk(enrollment.enrollment_id, { include: includeStudentCourse });
    res.status(201).json(full);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    await enrollment.update(req.body);
    const updated = await Enrollment.findByPk(req.params.id, { include: includeStudentCourse });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteEnrollment = async (req, res) => {
  try {
    const enrollment = await Enrollment.findByPk(req.params.id);
    if (!enrollment) return res.status(404).json({ message: 'Enrollment not found' });
    await enrollment.destroy();
    res.json({ message: 'Enrollment deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    const totalStudents    = await Student.count();
    const totalCourses     = await Course.count();
    const totalEnrollments = await Enrollment.count();
    const activeUsers      = await Enrollment.count({ where: { status: 'Active' } });

    const recentEnrollments = await Enrollment.findAll({
      include: includeStudentCourse,
      limit: 5,
      order: [['createdAt', 'DESC']]
    });

    // Build chart data: enrollments per day for the last 7 days
    const labels = [];
    const data   = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      labels.push(dateStr);
      const count = await Enrollment.count({
        where: { enrollment_date: dateStr }
      });
      data.push(count);
    }

    res.json({ totalStudents, totalCourses, totalEnrollments, activeUsers, recentEnrollments, chartLabels: labels, chartData: data });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
