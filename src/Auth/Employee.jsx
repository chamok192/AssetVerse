import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerEmployee, getFieldError, uploadImageToImgBB, checkEmailExists } from './authService';

const init = { name: '', email: '', password: '', dateOfBirth: '', profileImage: '', role: 'Employee' };

const Input = ({ name, type = 'text', placeholder, label, value, onChange, onBlur, error }) => {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';
    const inputType = isPassword && showPassword ? 'text' : type;

    return (
        <label className="form-control w-full">
            <div className="label"><span className="label-text font-semibold">{label}</span></div>
            <div className="relative">
                <input key={name} name={name} value={value} onChange={onChange} onBlur={onBlur} type={inputType} placeholder={placeholder} className={`input input-bordered w-full pr-10 ${error ? 'input-error' : ''}`} minLength={name === 'password' ? 6 : undefined} required autoComplete={name === 'password' ? 'new-password' : name === 'email' ? 'email' : name === 'name' ? 'name' : name === 'dateOfBirth' ? 'bday' : 'off'} />
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
            {error && <p className="text-error text-xs mt-1">{error}</p>}
        </label>
    );
};

const Employee = () => {
    const nav = useNavigate();
    const [form, setForm] = useState(init);
    const [err, setErr] = useState('');
    const [suc, setSuc] = useState('');
    const [touch, setTouch] = useState({});
    const [load, setLoad] = useState(false);
    const [preview, setPreview] = useState('');
    const [file, setFile] = useState(null);
    const [emailExists, setEmailExists] = useState(false);

    const getErr = (f) => {
        if (f === 'email' && emailExists) return 'Email already registered';
        return getFieldError(f, form[f], touch[f]);
    };
    const change = (e) => { 
        const { name, value } = e.target; 
        setForm(p => ({ ...p, [name]: value })); 
        setTouch(p => ({ ...p, [name]: true })); 
        setErr(''); 
        setSuc(''); 
        if (name === 'email') setEmailExists(false);
    };
    const blur = async (e) => {
        const name = e.target.name;
        setTouch(p => ({ ...p, [name]: true }));
        if (name === 'email' && form.email) {
            const exists = await checkEmailExists(form.email);
            setEmailExists(exists);
        }
    };
    const upFile = (e) => { const f = e.target.files?.[0]; if (f) { setFile(f); setPreview(URL.createObjectURL(f)); setForm(p => ({ ...p, profileImage: '' })); setTouch(p => ({ ...p, profileImage: true })); } };

    const submit = async (e) => {
        e.preventDefault();
        setTouch({ name: true, email: true, password: true, dateOfBirth: true });

        if (!form.name || !form.email || !form.dateOfBirth || !form.password) { setErr('Please fill in all required fields.'); return; }
        if (form.password.length < 6) { setErr('Password must be at least 6 characters.'); return; }

        setLoad(true);
        setErr('');
        setSuc('');

        let img = form.profileImage;
        if (file) {
            const res = await uploadImageToImgBB(file);
            if (!res.success) { setErr(res.error); setLoad(false); return; }
            img = res.url;
        }

        const res = await registerEmployee({ ...form, profileImage: img });
        if (res.success) { setSuc('Registration successful! Redirecting...'); setTimeout(() => nav('/'), 1500); }
        else { setErr(res.error); }
        setLoad(false);
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12 overflow-x-hidden">
            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
                <div className="bg-base-100 rounded-2xl shadow-xl p-4 sm:p-8 lg:p-10 space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm uppercase tracking-wide text-primary">Join as Employee</p>
                        <h1 className="text-3xl font-bold">Create your employee account</h1>
                        <p className="text-sm text-base-content/70">Use your personal email. Company affiliation will be handled after registration.</p>
                    </div>
                    <form onSubmit={submit} className="space-y-6">
                        <Input name="name" value={form.name} onChange={change} onBlur={blur} error={getErr('name')} placeholder="Your full name" label="Full Name" />
                        <Input name="email" value={form.email} onChange={change} onBlur={blur} error={getErr('email')} type="email" placeholder="personal@email.com" label="Personal Email" />
                        <Input name="password" value={form.password} onChange={change} onBlur={blur} error={getErr('password')} type="password" placeholder="Minimum 6 characters" label="Password" />
                        <Input name="dateOfBirth" value={form.dateOfBirth} onChange={change} onBlur={blur} error={getErr('dateOfBirth')} type="date" label="Date of Birth" />
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text font-semibold">Upload profile image</span></div>
                            <input name="profileImageFile" onChange={upFile} type="file" accept="image/*" className="file-input file-input-bordered file-input-primary w-full" />
                            <div className="label"><span className="label-text-alt">We will upload to ImgBB and store the URL.</span></div>
                        </label>
                        {preview && <div className="p-3 bg-base-200 rounded-lg flex items-center justify-center"><img src={preview} alt="Profile preview" className="w-20 h-20 rounded-full object-cover" onError={() => setPreview('')} /></div>}
                        <label className="form-control w-full"><div className="label"><span className="label-text font-semibold">Role</span></div><input name="role" value={form.role} disabled className="input input-bordered w-full bg-base-200" /></label>
                        {err && <p className="text-error text-sm font-semibold">{err}</p>}
                        {suc && <p className="text-success text-sm font-semibold">{suc}</p>}
                        <button type="submit" className="btn btn-neutral w-full" disabled={load}>{load ? <span className="loading loading-spinner loading-sm"></span> : 'Register'}</button>
                    </form>
                </div>
                <div className="hidden md:flex items-center justify-center">
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-linear-to-br from-black via-gray-900 to-gray-700 text-white w-full h-full min-h-[520px] p-4 sm:p-8 lg:p-10 flex flex-col justify-between">
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
