import React from 'react';
import { Outlet } from "react-router-dom";
import BottomNavbar from '../components/BottomNavbar';
import Logo from '../components/Logo';


const HomeLayoutPage = () => {
    return (
    <>
        <Logo />
        <Outlet />
        <BottomNavbar />
    </>
    );
};

export default HomeLayoutPage;
