import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://127.0.0.1:8000/api/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Necessary to send secure httpOnly session cookies
});

// Request Interceptor: Attach CSRF Token for state mutations
api.interceptors.request.use((config) => {
    // Attach CSRF Token for state mutations
    if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
        let csrfToken = null;
        if (typeof document !== 'undefined') {
            csrfToken = document.cookie
                .split('; ')
                .find(row => row.startsWith('XSRF-TOKEN='))
                ?.split('=')[1];
        }
        if (csrfToken) {
            config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
        }
    }

    // Attach Bearer Token from Zustand Auth Store
    if (typeof window !== 'undefined') {
        const authStorageStr = localStorage.getItem('erp-auth');
        if (authStorageStr) {
            try {
                const { state } = JSON.parse(authStorageStr);
                if (state?.token) {
                    config.headers.Authorization = `Bearer ${state.token}`;
                }
            } catch (e) {
                console.error("Failed to parse auth token", e);
            }
        }
    }

    return config;
}, (error) => Promise.reject(error));

// Response Interceptor: Handle 401 Unauthorized globally
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('erp-auth');
                window.location.href = '/auth/login';
            }
        }
        return Promise.reject(error);
    }
);
