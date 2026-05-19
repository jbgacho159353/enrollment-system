const { Student, Enrollment, Course } = require('../models');
const { Op } = require('sequelize');

exports.getAllStudents = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

    const where = search
      ? {
          [Op.or]: [
            { first_name:  { [Op.like]: `%${search}%` } },
            { last_name:   { [Op.like]: `%${search}%` } },
            { email:       { [Op.like]: `%${search}%` } }
          ]
        }
      : {};

    const { count, rows } = await Student.findAndCountAll({
      where,
      limit: parseInt(limit),
      offset,
      order: [['student_id', 'ASC']]
    });

    res.json({ students: rows, total: count, page: parseInt(page), totalPages: Math.ceil(count / parseInt(limit)) });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getStudentById = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id, {
      include: [{ model: Enrollment, include: [Course] }]
    });
    if (!student) return res.status(404).json({ message: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.createStudent = async (req, res) => {
  try {
    const { first_name, last_name, birth_date, gender, grade_level, email, contact_number } = req.body;
    if (!first_name || !last_name || !email) {
      return res.status(400).json({ message: 'First name, last name, and email are required' });
    }

    const exists = await Student.findOne({ where: { email } });
    if (exists) return res.status(400).json({ message: 'Email already registered' });

    const student = await Student.create({ first_name, last_name, birth_date, gender, grade_level, email, contact_number });
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.update(req.body);
    res.json(student);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ message: 'Student not found' });
    await student.destroy();
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
