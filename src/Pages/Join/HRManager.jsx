import React, { useState } from 'react';

const initialForm = {
    name: '',
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
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [logoPreview, setLogoPreview] = useState('');
    const [touched, setTouched] = useState({});

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

    const getFieldError = (fieldName) => {
        if (!touched[fieldName]) return '';
        if (!form[fieldName]) return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1).replace(/([A-Z])/g, ' $1')} is required`;
        if (fieldName === 'password' && form[fieldName].length < 6) return 'Password must be at least 6 characters';
        if (fieldName === 'email' && !form[fieldName].includes('@')) return 'Valid email required';
        return '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const allTouched = { name: true, email: true, password: true, dateOfBirth: true, companyName: true, companyLogo: true };
        setTouched(allTouched);
        if (!form.name || !form.companyName || !form.companyLogo || !form.email || !form.password || !form.dateOfBirth) {
            setError('Please fill in all required fields.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setSuccess('Registered successfully as HR Manager.');
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
                            {!getFieldError('companyLogo') && <div className="label"><span className="label-text-alt">Use ImgBB or Cloudinary for hosting</span></div>}
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
                        <button type="submit" className="btn btn-neutral w-full">Register Company</button>
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
