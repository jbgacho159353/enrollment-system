import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import Toast, { useToast } from '../components/Toast';

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

const emptyForm = { course_name: '', grade_level: '', description: '', duration: '', status: 'Active' };

function fmtCourseId(id) {
  const prefixes = { 1: 'CS', 2: 'IT', 3: 'BA', 4: 'DS', 5: 'SE' };
  return `${prefixes[id] || 'C'}-${String(id * 100 + 1)}`;
}

export default function Courses() {
  const [courses, setCourses]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch]       = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [errors, setErrors]       = useState({});
  const { toasts, addToast, removeToast } = useToast();

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/courses', { params: { search } });
      setCourses(data);
    } catch {
      addToast('Failed to load courses', 'error');
    } finally {
      setLoading(false);
    }
  }, [search, addToast]);

  useEffect(() => { fetchCourses(); }, [fetchCourses]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const openAdd = () => { setEditing(null); setForm(emptyForm); setErrors({}); setModalOpen(true); };
  const openEdit = (c) => {
    setEditing(c);
    setForm({ course_name: c.course_name, grade_level: c.grade_level || '', description: c.description || '', duration: c.duration || '', status: c.status });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.course_name.trim()) e.course_name = 'Required';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/courses/${editing.course_id}`, form);
        addToast('Course updated successfully', 'success');
      } else {
        await api.post('/courses', form);
        addToast('Course added successfully', 'success');
      }
      setModalOpen(false);
      fetchCourses();
    } catch (err) {
      addToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete course "${c.course_name}"?`)) return;
    try {
      await api.delete(`/courses/${c.course_id}`);
      addToast('Course deleted', 'success');
      fetchCourses();
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  return (
    <div>
      <Toast toasts={toasts} onRemove={removeToast} />

      <div className="page-header">
        <div className="page-header-left">
          <h1>Courses</h1>
          <div className="breadcrumb">Home / <span>Courses</span></div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <IconPlus />
          Add Course
        </button>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <span style={{ fontSize: 13, color: 'var(--text-light)' }}>
              {courses.length} course{courses.length !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="table-toolbar-right">
            <div className="search-box">
              <IconSearch />
              <input
                type="text"
                placeholder="Search courses…"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading-wrapper"><div className="spinner" /><span>Loading…</span></div>
          ) : courses.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              <h3>No courses found</h3>
              <p>{search ? 'Try a different search term' : 'Click "Add Course" to get started'}</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Course Code</th>
                  <th>Course Name</th>
                  <th>Description</th>
                  <th>Grade Level</th>
                  <th>Duration</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c) => (
                  <tr key={c.course_id}>
                    <td><span className="td-id">{fmtCourseId(c.course_id)}</span></td>
                    <td className="td-name">{c.course_name}</td>
                    <td style={{ color: 'var(--text-mid)', maxWidth: 220 }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {c.description || '—'}
                      </span>
                    </td>
                    <td>{c.grade_level || '—'}</td>
                    <td>{c.duration || '—'}</td>
                    <td>
                      <span className={`badge ${c.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                        {c.status}
                      </span>
                    </td>
                    <td>
                      <div className="td-actions">
                        <button className="action-btn edit" onClick={() => openEdit(c)} title="Edit">
                          <IconEdit />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(c)} title="Delete">
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
      </div>

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Course' : 'Add New Course'}
        subtitle={editing ? 'Update course information' : 'Fill in course details below'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update Course' : 'Save Course'}
            </button>
          </>
        }
      >
        <div className="form-section-title">Course Information</div>
        <div className="form-grid">
          <div className="form-group form-col-full">
            <label className="form-label">Course Name *</label>
            <input
              className={`form-input ${errors.course_name ? 'error' : ''}`}
              placeholder="e.g. Computer Science"
              value={form.course_name}
              onChange={(e) => { setForm({ ...form, course_name: e.target.value }); setErrors({ ...errors, course_name: '' }); }}
            />
            {errors.course_name && <span className="form-error">{errors.course_name}</span>}
          </div>
          <div className="form-group">
            <label className="form-label">Grade Level</label>
            <select className="form-select" value={form.grade_level} onChange={(e) => setForm({ ...form, grade_level: e.target.value })}>
              <option value="">Select grade level</option>
              {['Grade 7','Grade 8','Grade 9','Grade 10','Grade 11','Grade 12','College'].map((g) => <option key={g}>{g}</option>)}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Duration</label>
            <input
              className="form-input"
              placeholder="e.g. 4 Years"
              value={form.duration}
              onChange={(e) => setForm({ ...form, duration: e.target.value })}
            />
          </div>
          <div className="form-group form-col-full">
            <label className="form-label">Description</label>
            <input
              className="form-input"
              placeholder="Brief description of the course"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
