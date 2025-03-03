import React, { useState } from 'react';
import { Outlet } from "react-router-dom";
import { useAuthStore } from '../store/authStore';
import LoginForm from '../components/LoginForm';
import SignUpForm from '../components/SignUpForm';

const HomeLayoutPage = () => {
    const { isAuthenticated, user } = useAuthStore();
    const [ toggleForm, setToggleForm] = useState(true)

    return (
        <>
            {isAuthenticated ? (
                <>
                    <Outlet />
                </>
            ) : (
                <div className="min-h-screen bg-white flex flex-col justify-center items-center p-6">
                    <div className="w-full max-w-md text-center">
                        {toggleForm ? (
                            <LoginForm />
                        ) : (
                            <SignUpForm />
                        )}

                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-600">
                                {toggleForm ? "Don't have an account?" : 'Already have an account?'}{' '}
                                <span
                                    onClick={() => setToggleForm(!toggleForm)}
                                    className="text-teal-400 hover:text-blue-500 font-medium cursor-pointer"
                                >
                                    {toggleForm ? 'Sign up' : 'Log in'}
                                </span>
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default HomeLayoutPage;
