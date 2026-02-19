import React from 'react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const { loading } = useAuth();

    if (loading) return (
        <div className="h-screen flex items-center justify-center bg-[#101010] text-[#B7EF02] font-['Barlow']">
            Loading...
        </div>
    );

    return (
        <div className="h-screen flex items-center justify-center bg-[#101010] p-4">
            <div className="text-center w-full max-w-md">
                <h1 className="text-3xl md:text-4xl font-['Federo'] text-[#B7EF02] mb-4">
                    2H ADS
                </h1>
                <p className="text-gray-400 font-['Barlow'] text-sm md:text-base">
                    Please sign in via Firebase to continue.
                </p>
            </div>
        </div>
    );
};

export default Login;
