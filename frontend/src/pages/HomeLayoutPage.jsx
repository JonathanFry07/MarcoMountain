import React from 'react';
import { Outlet } from "react-router-dom";
import BottomNavbar from '../components/BottomNavbar';


const HomeLayoutPage = () => {
    return (
    <>
        <Outlet />
        <BottomNavbar />
    </>
    );
};

export default HomeLayoutPage;
