import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithEmail, getFieldError, validatePassword } from './authService';
import { useAuth } from '../Contents/AuthContext/useAuth';

const Input = ({ name, type, placeholder, label, value, onChange }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <label className="form-control w-full">
            <div className="label"><span className="label-text">{label}</span></div>
            <div className="relative">
                <input
                    name={name}
                    value={value}
                    onChange={onChange}
                    type={inputType}
                    placeholder={placeholder}
                    className={`input input-bordered w-full pr-10 ${getFieldError(name) ? 'input-error' : ''}`}
                    required
                    minLength={name === 'password' ? 6 : undefined}
                />
                {isPassword && (
                    <button
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                    </button>
                )}
            </div>
            {getFieldError(name) && <p className="text-error text-xs mt-1">{getFieldError(name)}</p>}
        </label>
    );
};

const Login = () => {
    const nav = useNavigate();
    const { refetchProfile } = useAuth();
    const [form, setForm] = useState({ email: '', password: '' });
    const [err, setErr] = useState('');
    const [suc, setSuc] = useState('');
    const [load, setLoad] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(p => ({ ...p, [name]: value }));
        if (err) setErr('');
    };

    const handle = async (e) => {
        e.preventDefault();
        if (!form.email || !form.password) { setErr('Please fill in all fields.'); return; }
        if (!validatePassword(form.password)) { setErr('Password must be at least 6 characters.'); return; }

        setLoad(true);
        setErr('');
        setSuc('');

        const res = await loginWithEmail(form.email, form.password);
        if (!res.success) {
            setErr(res.error);
            setLoad(false);
            return;
        }

        const data = res.userData;


        localStorage.setItem('userData', JSON.stringify(data));
        window.dispatchEvent(new Event('storage'));
        await refetchProfile();

        setSuc('Login successful! Redirecting...');
        const role = (data.role || '').toLowerCase();
        const redirectPath = role === 'hr' ? '/hr/assets' : role === 'employee' ? '/employee/assets' : '/';

        setTimeout(() => nav(redirectPath), 1500);
        setLoad(false);
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
            <div className="max-w-md w-full bg-base-100 rounded-2xl shadow-xl p-8 space-y-6">
                <div className="text-center space-y-2">
                    <h1 className="text-3xl font-bold">Welcome Back</h1>
                    <p className="text-sm text-base-content/70">Login to access your account</p>
                </div>
                <form onSubmit={handle} className="space-y-5">
                    <Input name="email" type="email" placeholder="your@email.com" label="Email" value={form.email} onChange={handleInputChange} />
                    <Input name="password" type="password" placeholder="Minimum 6 characters" label="Password" value={form.password} onChange={handleInputChange} />
                    {err && <p className="text-error text-sm font-semibold">{err}</p>}
                    {suc && <p className="text-success text-sm font-semibold">{suc}</p>}
                    <button type="submit" className="btn mt-5 btn-neutral w-full" disabled={load}>
                        {load ? <span className="loading loading-spinner loading-sm"></span> : 'Login'}
                    </button>
                </form>
                <div className="divider">New to AssetVerse?</div>
                <div className="text-center"><div className="flex flex-col gap-2"><Link to="/join/employee" className="btn btn-outline btn-sm">Join as Employee</Link><Link to="/join/hr-manager" className="btn btn-outline btn-sm">Join as HR Manager</Link></div></div>
            </div>
        </div>
    );
};

export default Login;
