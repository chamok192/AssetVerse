import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import Nav from '../Pages/Shared/NavBar/Nav';
import Footer from '../Pages/Shared/Footer/Footer';

const RootLayout = () => {
    const location = useLocation();

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [location.pathname]);

    return (
        <div className='max-w-7xl mx-auto'>
            <Nav></Nav>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;