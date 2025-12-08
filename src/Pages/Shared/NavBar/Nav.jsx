import React from 'react';
import Logo from '../../../Components/Logo/Logo';
import { Link } from 'react-router';

const Nav = () => {
    return (
        <div className="navbar bg-base-100 shadow-sm">
            <div className="navbar-start">
                <div className="dropdown">
                    <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" />
                        </svg>
                    </div>
                    <ul
                        tabIndex="-1"
                        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-1 mt-3 w-64 p-2 shadow">
                        <li className="menu-title">Public Links</li>
                        <li><Link to="/">Home</Link></li>
                        <li><Link to="/join/employee">Join as Employee</Link></li>
                        <li><Link to="/join/hr-manager">Join as HR Manager</Link></li>
                        <li className="divider"></li>
                        <li className="menu-title">Join as Employee</li>
                        <li><button>My Assets</button></li>
                        <li><button>My Team</button></li>
                        <li><button>Request Asset</button></li>
                        <li><button>Profile</button></li>
                        <li><button>Logout</button></li>
                        <li className="divider"></li>
                        <li className="menu-title">Join as HR Manager</li>
                        <li><button>Asset List</button></li>
                        <li><button>Add Asset</button></li>
                        <li><button>All Requests</button></li>
                        <li><button>Employee List</button></li>
                        <li><button>Profile</button></li>
                        <li><button>Logout</button></li>
                    </ul>
                </div>
                <Link to={'/'} className="cursor-pointer">
                    <Logo />
                </Link>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li>
                        <details>
                            <summary>Public Links</summary>
                            <ul className="p-2 bg-base-100 w-52 z-1">
                                <li><Link to="/">Home</Link></li>
                                <li><Link to="/join/employee">Join as Employee</Link></li>
                                <li><Link to="/join/hr-manager">Join as HR Manager</Link></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary>Join as Employee</summary>
                            <ul className="p-2 bg-base-100 w-52 z-1">
                                <li><button>My Assets</button></li>
                                <li><button>My Team</button></li>
                                <li><button>Request Asset</button></li>
                                <li><button>Profile</button></li>
                                <li><button>Logout</button></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary>Join as HR Manager</summary>
                            <ul className="p-2 bg-base-100 w-52 z-1">
                                <li><button>Asset List</button></li>
                                <li><button>Add Asset</button></li>
                                <li><button>All Requests</button></li>
                                <li><button>Employee List</button></li>
                                <li><button>Profile</button></li>
                                <li><button>Logout</button></li>
                            </ul>
                        </details>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default Nav;
