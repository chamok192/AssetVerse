import axios from 'axios';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { auth } from '../FireBase/firebase.init';

const imageHostKey = import.meta.env.VITE_image_host_api_key;
const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const errors = {
    'auth/user-not-found': 'No account found with this email',
    'auth/wrong-password': 'Incorrect password',
    'auth/invalid-email': 'Invalid email format',
    'auth/invalid-credential': 'Invalid email or password',
    'auth/email-already-in-use': 'This email is already registered',
    'auth/weak-password': 'Password must be at least 6 characters'
};

const getError = (code) => errors[code] || 'Operation failed';

export const validateEmail = (e) => e?.includes('@');
export const validatePassword = (p) => p?.length >= 6;

export const getFieldError = (name, value, touched) => {
    if (!touched) return '';
    if (!value) return `${name.charAt(0).toUpperCase() + name.slice(1)} required`;
    if (name === 'password' && !validatePassword(value)) return 'Min 6 characters';
    if (name === 'email' && !validateEmail(value)) return 'Invalid email';
    return '';
};

const fileToBase64 = (file) => new Promise((r, e) => {
    const reader = new FileReader();
    reader.onloadend = () => r(reader.result.split(',')[1]);
    reader.onerror = e;
    reader.readAsDataURL(file);
});

export const uploadImageToImgBB = async (file) => {
    if (!file || !imageHostKey) return { success: false, error: 'Image config missing' };
    try {
        const formData = new FormData();
        formData.append('image', await fileToBase64(file));
        const res = await axios.post(`https://api.imgbb.com/1/upload?expiration=600&key=${imageHostKey}`, formData);
        return res.data?.data?.url ? { success: true, url: res.data.data.url } : { success: false, error: 'Upload failed' };
    } catch { return { success: false, error: 'Upload failed' }; }
};

const saveUser = (user) => {
    localStorage.setItem('userData', JSON.stringify(user));
    window.dispatchEvent(new Event('storage'));
};

const fetchUserData = async (email, token) => {
    try {
        const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
        const res = await axios.get(`${apiBase}/api/users/email/${email}`, config);
        const userData = res.data?.success ? res.data.data : (res.data?.data || res.data);
        return userData || null;
    } catch (err) { 
        return null; 
    }
};

export const loginWithEmail = async (email, password) => {
    try {
        const backendUser = await fetchUserData(email, null);
        
        if (!backendUser) {
            return { success: false, error: 'User account not found. Please register first.' };
        }
        
        const { user: fbUser } = await signInWithEmailAndPassword(auth, email, password);
        
        const tokenRes = await axios.post(`${apiBase}/api/auth/login`, { email, uid: fbUser.uid }).catch(() => ({}));
        const token = tokenRes.data?.token;
        
        if (token) {
            localStorage.setItem('token', token);
            sessionStorage.setItem('token', token);
        }

        let role = backendUser.role || 'Employee';
        
        if (role && typeof role === 'string') {
            role = role.charAt(0).toUpperCase() + role.slice(1).toLowerCase();
        }
        
        const userData = {
            uid: fbUser.uid,
            email: fbUser.email,
            displayName: fbUser.displayName || backendUser.name || '',
            name: backendUser.name || fbUser.displayName || '',
            profileImage: fbUser.photoURL || backendUser.profileImage || '',
            role: role,
            ...backendUser
        };
        
        saveUser(userData);
        return { success: true, user: fbUser, userData };
    } catch (e) {
        return { success: false, error: getError(e.code) };
    }
};

export const registerEmployee = async (data) => {
    try {
        const { user: fbUser } = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await updateProfile(fbUser, { displayName: data.name, photoURL: data.profileImage || '' });
        
        const userData = {
            uid: fbUser.uid,
            name: data.name,
            email: data.email,
            profileImage: data.profileImage || '',
            dateOfBirth: data.dateOfBirth || '',
            role: 'Employee'
        };
        
        await axios.post(`${apiBase}/api/users`, userData).catch(() => {});
        saveUser(userData);
        return { success: true, user: fbUser, userData };
    } catch (e) {
        return { success: false, error: getError(e.code) };
    }
};

export const registerHRManager = async (data) => {
    try {
        const { user: fbUser } = await createUserWithEmailAndPassword(auth, data.email, data.password);
        await updateProfile(fbUser, { displayName: data.name, photoURL: data.profileImage || '' });
        
        const userData = {
            uid: fbUser.uid,
            name: data.name,
            email: data.email,
            profileImage: data.profileImage || '',
            role: 'HR',
            companyName: data.companyName || '',
            companyLogo: data.companyLogo || '',
            packageLimit: parseInt(data.packageLimit) || 5,
            currentEmployees: 0,
            subscription: data.subscription || 'basic',
            dateOfBirth: data.dateOfBirth || ''
        };
        
        await axios.post(`${apiBase}/api/users`, userData).catch(() => {});
        saveUser(userData);
        return { success: true, user: fbUser, userData };
    } catch (e) {
        return { success: false, error: getError(e.code) };
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('userData');
        window.dispatchEvent(new Event('storage'));
        return { success: true };
    } catch (e) {
        return { success: false, error: e.message };
    }
};
