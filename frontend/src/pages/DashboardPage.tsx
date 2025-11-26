import React from 'react';
import { useAuth } from '../auth/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1>Welcome, {user?.email}</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
};

export default DashboardPage;
