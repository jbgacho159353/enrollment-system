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

const emptyForm = {
  first_name: '', last_name: '', email: '',
  contact_number: '', birth_date: '', gender: '', grade_level: ''
};

function fmtId(id) {
  return `STU-${String(id).padStart(3, '0')}`;
}

export default function Students() {
  const [students, setStudents]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [page, setPage]           = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch]       = useState('');
  const [loading, setLoading]     = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [errors, setErrors]       = useState({});
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

  /* Debounce search */
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setErrors({}); setModalOpen(true); };
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
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/></svg>
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
                    <td className="td-name">{s.first_name} {s.last_name}</td>
                    <td style={{ color: 'var(--text-mid)' }}>{s.email}</td>
                    <td>{s.gender || '—'}</td>
                    <td>{s.grade_level || '—'}</td>
                    <td>{s.contact_number || '—'}</td>
                    <td>
                      <div className="td-actions">
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

        {/* Pagination */}
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
              {totalPages > 5 && <span className="pagination-btn" style={{ border: 'none', cursor: 'default' }}>…</span>}
              <button className="pagination-btn" onClick={() => setPage(p => p + 1)} disabled={page === totalPages}>
                <IconChevRight />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
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
        {/* Personal Information */}
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

        {/* Academic Information */}
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
