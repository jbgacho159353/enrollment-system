import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import Toast, { useToast } from '../components/Toast';

const IconPlus = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
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

const statusColors = {
  Active:    'badge-success',
  Inactive:  'badge-danger',
  Completed: 'badge-info',
  Dropped:   'badge-secondary'
};

function fmtId(id) { return `ENR-${String(id).padStart(4, '0')}`; }
function fmtDate(str) {
  if (!str) return '—';
  return new Date(str + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const emptyForm = { student_id: '', course_id: '', enrollment_date: '', status: 'Active' };

export default function Enrollments() {
  const [enrollments, setEnrollments]   = useState([]);
  const [total, setTotal]               = useState(0);
  const [page, setPage]                 = useState(1);
  const [totalPages, setTotalPages]     = useState(1);
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading]           = useState(true);
  const [students, setStudents]         = useState([]);
  const [courses, setCourses]           = useState([]);
  const [modalOpen, setModalOpen]       = useState(false);
  const [editing, setEditing]           = useState(null);
  const [form, setForm]                 = useState(emptyForm);
  const [saving, setSaving]             = useState(false);
  const [errors, setErrors]             = useState({});
  const { toasts, addToast, removeToast } = useToast();

  const limit = 8;

  const fetchEnrollments = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (statusFilter) params.status = statusFilter;
      const { data } = await api.get('/enrollments', { params });
      setEnrollments(data.enrollments);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch {
      addToast('Failed to load enrollments', 'error');
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter, addToast]);

  useEffect(() => { fetchEnrollments(); }, [fetchEnrollments]);

  useEffect(() => {
    Promise.all([
      api.get('/students', { params: { limit: 1000 } }),
      api.get('/courses')
    ]).then(([sRes, cRes]) => {
      setStudents(sRes.data.students || []);
      setCourses(cRes.data);
    }).catch(() => {});
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm({ ...emptyForm, enrollment_date: new Date().toISOString().split('T')[0] });
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (en) => {
    setEditing(en);
    setForm({
      student_id: String(en.student_id),
      course_id:  String(en.course_id),
      enrollment_date: en.enrollment_date || '',
      status: en.status
    });
    setErrors({});
    setModalOpen(true);
  };

  const validate = () => {
    const e = {};
    if (!form.student_id) e.student_id = 'Select a student';
    if (!form.course_id)  e.course_id  = 'Select a course';
    if (!form.enrollment_date) e.enrollment_date = 'Required';
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      if (editing) {
        await api.put(`/enrollments/${editing.enrollment_id}`, form);
        addToast('Enrollment updated', 'success');
      } else {
        await api.post('/enrollments', form);
        addToast('Enrollment created', 'success');
      }
      setModalOpen(false);
      fetchEnrollments();
    } catch (err) {
      addToast(err.response?.data?.message || 'Operation failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (en) => {
    if (!window.confirm('Delete this enrollment?')) return;
    try {
      await api.delete(`/enrollments/${en.enrollment_id}`);
      addToast('Enrollment deleted', 'success');
      fetchEnrollments();
    } catch (err) {
      addToast(err.response?.data?.message || 'Delete failed', 'error');
    }
  };

  const startItem = (page - 1) * limit + 1;
  const endItem   = Math.min(page * limit, total);

  return (
    <div>
      <Toast toasts={toasts} onRemove={removeToast} />

      <div className="page-header">
        <div className="page-header-left">
          <h1>Enrollments</h1>
          <div className="breadcrumb">Home / <span>Enrollments</span></div>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          <IconPlus />
          New Enrollment
        </button>
      </div>

      <div className="card">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <span style={{ fontSize: 13, color: 'var(--text-light)' }}>
              {total} enrollment{total !== 1 ? 's' : ''}
            </span>
          </div>
          <div className="table-toolbar-right">
            <select
              className="form-select"
              style={{ width: 160, padding: '8px 12px' }}
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            >
              <option value="">All Status</option>
              <option>Active</option>
              <option>Inactive</option>
              <option>Completed</option>
              <option>Dropped</option>
            </select>
          </div>
        </div>

        <div className="table-wrapper">
          {loading ? (
            <div className="loading-wrapper"><div className="spinner" /><span>Loading…</span></div>
          ) : enrollments.length === 0 ? (
            <div className="empty-state">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
              <h3>No enrollments found</h3>
              <p>Click "New Enrollment" to enroll a student in a course</p>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Student</th>
                  <th>Email</th>
                  <th>Course</th>
                  <th>Enrollment Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {enrollments.map((en) => (
                  <tr key={en.enrollment_id}>
                    <td><span className="td-id">{fmtId(en.enrollment_id)}</span></td>
                    <td className="td-name">{en.Student?.first_name} {en.Student?.last_name}</td>
                    <td style={{ color: 'var(--text-mid)' }}>{en.Student?.email}</td>
                    <td>{en.Course?.course_name}</td>
                    <td>{fmtDate(en.enrollment_date)}</td>
                    <td>
                      <span className={`badge ${statusColors[en.status] || 'badge-secondary'}`}>
                        {en.status}
                      </span>
                    </td>
                    <td>
                      <div className="td-actions">
                        <button className="action-btn edit" onClick={() => openEdit(en)} title="Edit">
                          <IconEdit />
                        </button>
                        <button className="action-btn delete" onClick={() => handleDelete(en)} title="Delete">
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

        {!loading && enrollments.length > 0 && (
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

      {/* Add / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Enrollment' : 'New Enrollment'}
        subtitle={editing ? 'Update enrollment details' : 'Enroll a student in a course'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update' : 'Enroll Student'}
            </button>
          </>
        }
      >
        <div className="form-section-title">Enrollment Details</div>
        <div className="form-grid single">
          <div className="form-group">
            <label className="form-label">Student *</label>
            <select
              className={`form-select ${errors.student_id ? 'error' : ''}`}
              value={form.student_id}
              onChange={(e) => { setForm({ ...form, student_id: e.target.value }); setErrors({ ...errors, student_id: '' }); }}
              disabled={!!editing}
            >
              <option value="">Select student</option>
              {students.map((s) => (
                <option key={s.student_id} value={s.student_id}>
                  {s.first_name} {s.last_name} — {s.email}
                </option>
              ))}
            </select>
            {errors.student_id && <span className="form-error">{errors.student_id}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Course *</label>
            <select
              className={`form-select ${errors.course_id ? 'error' : ''}`}
              value={form.course_id}
              onChange={(e) => { setForm({ ...form, course_id: e.target.value }); setErrors({ ...errors, course_id: '' }); }}
              disabled={!!editing}
            >
              <option value="">Select course</option>
              {courses.filter((c) => c.status === 'Active').map((c) => (
                <option key={c.course_id} value={c.course_id}>{c.course_name}</option>
              ))}
            </select>
            {errors.course_id && <span className="form-error">{errors.course_id}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Enrollment Date *</label>
            <input
              type="date"
              className={`form-input ${errors.enrollment_date ? 'error' : ''}`}
              value={form.enrollment_date}
              onChange={(e) => { setForm({ ...form, enrollment_date: e.target.value }); setErrors({ ...errors, enrollment_date: '' }); }}
            />
            {errors.enrollment_date && <span className="form-error">{errors.enrollment_date}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Status</label>
            <select className="form-select" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Active</option>
              <option>Inactive</option>
              <option>Completed</option>
              <option>Dropped</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
