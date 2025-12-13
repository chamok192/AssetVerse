import { useState } from 'react';
import { registerHRManager, getFieldError, uploadImageToImgBB } from './authService';
import { useNavigate } from 'react-router-dom';
import { createUser } from '../Services/api';

const initialForm = {
    name: '',
    profileImage: '',
    companyName: '',
    companyLogo: '',
    email: '',
    password: '',
    dateOfBirth: '',
    role: 'HR',
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
    const [profileImageFile, setProfileImageFile] = useState(null);
    const [companyLogoFile, setCompanyLogoFile] = useState(null);

    const handleFieldError = (fieldName) => {
        return getFieldError(fieldName, form[fieldName], touched[fieldName]);
    };

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

    const handleProfileFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImageFile(file);
            setProfileImagePreview(URL.createObjectURL(file));
            setForm((prev) => ({ ...prev, profileImage: '' }));
            setTouched((prev) => ({ ...prev, profileImage: true }));
        }
    };

    const handleLogoFileChange = (e) => {
        const file = e.target.files?.[0];
        if (file) {
            setCompanyLogoFile(file);
            setLogoPreview(URL.createObjectURL(file));
            setForm((prev) => ({ ...prev, companyLogo: '' }));
            setTouched((prev) => ({ ...prev, companyLogo: true }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allTouched = { name: true, email: true, password: true, dateOfBirth: true, companyName: true };
        setTouched(allTouched);

        if (!form.name || !form.email || !form.dateOfBirth || !form.companyName || !form.password) {
            setError('Please fill in all required fields.');
            return;
        }
        if (!profileImageFile) {
            setError('Please upload a profile image.');
            return;
        }
        if (!companyLogoFile) {
            setError('Please upload a company logo.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        let profileImageUrl = form.profileImage;
        let companyLogoUrl = form.companyLogo;

        if (profileImageFile) {
            const upload = await uploadImageToImgBB(profileImageFile);
            if (!upload.success) {
                setError(upload.error);
                setLoading(false);
                return;
            }
            profileImageUrl = upload.url;
        }

        if (companyLogoFile) {
            const upload = await uploadImageToImgBB(companyLogoFile);
            if (!upload.success) {
                setError(upload.error);
                setLoading(false);
                return;
            }
            companyLogoUrl = upload.url;
        }

        const result = await registerHRManager({
            ...form,
            profileImage: profileImageUrl,
            companyLogo: companyLogoUrl
        });
        
        if (result.success) {
            setSuccess('Registration successful! Redirecting...');
            setTimeout(() => {
                navigate('/hr/assets');
            }, 2000);
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12 overflow-x-hidden">
            <div className="w-full max-w-6xl grid md:grid-cols-[1.35fr_1fr] gap-6 md:gap-8 lg:gap-10">
                <div className="bg-base-100 rounded-2xl shadow-xl p-8 lg:p-10 space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm uppercase tracking-wide text-primary">Join as HR Manager</p>
                        <h1 className="text-3xl font-bold">Register your company</h1>
                        <p className="text-sm text-base-content/70">Set up your company profile and admin credentials to manage assets and employees.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="divider my-2">Your Information</div>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text font-semibold text-base-content">Full Name</span></div>
                            <input name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} type="text" placeholder="Your Full Name" className={`input input-bordered w-full ${handleFieldError('name') ? 'input-error' : ''}`} required />
                            {handleFieldError('name') && <p className="text-error text-xs mt-1">{handleFieldError('name')}</p>}
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text font-semibold text-base-content">Work Email</span></div>
                            <input name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} type="email" placeholder="admin@company.com" className={`input input-bordered w-full ${handleFieldError('email') ? 'input-error' : ''}`} required />
                            {handleFieldError('email') && <p className="text-error text-xs mt-1">{handleFieldError('email')}</p>}
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text font-semibold text-base-content">Password</span></div>
                            <input name="password" value={form.password} onChange={handleChange} onBlur={handleBlur} type="password" placeholder="Minimum 6 characters" className={`input input-bordered w-full ${handleFieldError('password') ? 'input-error' : ''}`} minLength={6} required />
                            {handleFieldError('password') && <p className="text-error text-xs mt-1">{handleFieldError('password')}</p>}
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text font-semibold text-base-content">Date of Birth</span></div>
                            <input name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} onBlur={handleBlur} type="date" className={`input input-bordered w-full ${handleFieldError('dateOfBirth') ? 'input-error' : ''}`} required />
                            {handleFieldError('dateOfBirth') && <p className="text-error text-xs mt-1">{handleFieldError('dateOfBirth')}</p>}
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text font-semibold text-base-content">Upload profile image</span></div>
                            <input name="profileImageFile" onChange={handleProfileFileChange} type="file" accept="image/*" className="file-input file-input-bordered file-input-primary w-full" />
                            <div className="label"><span className="label-text-alt">We will upload to ImgBB and store the URL.</span></div>
                        </label>
                        {profileImagePreview && (
                            <div className="p-4 bg-base-200 rounded-lg flex items-center justify-center">
                                <img src={profileImagePreview} alt="Profile" className="w-24 h-24 rounded-full object-cover" onError={() => setProfileImagePreview('')} />
                            </div>
                        )}
                        <div className="divider my-2">Company Details</div>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text font-semibold text-base-content">Company Name</span></div>
                            <input name="companyName" value={form.companyName} onChange={handleChange} onBlur={handleBlur} type="text" placeholder="Your Company Ltd." className={`input input-bordered w-full ${handleFieldError('companyName') ? 'input-error' : ''}`} required />
                            {handleFieldError('companyName') && <p className="text-error text-xs mt-1">{handleFieldError('companyName')}</p>}
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text font-semibold text-base-content">Upload company logo</span></div>
                            <input name="companyLogoFile" onChange={handleLogoFileChange} type="file" accept="image/*" className="file-input file-input-bordered file-input-primary w-full" />
                            <div className="label"><span className="label-text-alt">We will upload to ImgBB and store the URL.</span></div>
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
                        <p className="text-sm text-center text-base-content/70">
                            Already have an account? <a href="/login" className="link link-primary">Login here</a>
                        </p>
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
