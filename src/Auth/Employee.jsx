import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerEmployee, getFieldError, uploadImageToImgBB } from './authService';

const init = { name: '', email: '', password: '', dateOfBirth: '', profileImage: '', role: 'Employee' };

const Employee = () => {
    const nav = useNavigate();
    const [form, setForm] = useState(init);
    const [err, setErr] = useState('');
    const [suc, setSuc] = useState('');
    const [touch, setTouch] = useState({});
    const [load, setLoad] = useState(false);
    const [preview, setPreview] = useState('');
    const [file, setFile] = useState(null);

    const getErr = (f) => getFieldError(f, form[f], touch[f]);
    const change = (e) => { const { name, value } = e.target; setForm(p => ({ ...p, [name]: value })); setTouch(p => ({ ...p, [name]: true })); setErr(''); setSuc(''); };
    const blur = (e) => setTouch(p => ({ ...p, [e.target.name]: true }));
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

    const Input = ({ name, type = 'text', placeholder, label }) => (
        <label className="form-control w-full">
            <div className="label"><span className="label-text font-semibold">{label}</span></div>
            <input name={name} value={form[name]} onChange={change} onBlur={blur} type={type} placeholder={placeholder} className={`input input-bordered w-full ${getErr(name) ? 'input-error' : ''}`} minLength={name === 'password' ? 6 : undefined} required />
            {getErr(name) && <p className="text-error text-xs mt-1">{getErr(name)}</p>}
        </label>
    );

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12 overflow-x-hidden">
            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
                <div className="bg-base-100 rounded-2xl shadow-xl p-8 lg:p-10 space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm uppercase tracking-wide text-primary">Join as Employee</p>
                        <h1 className="text-3xl font-bold">Create your employee account</h1>
                        <p className="text-sm text-base-content/70">Use your personal email. Company affiliation will be handled after registration.</p>
                    </div>
                    <form onSubmit={submit} className="space-y-6">
                        <Input name="name" placeholder="Your full name" label="Full Name" />
                        <Input name="email" type="email" placeholder="personal@email.com" label="Personal Email" />
                        <Input name="password" type="password" placeholder="Minimum 6 characters" label="Password" />
                        <Input name="dateOfBirth" type="date" label="Date of Birth" />
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
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-linear-to-br from-black via-gray-900 to-gray-700 text-white w-full h-full min-h-[520px] p-8 lg:p-10 flex flex-col justify-between">
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
