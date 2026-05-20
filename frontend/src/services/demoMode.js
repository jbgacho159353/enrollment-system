// Demo mode — full in-browser mock backend using localStorage.
// Activates automatically when the real backend is unreachable.

function getStore(key) {
  try { return JSON.parse(localStorage.getItem(`demo_${key}`)); } catch { return null; }
}
function setStore(key, data) {
  localStorage.setItem(`demo_${key}`, JSON.stringify(data));
}

function getNextId(entity) {
  const ids = JSON.parse(localStorage.getItem('demo_next_ids') || '{}');
  const id = ids[entity] || 1;
  ids[entity] = id + 1;
  localStorage.setItem('demo_next_ids', JSON.stringify(ids));
  return id;
}

function initIfNeeded() {
  if (localStorage.getItem('demo_initialized')) return;
  const now = new Date().toISOString();
  const today = now.split('T')[0];

  setStore('users', [
    { user_id: 1, username: 'admin',     password: 'admin123',     role: 'admin',     createdAt: now },
    { user_id: 2, username: 'registrar', password: 'registrar123', role: 'registrar', createdAt: now }
  ]);
  setStore('courses', [
    { course_id: 1, course_name: 'Computer Science',        grade_level: 'College', description: 'Introduction to Computer Science',    duration: '4 Years', status: 'Active',   createdAt: now, updatedAt: now },
    { course_id: 2, course_name: 'Information Technology',  grade_level: 'College', description: 'Information Technology Fundamentals', duration: '4 Years', status: 'Active',   createdAt: now, updatedAt: now },
    { course_id: 3, course_name: 'Business Administration', grade_level: 'College', description: 'Business Administration Principles',   duration: '4 Years', status: 'Active',   createdAt: now, updatedAt: now },
    { course_id: 4, course_name: 'Data Science',            grade_level: 'College', description: 'Data Science and Analytics',           duration: '4 Years', status: 'Active',   createdAt: now, updatedAt: now },
    { course_id: 5, course_name: 'Software Engineering',    grade_level: 'College', description: 'Software Engineering Fundamentals',    duration: '4 Years', status: 'Inactive', createdAt: now, updatedAt: now }
  ]);
  setStore('students', [
    { student_id: 1, first_name: 'John',    last_name: 'Doe',      email: 'john.doe@email.com',   gender: 'Male',   grade_level: 'College', contact_number: '09123456789', birth_date: '2000-05-15', createdAt: now, updatedAt: now },
    { student_id: 2, first_name: 'Jane',    last_name: 'Smith',    email: 'jane.smith@email.com', gender: 'Female', grade_level: 'College', contact_number: '09234567890', birth_date: '2001-08-22', createdAt: now, updatedAt: now },
    { student_id: 3, first_name: 'Michael', last_name: 'Johnson',  email: 'michael.j@email.com',  gender: 'Male',   grade_level: 'College', contact_number: '09345678901', birth_date: '2000-03-10', createdAt: now, updatedAt: now },
    { student_id: 4, first_name: 'Sarah',   last_name: 'Williams', email: 'sarah.w@email.com',    gender: 'Female', grade_level: 'College', contact_number: '09456789012', birth_date: '2001-11-05', createdAt: now, updatedAt: now },
    { student_id: 5, first_name: 'David',   last_name: 'Brown',    email: 'david.b@email.com',    gender: 'Male',   grade_level: 'College', contact_number: '09567890123', birth_date: '1999-07-18', createdAt: now, updatedAt: now },
    { student_id: 6, first_name: 'Emily',   last_name: 'Davis',    email: 'emily.d@email.com',    gender: 'Female', grade_level: 'College', contact_number: '09678901234', birth_date: '2001-04-30', createdAt: now, updatedAt: now },
    { student_id: 7, first_name: 'James',   last_name: 'Wilson',   email: 'james.w@email.com',    gender: 'Male',   grade_level: 'College', contact_number: '09789012345', birth_date: '2000-09-12', createdAt: now, updatedAt: now }
  ]);
  setStore('enrollments', [
    { enrollment_id: 1, student_id: 1, course_id: 1, enrollment_date: today, status: 'Active',   createdAt: now, updatedAt: now },
    { enrollment_id: 2, student_id: 2, course_id: 2, enrollment_date: today, status: 'Active',   createdAt: now, updatedAt: now },
    { enrollment_id: 3, student_id: 3, course_id: 3, enrollment_date: today, status: 'Active',   createdAt: now, updatedAt: now },
    { enrollment_id: 4, student_id: 4, course_id: 4, enrollment_date: today, status: 'Inactive', createdAt: now, updatedAt: now },
    { enrollment_id: 5, student_id: 5, course_id: 1, enrollment_date: today, status: 'Active',   createdAt: now, updatedAt: now },
    { enrollment_id: 6, student_id: 6, course_id: 2, enrollment_date: today, status: 'Active',   createdAt: now, updatedAt: now },
    { enrollment_id: 7, student_id: 7, course_id: 3, enrollment_date: today, status: 'Active',   createdAt: now, updatedAt: now }
  ]);
  localStorage.setItem('demo_next_ids', JSON.stringify({ users: 3, students: 8, courses: 6, enrollments: 8 }));
  localStorage.setItem('demo_initialized', '1');
}

function ok(data) { return Promise.resolve({ data }); }
function fail(status, message) {
  const e = new Error(message);
  e.response = { status, data: { message } };
  return Promise.reject(e);
}

function enrich(en, students, courses) {
  const s = students.find(x => x.student_id === en.student_id);
  const c = courses.find(x => x.course_id  === en.course_id);
  return {
    ...en,
    Student: s ? { student_id: s.student_id, first_name: s.first_name, last_name: s.last_name, email: s.email } : null,
    Course:  c ? { course_id:  c.course_id,  course_name: c.course_name } : null
  };
}

const demoMode = {
  handleRequest(config) {
    initIfNeeded();
    const method  = (config.method || 'get').toLowerCase();
    const urlPath = (config.url || '').replace(/^\/api/, '').split('?')[0];
    let body = {};
    try { body = config.data ? (typeof config.data === 'string' ? JSON.parse(config.data) : config.data) : {}; } catch {}
    const params = config.params || {};
    const seg = urlPath.split('/').filter(Boolean); // e.g. ['students','5']

    // AUTH
    if (urlPath === '/auth/login' && method === 'post') return this.login(body);
    if (urlPath === '/auth/me')                          return ok(JSON.parse(localStorage.getItem('user') || '{}'));

    // STUDENTS
    if (seg[0] === 'students') {
      if (!seg[1] && method === 'get')    return this.getStudents(params);
      if (!seg[1] && method === 'post')   return this.createStudent(body);
      if (seg[1]  && method === 'get')    return this.getStudentById(+seg[1]);
      if (seg[1]  && method === 'put')    return this.updateStudent(+seg[1], body);
      if (seg[1]  && method === 'delete') return this.deleteStudent(+seg[1]);
    }

    // COURSES
    if (seg[0] === 'courses') {
      if (!seg[1] && method === 'get')    return this.getCourses(params);
      if (!seg[1] && method === 'post')   return this.createCourse(body);
      if (seg[1]  && method === 'get')    return this.getCourseById(+seg[1]);
      if (seg[1]  && method === 'put')    return this.updateCourse(+seg[1], body);
      if (seg[1]  && method === 'delete') return this.deleteCourse(+seg[1]);
    }

    // ENROLLMENTS
    if (seg[0] === 'enrollments') {
      if (seg[1] === 'stats')              return this.getStats();
      if (!seg[1] && method === 'get')    return this.getEnrollments(params);
      if (!seg[1] && method === 'post')   return this.createEnrollment(body);
      if (seg[1]  && method === 'put')    return this.updateEnrollment(+seg[1], body);
      if (seg[1]  && method === 'delete') return this.deleteEnrollment(+seg[1]);
    }

    // USERS
    if (seg[0] === 'users') {
      if (!seg[1] && method === 'get')    return this.getUsers();
      if (!seg[1] && method === 'post')   return this.createUser(body);
      if (seg[1]  && method === 'delete') return this.deleteUser(+seg[1]);
    }

    return ok({});
  },

  login({ username, password }) {
    const users = getStore('users') || [];
    const user  = users.find(u => u.username === username && u.password === password);
    if (!user) return fail(401, 'Invalid credentials');
    const token = `demo_${btoa(JSON.stringify({ user_id: user.user_id, username: user.username, role: user.role }))}`;
    return ok({ token, user: { user_id: user.user_id, username: user.username, role: user.role } });
  },

  // ── STUDENTS ──────────────────────────────────────
  getStudents({ page = 1, limit = 7, search = '' } = {}) {
    let list = getStore('students') || [];
    if (search) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.first_name.toLowerCase().includes(q) ||
        s.last_name.toLowerCase().includes(q)  ||
        s.email.toLowerCase().includes(q)
      );
    }
    const total   = list.length;
    const offset  = (parseInt(page) - 1) * parseInt(limit);
    const rows    = list.slice(offset, offset + parseInt(limit));
    return ok({ students: rows, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) || 1 });
  },

  getStudentById(id) {
    const s = (getStore('students') || []).find(x => x.student_id === id);
    return s ? ok(s) : fail(404, 'Student not found');
  },

  createStudent(data) {
    const list = getStore('students') || [];
    if (list.find(s => s.email === data.email)) return fail(400, 'Email already registered');
    const now = new Date().toISOString();
    const student = { ...data, student_id: getNextId('students'), createdAt: now, updatedAt: now };
    list.push(student);
    setStore('students', list);
    return ok(student);
  },

  updateStudent(id, data) {
    const list = getStore('students') || [];
    const idx  = list.findIndex(s => s.student_id === id);
    if (idx === -1) return fail(404, 'Student not found');
    list[idx] = { ...list[idx], ...data, student_id: id, updatedAt: new Date().toISOString() };
    setStore('students', list);
    return ok(list[idx]);
  },

  deleteStudent(id) {
    const list = getStore('students') || [];
    const idx  = list.findIndex(s => s.student_id === id);
    if (idx === -1) return fail(404, 'Student not found');
    list.splice(idx, 1);
    setStore('students', list);
    const enrollments = (getStore('enrollments') || []).filter(e => e.student_id !== id);
    setStore('enrollments', enrollments);
    return ok({ message: 'Student deleted successfully' });
  },

  // ── COURSES ───────────────────────────────────────
  getCourses({ search = '' } = {}) {
    let list = getStore('courses') || [];
    if (search) list = list.filter(c => c.course_name.toLowerCase().includes(search.toLowerCase()));
    return ok(list);
  },

  getCourseById(id) {
    const c = (getStore('courses') || []).find(x => x.course_id === id);
    return c ? ok(c) : fail(404, 'Course not found');
  },

  createCourse(data) {
    const list = getStore('courses') || [];
    const now  = new Date().toISOString();
    const course = { ...data, course_id: getNextId('courses'), createdAt: now, updatedAt: now };
    list.push(course);
    setStore('courses', list);
    return ok(course);
  },

  updateCourse(id, data) {
    const list = getStore('courses') || [];
    const idx  = list.findIndex(c => c.course_id === id);
    if (idx === -1) return fail(404, 'Course not found');
    list[idx] = { ...list[idx], ...data, course_id: id, updatedAt: new Date().toISOString() };
    setStore('courses', list);
    return ok(list[idx]);
  },

  deleteCourse(id) {
    const list = getStore('courses') || [];
    const idx  = list.findIndex(c => c.course_id === id);
    if (idx === -1) return fail(404, 'Course not found');
    list.splice(idx, 1);
    setStore('courses', list);
    return ok({ message: 'Course deleted successfully' });
  },

  // ── ENROLLMENTS ───────────────────────────────────
  getEnrollments({ page = 1, limit = 8, status } = {}) {
    let list     = getStore('enrollments') || [];
    const students = getStore('students') || [];
    const courses  = getStore('courses')  || [];
    if (status) list = list.filter(e => e.status === status);
    const total  = list.length;
    const offset = (parseInt(page) - 1) * parseInt(limit);
    const rows   = list.slice(offset, offset + parseInt(limit)).map(e => enrich(e, students, courses));
    return ok({ enrollments: rows, total, page: parseInt(page), totalPages: Math.ceil(total / parseInt(limit)) || 1 });
  },

  createEnrollment(data) {
    const list     = getStore('enrollments') || [];
    const students = getStore('students')    || [];
    const courses  = getStore('courses')     || [];
    const sid = parseInt(data.student_id);
    const cid = parseInt(data.course_id);
    if (!students.find(s => s.student_id === sid)) return fail(404, 'Student not found');
    if (!courses.find(c => c.course_id === cid))   return fail(404, 'Course not found');
    if (list.find(e => e.student_id === sid && e.course_id === cid))
      return fail(400, 'Student is already enrolled in this course');
    const now = new Date().toISOString();
    const en  = { enrollment_id: getNextId('enrollments'), student_id: sid, course_id: cid,
                  enrollment_date: data.enrollment_date || now.split('T')[0],
                  status: data.status || 'Active', createdAt: now, updatedAt: now };
    list.push(en);
    setStore('enrollments', list);
    return ok(enrich(en, students, courses));
  },

  updateEnrollment(id, data) {
    const list     = getStore('enrollments') || [];
    const students = getStore('students')    || [];
    const courses  = getStore('courses')     || [];
    const idx = list.findIndex(e => e.enrollment_id === id);
    if (idx === -1) return fail(404, 'Enrollment not found');
    list[idx] = { ...list[idx], ...data, enrollment_id: id, updatedAt: new Date().toISOString() };
    setStore('enrollments', list);
    return ok(enrich(list[idx], students, courses));
  },

  deleteEnrollment(id) {
    const list = getStore('enrollments') || [];
    const idx  = list.findIndex(e => e.enrollment_id === id);
    if (idx === -1) return fail(404, 'Enrollment not found');
    list.splice(idx, 1);
    setStore('enrollments', list);
    return ok({ message: 'Enrollment deleted successfully' });
  },

  // ── USERS ─────────────────────────────────────────
  getUsers() {
    return ok((getStore('users') || []).map(({ password, ...rest }) => rest));
  },

  createUser({ username, password, role }) {
    if (!username || !password) return fail(400, 'Username and password are required');
    const list = getStore('users') || [];
    if (list.find(u => u.username === username)) return fail(400, 'Username already exists');
    const now  = new Date().toISOString();
    const user = { user_id: getNextId('users'), username, password, role: role || 'registrar', createdAt: now };
    list.push(user);
    setStore('users', list);
    return ok({ user_id: user.user_id, username: user.username, role: user.role });
  },

  deleteUser(id) {
    const list = getStore('users') || [];
    const idx  = list.findIndex(u => u.user_id === id);
    if (idx === -1) return fail(404, 'User not found');
    list.splice(idx, 1);
    setStore('users', list);
    return ok({ message: 'User deleted successfully' });
  },

  // ── DASHBOARD STATS ───────────────────────────────
  getStats() {
    const students    = getStore('students')    || [];
    const courses     = getStore('courses')     || [];
    const enrollments = getStore('enrollments') || [];
    const activeUsers = enrollments.filter(e => e.status === 'Active').length;

    const chartLabels = [], chartData = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const ds = d.toISOString().split('T')[0];
      chartLabels.push(ds);
      chartData.push(enrollments.filter(e => e.enrollment_date === ds).length);
    }

    const recentEnrollments = [...enrollments]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .slice(0, 5)
      .map(e => enrich(e, students, courses));

    return ok({ totalStudents: students.length, totalCourses: courses.length,
                totalEnrollments: enrollments.length, activeUsers,
                recentEnrollments, chartLabels, chartData });
  }
};

export default demoMode;
