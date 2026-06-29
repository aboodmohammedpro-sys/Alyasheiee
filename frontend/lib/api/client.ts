import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'https://api.erp-system.local/v1',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
    withCredentials: true, // Necessary to send secure httpOnly session cookies
});

// Request Interceptor: Attach CSRF Token for state mutations
api.interceptors.request.use((config) => {
    if (config.method && ['post', 'put', 'patch', 'delete'].includes(config.method.toLowerCase())) {
        let csrfToken = null;

        // Safety check for document (could be running on SSR)
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
    return config;
}, (error) => Promise.reject(error));
