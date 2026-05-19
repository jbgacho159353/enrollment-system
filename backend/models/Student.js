const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Student = sequelize.define('Student', {
  student_id:     { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  first_name:     { type: DataTypes.STRING(50), allowNull: false },
  last_name:      { type: DataTypes.STRING(50), allowNull: false },
  birth_date:     { type: DataTypes.DATEONLY },
  gender:         { type: DataTypes.ENUM('Male', 'Female', 'Other') },
  grade_level:    { type: DataTypes.STRING(20) },
  email:          { type: DataTypes.STRING(100), allowNull: false, unique: true },
  contact_number: { type: DataTypes.STRING(20) }
}, { tableName: 'students', timestamps: true });

module.exports = Student;
