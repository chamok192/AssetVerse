export const deletePayment = (id) => handler(() => api.delete(`/api/payments/${id}`), 'Failed to delete payment');
import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(config => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
}, e => Promise.reject(e));

api.interceptors.response.use(r => r, e => {
    if ([401, 403].includes(e.response?.status)) {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
    }
    return Promise.reject(e);
});

const handler = async (fn, fallback) => {
    try {
        const res = await fn();
        return { success: true, data: res.data?.data || res.data };
    } catch (e) {
        return { success: false, error: e.response?.data?.message || e.response?.data?.error || fallback };
    }
};

const getUserData = () => {
    try {
        return JSON.parse(localStorage.getItem('userData') || sessionStorage.getItem('userData') || '{}');
    } catch {
        return {};
    }
};

export { getUserData };

export const getUsers = () => handler(() => api.get('/api/users'), 'Failed to fetch users');
export const createUser = (data) => handler(() => api.post('/api/users', data), 'Failed to create user');
export const getUserByEmail = (email) => handler(() => api.get(`/api/users/email/${email}`), 'User not found');
export const updateUser = (id, data) => handler(() => api.put(`/api/users/${id}`, data), 'Failed to update user');
export const updateUserProfile = (data) => handler(() => api.patch('/api/users/profile', data), 'Failed to update profile');
export const getAssets = () => handler(() => api.get('/api/assets'), 'Failed to fetch assets');
export const createAsset = (data) => {
    const user = getUserData();
    return handler(() => api.post('/api/assets', { ...data, hrEmail: user?.email || '' }), 'Failed to create asset');
};
export const getAssetById = (id) => handler(() => api.get(`/api/assets/${id}`), 'Failed to fetch asset');
export const updateAsset = (id, data) => {
    if (!id?.trim()) return { success: false, error: 'Asset ID required' };
    return handler(() => api.patch(`/api/assets/${id}`, { name: data.name, image: data.image, type: data.type, quantity: data.quantity }), 'Failed to update asset');
};
export const deleteAsset = (id) => handler(() => api.delete(`/api/assets/${id}`), 'Failed to delete asset');
export const getEmployeeLimitCheck = () => handler(() => api.get('/api/users/limit-check'), 'Failed to check employee limit');
export const getRequests = () => handler(() => api.get('/api/requests'), 'Failed to fetch requests');
export const approveRequest = (id) => handler(() => api.put(`/api/requests/${id}/approve`), 'Failed to approve');
export const rejectRequest = (id) => handler(() => api.put(`/api/requests/${id}/reject`), 'Failed to reject');
export const getEmployees = () => handler(() => api.get('/api/employees'), 'Failed to fetch employees');
export const removeEmployee = (id) => handler(() => api.delete(`/api/employees/${id}`), 'Failed to remove employee');
export const getPaymentHistory = () => handler(() => api.get('/api/payments/history'), 'Failed to fetch history');
export const createPaymentIntent = (data) => handler(() => api.post('/api/payments/create-checkout', data), 'Failed to create checkout session');
export const confirmPayment = (data) => handler(() => api.post('/api/payments/confirm', data), 'Failed to confirm payment');
export const verifyPaymentSession = (sessionId) => handler(() => api.get(`/api/payments/session/${sessionId}`), 'Failed to verify session');
export const getEmployeeAssets = () => handler(() => api.get('/api/employee-assets'), 'Failed to fetch employee assets');
export const createRequest = (data) => handler(() => api.post('/api/requests', data), 'Failed to create request');
export const updateRequest = (id, data) => handler(() => api.patch(`/api/requests/${id}`, data), 'Failed to update request');
export const getPackages = () => handler(() => api.get('/api/packages'), 'Failed to fetch packages');
export const clearToken = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
};

export { api };
export default api;
