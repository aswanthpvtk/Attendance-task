import React, { useState } from 'react';
import { Home, Users, Settings, Menu, X, ClipboardCheck, Monitor } from 'lucide-react'; // Removed Attendance import
import SidebarLink from './SidebarLink';
import Header from './Header';
import Breadcrumbs from './Breadcrumbs';

// Dashboard Layout Component
const DashboardLayout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen bg-gray-100">
 
      <div className={`${sidebarOpen ? 'w-64' : 'w-20'} transition-all duration-300 bg-gray-800 text-white`}>
        <div className="p-4 flex justify-between items-center">
          {sidebarOpen && <h2 className="text-xl font-bold">Dashboard</h2>}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1 rounded hover:bg-gray-700"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
        <nav className="mt-6">
          <SidebarLink to="/" icon={<Home size={20} />} label="Dashboard" collapsed={!sidebarOpen} />
          <SidebarLink to="/batches" icon={<Users size={20} />} label="Batches" collapsed={!sidebarOpen} />
          <SidebarLink to="/attendance" icon={<ClipboardCheck size={20} />} label="Attendance" collapsed={!sidebarOpen} />
          <SidebarLink to="/device" icon={<Monitor size={20} />} label="Device change" collapsed={!sidebarOpen} />

          {/* <SidebarLink to="/users" icon={<Users size={20} />} label="Users" collapsed={!sidebarOpen} />
          <SidebarLink to="/settings" icon={<Settings size={20} />} label="Settings" collapsed={!sidebarOpen} /> */}
        </nav>
      </div>

  
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
          <Breadcrumbs />
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
