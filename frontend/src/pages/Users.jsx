import React, { useState, useEffect, useCallback } from 'react';
import api from '../services/api';
import Modal from '../components/Modal';
import Toast, { useToast } from '../components/Toast';
import { useAuth } from '../context/AuthContext';

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

const emptyForm = { username: '', password: '', role: 'registrar' };

function fmtUserId(id) {
  return `USR-${String(id).padStart(3, '0')}`;
}

export default function Users() {
  const { user: currentUser } = useAuth();

  const [users, setUsers]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch]       = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing]     = useState(null);
  const [form, setForm]           = useState(emptyForm);
  const [saving, setSaving]       = useState(false);
  const [errors, setErrors]       = useState({});
  const [showPwd, setShowPwd]     = useState(false);
  const { toasts, addToast, removeToast } = useToast();

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.get('/users');
      setUsers(data);
    } catch {
      addToast('Failed to load users', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const filtered = users.filter(u =>
    u.username.toLowerCase().includes(search.toLowerCase()) ||
    u.role.toLowerCase().includes(search.toLowerCase())
  );

  const validate = () => {
    const e = {};
    if (!form.username.trim()) e.username = 'Username is required';
    if (!editing) {
      if (!form.password.trim()) e.password = 'Password is required';
      else if (form.password.length < 6) e.password = 'Password must be at least 6 characters';
    } else if (form.password && form.password.length < 6) {
      e.password = 'Password must be at least 6 characters';
    }
    return e;
  };

  const handleChange = (e) => {
    setErrors({ ...errors, [e.target.name]: '' });
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setShowPwd(false);
    setModalOpen(true);
  };

  const openEdit = (u) => {
    setEditing(u);
    setForm({ username: u.username, password: '', role: u.role });
    setErrors({});
    setShowPwd(false);
    setModalOpen(true);
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSaving(true);
    try {
      if (editing) {
        const payload = { username: form.username, role: form.role };
        if (form.password) payload.password = form.password;
        await api.put(`/users/${editing.user_id}`, payload);
        addToast('User updated successfully', 'success');
      } else {
        await api.post('/users', form);
        addToast('User added successfully', 'success');
      }
      setModalOpen(false);
      fetchUsers();
    } catch (err) {
      addToast(err.response?.data?.message || 'Failed to save user', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await api.delete(`/users/${id}`);
      addToast('User deleted', 'success');
      fetchUsers();
    } catch {
      addToast('Failed to delete user', 'error');
    }
  };

  return (
    <div className="page-container">
      <Toast toasts={toasts} removeToast={removeToast} />

      <div className="page-header">
        <div>
          <h1 className="page-title">User Management</h1>
          <p className="page-subtitle">Manage system user accounts</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <IconPlus /> Add User
        </button>
      </div>

      <div className="table-card">
        <div className="table-toolbar">
          <div className="search-box">
            <IconSearch />
            <input
              type="text"
              placeholder="Search by username or role..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
          <span className="table-count">{filtered.length} user{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {loading ? (
          <div className="table-loading">Loading users…</div>
        ) : (
          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={4} className="table-empty">No users found</td></tr>
                ) : (
                  filtered.map(u => (
                    <tr key={u.user_id}>
                      <td><span className="id-badge">{fmtUserId(u.user_id)}</span></td>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar-sm">{u.username.slice(0, 2).toUpperCase()}</div>
                          {u.username}
                        </div>
                      </td>
                      <td>
                        <span className={`status-badge ${u.role === 'admin' ? 'status-active' : 'status-pending'}`}>
                          {u.role.charAt(0).toUpperCase() + u.role.slice(1)}
                        </span>
                      </td>
                      <td>
                        <div className="action-btns">
                          <button
                            className="btn-icon btn-warning"
                            onClick={() => openEdit(u)}
                            title="Edit user"
                          >
                            <IconEdit />
                          </button>
                          <button
                            className="btn-icon btn-danger"
                            onClick={() => handleDelete(u.user_id)}
                            title="Delete user"
                            disabled={u.user_id === currentUser?.user_id}
                          >
                            <IconDelete />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit User' : 'Add New User'}
        subtitle={editing ? 'Update account details below' : 'Fill in the details below to create a new account'}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? 'Saving…' : editing ? 'Update User' : 'Add User'}
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div className="form-group">
            <label>Username <span className="required">*</span></label>
            <input
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter username"
              className={errors.username ? 'input-error' : ''}
            />
            {errors.username && <span className="field-error">{errors.username}</span>}
          </div>

          <div className="form-group">
            <label>Password {editing ? <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.8rem' }}>(leave blank to keep current)</span> : <span className="required">*</span>}</label>
            <div style={{ position: 'relative' }}>
              <input
                name="password"
                type={showPwd ? 'text' : 'password'}
                value={form.password}
                onChange={handleChange}
                placeholder={editing ? 'Leave blank to keep current password' : 'Enter password (min. 6 characters)'}
                className={errors.password ? 'input-error' : ''}
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPwd(p => !p)}
                style={{ position: 'absolute', right: '0.75rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: 0 }}
              >
                {showPwd ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label>Role <span className="required">*</span></label>
            <select name="role" value={form.role} onChange={handleChange}>
              <option value="registrar">Registrar</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>
      </Modal>
    </div>
  );
}
