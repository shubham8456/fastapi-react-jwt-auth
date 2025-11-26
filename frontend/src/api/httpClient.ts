import axios, { AxiosError } from 'axios';

const httpClient = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (value?: any) => void;
  reject: (reason?: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(p => {
    if (error) p.reject(error);
    else p.resolve(token);
  });
  failedQueue = [];
};

httpClient.interceptors.response.use(
  response => response,
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    const status = error.response?.status;

    if (!originalRequest) return Promise.reject(error);

    // Skip refresh for auth endpoints themselves to avoid loops
    const isAuthEndpoint = originalRequest.url && /\/auth\/(login|register|refresh)/.test(originalRequest.url);
    if (isAuthEndpoint) return Promise.reject(error);

    if (status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(() => httpClient(originalRequest))
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // If there's no refresh_token cookie, don't attempt refresh — short-circuit.
        if (typeof document !== 'undefined' && !document.cookie.includes('refresh_token=')) {
          const noRefreshError = { response: { status: 401, data: { detail: 'No refresh token' } } };
          throw noRefreshError;
        }

        await httpClient.post('/auth/refresh');
        processQueue(null, null);
        return httpClient(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        try { localStorage.removeItem('access_token'); localStorage.removeItem('refresh_token'); } catch (e) { }
        try { document.cookie = 'access_token=; Max-Age=0; path=/;'; document.cookie = 'refresh_token=; Max-Age=0; path=/;'; } catch (e) { }
        if (typeof window !== 'undefined') {
          // Mark auth as invalid to short-circuit further attempts
          (window as any).__authInvalid = true;
          // Avoid multiple redirects from concurrent failures
          if (!(window as any).__authRedirecting) {
            (window as any).__authRedirecting = true;
            window.location.href = '/login';
          }
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
