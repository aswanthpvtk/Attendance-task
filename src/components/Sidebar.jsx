import React, { useState, useEffect } from 'react';
import { Home, Users, Settings, Menu, X } from 'lucide-react';
import SidebarLink from './SidebarLink';

const Sidebar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 768); // Open only on large screens

  // Auto-collapse sidebar on screen resize
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setSidebarOpen(false); // Collapse when screen width < 768px (Medium to Extra Small)
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Check on component mount

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
     
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-white rounded"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>


      <div
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } transition-all duration-300 bg-gray-800 text-white h-screen fixed top-0 left-0 z-40 md:relative md:block ${
          sidebarOpen ? 'block' : 'hidden md:block'
        }`}
      >
        <div className="p-4 flex justify-between items-center">
          {sidebarOpen ? <h2 className="text-xl font-bold">Dashboard</h2> : <span></span>}
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
          <SidebarLink to="/device" icon={<Home size={20} />} label="Device Change" collapsed={!sidebarOpen} />
          <SidebarLink to="/users" icon={<Users size={20} />} label="Users" collapsed={!sidebarOpen} />
          <SidebarLink to="/settings" icon={<Settings size={20} />} label="Settings" collapsed={!sidebarOpen} />
        </nav>
      </div>

     
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 md:hidden" onClick={() => setSidebarOpen(false)}></div>
      )}
    </>
  );
};

export default Sidebar;
