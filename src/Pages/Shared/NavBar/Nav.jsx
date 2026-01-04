import { useState, useEffect } from 'react';
import Logo from '../../../Components/Logo/Logo';
import { Link, NavLink, useLocation } from 'react-router';
import { useAuth } from '../../../Contents/AuthContext/useAuth';
import { logoutUser } from '../../../Auth/authService';

const DEF_IMG = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="150" height="150" viewBox="0 0 150 150"%3E%3Crect fill="%23e0e0e0" width="150" height="150"/%3E%3Ctext x="50%25" y="50%25" font-family="Arial" font-size="14" fill="%23999" text-anchor="middle" dy=".3em"%3ENo Image%3C/text%3E%3C/svg%3E';
const publicLinks = [{ label: 'Home', to: '/' }, { label: 'Join as Employee', to: '/join/employee' }, { label: 'Join as HR Manager', to: '/join/hr-manager' }];
const empMenu = [{ label: 'My Assets', to: '/employee/assets' }, { label: 'My Team', to: '/employee/team' }, { label: 'Request Asset', to: '/employee/request' }, { label: 'Profile', to: '/profile' }, { label: 'Logout', action: 'logout' }];
const hrMenu = [{ label: 'Dashboard', to: '/hr/assets' }, { label: 'Asset List', to: '/hr/assets' }, { label: 'Add Asset', to: '/hr/assets/new' }, { label: 'All Requests', to: '/hr/requests' }, { label: 'Upgrade Package', to: '/hr/upgrade' }, { label: 'Employee List', to: '/hr/employees' }, { label: 'Profile', to: '/profile' }, { label: 'Logout', action: 'logout' }];

const Nav = () => {
    const { user } = useAuth();
    const [mobile, setMobile] = useState(false);
    const [profile, setProfile] = useState(false);
    const location = useLocation();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setMobile(false); setProfile(false);
    }, [location.pathname]);

    const close = () => { setMobile(false); setProfile(false); };
    const menu = user?.role?.toLowerCase() === 'hr' ? hrMenu : empMenu;
    const linkClass = ({ isActive }) => isActive ? 'active text-base-content font-semibold' : 'text-base-content/70';
    const scroll = (h) => { const el = document.querySelector(h); el?.scrollIntoView({ behavior: 'smooth', block: 'start' }); };

    const Item = ({ item }) => (
        <li key={item.label}>
            {item.to ? (item.isHash ? <a href={item.to} onClick={e => { e.preventDefault(); scroll(item.to.substring(1)); close(); }} className="text-base-content/70 hover:text-base-content">{item.label}</a> : <NavLink to={item.to} className={linkClass} onClick={close}>{item.label}</NavLink>) : <button type="button" onClick={async () => { await logoutUser(); close(); }}>{item.label}</button>}
        </li>
    );

    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
            <div className="navbar-start">
                <div className={`dropdown ${mobile ? 'dropdown-open' : ''}`}>
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden" onClick={() => setMobile(m => !m)}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                    </div>
                    <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-56 p-2 shadow">
                        {publicLinks.map(i => <Item key={i.label} item={i} />)}
                        {user && (<><li className="menu-title">{user.role === 'hr' ? 'HR Manager' : 'Employee'}</li>{menu.map(i => <Item key={i.label} item={i} />)}</>)}
                    </ul>
                </div>
                <Link to={'/'} className="cursor-pointer text-xl font-semibold tracking-tight"><Logo /></Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">
                    {publicLinks.map(i => (
                        <li key={i.label}>
                            {i.isHash ? <a href={i.to} onClick={e => { e.preventDefault(); scroll(i.to.substring(1)); }} className="text-base-content/70 hover:text-base-content">{i.label}</a> : <NavLink to={i.to} className={linkClass}>{i.label}</NavLink>}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="navbar-end gap-3">
                {!user && <Link to="/login" className="btn btn-neutral">Login</Link>}
                {user && (
                    <div className={`dropdown dropdown-end ${profile ? 'dropdown-open' : ''}`}>
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar" onClick={() => setProfile(p => !p)}>
                            <div className="w-10 rounded-full"><img alt={user.name} src={user.profileImage || user.photoURL || DEF_IMG} /></div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-56 p-2 shadow">
                            <li className="menu-title">{user.name}</li>
                            {menu.map(i => <Item key={i.label} item={i} />)}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Nav;
