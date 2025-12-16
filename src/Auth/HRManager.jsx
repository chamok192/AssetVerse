import { useState } from 'react';
import { registerHRManager, getFieldError, uploadImageToImgBB } from './authService';
import { useNavigate } from 'react-router-dom';

const init = { name: '', profileImage: '', companyName: '', companyLogo: '', email: '', password: '', dateOfBirth: '', role: 'HR', packageLimit: 5, currentEmployees: 0, subscription: 'basic' };

const HRManager = () => {
    const nav = useNavigate();
    const [form, setForm] = useState(init);
    const [err, setErr] = useState('');
    const [suc, setSuc] = useState('');
    const [logoPrev, setLogoPrev] = useState('');
    const [profPrev, setProfPrev] = useState('');
    const [touch, setTouch] = useState({});
    const [load, setLoad] = useState(false);
    const [profFile, setProfFile] = useState(null);
    const [logoFile, setLogoFile] = useState(null);

    const getErr = (f) => getFieldError(f, form[f], touch[f]);
    const change = (e) => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })); setTouch(p => ({ ...p, [name]: true })); setErr(''); setSuc(''); };
    const blur = (e) => setTouch(p => ({ ...p, [e.target.name]: true }));
    const upProf = (e) => { const f = e.target.files?.[0]; if (f) { setProfFile(f); setProfPrev(URL.createObjectURL(f)); setForm(p => ({ ...p, profileImage: '' })); } };
    const upLogo = (e) => { const f = e.target.files?.[0]; if (f) { setLogoFile(f); setLogoPrev(URL.createObjectURL(f)); setForm(p => ({ ...p, companyLogo: '' })); } };

    const submit = async (e) => {
        e.preventDefault();
        setTouch({ name: true, email: true, password: true, dateOfBirth: true, companyName: true });
        if (!form.name || !form.email || !form.dateOfBirth || !form.companyName || !form.password) { setErr('Please fill in all required fields.'); return; }
        if (!profFile) { setErr('Please upload a profile image.'); return; }
        if (!logoFile) { setErr('Please upload a company logo.'); return; }
        if (form.password.length < 6) { setErr('Password must be at least 6 characters.'); return; }

        setLoad(true);
        setErr('');
        setSuc('');

        const upImg = async (f) => { const res = await uploadImageToImgBB(f); if (!res.success) { setErr(res.error); setLoad(false); return null; } return res.url; };
        const profUrl = profFile ? await upImg(profFile) : form.profileImage;
        const logoUrl = logoFile ? await upImg(logoFile) : form.companyLogo;
        if (!profUrl || !logoUrl) return;

        const res = await registerHRManager({ ...form, profileImage: profUrl, companyLogo: logoUrl });
        if (res.success) { setSuc('Registration successful! Redirecting...'); setTimeout(() => nav('/hr/assets'), 2000); }
        else { setErr(res.error); }
        setLoad(false);
    };

    const Input = ({ name, type = 'text', placeholder, label }) => (
        <label className="form-control w-full">
            <div className="label"><span className="label-text font-semibold">{label}</span></div>
            <input name={name} value={form[name]} onChange={change} onBlur={blur} type={type} placeholder={placeholder} className={`input input-bordered w-full ${getErr(name) ? 'input-error' : ''}`} minLength={name === 'password' ? 6 : undefined} required />
            {getErr(name) && <p className="text-error text-xs mt-1">{getErr(name)}</p>}
        </label>
    );

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12 overflow-x-hidden">
            <div className="w-full max-w-6xl grid md:grid-cols-[1.35fr_1fr] gap-6 md:gap-8 lg:gap-10">
                <div className="bg-base-100 rounded-2xl shadow-xl p-8 lg:p-10 space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm uppercase tracking-wide text-primary">Join as HR Manager</p>
                        <h1 className="text-3xl font-bold">Register your company</h1>
                        <p className="text-sm text-base-content/70">Set up your company profile and admin credentials to manage assets and employees.</p>
                    </div>
                    <form onSubmit={submit} className="space-y-6">
                        <div className="divider my-2">Your Information</div>
                        <Input name="name" placeholder="Your Full Name" label="Full Name" />
                        <Input name="email" type="email" placeholder="admin@company.com" label="Work Email" />
                        <Input name="password" type="password" placeholder="Minimum 6 characters" label="Password" />
                        <Input name="dateOfBirth" type="date" label="Date of Birth" />
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text font-semibold">Upload profile image</span></div>
                            <input name="profileImageFile" onChange={upProf} type="file" accept="image/*" className="file-input file-input-bordered file-input-primary w-full" />
                            <div className="label"><span className="label-text-alt">We will upload to ImgBB and store the URL.</span></div>
                        </label>
                        {profPrev && <div className="p-4 bg-base-200 rounded-lg flex items-center justify-center"><img src={profPrev} alt="Profile" className="w-24 h-24 rounded-full object-cover" onError={() => setProfPrev('')} /></div>}
                        <div className="divider my-2">Company Details</div>
                        <Input name="companyName" placeholder="Your Company Ltd." label="Company Name" />
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text font-semibold">Upload company logo</span></div>
                            <input name="companyLogoFile" onChange={upLogo} type="file" accept="image/*" className="file-input file-input-bordered file-input-primary w-full" />
                            <div className="label"><span className="label-text-alt">We will upload to ImgBB and store the URL.</span></div>
                        </label>
                        {logoPrev && <div className="p-4 bg-base-200 rounded-lg flex items-center justify-center"><img src={logoPrev} alt="Logo" className="max-h-20 object-contain" onError={() => setLogoPrev('')} /></div>}
                        <div className="divider my-2">Auto-Assigned Plan</div>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                            <div className="p-4 bg-base-200 rounded-lg"><p className="font-semibold">Role</p><p className="text-base-content/70">{form.role === 'hr' ? 'HR Manager' : form.role}</p></div>
                            <div className="p-4 bg-base-200 rounded-lg"><p className="font-semibold">Package Limit</p><p className="text-base-content/70">{form.packageLimit} assets</p></div>
                            <div className="p-4 bg-base-200 rounded-lg"><p className="font-semibold">Plan</p><p className="text-base-content/70">{form.subscription}</p></div>
                        </div>
                        {err && <p className="text-error text-sm font-semibold">{err}</p>}
                        {suc && <p className="text-success text-sm font-semibold">{suc}</p>}
                        <button type="submit" className="btn btn-neutral w-full" disabled={load}>{load ? <span className="loading loading-spinner loading-sm"></span> : 'Register Company'}</button>
                        <p className="text-sm text-center text-base-content/70">Already have an account? <a href="/login" className="link link-primary">Login here</a></p>
                    </form>
                </div>
                <div className="hidden md:flex items-center justify-center">
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-linear-to-br from-gray-700 via-black to-black text-white w-full h-full min-h-[560px] p-8 lg:p-10 flex flex-col justify-between">
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
