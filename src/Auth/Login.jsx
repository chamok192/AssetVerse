import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginWithEmail, getFieldError, validatePassword } from './authService';

const Input = ({ name, type, placeholder, label, value, onChange }) => (
    <label className="form-control w-full">
        <div className="label"><span className="label-text">{label}</span></div>
        <input 
            name={name} 
            value={value} 
            onChange={onChange}
            type={type} 
            placeholder={placeholder} 
            className={`input input-bordered w-full ${getFieldError(name) ? 'input-error' : ''}`} 
            required 
            minLength={name === 'password' ? 6 : undefined} 
        />
        {getFieldError(name) && <p className="text-error text-xs mt-1">{getFieldError(name)}</p>}
    </label>
);

const Login = () => {
    const nav = useNavigate();
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

        setSuc('Login successful! Redirecting...');
        const role = (data.role || '').toLowerCase();
        const redirectPath = role === 'hr' ? '/hr/assets' : role === 'employee' ? '/employee/dashboard' : '/';

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
