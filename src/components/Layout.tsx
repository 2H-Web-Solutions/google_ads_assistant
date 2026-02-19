import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu } from 'lucide-react';
import Sidebar from './Sidebar';

const Layout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-[#F0F0F3]">
            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300">

                {/* Mobile Header / Hamburger */}
                <div className="md:hidden p-4 bg-white border-b border-gray-200 flex items-center justify-between sticky top-0 z-30">
                    <span className="font-['Federo'] text-lg text-gray-900">2H ADS ASSISTANT</span>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                    >
                        <Menu size={24} />
                    </button>
                </div>

                {/* Page Content */}
                <div className="flex-1 p-4 md:p-8 overflow-y-auto">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default Layout;
