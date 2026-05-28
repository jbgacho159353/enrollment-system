import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import Toast, { useToast } from '../components/Toast';

/* ── SVG Icons ── */
const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);
const IconSearch = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconEdit = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
);
const IconDelete = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
  </svg>
);
const IconEye = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const IconChevLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IconChevRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);
const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
);
const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.56 2h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.18 6.18l.91-.91a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
);
const IconCalendar = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
  </svg>
);
const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);
const IconMapPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);
const IconDroplet = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
  </svg>
);
const IconGlobe = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);
const IconBook = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const IconAward = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
  </svg>
);
const IconGrid = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
    <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
  </svg>
);
const IconShield = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
  </svg>
);

/* ── Avatar helpers ── */
const AVATAR_GRADIENTS = [
  ['#4f46e5', '#7c3aed'],
  ['#059669', '#10b981'],
  ['#d97706', '#f59e0b'],
  ['#dc2626', '#ef4444'],
  ['#0891b2', '#06b6d4'],
  ['#7c3aed', '#a855f7'],
  ['#be185d', '#ec4899'],
];

function avatarGradient(id) {
  const [a, b] = AVATAR_GRADIENTS[(id - 1) % AVATAR_GRADIENTS.length];
  return `linear-gradient(135deg, ${a}, ${b})`;
}

/* Renders a photo if available, falls back to gradient initials */
function Avatar({ student, size = 32, fontSize = 12 }) {
  const [err, setErr] = React.useState(false);
  const initials = `${student.first_name?.[0] || ''}${student.last_name?.[0] || ''}`.toUpperCase();

  if (student.avatar && !err) {
    return (
      <img
        src={student.avatar}
        alt={`${student.first_name} ${student.last_name}`}
        className="student-avatar-img"
        style={{ width: size, height: size }}
        onError={() => setErr(true)}
      />
    );
  }
  return (
    <div
      className="student-avatar-fallback"
      style={{ width: size, height: size, background: avatarGradient(student.student_id), fontSize }}
    >
      {initials}
    </div>
  );
}

function fmtDate(str) {
  if (!str) return null;
  return new Date(str).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function calcAge(birthDate) {
  if (!birthDate) return null;
  const diff = Date.now() - new Date(birthDate).getTime();
  return Math.floor(diff / (365.25 * 24 * 60 * 60 * 1000));
}

function fmtId(id) {
  return `STU-${String(id).padStart(3, '0')}`;
}

/* ── Info cell for detail view ── */
function InfoCell({ icon, label, value, wide }) {
  return (
    <div className={`sdetail-cell${wide ? ' wide' : ''}`}>
      <span className="sdetail-cell-icon">{icon}</span>
      <div className="sdetail-cell-body">
        <span className="sdetail-cell-label">{label}</span>
        <span className="sdetail-cell-value">{value || '—'}</span>
      </div>
    </div>
  );
}

/* ── Student Detail view ── */
function StudentDetail({ student }) {
  const age = calcAge(student.birth_date);

  return (
    <div className="sdetail">
      {/* ── Profile header ── */}
      <div className="sdetail-hero" style={{ background: avatarGradient(student.student_id) }}>
        <Avatar student={student} size={80} fontSize={26} />
        <div className="sdetail-hero-info">
          <h3 className="sdetail-name">{student.first_name} {student.last_name}</h3>
          <div className="sdetail-hero-meta">
            <span className="sdetail-id-badge">{fmtId(student.student_id)}</span>
            {student.grade_level && (
              <span className="sdetail-meta-pill">{student.grade_level}</span>
            )}
            {student.year_level && (
              <span className="sdetail-meta-pill">{student.year_level}</span>
            )}
          </div>
          {student.academic_year && (
            <p className="sdetail-hero-sub">A.Y. {student.academic_year}</p>
          )}
        </div>
        {student.gpa && (
          <div className="sdetail-gpa-badge">
            <span className="sdetail-gpa-num">{Number(student.gpa).toFixed(2)}</span>
            <span className="sdetail-gpa-lbl">GPA</span>
          </div>
        )}
      </div>

      {/* ── Personal Information ── */}
      <div className="sdetail-section">
        <div className="sdetail-section-title">
          <IconUser /> Personal Information
        </div>
        <div className="sdetail-grid">
          <InfoCell icon={<IconMail />}     label="Email Address"  value={student.email} />
          <InfoCell icon={<IconPhone />}    label="Phone Number"   value={student.contact_number} />
          <InfoCell icon={<IconCalendar />} label="Date of Birth"  value={fmtDate(student.birth_date)} />
          <InfoCell icon={<IconUser />}     label="Age"            value={age ? `${age} years old` : null} />
          <InfoCell icon={<IconUser />}     label="Gender"         value={student.gender} />
          <InfoCell icon={<IconDroplet />}  label="Blood Type"     value={student.blood_type} />
          <InfoCell icon={<IconGlobe />}    label="Nationality"    value={student.nationality} />
          <InfoCell icon={<IconMapPin />}   label="Address"        value={student.address} wide />
        </div>
      </div>

      {/* ── Academic Information ── */}
      <div className="sdetail-section">
        <div className="sdetail-section-title">
          <IconBook /> Academic Information
        </div>
        <div className="sdetail-grid">
          <InfoCell icon={<IconBook />}    label="Grade Level"    value={student.grade_level} />
          <InfoCell icon={<IconGrid />}    label="Year Level"     value={student.year_level} />
          <InfoCell icon={<IconShield />}  label="Section"        value={student.section ? `Section ${student.section}` : null} />
          <InfoCell icon={<IconCalendar />}label="Academic Year"  value={student.academic_year} />
          <InfoCell icon={<IconAward />}   label="GPA"            value={student.gpa ? `${Number(student.gpa).toFixed(2)} / 4.00` : null} />
        </div>
      </div>

      {/* ── Emergency Contact ── */}
      {(student.guardian_name || student.guardian_contact) && (
        <div className="sdetail-section">
          <div className="sdetail-section-title">
            <IconShield /> Emergency Contact
          </div>
          <div className="sdetail-grid">
            <InfoCell icon={<IconUser />}  label="Full Name"      value={student.guardian_name} />
            <InfoCell icon={<IconShield />}label="Relationship"   value={student.guardian_relation} />
            <InfoCell icon={<IconPhone />} label="Contact Number" value={student.guardian_contact} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Empty form ── */
const emptyForm = {
  first_name: '', last_name: '', email: '',
  contact_number: '', birth_date: '', gender: '', grade_level: ''
};

export default function Students() {
  const [students, setStudents]       = useState([]);
  const [total, setTotal]             = useState(0);
  const [page, setPage]               = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [search, setSearch]           = useState('');
  const [loading, setLoading]         = useState(true);
  const [modalOpen, setModalOpen]     = useState(false);
  const [detailOpen, setDetailOpen]   = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editing, setEditing]         = useState(null);
  const [form, setForm]               = useState(emptyForm);
  const [saving, setSaving]           = useState(false);
  const [errors, setErrors]           = useState({});
  const { toasts, addToast, removeToast } = useToast();

  const limit = 7;

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/students', { params: { page, limit, search } });
      setStudents(data.students);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      addToast('Failed to load students', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, search, addToast]);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const openView = (s) => { setSelectedStudent(s); setDetailOpen(true); };
  const openAdd  = () => { setEditing(null); setForm(emptyForm); setErrors({}); setModalOpen(true); };
  const openEdit = (s) => {
    setEditing(s);
    setForm({
      first_name: s.first_name, last_name: s.last_name, email: s.email,
      contact_number: s.contact_number || '', birth_date: s.birth_date || '',
      gender: s.gender || '', grade_level: s.grade_level || ''
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'Required';
    if (!form.last_name.trim())  e.last_name  = 'Required';
    if (!form.email.trim())      e.email      = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/students/${editing.student_id}`, form);
        addToast('Student updated successfully', 'success');
      } else {
        await api.post('/students', form);
        addToast('Student added successfully', 'success');
      }
      setModalOpen(false);
      fetchStudents();
    } catch (err) {
      addToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (s) => {
    if (!window.confirm(`Delete ${s.first_name} ${s.last_name}?`)) return;
    try {
      await api.delete(`/students/${s.student_id}`);
      addToast('Student deleted', 'success');
      fetchStudents();
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const startItem = (page - 1) * limit + 1;
  const endItem   = Math.min(page * limit, total);

  return (
    <div>
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Page Header */}
      <div className="page-header">
        <div className="page-header-left">
          <h1>Students</h1>
          <div className="breadcrumb">Home / <span>Students</span></div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <IconPlus />
          Add Student
        </button>
      </div>

      {/* Table Card */}
      <div className="card">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <span style={{ fontSize: 13, color: 'var(--text-light)' }}>
              {total} student{total !== 1 ? 's' : ''} total
            </span>
          </div>
          <div className="table-toolbar-right">
            <div className="search-box">
              <IconSearch />
              <input
                type="text"
                placeholder="Search students…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading-wrapper"><div className="spinner" /><span>Loading…</span></div>
          ) : students.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
              <h3>No students found</h3>
              <p>{search ? 'Try a different search term' : 'Click "Add Student" to get started'}</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Gender</th>
                  <th>Grade Level</th>
                  <th>Contact</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((s) => (
                  <tr key={s.student_id}>
                    <td><span className="td-id">{fmtId(s.student_id)}</span></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar student={s} size={34} fontSize={12} />
                        <span className="td-name">{s.first_name} {s.last_name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-mid)' }}>{s.email}</td>
                    <td>{s.gender || '—'}</td>
                    <td>{s.grade_level || '—'}</td>
                    <td>{s.contact_number || '—'}</td>
                    <td>
                      <div className="td-actions">
                        <button className="action-btn view" onClick={() => openView(s)} title="View Details">
                          <IconEye />
                        </button>
                        <button className="action-btn edit" onClick={() => openEdit(s)} title="Edit">
                          <IconEdit />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(s)} title="Delete">
                          <IconDelete />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {!loading && students.length > 0 && (
          <div className="pagination">
            <div className="pagination-info">
              Showing {startItem}–{endItem} of {total} results
            </div>
            <div className="pagination-controls">
              <button className="pagination-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                <IconChevLeft />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  className={`pagination-btn ${p === page ? 'active' : ''}`}
                  onClick={() => setPage(p)}
                >
                  {p}
                </button>
              ))}
              {totalPages > 5 && (
                <span className="pagination-btn" style={{ border: 'none', cursor: 'default' }}>…</span>
              )}
              <button className="pagination-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                <IconChevRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Student Detail Modal ── */}
      <Modal
        open={detailOpen}
        onClose={() => setDetailOpen(false)}
        title="Student Profile"
        subtitle="Complete student information"
        wide
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setDetailOpen(false)}>Close</button>
            <button className="btn btn-primary" onClick={() => { setDetailOpen(false); openEdit(selectedStudent); }}>
              Edit Profile
            </button>
          </>
        }
      >
        {selectedStudent && <StudentDetail student={selectedStudent} />}
      </Modal>

      {/* ── Add / Edit Modal ── */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Student' : 'Add New Student'}
        subtitle={editing ? 'Update student information' : 'Fill in student details below'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update Student' : 'Save Student'}
            </button>
          </>
        }
      >
        <div className="form-section-title">Personal Information</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input
              className={`form-input ${errors.first_name ? 'error' : ''}`}
              placeholder="Enter first name"
              value={form.first_name}
              onChange={(e) => { setForm({ ...form, first_name: e.target.value }); setErrors({ ...errors, first_name: '' }); }}
            />
            {errors.first_name && <span className="form-error">{errors.first_name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input
              className={`form-input ${errors.last_name ? 'error' : ''}`}
              placeholder="Enter last name"
              value={form.last_name}
              onChange={(e) => { setForm({ ...form, last_name: e.target.value }); setErrors({ ...errors, last_name: '' }); }}
            />
            {errors.last_name && <span className="form-error">{errors.last_name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className={`form-input ${errors.email ? 'error' : ''}`}
              placeholder="Enter email address"
              value={form.email}
              onChange={(e) => { setForm({ ...form, email: e.target.value }); setErrors({ ...errors, email: '' }); }}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input
              className="form-input"
              placeholder="Enter phone number"
              value={form.contact_number}
              onChange={(e) => setForm({ ...form, contact_number: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input
              type="date"
              className="form-input"
              value={form.birth_date}
              onChange={(e) => setForm({ ...form, birth_date: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-select" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
              <option value="">Select gender</option>
              <option>Male</option>
              <option>Female</option>
              <option>Other</option>
            </select>
          </div>
        </div>

        <div className="form-section-title">Academic Information</div>
        <div className="form-grid single">
          <div className="form-group">
            <label className="form-label">Grade Level</label>
            <select className="form-select" value={form.grade_level} onChange={(e) => setForm({ ...form, grade_level: e.target.value })}>
              <option value="">Select grade level</option>
              {['Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12','College'].map((g) => (
                <option key={g}>{g}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
