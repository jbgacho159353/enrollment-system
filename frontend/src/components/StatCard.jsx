import React from 'react';

export default function StatCard({ label, value, change, changeType = 'up', iconClass, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-card-info">
        <div className="stat-card-label">{label}</div>
        <div className="stat-card-value">{value}</div>
        {change && (
          <div className={`stat-card-change ${changeType}`}>
            {changeType === 'up' ? '▲' : '▼'} {change}
          </div>
        )}
      </div>
      <div className={`stat-card-icon ${iconClass}`}>{icon}</div>
    </div>
  );
}
