import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    console.log('[API Request]', config.method.toUpperCase(), config.url);
    console.log('[Token present]', Boolean(token));
    if (token) {
        console.log('[Token length]', token.length);
        config.headers.Authorization = `Bearer ${token}`;
        console.log('[Auth header set]', config.headers.Authorization.substring(0, 20) + '...');
    } else {
        console.warn('[No token found in localStorage or sessionStorage]');
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            sessionStorage.removeItem('token');
            localStorage.removeItem('userData');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export const getUsers = async () => {
    try {
        const response = await api.get('/api/users');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch users' };
    }
};

export const createUser = async (userData) => {
    try {
        const response = await api.post('/api/users', userData);
        return { success: true, data: response.data };
    } catch (error) {
        const serverMessage = error.response?.data?.message || error.response?.data?.error;
        const status = error.response?.status;
        const fullError = error.response?.data;
        console.error('createUser error:', { status, serverMessage, data: fullError });
        console.error('Request payload was:', userData);
        if (fullError?.errors) {
            console.error('Validation errors:', fullError.errors);
        }
        return { success: false, error: serverMessage || `Failed to create user (status ${status || 'unknown'})` };
    }
};

export const getUserByEmail = async (email) => {
    try {
        const response = await api.get(`/api/users/email/${email}`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || 'User not found' };
    }
};

export const updateUser = async (userId, userData) => {
    try {
        const response = await api.put(`/api/users/${userId}`, userData);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to update user' };
    }
};

export const getAssets = async () => {
    try {
        console.log('[getAssets] Fetching from /api/assets');
        const response = await api.get('/api/assets');
        console.log('[getAssets] Success:', response.data);
        return { success: response.data.success, data: response.data.data };
    } catch (error) {
        console.error('[getAssets] Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        return { success: false, error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch assets' };
    }
};

export const createAsset = async (assetData) => {
    try {
        console.log('[createAsset] Payload:', assetData);
        const response = await api.post('/api/assets', assetData);
        console.log('[createAsset] Success:', response.data);
        return { success: response.data.success, data: response.data.data };
    } catch (error) {
        console.error('[createAsset] Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        return { success: false, error: error.response?.data?.error || error.response?.data?.message || 'Failed to create asset' };
    }
};

export const getAssetById = async (assetId) => {
    try {
        const response = await api.get(`/api/assets/${assetId}`);
        return { success: response.data.success, data: response.data.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch asset' };
    }
};

export const updateAsset = async (assetId, assetData) => {
    try {
        console.log('[updateAsset] ID:', assetId, 'Payload:', assetData);
        const response = await api.patch(`/api/assets/${assetId}`, assetData);
        console.log('[updateAsset] Success:', response.data);
        return { success: response.data.success, data: response.data.data };
    } catch (error) {
        console.error('[updateAsset] Error:', {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            message: error.message
        });
        return { success: false, error: error.response?.data?.error || error.response?.data?.message || 'Failed to update asset' };
    }
};

export const deleteAsset = async (assetId) => {
    try {
        const response = await api.delete(`/api/assets/${assetId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to delete asset' };
    }
};

export const getRequests = async () => {
    try {
        const response = await api.get('/api/requests');
        return { success: response.data.success, data: response.data.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch requests' };
    }
};

export const approveRequest = async (requestId) => {
    try {
        const response = await api.put(`/api/requests/${requestId}/approve`);
        return { success: response.data.success, data: response.data.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error || error.response?.data?.message || 'Failed to approve request' };
    }
};

export const rejectRequest = async (requestId) => {
    try {
        const response = await api.put(`/api/requests/${requestId}/reject`);
        return { success: response.data.success, data: response.data.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error || error.response?.data?.message || 'Failed to reject request' };
    }
};

export const getEmployees = async () => {
    try {
        const response = await api.get('/api/employees');
        return { success: response.data.success, data: response.data.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch employees' };
    }
};

export const removeEmployee = async (employeeId) => {
    try {
        const response = await api.delete(`/api/employees/${employeeId}`);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to remove employee' };
    }
};

export const getPaymentHistory = async () => {
    try {
        const response = await api.get('/api/payments/history');
        return { success: response.data.success, data: response.data.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error || error.response?.data?.message || 'Failed to fetch payment history' };
    }
};

export const createCheckoutSession = async (packageId) => {
    try {
        const response = await api.post('/api/payments/checkout', { packageId });
        return { success: response.data.success, data: response.data.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.error || error.response?.data?.message || 'Failed to start checkout' };
    }
};

export const clearToken = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
};

export default api;
