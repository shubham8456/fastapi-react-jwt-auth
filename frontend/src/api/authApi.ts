import httpClient from './httpClient';

export const login = (email, password) => {
  return httpClient.post('/auth/login', { email, password });
};

export const register = (email, password) => {
  return httpClient.post('/auth/register', { email, password });
};

export const logout = () => {
  return httpClient.post('/auth/logout');
};

export const getMe = () => {
  return httpClient.get('/users/me');
};
