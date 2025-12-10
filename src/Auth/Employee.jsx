import React, { useState } from 'react';
import { FcGoogle } from 'react-icons/fc';
import { useNavigate } from 'react-router-dom';
import { getAuth, createUserWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import app from '../FireBase/firebase.init';

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const initialForm = {
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    profileImage: '',
    role: 'employee'
};

const Employee = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [touched, setTouched] = useState({});
    const [loading, setLoading] = useState(false);
    const [profilePreview, setProfilePreview] = useState('');

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

    const handleProfileImageChange = (e) => {
        const url = e.target.value;
        setForm((prev) => ({ ...prev, profileImage: url }));
        setProfilePreview(url);
        setTouched((prev) => ({ ...prev, profileImage: true }));
        setError('');
    };

    const getFieldError = (fieldName) => {
        if (!touched[fieldName]) return '';
        if (!form[fieldName]) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
        if (fieldName === 'password' && form[fieldName].length < 6) return 'Password must be at least 6 characters';
        if (fieldName === 'email' && !form[fieldName].includes('@')) return 'Valid email required';
        return '';
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
                dateOfBirth: '',
                role: 'employee'
            };
            localStorage.setItem('userData', JSON.stringify(userData));

            setTimeout(() => {
                window.dispatchEvent(new Event('storage'));
            }, 100);

            setSuccess('Google registration successful! Redirecting...');

            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            console.error('Google registration error:', err);

            if (err.code === 'auth/popup-closed-by-user') {
                setError('Registration cancelled. Please try again.');
            } else if (err.code === 'auth/popup-blocked') {
                setError('Popup blocked. Please allow popups for this site.');
            } else {
                setError('Google registration failed. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allTouched = { name: true, email: true, password: true, dateOfBirth: true };
        setTouched(allTouched);

        if (!form.name || !form.email || !form.password || !form.dateOfBirth) {
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

            if (form.name || form.profileImage) {
                await updateProfile(user, {
                    displayName: form.name,
                    photoURL: form.profileImage || null
                });
            }

            const userData = {
                uid: user.uid,
                name: form.name,
                email: form.email,
                profileImage: form.profileImage || user.photoURL || '',
                avatar: form.profileImage || user.photoURL || '',
                dateOfBirth: form.dateOfBirth,
                role: 'employee'
            };
            localStorage.setItem('userData', JSON.stringify(userData));

            setTimeout(() => {
                window.dispatchEvent(new Event('storage'));
            }, 100);

            setSuccess('Registration successful! Redirecting...');

            setTimeout(() => {
                navigate('/');
            }, 1500);
        } catch (err) {
            console.error('Registration error:', err);

            if (err.code === 'auth/email-already-in-use') {
                setError('This email is already registered. Please use a different email or login.');
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address format.');
            } else if (err.code === 'auth/weak-password') {
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
            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
                <div className="bg-base-100 rounded-2xl shadow-xl p-8 space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm uppercase tracking-wide text-primary">Join as Employee</p>
                        <h1 className="text-3xl font-bold">Create your employee account</h1>
                        <p className="text-sm text-base-content/70">Use your personal email. Company affiliation will be handled after registration.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Full Name</span></div>
                            <input name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} type="text" placeholder="Your full name" className={`input input-bordered w-full ${getFieldError('name') ? 'input-error' : ''}`} required />
                            {getFieldError('name') && <p className="text-error text-xs mt-1">{getFieldError('name')}</p>}
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Personal Email</span></div>
                            <input name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} type="email" placeholder="personal@email.com" className={`input input-bordered w-full ${getFieldError('email') ? 'input-error' : ''}`} required />
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
                            <div className="label"><span className="label-text">Profile Image URL (optional)</span></div>
                            <input name="profileImage" value={form.profileImage} onChange={handleProfileImageChange} onBlur={handleBlur} type="url" placeholder="https://example.com/profile.jpg" className="input input-bordered w-full" />
                            {!getFieldError('profileImage') && <div className="label"><span className="label-text-alt">If empty, we'll use your Google photo or initials.</span></div>}
                        </label>
                        {profilePreview && (
                            <div className="p-3 bg-base-200 rounded-lg flex items-center justify-center">
                                <img src={profilePreview} alt="Profile preview" className="w-20 h-20 rounded-full object-cover" onError={() => setProfilePreview('')} />
                            </div>
                        )}
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Role</span></div>
                            <input name="role" value={form.role} disabled className="input input-bordered w-full bg-base-200" />
                        </label>
                        {error && <p className="text-error text-sm font-semibold">{error}</p>}
                        {success && <p className="text-success text-sm font-semibold">{success}</p>}
                        <button type="submit" className="btn btn-neutral w-full" disabled={loading}>
                            {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Register'}
                        </button>
                    </form>
                    <div className="divider">OR</div>
                    <button type="button" onClick={handleGoogleRegister} className="btn btn-outline w-full gap-2" disabled={loading}>
                        <FcGoogle className="text-xl" />
                        {loading ? 'Signing in...' : 'Continue with Google'}
                    </button>
                </div>
                <div className="hidden md:flex items-center justify-center">
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-linear-to-br from-black via-gray-900 to-gray-700 text-white w-full h-full min-h-[480px] p-8 flex flex-col justify-between">
                        <div className="space-y-3">
                            <p className="text-sm uppercase tracking-[0.2em]">AssetVerse</p>
                            <h2 className="text-4xl font-extrabold leading-tight">Securely manage your assets from day one.</h2>
                            <p className="text-base text-white/80">Your role is set to employee by default. You can request assets, collaborate with your team, and complete onboarding after registering.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Employee;
