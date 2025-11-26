import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="page">
      <div className="card">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Sign in</h2>
          <input className="" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input className="" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit">Login</button>
          <div className="muted">Don't have an account? <Link to="/register">Register</Link> to continue.</div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
