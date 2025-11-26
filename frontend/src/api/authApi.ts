import httpClient from './httpClient';

export const login = (email: string, password: string) => {
  return httpClient.post('/auth/login', { email, password });
};

export const register = (email: string, password: string) => {
  return httpClient.post('/auth/register', { email, password });
};

export const logout = () => {
  return httpClient.post('/auth/logout');
};

export const getMe = () => {
  // If we've previously determined auth is invalid (failed refresh), short-circuit.
  if (typeof window !== 'undefined' && (window as any).__authInvalid) {
    return Promise.reject({ response: { status: 401, data: { detail: 'Not authenticated' } } });
  }
  return httpClient.get('/users/me');
};
