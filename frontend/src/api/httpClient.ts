import axios from 'axios';

const httpClient = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

httpClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await httpClient.post('/auth/refresh');
        return httpClient(originalRequest);
      } catch (refreshError) {
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);

export default httpClient;
