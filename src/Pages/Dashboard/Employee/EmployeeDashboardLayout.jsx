import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router';
import { logoutUser } from '../../../Auth/authService';

const links = [
    { label: 'My Assets', to: '/employee/assets' },
    { label: 'Request Asset', to: '/employee/request' },
    { label: 'My Team', to: '/employee/team' },
    { label: 'Profile', to: '/profile' }
];

const EmployeeDashboardLayout = ({ children, title, subtitle }) => {
    const nav = useNavigate();
    const [open, setOpen] = useState(false);

    return (
        <div className="min-h-screen bg-base-200">
            <div className="navbar bg-base-100 shadow">
                <div className="flex-1">
                    <button className="btn btn-ghost lg:hidden" onClick={() => setOpen(!open)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
                    </button>
                    <div className="ml-2 text-xl font-bold">AssetVerse - Employee</div>
                </div>
                <div className="flex-none">
                    <button onClick={async () => { await logoutUser(); nav('/login'); }} className="btn btn-outline btn-sm">Logout</button>
                </div>
            </div>
            <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
                <aside className={`${open ? 'block' : 'hidden'} lg:block`}>
                    <div className="sticky top-16 space-y-2 bg-base-100 p-6 shadow lg:top-0">
                        {links.map(l => (
                            <NavLink key={l.to} to={l.to} className={({ isActive }) => `block rounded-lg px-4 py-2 transition ${isActive ? 'bg-primary text-primary-content font-bold' : 'hover:bg-base-200'}`} onClick={() => setOpen(false)}>
                                {l.label}
                            </NavLink>
                        ))}
                    </div>
                </aside>
                <main className="space-y-6 p-6">
                    <div><h1 className="text-3xl font-bold">{title}</h1><p className="text-base-content/60">{subtitle}</p></div>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default EmployeeDashboardLayout;
