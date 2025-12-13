import axios from 'axios';
import { 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    updateProfile,
    signOut 
} from 'firebase/auth';
import { auth } from '../FireBase/firebase.init';

const imageHostKey = import.meta.env.VITE_image_host_api_key;
const apiBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

const validateEmail = (email) => {
    return email && email.includes('@');
};

export const validatePassword = (password) => {
    return password && password.length >= 6;
};

export const getFieldError = (fieldName, value, touched) => {
    if (!touched) return '';
    if (!value) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
    if (fieldName === 'password' && value.length < 6) return 'Password must be at least 6 characters';
    if (fieldName === 'email' && !validateEmail(value)) return 'Valid email required';
    return '';
};

const fileToBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result.split(',')[1]);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
};

export const uploadImageToImgBB = async (file) => {
    if (!file || !imageHostKey) {
        return { success: false, error: 'Image upload configuration missing.' };
    }

    try {
        const base64Image = await fileToBase64(file);
        const formData = new FormData();
        formData.append('image', base64Image);

        const url = `https://api.imgbb.com/1/upload?expiration=600&key=${imageHostKey}`;
        const response = await axios.post(url, formData);

        const imageUrl = response?.data?.data?.url;
        if (!imageUrl) {
            return { success: false, error: 'Image upload failed. Please try again.' };
        }

        return { success: true, url: imageUrl };
    } catch (error) {
        const message = error?.response?.data?.error?.message || 'Failed to upload image. Please try again.';
        return { success: false, error: message };
    }
};

export const loginWithEmail = async (email, password) => {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        const tokenRes = await axios.post(`${apiBase}/api/auth/login`, {
            email: email,
            uid: user.uid
        });

        const token = tokenRes.data?.token;
        if (token) {
            localStorage.setItem('token', token);
            sessionStorage.setItem('token', token);
        }

        const existingData = JSON.parse(localStorage.getItem('userData')) || {};
        const userData = {
            ...existingData,
            uid: user.uid,
            email: user.email,
            displayName: user.displayName || existingData.name,
            name: existingData.name || user.displayName,
            profileImage: user.photoURL || existingData.profileImage || existingData.avatar || '',
            avatar: user.photoURL || existingData.profileImage || existingData.avatar || ''
        };
        
        localStorage.setItem('userData', JSON.stringify(userData));
        window.dispatchEvent(new Event('storage'));

        return { success: true, user, userData };
    } catch (error) {
        let errorMessage = 'Login failed. Please try again.';
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = 'No account found with this email. Please register first.';
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = 'Incorrect password. Please try again.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address format.';
        } else if (error.code === 'auth/invalid-credential') {
            errorMessage = 'Invalid email or password. Please check your credentials.';
        }
        
        return { success: false, error: errorMessage };
    }
};

export const registerEmployee = async (formData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: formData.name,
            photoURL: formData.profileImage || ''
        });

        const userData = {
            uid: user.uid,
            name: formData.name,
            email: formData.email,
            profileImage: formData.profileImage || '',
            dateOfBirth: formData.dateOfBirth || '',
            role: 'Employee'
        };

        // Sync user to MongoDB backend
        try {
            console.log('Syncing employee to backend with payload:', userData);
            console.log('Payload JSON:', JSON.stringify(userData, null, 2));
            const syncResponse = await axios.post(`${apiBase}/api/users`, userData);
            console.log('Backend sync successful:', syncResponse.data);
        } catch (apiError) {
            console.error('Full error object:', apiError);
            console.error('Status:', apiError.response?.status);
            console.error('Response data:', apiError.response?.data);
            console.warn('Failed to sync employee to backend:', apiError.response?.data || apiError.message);
            // Don't block registration if backend sync fails; user can retry
        }
        
        localStorage.setItem('userData', JSON.stringify(userData));
        window.dispatchEvent(new Event('storage'));

        return { success: true, user, userData };
    } catch (error) {
        let errorMessage = 'Registration failed. Please try again.';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered. Please login instead.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password is too weak. Please use a stronger password.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address format.';
        }
        
        return { success: false, error: errorMessage };
    }
};

export const registerHRManager = async (formData) => {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        const user = userCredential.user;

        await updateProfile(user, {
            displayName: formData.name,
            photoURL: formData.profileImage || ''
        });

        const userData = {
            uid: user.uid,
            name: formData.name,
            email: formData.email,
            role: 'HR'
        };

        // Sync user to MongoDB backend - start with minimal fields
        try {
            console.log('Syncing HR manager to backend with payload:', userData);
            console.log('Payload JSON:', JSON.stringify(userData, null, 2));
            const syncResponse = await axios.post(`${apiBase}/api/users`, userData);
            console.log('Backend sync successful:', syncResponse.data);
        } catch (apiError) {
            console.error('Full error object:', apiError);
            console.error('Status:', apiError.response?.status);
            console.error('Response data:', apiError.response?.data);
            const errorDetails = apiError.response?.data;
            console.warn('Failed to sync HR manager to backend:', errorDetails || apiError.message);
            if (errorDetails?.errors && Array.isArray(errorDetails.errors)) {
                console.error('Number of validation errors:', errorDetails.errors.length);
                errorDetails.errors.forEach((err, idx) => {
                    console.error(`Error ${idx}:`, err);
                    console.error(`  Field: ${err.field || err.path || 'unknown'}`);
                    console.error(`  Message: ${err.message || err.msg || 'unknown'}`);
                });
            }
            // Don't block registration if backend sync fails; user can retry
        }

        // Add remaining profile data after successful DB sync
        const fullUserData = {
            uid: user.uid,
            name: formData.name,
            email: formData.email,
            profileImage: formData.profileImage || '',
            dateOfBirth: formData.dateOfBirth || '',
            role: 'HR',
            companyName: formData.companyName || '',
            companyLogo: formData.companyLogo || '',
            packageLimit: parseInt(formData.packageLimit) || 5,
            currentEmployees: 0,
            subscription: formData.subscription || 'basic'
        };
        
        localStorage.setItem('userData', JSON.stringify(fullUserData));
        window.dispatchEvent(new Event('storage'));

        return { success: true, user, userData: fullUserData };
    } catch (error) {
        let errorMessage = 'Registration failed. Please try again.';
        
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = 'This email is already registered. Please login instead.';
        } else if (error.code === 'auth/weak-password') {
            errorMessage = 'Password is too weak. Please use a stronger password.';
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = 'Invalid email address format.';
        }
        
        return { success: false, error: errorMessage };
    }
};

export const logoutUser = async () => {
    try {
        await signOut(auth);
        localStorage.removeItem('userData');
        window.dispatchEvent(new Event('storage'));
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
};
