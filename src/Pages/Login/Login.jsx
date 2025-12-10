import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { getAuth, signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import app from '../../FireBase/firebase.config';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setTouched((prev) => ({ ...prev, [name]: true }));
        setError('');
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const getFieldError = (fieldName) => {
        if (!touched[fieldName]) return '';
        if (!form[fieldName]) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        if (fieldName === 'password' && form[fieldName].length < 6) return 'Password must be at least 6 characters';
        if (fieldName === 'email' && !form[fieldName].includes('@')) return 'Valid email required';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allTouched = { email: true, password: true };
        setTouched(allTouched);
        
        if (!form.email || !form.password) {
            setError('Please fill in all fields.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const userCredential = await signInWithEmailAndPassword(auth, form.email, form.password);
            const user = userCredential.user;

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
            
            setTimeout(() => {
                window.dispatchEvent(new Event('storage'));
            }, 100);

            setSuccess('Login successful! Redirecting...');
            
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (error) {
            console.error('Login error:', error);
            
            if (error.code === 'auth/user-not-found') {
                setError('No account found with this email. Please register first.');
            } else if (error.code === 'auth/wrong-password') {
                setError('Incorrect password. Please try again.');
            } else if (error.code === 'auth/invalid-email') {
                setError('Invalid email address format.');
            } else if (error.code === 'auth/invalid-credential') {
                setError('Invalid email or password. Please check your credentials.');
            } else {
                setError('Login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const existingData = JSON.parse(localStorage.getItem('userData')) || {};
            
            const userData = {
                ...existingData,
                uid: user.uid,
                email: user.email,
                name: user.displayName || existingData.name || 'User',
                displayName: user.displayName,
                profileImage: user.photoURL || existingData.profileImage || '',
                avatar: user.photoURL || existingData.avatar || '',
                role: existingData.role || 'employee'
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            
            setTimeout(() => {
                window.dispatchEvent(new Event('storage'));
            }, 100);

            setSuccess('Google login successful! Redirecting...');
            
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (error) {
            console.error('Google login error:', error);
            
            if (error.code === 'auth/popup-closed-by-user') {
                setError('Login cancelled. Please try again.');
            } else if (error.code === 'auth/popup-blocked') {
                setError('Popup blocked. Please allow popups for this site.');
            } else {
                setError('Google login failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
            <div className="max-w-md w-full bg-base-100 rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Welcome Back</h1>
                    <p className="text-sm text-base-content/70">Login to access your account</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-5">
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text">Email</span></div>
                        <input 
                            name="email" 
                            value={form.email} 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="email" 
                            placeholder="your@email.com" 
                            className={`input input-bordered w-full ${getFieldError('email') ? 'input-error' : ''}`}
                            required 
                        />
                        {getFieldError('email') && <p className="text-error text-xs mt-1">{getFieldError('email')}</p>}
                    </label>
                    <label className="form-control w-full">
                        <div className="label"><span className="label-text">Password</span></div>
                        <input 
                            name="password" 
                            value={form.password} 
                            onChange={handleChange}
                            onBlur={handleBlur}
                            type="password" 
                            placeholder="Minimum 6 characters" 
                            className={`input input-bordered w-full ${getFieldError('password') ? 'input-error' : ''}`}
                            minLength={6}
                            required 
                        />
                        {getFieldError('password') && <p className="text-error text-xs mt-1">{getFieldError('password')}</p>}
                    </label>
                    {error && <p className="text-error text-sm font-semibold">{error}</p>}
                    {success && <p className="text-success text-sm font-semibold">{success}</p>}
                    <button type="submit" className="btn mt-5 btn-neutral w-full" disabled={loading}>
                        {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Login'}
                    </button>
                </form>
                <div className="divider">OR</div>
                <button 
                    type="button" 
                    onClick={handleGoogleLogin} 
                    className="btn btn-outline w-full gap-2"
                    disabled={loading}
                >
                    <FcGoogle className="text-xl" />
                    {loading ? 'Signing in...' : 'Continue with Google'}
                </button>
                <div className="divider">New to AssetVerse?</div>
                <div className="text-center space-y-3">
                    <div className="flex flex-col gap-2">
                        <Link to="/join/employee" className="btn btn-outline btn-sm">Join as Employee</Link>
                        <Link to="/join/hr-manager" className="btn btn-outline btn-sm">Join as HR Manager</Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
