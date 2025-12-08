import React, { useState } from 'react';
import { Link } from 'react-router';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [touched, setTouched] = useState({});

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

    const handleSubmit = (e) => {
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
    };

    const handleGoogleLogin = () => {
        return null;
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
                    {error && <p className="text-error text-sm">{error}</p>}
                    <button type="submit" className="btn mt-5 btn-neutral w-full">Login</button>
                </form>
                <div className="divider">OR</div>
                <button 
                    type="button" 
                    onClick={handleGoogleLogin} 
                    className="btn btn-outline w-full gap-2"
                >
                    <FcGoogle className="text-xl" />
                    Continue with Google
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
