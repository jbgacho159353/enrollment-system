const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Enrollment = sequelize.define('Enrollment', {
  enrollment_id:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  student_id:      { type: DataTypes.INTEGER, allowNull: false },
  course_id:       { type: DataTypes.INTEGER, allowNull: false },
  enrollment_date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  status:          { type: DataTypes.ENUM('Active', 'Inactive', 'Completed', 'Dropped'), defaultValue: 'Active' }
}, { tableName: 'enrollments', timestamps: true });

module.exports = Enrollment;
