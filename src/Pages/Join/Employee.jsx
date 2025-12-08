import React, { useState } from 'react';

const initialForm = {
    name: '',
    email: '',
    password: '',
    dateOfBirth: '',
    role: 'employee'
};

const Employee = () => {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setError('');
        setSuccess('');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password || !form.dateOfBirth) {
            setError('Please fill in all required fields.');
            return;
        }
        if (form.password.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        setSuccess('Registered successfully as employee.');
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
            <div className="max-w-4xl w-full grid md:grid-cols-2 gap-8">
                <div className="bg-base-100 rounded-2xl shadow-xl p-8 space-y-6">
                    <div className="space-y-2">
                        <p className="text-sm uppercase tracking-wide text-primary">Join as Employee</p>
                        <h1 className="text-3xl font-bold">Create your employee account</h1>
                        <p className="text-sm text-base-content/70">Use your personal email. Company affiliation will be handled after registration.</p>
                    </div>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Full Name</span></div>
                            <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Your full Name" className="input input-bordered w-full" required />
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Personal Email</span></div>
                            <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="personal@email.com" className="input input-bordered w-full" required />
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Password</span></div>
                            <input name="password" value={form.password} onChange={handleChange} type="password" placeholder="Minimum 6 characters" className="input input-bordered w-full" minLength={6} required />
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Date of Birth</span></div>
                            <input name="dateOfBirth" value={form.dateOfBirth} onChange={handleChange} type="date" className="input input-bordered w-full" required />
                        </label>
                        <label className="form-control w-full">
                            <div className="label"><span className="label-text">Role</span></div>
                            <input name="role" value={form.role} disabled className="input input-bordered w-full bg-base-200" />
                        </label>
                        {error && <p className="text-error text-sm">{error}</p>}
                        {success && <p className="text-success text-sm">{success}</p>}
                        <button type="submit" className="btn btn-neutral w-full">Register</button>
                    </form>
                </div>
                <div className="hidden md:flex items-center justify-center">
                    <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gradient-to-br from-black via-gray-900 to-gray-700 text-white w-full h-full min-h-[480px] p-8 flex flex-col justify-between">
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
