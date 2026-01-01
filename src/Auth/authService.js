import axios from 'axios';

const imageHostKey = import.meta.env.VITE_image_host_api_key;
const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

export const validateEmail = (e) => e?.includes('@');
export const validatePassword = (p) => p?.length >= 6;

export const getFieldError = (name, value, touched) => {
    if (!touched) return '';
    if (!value) return `${name.charAt(0).toUpperCase() + name.slice(1)} required`;
    if (name === 'password' && !validatePassword(value)) return 'Min 6 characters';
    if (name === 'email' && !validateEmail(value)) return 'Invalid email';
    return '';
};

export const checkEmailExists = async (email) => {
    try {
        const res = await axios.get(`${apiBase}/api/users/check-email/${email}`);
        return res.data.exists;
    } catch {
        return false;
    }
};

export const uploadImageToImgBB = async (file) => {
    try {
        const formData = new FormData();
        formData.append('image', file);
        const res = await axios.post(`https://api.imgbb.com/1/upload?key=${imageHostKey}`, formData);
        if (res.data?.success) {
            return { success: true, url: res.data.data.url };
        } else {
            return { success: false, error: 'Upload failed' };
        }
    } catch (e) {
        return { success: false, error: e.message || 'Upload failed' };
    }
};

const saveUser = (user) => {
    localStorage.setItem('userData', JSON.stringify(user));
    window.dispatchEvent(new Event('storage'));
};

export const loginWithEmail = async (email, password) => {
    try {
        const res = await axios.post(`${apiBase}/api/auth/login`, { email, password });
        if (!res.data?.token) {
            return { success: false, error: 'Login failed' };
        }

        const user = res.data.user;
        const role = user.role || 'Employee';
        const normalizedRole = typeof role === 'string' ? (role.toLowerCase() === 'hr' ? 'HR' : 'Employee') : 'Employee';

        const userData = {
            ...user,
            role: normalizedRole
        };

        localStorage.setItem('token', res.data.token);
        sessionStorage.setItem('token', res.data.token);
        saveUser(userData);
        return { success: true, userData };  
    } catch (e) {
        return { success: false, error: e.response?.data?.error || 'Login failed' };
    }
};

const registerUser = async (data, role, extraFields = {}) => {
    try {
        const userData = {
            name: data.name,
            email: data.email,
            password: data.password,
            profileImage: data.profileImage || '',
            dateOfBirth: data.dateOfBirth || '',
            role: role,
            ...extraFields
        };

        const res = await axios.post(`${apiBase}/api/users`, userData);
        if (!res.data?.success) {
            throw new Error(res.data?.error || 'Failed to register');
        }

        // Then login to get token
        const loginRes = await axios.post(`${apiBase}/api/auth/login`, { email: data.email, password: data.password });
        const token = loginRes.data?.token;

        if (token) {
            localStorage.setItem('token', token);
            sessionStorage.setItem('token', token);
        }

        const user = loginRes.data.user;
        saveUser(user);
        return { success: true, userData: user };
    } catch (e) {
        return { success: false, error: e.message || 'Registration failed' };
    }
};

export const registerEmployee = async (data) => {
    return registerUser(data, 'Employee');
};

export const registerHRManager = async (data) => {
    const extraFields = {
        companyName: data.companyName || '',
        companyLogo: data.companyLogo || '',
        packageLimit: parseInt(data.packageLimit) || 5,
        currentEmployees: 0,
        subscription: data.subscription || 'basic'
    };
    return registerUser(data, 'HR', extraFields);
};

export const logoutUser = async () => {
    try {
        // Clear all stored authentication data
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');
        localStorage.removeItem('userData');
        sessionStorage.removeItem('userData');
        window.dispatchEvent(new Event('storage'));
        return { success: true };
    } catch (e) {
        return { success: false, error: e.message };
    }
};
