const bcrypt = require('bcryptjs');
const path = require('path');

require('dotenv').config({ path: path.join(__dirname, '../.env') });

const { sequelize } = require('../config/db');
const { User, Student, Course, Enrollment } = require('../models');

async function seed() {
  try {
    await sequelize.authenticate();
    console.log('Connected to database.');

    await sequelize.sync({ force: true });
    console.log('Tables created/reset.');

    // Users
    const [adminPwd, regPwd] = await Promise.all([
      bcrypt.hash('admin123', 10),
      bcrypt.hash('registrar123', 10)
    ]);
    await User.bulkCreate([
      { username: 'admin',     password: adminPwd, role: 'admin' },
      { username: 'registrar', password: regPwd,   role: 'registrar' }
    ]);
    console.log('Users seeded.');

    // Courses
    const courses = await Course.bulkCreate([
      { course_name: 'Computer Science',       grade_level: 'College', description: 'Introduction to Computer Science',       duration: '4 Years', status: 'Active' },
      { course_name: 'Information Technology', grade_level: 'College', description: 'Information Technology Fundamentals',    duration: '4 Years', status: 'Active' },
      { course_name: 'Business Administration',grade_level: 'College', description: 'Business Administration Principles',     duration: '4 Years', status: 'Active' },
      { course_name: 'Data Science',           grade_level: 'College', description: 'Data Science and Analytics',             duration: '4 Years', status: 'Active' },
      { course_name: 'Software Engineering',   grade_level: 'College', description: 'Software Engineering Fundamentals',      duration: '4 Years', status: 'Inactive' }
    ]);
    console.log('Courses seeded.');

    // Students
    const students = await Student.bulkCreate([
      { first_name: 'John',    last_name: 'Doe',      birth_date: '2000-05-15', gender: 'Male',   grade_level: 'College', email: 'john.doe@email.com',     contact_number: '09123456789' },
      { first_name: 'Jane',    last_name: 'Smith',    birth_date: '2001-08-22', gender: 'Female', grade_level: 'College', email: 'jane.smith@email.com',   contact_number: '09234567890' },
      { first_name: 'Michael', last_name: 'Johnson',  birth_date: '2000-03-10', gender: 'Male',   grade_level: 'College', email: 'michael.j@email.com',    contact_number: '09345678901' },
      { first_name: 'Sarah',   last_name: 'Williams', birth_date: '2001-11-05', gender: 'Female', grade_level: 'College', email: 'sarah.w@email.com',      contact_number: '09456789012' },
      { first_name: 'David',   last_name: 'Brown',    birth_date: '1999-07-18', gender: 'Male',   grade_level: 'College', email: 'david.b@email.com',      contact_number: '09567890123' },
      { first_name: 'Emily',   last_name: 'Davis',    birth_date: '2001-04-30', gender: 'Female', grade_level: 'College', email: 'emily.d@email.com',      contact_number: '09678901234' },
      { first_name: 'James',   last_name: 'Wilson',   birth_date: '2000-09-12', gender: 'Male',   grade_level: 'College', email: 'james.w@email.com',      contact_number: '09789012345' }
    ]);
    console.log('Students seeded.');

    // Enrollments
    const today = new Date().toISOString().split('T')[0];
    await Enrollment.bulkCreate([
      { student_id: students[0].student_id, course_id: courses[0].course_id, enrollment_date: today, status: 'Active' },
      { student_id: students[1].student_id, course_id: courses[1].course_id, enrollment_date: today, status: 'Active' },
      { student_id: students[2].student_id, course_id: courses[2].course_id, enrollment_date: today, status: 'Active' },
      { student_id: students[3].student_id, course_id: courses[3].course_id, enrollment_date: today, status: 'Inactive' },
      { student_id: students[4].student_id, course_id: courses[0].course_id, enrollment_date: today, status: 'Active' },
      { student_id: students[5].student_id, course_id: courses[1].course_id, enrollment_date: today, status: 'Active' },
      { student_id: students[6].student_id, course_id: courses[2].course_id, enrollment_date: today, status: 'Active' }
    ]);
    console.log('Enrollments seeded.');

    console.log('\n✅  Database seeded successfully!');
    console.log('   Admin     → username: admin      | password: admin123');
    console.log('   Registrar → username: registrar  | password: registrar123');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
