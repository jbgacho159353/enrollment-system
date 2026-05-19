const User = require('./User');
const Student = require('./Student');
const Course = require('./Course');
const Enrollment = require('./Enrollment');

Student.hasMany(Enrollment, { foreignKey: 'student_id', onDelete: 'CASCADE' });
Enrollment.belongsTo(Student, { foreignKey: 'student_id' });

Course.hasMany(Enrollment, { foreignKey: 'course_id', onDelete: 'CASCADE' });
Enrollment.belongsTo(Course, { foreignKey: 'course_id' });

module.exports = { User, Student, Course, Enrollment };
