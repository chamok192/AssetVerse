import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import app from '../../FireBase/firebase.config';
import { useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const initialForm = {
    name: '',
    profileImage: '',
    companyName: '',
    companyLogo: '',
    email: '',
    password: '',
    dateOfBirth: '',
    role: 'hr',
    packageLimit: 5,
    currentEmployees: 0,
    subscription: 'basic'
};

const HRManager = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [logoPreview, setLogoPreview] = useState('');
    const [profileImagePreview, setProfileImagePreview] = useState('');
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setTouched((prev) => ({ ...prev, [name]: true }));
        setError('');
        setSuccess('');
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched((prev) => ({ ...prev, [name]: true }));
    };

    const handleLogoChange = (e) => {
        const url = e.target.value;
        setForm((prev) => ({ ...prev, companyLogo: url }));
        setLogoPreview(url);
        setTouched((prev) => ({ ...prev, companyLogo: true }));
        setError('');
        setSuccess('');
    };

    const handleProfileImageChange = (e) => {
        const url = e.target.value;
        setForm((prev) => ({ ...prev, profileImage: url }));
        setProfileImagePreview(url);
        setTouched((prev) => ({ ...prev, profileImage: true }));
        setError('');
        setSuccess('');
    };

    const handleGoogleRegister = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userData = {
                uid: user.uid,
                name: user.displayName || 'User',
                email: user.email,
                profileImage: user.photoURL || '',
                avatar: user.photoURL || '',
                companyName: '',
                companyLogo: '',
                dateOfBirth: '',
                role: 'hr',
                packageLimit: 5,
                currentEmployees: 0,
                subscription: 'basic'
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            
            setTimeout(() => {
                window.dispatchEvent(new Event('storage'));
            }, 100);

            setSuccess('Google registration successful! Redirecting...');
            
            setTimeout(() => {
                navigate('/');
            }, 1500);

        } catch (error) {
            console.error('Google registration error:', error);
            
            if (error.code === 'auth/popup-closed-by-user') {
                setError('Registration cancelled. Please try again.');
            } else if (error.code === 'auth/popup-blocked') {
                setError('Popup blocked. Please allow popups for this site.');
            } else {
                setError('Google registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const getFieldError = (fieldName) => {
        if (!touched[fieldName]) return '';
        if (!form[fieldName]) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
        if (fieldName === 'password' && form[fieldName].length < 6) return 'Password must be at least 6 characters';
        if (fieldName === 'email' && !form[fieldName].includes('@')) return 'Valid email required';
        return '';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allTouched = { name: true, email: true, password: true, dateOfBirth: true, companyName: true, companyLogo: true, profileImage: true };
        setTouched(allTouched);

        if (!form.name || !form.profileImage || !form.companyName || !form.companyLogo || !form.email || !form.password || !form.dateOfBirth) {
            setError('Please fill in all required fields.');
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

            const userCredential = await createUserWithEmailAndPassword(auth, form.email, form.password);
            const user = userCredential.user;


            await updateProfile(user, {
                displayName: form.name,
                photoURL: form.profileImage
            });


            const userData = {
                uid: user.uid,
                name: form.name,
                email: form.email,
                profileImage: form.profileImage,
                companyName: form.companyName,
                companyLogo: form.companyLogo,
                dateOfBirth: form.dateOfBirth,
                role: form.role,
                packageLimit: form.packageLimit,
                currentEmployees: form.currentEmployees,
                subscription: form.subscription
            };
            localStorage.setItem('userData', JSON.stringify(userData));
            window.dispatchEvent(new Event('storage'));

            setSuccess('Registration successful! Redirecting...');

            setTimeout(() => {
                navigate('/');
            }, 2000);

        } catch (error) {
            console.error('Registration error:', error);

            if (error.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please use a different email or login.');
            } else if (error.code === 'auth/invalid-email') {
                setError('Invalid email address format.');
            } else if (error.code === 'auth/weak-password') {
                setError('Password is too weak. Please use a stronger password.');
            } else {
                setError('Registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
            <div className="max-w-5xl w-full grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-base-100 rounded-2xl shadow-xl p-8 space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm uppercase tracking-wide text-primary">Join as HR Manager</p>
                        <h1 className="text-3xl font-bold">Register your company</h1>
                        <p className="text-sm text-base-content/70">Set up your company profile and admin credentials to manage assets and employees.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="divider my-2">Your Information</div>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Full Name</span></div>
                            <input name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} type="text" placeholder="Your Full Name" className={`input input-bordered w-full ${getFieldError('name') ? 'input-error' : ''}`} required />
                            {getFieldError('name') && <p className="text-error text-xs mt-1">{getFieldError('name')}</p>}
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Work Email</span></div>
                            <input name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} type="email" placeholder="admin@company.com" className={`input input-bordered w-full ${getFieldError('email') ? 'input-error' : ''}`} required />
                            {getFieldError('email') && <p className="text-error text-xs mt-1">{getFieldError('email')}</p>}
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Password</span></div>
                            <input name="password" value={form.password} onChange={handleChange} onBlur={handleBlur} type="password" placeholder="Minimum 6 characters" className={`input input-bordered w-full ${getFieldError('password') ? 'input-error' : ''}`} minLength={6} required />
                            {getFieldError('password') && <p className="text-error text-xs mt-1">{getFieldError('password')}</p>}
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Date of Birth</span></div>
                            <input name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} onBlur={handleBlur} type="date" className={`input input-bordered w-full ${getFieldError('dateOfBirth') ? 'input-error' : ''}`} required />
                            {getFieldError('dateOfBirth') && <p className="text-error text-xs mt-1">{getFieldError('dateOfBirth')}</p>}
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Profile Image URL</span></div>
                            <input name="profileImage" value={form.profileImage} onChange={handleProfileImageChange} onBlur={handleBlur} type="url" placeholder="https://example.com/profile.jpg" className={`input input-bordered w-full ${getFieldError('profileImage') ? 'input-error' : ''}`} required />
                            {getFieldError('profileImage') && <p className="text-error text-xs mt-1">{getFieldError('profileImage')}</p>}
                            {!getFieldError('profileImage') && <div className="label"><span className="label-text-alt">Use ImgBB </span></div>}
                        </label>
                        {profileImagePreview && (
                            <div className="p-4 bg-base-200 rounded-lg flex items-center justify-center">
                                <img src={profileImagePreview} alt="Profile" className="w-24 h-24 rounded-full object-cover" onError={() => setProfileImagePreview('')} />
                            </div>
                        )}
                        <div className="divider my-2">Company Details</div>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Company Name</span></div>
                            <input name="companyName" value={form.companyName} onChange={handleChange} onBlur={handleBlur} type="text" placeholder="Your Company Ltd." className={`input input-bordered w-full ${getFieldError('companyName') ? 'input-error' : ''}`} required />
                            {getFieldError('companyName') && <p className="text-error text-xs mt-1">{getFieldError('companyName')}</p>}
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Company Logo URL</span></div>
                            <input name="companyLogo" value={form.companyLogo} onChange={handleLogoChange} onBlur={handleBlur} type="url" placeholder="https://example.com/logo.png" className={`input input-bordered w-full ${getFieldError('companyLogo') ? 'input-error' : ''}`} required />
                            {getFieldError('companyLogo') && <p className="text-error text-xs mt-1">{getFieldError('companyLogo')}</p>}
                            {!getFieldError('companyLogo') && <div className="label"><span className="label-text-alt">Use ImgBB </span></div>}
                        </label>
                        {logoPreview && (
                            <div className="p-4 bg-base-200 rounded-lg flex items-center justify-center">
                                <img src={logoPreview} alt="Company Logo" className="max-h-20 object-contain" onError={() => setLogoPreview('')} />
                            </div>
                        )}
                        <div className="divider my-2">Auto-Assigned Plan</div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="p-4 bg-base-200 rounded-lg">
                                <p className="font-semibold">Role</p>
                                <p className="text-base-content/70">{form.role === 'hr' ? 'HR Manager' : form.role}</p>
                            </div>
                            <div className="p-4 bg-base-200 rounded-lg">
                                <p className="font-semibold">Package Limit</p>
                                <p className="text-base-content/70">{form.packageLimit} assets</p>
                            </div>
                            <div className="p-4 bg-base-200 rounded-lg">
                                <p className="font-semibold">Plan</p>
                                <p className="text-base-content/70">{form.subscription}</p>
                            </div>
                        </div>
                        {error && <p className="text-error text-sm font-semibold">{error}</p>}
                        {success && <p className="text-success text-sm font-semibold">{success}</p>}
                        <button type="submit" className="btn btn-neutral w-full" disabled={loading}>
                            {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Register Company'}
                        </button>
                        <div className="divider my-2">OR</div>
                        <button 
                            type="button" 
                            onClick={handleGoogleRegister} 
                            className="btn btn-outline w-full gap-2"
                            disabled={loading}
                        >
                            <FcGoogle className="text-xl" />
                            {loading ? 'Signing up...' : 'Sign Up with Google'}
                        </button>
                        <p className="text-sm text-center text-base-content/70">
                            Already have an account? <a href="/login" className="link link-primary">Login here</a>
                        </p>
                    </form>
                </div>
                <div className="hidden lg:flex items-center justify-center">
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-linear-to-br from-gray-700 via-black to-black text-white w-full h-full min-h-[600px] p-8 flex flex-col justify-between">
                        <div className="space-y-4">
                            <p className="text-sm uppercase tracking-[0.2em] font-semibold">AssetVerse</p>
                            <h2 className="text-3xl font-extrabold leading-tight">Manage your team's assets effortlessly.</h2>
                            <p className="text-sm text-white/80">As an HR Manager, you get a dedicated workspace to track company assets, manage employee requests, and control your subscription plan.</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default HRManager;
