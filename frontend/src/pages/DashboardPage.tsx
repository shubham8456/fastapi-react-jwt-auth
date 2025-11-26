import React from 'react';
import { useAuth } from '../auth/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div className="page">
      <div className="card">
        <div className="top-actions">
          <button className="btn" onClick={logout}>Logout</button>
        </div>
        <div className="welcome">Welcome, {user?.email}</div>
        <div className="muted">This is your dashboard.</div>
      </div>
    </div>
  );
};

export default DashboardPage;
