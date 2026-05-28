import React, { useState, useEffect, useCallback, useRef } from 'react';
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
const IconCamera = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
    <circle cx="12" cy="13" r="4"/>
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

/* Photo if available, gradient initials as fallback */
function Avatar({ student, size = 32, fontSize = 12 }) {
  const [err, setErr] = React.useState(false);
  // reset error whenever the avatar src changes
  React.useEffect(() => { setErr(false); }, [student.avatar]);

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
      style={{ width: size, height: size, background: avatarGradient(student.student_id || 0), fontSize }}
    >
      {initials}
    </div>
  );
}

/* ── Utility ── */
function fmtDate(str) {
  if (!str) return null;
  return new Date(str).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}
function calcAge(birthDate) {
  if (!birthDate) return null;
  return Math.floor((Date.now() - new Date(birthDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
}
function fmtId(id) {
  return `STU-${String(id).padStart(3, '0')}`;
}

/* ── Info cell (detail view) ── */
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

/* ── Read-only student profile ── */
function StudentDetail({ student }) {
  const age = calcAge(student.birth_date);
  return (
    <div className="sdetail">
      <div className="sdetail-hero" style={{ background: avatarGradient(student.student_id) }}>
        <Avatar student={student} size={80} fontSize={26} />
        <div className="sdetail-hero-info">
          <h3 className="sdetail-name">{student.first_name} {student.last_name}</h3>
          <div className="sdetail-hero-meta">
            <span className="sdetail-id-badge">{fmtId(student.student_id)}</span>
            {student.grade_level && <span className="sdetail-meta-pill">{student.grade_level}</span>}
            {student.year_level  && <span className="sdetail-meta-pill">{student.year_level}</span>}
          </div>
          {student.academic_year && <p className="sdetail-hero-sub">A.Y. {student.academic_year}</p>}
        </div>
        {student.gpa && (
          <div className="sdetail-gpa-badge">
            <span className="sdetail-gpa-num">{Number(student.gpa).toFixed(2)}</span>
            <span className="sdetail-gpa-lbl">GPA</span>
          </div>
        )}
      </div>

      <div className="sdetail-section">
        <div className="sdetail-section-title"><IconUser /> Personal Information</div>
        <div className="sdetail-grid">
          <InfoCell icon={<IconMail />}     label="Email Address" value={student.email} />
          <InfoCell icon={<IconPhone />}    label="Phone Number"  value={student.contact_number} />
          <InfoCell icon={<IconCalendar />} label="Date of Birth" value={fmtDate(student.birth_date)} />
          <InfoCell icon={<IconUser />}     label="Age"           value={age ? `${age} years old` : null} />
          <InfoCell icon={<IconUser />}     label="Gender"        value={student.gender} />
          <InfoCell icon={<IconDroplet />}  label="Blood Type"    value={student.blood_type} />
          <InfoCell icon={<IconGlobe />}    label="Nationality"   value={student.nationality} />
          <InfoCell icon={<IconMapPin />}   label="Address"       value={student.address} wide />
        </div>
      </div>

      <div className="sdetail-section">
        <div className="sdetail-section-title"><IconBook /> Academic Information</div>
        <div className="sdetail-grid">
          <InfoCell icon={<IconBook />}     label="Grade Level"   value={student.grade_level} />
          <InfoCell icon={<IconGrid />}     label="Year Level"    value={student.year_level} />
          <InfoCell icon={<IconShield />}   label="Section"       value={student.section ? `Section ${student.section}` : null} />
          <InfoCell icon={<IconCalendar />} label="Academic Year" value={student.academic_year} />
          <InfoCell icon={<IconAward />}    label="GPA"           value={student.gpa ? `${Number(student.gpa).toFixed(2)} / 4.00` : null} />
        </div>
      </div>

      {(student.guardian_name || student.guardian_contact) && (
        <div className="sdetail-section">
          <div className="sdetail-section-title"><IconShield /> Emergency Contact</div>
          <div className="sdetail-grid">
            <InfoCell icon={<IconUser />}   label="Full Name"      value={student.guardian_name} />
            <InfoCell icon={<IconShield />} label="Relationship"   value={student.guardian_relation} />
            <InfoCell icon={<IconPhone />}  label="Contact Number" value={student.guardian_contact} />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Form default ── */
const emptyForm = {
  avatar: '',
  first_name: '', last_name: '', email: '',
  contact_number: '', birth_date: '', gender: '',
  blood_type: '', nationality: '', address: '',
  grade_level: '', year_level: '', section: '',
  academic_year: '', gpa: '',
  guardian_name: '', guardian_relation: '', guardian_contact: '',
};

export default function Students() {
  const [students, setStudents]             = useState([]);
  const [total, setTotal]                   = useState(0);
  const [page, setPage]                     = useState(1);
  const [totalPages, setTotalPages]         = useState(1);
  const [search, setSearch]                 = useState('');
  const [loading, setLoading]               = useState(true);
  const [modalOpen, setModalOpen]           = useState(false);
  const [detailOpen, setDetailOpen]         = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [editing, setEditing]               = useState(null);
  const [form, setForm]                     = useState(emptyForm);
  const [saving, setSaving]                 = useState(false);
  const [errors, setErrors]                 = useState({});
  const fileInputRef                        = useRef(null);
  const { toasts, addToast, removeToast }   = useToast();

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

  const f = (key) => (e) => {
    setForm(prev => ({ ...prev, [key]: e.target.value }));
    setErrors(prev => ({ ...prev, [key]: '' }));
  };

  const openView = (s) => { setSelectedStudent(s); setDetailOpen(true); };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (s) => {
    setEditing(s);
    setForm({
      avatar:            s.avatar            || '',
      first_name:        s.first_name        || '',
      last_name:         s.last_name         || '',
      email:             s.email             || '',
      contact_number:    s.contact_number    || '',
      birth_date:        s.birth_date        || '',
      gender:            s.gender            || '',
      blood_type:        s.blood_type        || '',
      nationality:       s.nationality       || '',
      address:           s.address           || '',
      grade_level:       s.grade_level       || '',
      year_level:        s.year_level        || '',
      section:           s.section           || '',
      academic_year:     s.academic_year     || '',
      gpa:               s.gpa != null ? String(s.gpa) : '',
      guardian_name:     s.guardian_name     || '',
      guardian_relation: s.guardian_relation || '',
      guardian_contact:  s.guardian_contact  || '',
    });
    setErrors({});
    setModalOpen(true);
  };

  /* Resize-and-crop selected file to 220×220 JPEG, store as data URL */
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const SIZE = 220;
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext('2d');
        const side = Math.min(img.width, img.height);
        const sx = (img.width - side) / 2;
        const sy = (img.height - side) / 2;
        ctx.drawImage(img, sx, sy, side, side, 0, 0, SIZE, SIZE);
        setForm(prev => ({ ...prev, avatar: canvas.toDataURL('image/jpeg', 0.75) }));
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
    // reset so the same file can be re-selected if needed
    e.target.value = '';
  };

  const validate = () => {
    const e = {};
    if (!form.first_name.trim()) e.first_name = 'Required';
    if (!form.last_name.trim())  e.last_name  = 'Required';
    if (!form.email.trim())      e.email      = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (form.gpa && (isNaN(form.gpa) || +form.gpa < 0 || +form.gpa > 4))
      e.gpa = 'Must be 0.00 – 4.00';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    const payload = { ...form, gpa: form.gpa !== '' ? parseFloat(form.gpa) : null };
    try {
      if (editing) {
        await api.put(`/students/${editing.student_id}`, payload);
        addToast('Student updated successfully', 'success');
      } else {
        await api.post('/students', payload);
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

  /* Proxy student object for the edit-modal avatar preview */
  const previewStudent = {
    ...form,
    student_id: editing?.student_id || 0,
    first_name: form.first_name || '?',
    last_name:  form.last_name  || '',
  };

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
          <IconPlus /> Add Student
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
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
              </svg>
              <h3>No students found</h3>
              <p>{search ? 'Try a different search term' : 'Click "Add Student" to get started'}</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th><th>Name</th><th>Email</th>
                  <th>Gender</th><th>Grade Level</th><th>Contact</th><th>Actions</th>
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
                        <button className="action-btn view"   onClick={() => openView(s)}   title="View Details"><IconEye /></button>
                        <button className="action-btn edit"   onClick={() => openEdit(s)}   title="Edit"><IconEdit /></button>
                        <button className="action-btn delete" onClick={() => handleDelete(s)} title="Delete"><IconDelete /></button>
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
            <div className="pagination-info">Showing {startItem}–{endItem} of {total} results</div>
            <div className="pagination-controls">
              <button className="pagination-btn" onClick={() => setPage(p => p - 1)} disabled={page === 1}>
                <IconChevLeft />
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map((p) => (
                <button key={p} className={`pagination-btn ${p === page ? 'active' : ''}`} onClick={() => setPage(p)}>
                  {p}
                </button>
              ))}
              {totalPages > 5 && <span className="pagination-btn" style={{ border: 'none', cursor: 'default' }}>…</span>}
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
        subtitle={editing ? 'Update all student information' : 'Fill in student details below'}
        wide
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update Student' : 'Save Student'}
            </button>
          </>
        }
      >
        {/* ── Photo picker ── */}
        <div className="savatar-section">
          <div className="savatar-wrap" onClick={() => fileInputRef.current?.click()} title="Click to change photo">
            <Avatar student={previewStudent} size={90} fontSize={28} />
            <div className="savatar-overlay">
              <IconCamera />
              <span>Change Photo</span>
            </div>
          </div>
          <p className="savatar-hint">Click the photo to upload a new image</p>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
          />
        </div>

        {/* ── Personal Information ── */}
        <div className="form-section-title">Personal Information</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">First Name *</label>
            <input className={`form-input ${errors.first_name ? 'error' : ''}`} placeholder="First name" value={form.first_name} onChange={f('first_name')} />
            {errors.first_name && <span className="form-error">{errors.first_name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Last Name *</label>
            <input className={`form-input ${errors.last_name ? 'error' : ''}`} placeholder="Last name" value={form.last_name} onChange={f('last_name')} />
            {errors.last_name && <span className="form-error">{errors.last_name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Email Address *</label>
            <input type="email" className={`form-input ${errors.email ? 'error' : ''}`} placeholder="Email address" value={form.email} onChange={f('email')} />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Phone Number</label>
            <input className="form-input" placeholder="e.g. 09123456789" value={form.contact_number} onChange={f('contact_number')} />
          </div>
          <div className="form-group">
            <label className="form-label">Date of Birth</label>
            <input type="date" className="form-input" value={form.birth_date} onChange={f('birth_date')} />
          </div>
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-select" value={form.gender} onChange={f('gender')}>
              <option value="">Select gender</option>
              <option>Male</option><option>Female</option><option>Other</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Blood Type</label>
            <select className="form-select" value={form.blood_type} onChange={f('blood_type')}>
              <option value="">Select blood type</option>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bt => <option key={bt}>{bt}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Nationality</label>
            <input className="form-input" placeholder="e.g. Filipino" value={form.nationality} onChange={f('nationality')} />
          </div>
          <div className="form-group form-col-full">
            <label className="form-label">Home Address</label>
            <input className="form-input" placeholder="Street, City, Province" value={form.address} onChange={f('address')} />
          </div>
        </div>

        {/* ── Academic Information ── */}
        <div className="form-section-title">Academic Information</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Grade Level</label>
            <select className="form-select" value={form.grade_level} onChange={f('grade_level')}>
              <option value="">Select grade level</option>
              {['Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12','College'].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Year Level</label>
            <select className="form-select" value={form.year_level} onChange={f('year_level')}>
              <option value="">Select year level</option>
              {['1st Year','2nd Year','3rd Year','4th Year','5th Year'].map(y => <option key={y}>{y}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Section</label>
            <input className="form-input" placeholder="e.g. A, B, C" value={form.section} onChange={f('section')} />
          </div>
          <div className="form-group">
            <label className="form-label">Academic Year</label>
            <input className="form-input" placeholder="e.g. 2024-2025" value={form.academic_year} onChange={f('academic_year')} />
          </div>
          <div className="form-group">
            <label className="form-label">GPA</label>
            <input
              type="number" step="0.01" min="0" max="4"
              className={`form-input ${errors.gpa ? 'error' : ''}`}
              placeholder="0.00 – 4.00"
              value={form.gpa}
              onChange={f('gpa')}
            />
            {errors.gpa && <span className="form-error">{errors.gpa}</span>}
          </div>
        </div>

        {/* ── Emergency Contact ── */}
        <div className="form-section-title">Emergency Contact</div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Guardian Name</label>
            <input className="form-input" placeholder="Full name" value={form.guardian_name} onChange={f('guardian_name')} />
          </div>
          <div className="form-group">
            <label className="form-label">Relationship</label>
            <select className="form-select" value={form.guardian_relation} onChange={f('guardian_relation')}>
              <option value="">Select relationship</option>
              {['Mother','Father','Guardian','Sibling','Spouse','Other'].map(r => <option key={r}>{r}</option>)}
            </select>
          </div>
          <div className="form-group form-col-full">
            <label className="form-label">Contact Number</label>
            <input className="form-input" placeholder="e.g. 09112345678" value={form.guardian_contact} onChange={f('guardian_contact')} />
          </div>
        </div>
      </Modal>
    </div>
  );
}
