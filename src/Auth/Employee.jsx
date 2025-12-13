import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerEmployee, getFieldError, uploadImageToImgBB } from './authService';
import { createUser } from '../Services/api';

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
    const [profileFile, setProfileFile] = useState(null);

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
            setProfileFile(file);
            setProfilePreview(URL.createObjectURL(file));
            setForm((prev) => ({ ...prev, profileImage: '' }));
            setTouched((prev) => ({ ...prev, profileImage: true }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const allTouched = { name: true, email: true, password: true, dateOfBirth: true };
        setTouched(allTouched);

        if (!form.name || !form.email || !form.dateOfBirth || !form.password) {
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

        let profileImageUrl = form.profileImage;
        if (profileFile) {
            const upload = await uploadImageToImgBB(profileFile);
            if (!upload.success) {
                setError(upload.error);
                setLoading(false);
                return;
            }
            profileImageUrl = upload.url;
        }

        const result = await registerEmployee({
            ...form,
            profileImage: profileImageUrl
        });
        
        if (result.success) {
            const dbResult = await createUser({
                uid: result.user.uid,
                name: form.name,
                email: form.email,
                profileImage: profileImageUrl,
                dateOfBirth: form.dateOfBirth,
                role: 'employee'
            });
            
            if (!dbResult.success) {
                console.error('MongoDB save failed:', dbResult.error);
                setError('Firebase saved but MongoDB failed: ' + dbResult.error);
                setLoading(false);
                return;
            }
            
            setSuccess('Registration successful! Redirecting...');
            setTimeout(() => {
                navigate('/');
            }, 1500);
        } else {
            setError(result.error);
        }
        
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-12 overflow-x-hidden">
            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-6 md:gap-8 lg:gap-10">
                <div className="bg-base-100 rounded-2xl shadow-xl p-8 lg:p-10 space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm uppercase tracking-wide text-primary">Join as Employee</p>
                        <h1 className="text-3xl font-bold">Create your employee account</h1>
                        <p className="text-sm text-base-content/70">Use your personal email. Company affiliation will be handled after registration.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text font-semibold text-base-content">Full Name</span></div>
                            <input name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} type="text" placeholder="Your full name" className={`input input-bordered w-full ${handleFieldError('name') ? 'input-error' : ''}`} required />
                            {handleFieldError('name') && <p className="text-error text-xs mt-1">{handleFieldError('name')}</p>}
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text font-semibold text-base-content">Personal Email</span></div>
                            <input name="email" value={form.email} onChange={handleChange} onBlur={handleBlur} type="email" placeholder="personal@email.com" className={`input input-bordered w-full ${handleFieldError('email') ? 'input-error' : ''}`} required />
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
                        {profilePreview && (
                            <div className="p-3 bg-base-200 rounded-lg flex items-center justify-center">
                                <img src={profilePreview} alt="Profile preview" className="w-20 h-20 rounded-full object-cover" onError={() => setProfilePreview('')} />
                            </div>
                        )}
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text font-semibold text-base-content">Role</span></div>
                            <input name="role" value={form.role} disabled className="input input-bordered w-full bg-base-200" />
                        </label>
                        {error && <p className="text-error text-sm font-semibold">{error}</p>}
                        {success && <p className="text-success text-sm font-semibold">{success}</p>}
                        <button type="submit" className="btn btn-neutral w-full" disabled={loading}>
                            {loading ? <span className="loading loading-spinner loading-sm"></span> : 'Register'}
                        </button>
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
