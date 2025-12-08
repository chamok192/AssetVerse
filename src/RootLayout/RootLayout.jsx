import React from 'react';
import { Outlet } from 'react-router';
import Nav from '../Pages/Shared/NavBar/Nav';
import Footer from '../Pages/Shared/Footer/Footer';

const RootLayout = () => {
    return (
        <div>
            <Nav></Nav>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    );
};

export default RootLayout;