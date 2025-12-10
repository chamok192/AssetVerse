import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { loginWithEmail, signInWithGoogle, getFieldError, validatePassword } from './authService';

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!form.email || !form.password) {
            setError('Please fill in all fields.');
            return;
        }
        if (!validatePassword(form.password)) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        const result = await loginWithEmail(form.email, form.password);
        
        if (result.success) {
            setSuccess('Login successful! Redirecting...');
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        const result = await signInWithGoogle('employee');
        
        if (result.success) {
            setSuccess('Google login successful! Redirecting...');
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } else {
            setError(result.error);
        }
        
        setLoading(false);
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
