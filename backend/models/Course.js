const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Course = sequelize.define('Course', {
  course_id:   { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  course_name: { type: DataTypes.STRING(100), allowNull: false },
  grade_level: { type: DataTypes.STRING(20) },
  description: { type: DataTypes.TEXT },
  duration:    { type: DataTypes.STRING(50) },
  status:      { type: DataTypes.ENUM('Active', 'Inactive'), defaultValue: 'Active' }
}, { tableName: 'courses', timestamps: true });

module.exports = Course;
