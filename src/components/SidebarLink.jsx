import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SidebarLink = ({ to, icon, label, collapsed }) => {
    const location = useLocation();
    const isActive = location.pathname === to || location.pathname.startsWith(`${to}/`);
    
    return (
      <Link 
        to={to} 
        className={`flex items-center px-4 py-3 ${isActive ? 'bg-gray-700' : 'hover:bg-gray-700'}`}
      >
        <span className="mr-3">{icon}</span>
        {!collapsed && <span>{label}</span>}
      </Link>
    );
  };

export default SidebarLink;
