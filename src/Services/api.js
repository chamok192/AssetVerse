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
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => Promise.reject(error));

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
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
        return { success: false, error: error.response?.data?.message || 'Failed to create user' };
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
        const response = await api.get('/api/assets');
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to fetch assets' };
    }
};

export const createAsset = async (assetData) => {
    try {
        const response = await api.post('/api/assets', assetData);
        return { success: true, data: response.data };
    } catch (error) {
        return { success: false, error: error.response?.data?.message || 'Failed to create asset' };
    }
};

export const clearToken = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');
};

export default api;
