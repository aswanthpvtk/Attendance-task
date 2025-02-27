import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import logo from "../assets/logo.jpeg";




const Header = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const getCurrentPageTitle = () => {
        const path = location.pathname;
        if (path === '/') return 'Dashboard';
        if (path.startsWith('/users')) return 'Users Management';
        if (path.startsWith('/settings')) return 'Settings';
        return 'Dashboard';
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
        window.location.reload();
    };

    return (
        <header className="bg-white shadow">
            <div className="px-6 py-4 flex justify-between items-center">
                <h1 className="text-2xl font-semibold text-gray-800">
                    <div className='flex'>
                        <img className='me-1' src={logo} style={{ height: "30px", width: '30px' }} alt="Luminar Technolab Logo" />
                        <span className="bg-gradient-to-r from-purple-700 to-blue-600 bg-clip-text text-transparent">
                            Luminar Technolab
                        </span>
                    </div>
                </h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                        <User className="h-5 w-5" />
                        <span>{username || 'Guest'}</span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-md transition-colors"
                    >
                        <LogOut className="h-4 w-4" />

                    </button>
                </div>
            </div>
        </header>
    );
};

export default Header;