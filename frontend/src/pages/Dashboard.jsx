import React, { useEffect, useState, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement,
  LineElement, Tooltip, Legend, Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import api from '../services/api';
import StatCard from '../components/StatCard';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Filler);

const IconStudents = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconCourses = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const IconEnrollments = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);
const IconActive = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="24" height="24">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
  </svg>
);

function formatDate(str) {
  if (!str) return '';
  return new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function getInitials(firstName, lastName) {
  return `${(firstName || '').charAt(0)}${(lastName || '').charAt(0)}`.toUpperCase();
}

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const { data } = await api.get('/enrollments/stats');
      setStats(data);
    } catch (err) {
      console.error('Failed to load stats:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStats(); }, [fetchStats]);

  if (loading) {
    return (
      <div className="loading-wrapper">
        <div className="spinner" />
        <span>Loading dashboard…</span>
      </div>
    );
  }

  const chartData = {
    labels: stats?.chartLabels || [],
    datasets: [
      {
        label: 'Enrollments',
        data: stats?.chartData || [],
        fill: true,
        borderColor: '#4f46e5',
        backgroundColor: 'rgba(79,70,229,0.08)',
        tension: 0.4,
        pointBackgroundColor: '#4f46e5',
        pointRadius: 4,
        pointHoverRadius: 6
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: '#1e293b',
        titleColor: '#94a3b8',
        bodyColor: '#fff',
        padding: 10,
        cornerRadius: 8
      }
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8', font: { family: 'Poppins', size: 11 } }
      },
      y: {
        grid: { color: '#f1f5f9' },
        ticks: { color: '#94a3b8', font: { family: 'Poppins', size: 11 }, stepSize: 1 },
        beginAtZero: true
      }
    }
  };

  return (
    <div>
      {/* Stat Cards */}
      <div className="stat-cards">
        <StatCard
          label="Total Students"
          value={stats?.totalStudents ?? 0}
          change="from last week"
          changeType="up"
          iconClass="icon-blue"
          icon={<IconStudents />}
        />
        <StatCard
          label="Total Courses"
          value={stats?.totalCourses ?? 0}
          change="from last week"
          changeType="up"
          iconClass="icon-purple"
          icon={<IconCourses />}
        />
        <StatCard
          label="Total Enrollments"
          value={stats?.totalEnrollments ?? 0}
          change="from last week"
          changeType="up"
          iconClass="icon-green"
          icon={<IconEnrollments />}
        />
        <StatCard
          label="Active Enrollments"
          value={stats?.activeUsers ?? 0}
          change="from last week"
          changeType="up"
          iconClass="icon-orange"
          icon={<IconActive />}
        />
      </div>

      {/* Charts Row */}
      <div className="dashboard-grid">
        {/* Enrollment Overview Chart */}
        <div className="card chart-card">
          <div className="card-header">
            <div>
              <div className="card-title">Enrollment Overview</div>
              <div className="card-subtitle">Daily enrollments — last 7 days</div>
            </div>
          </div>
          <div className="card-body" style={{ height: 260 }}>
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="card">
          <div className="card-header">
            <div>
              <div className="card-title">Recent Enrollments</div>
              <div className="card-subtitle">Latest student enrollments</div>
            </div>
            <a href="/enrollments" style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 500 }}>View All</a>
          </div>
          <div className="recent-enrollments-list">
            {!stats?.recentEnrollments?.length && (
              <div className="empty-state" style={{ padding: '24px 0' }}>
                <p>No recent enrollments</p>
              </div>
            )}
            {stats?.recentEnrollments?.map((en) => (
              <div key={en.enrollment_id} className="recent-enrollment-item">
                <div className="rei-avatar">
                  {getInitials(en.Student?.first_name, en.Student?.last_name)}
                </div>
                <div className="rei-info">
                  <div className="rei-name">
                    {en.Student?.first_name} {en.Student?.last_name}
                  </div>
                  <div className="rei-course">{en.Course?.course_name}</div>
                </div>
                <div>
                  <span className={`badge badge-${en.status === 'Active' ? 'success' : en.status === 'Inactive' ? 'danger' : 'warning'}`}>
                    {en.status}
                  </span>
                  <div className="rei-date" style={{ marginTop: 4 }}>{formatDate(en.enrollment_date)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
