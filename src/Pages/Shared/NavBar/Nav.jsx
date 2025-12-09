import React, { useState, useEffect } from 'react';
import Logo from '../../../Components/Logo/Logo';
import { Link, NavLink } from 'react-router';

const publicLinks = [
    { label: 'Home', to: '/' },
    { label: 'Pricing', to: '/#pricing', isHash: true },
    { label: 'Join as Employee', to: '/join/employee' },
    { label: 'Join as HR Manager', to: '/join/hr-manager' }
];

const employeeMenu = [
    { label: 'My Assets', to: '/employee/assets' },
    { label: 'My Team', to: '/employee/team' },
    { label: 'Request Asset', to: '/employee/request' },
    { label: 'Profile', to: '/profile' },
    { label: 'Logout', action: 'logout' }
];

const hrManagerMenu = [
    { label: 'Asset List', to: '/hr/assets' },
    { label: 'Add Asset', to: '/hr/assets/new' },
    { label: 'All Requests', to: '/hr/requests' },
    { label: 'Employee List', to: '/hr/employees' },
    { label: 'Profile', to: '/profile' },
    { label: 'Logout', action: 'logout' }
];

const Nav = () => {
    const user = null;
    const [activePricing, setActivePricing] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const pricingSection = document.querySelector('#pricing');
            if (pricingSection) {
                const rect = pricingSection.getBoundingClientRect();
                setActivePricing(rect.top < window.innerHeight && rect.bottom > 0);
            }
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const roleMenu = user?.role === 'hr-manager' ? hrManagerMenu : employeeMenu;

    const handleLogout = () => {
        return null;
    };

    const linkClass = ({ isActive }) => {
        // Don't show Home as active if pricing section is in view
        if (isActive && activePricing) {
            return 'text-base-content/70';
        }
        return isActive ? 'active text-base-content font-semibold' : 'text-base-content/70';
    };

    const handleScrollToSection = (hash) => {
        const element = document.querySelector(hash);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };

    const getHashLinkClass = (isHashActive) => isHashActive ? 'active text-base-content font-semibold' : 'text-base-content/70 hover:text-base-content';

    const renderMenuItems = (items) => items.map((item) => (
        <li key={item.label}>
            {item.to ? (
                item.isHash ? (
                    <a 
                        href={item.to} 
                        onClick={(e) => {
                            e.preventDefault();
                            handleScrollToSection(item.to.substring(1));
                        }}
                        className="text-base-content/70 hover:text-base-content"
                    >
                        {item.label}
                    </a>
                ) : (
                    <NavLink to={item.to} className={linkClass}>{item.label}</NavLink>
                )
            ) : (
                <button type="button" onClick={handleLogout}>{item.label}</button>
            )}
        </li>
    ));

    return (
        <div className="navbar bg-base-100 shadow-sm sticky top-0 z-50">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex={0}
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-56 p-2 shadow">
                        {publicLinks.map((item) => (
                            <li key={item.label}>
                                {item.isHash ? (
                                    <a 
                                        href={item.to} 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handleScrollToSection(item.to.substring(1));
                                        }}
                                        className={getHashLinkClass(activePricing)}
                                    >
                                        {item.label}
                                    </a>
                                ) : (
                                    <NavLink to={item.to} className={linkClass}>{item.label}</NavLink>
                                )}
                            </li>
                        ))}
                        {user && (
                            <>
                                <li className="menu-title">{user.role === 'hr-manager' ? 'HR Manager' : 'Employee'}</li>
                                {renderMenuItems(roleMenu)}
                            </>
                        )}
                    </ul>
                </div>
                <Link to={'/'} className="cursor-pointer text-xl font-semibold tracking-tight">
                    <Logo />
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1 gap-2">
                    {publicLinks.map((item) => (
                        <li key={item.label}>
                            {item.isHash ? (
                                <a 
                                    href={item.to} 
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleScrollToSection(item.to.substring(1));
                                    }}
                                    className={getHashLinkClass(activePricing)}
                                >
                                    {item.label}
                                </a>
                            ) : (
                                <NavLink to={item.to} className={linkClass}>{item.label}</NavLink>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
            <div className="navbar-end gap-3">
                {!user && (
                    <Link to="/login" className="btn btn-neutral">Login</Link>
                )}
                {user && (
                    <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full">
                                <img alt={user.name} src={user.avatar} />
                            </div>
                        </div>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-56 p-2 shadow">
                            <li className="menu-title">{user.name}</li>
                            {renderMenuItems(roleMenu)}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Nav;
