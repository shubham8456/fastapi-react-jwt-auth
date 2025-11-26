import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const RegisterPage = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password);
      navigate('/');
    } catch {
      alert('Registration failed');
    }
  };

  return (
    <div className="page">
      <div className="card">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h2>Create account</h2>
          <input placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
          <button type="submit" className="primary">Register</button>
          <div className="muted">By registering you accept the terms.</div>
          <div className="muted">Already have an account? <Link to="/login">Log In</Link></div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
