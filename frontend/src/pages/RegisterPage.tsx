import React, { useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { useNavigate } from 'react-router-dom';

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
    <form onSubmit={handleSubmit}>
      <input placeholder='Email' value={email} onChange={e => setEmail(e.target.value)} />
      <input type='password' placeholder='Password' value={password} onChange={e => setPassword(e.target.value)} />
      <button type='submit'>Register</button>
    </form>
  );
};

export default RegisterPage;
