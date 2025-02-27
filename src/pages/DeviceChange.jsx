import React, { useState } from 'react';
import { Laptop, Smartphone, Tablet, Monitor } from 'lucide-react';

const DeviceChange = () => {
  const [activeDevice, setActiveDevice] = useState('desktop');

  const devices = [
    { id: 'desktop', name: 'Desktop', icon: Monitor },
    { id: 'laptop', name: 'Laptop', icon: Laptop },
    { id: 'tablet', name: 'Tablet', icon: Tablet },
    { id: 'mobile', name: 'Mobile', icon: Smartphone },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg border border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-2xl font-bold text-gray-900">Device Switcher</h2>
        <p className="text-sm text-gray-500 mt-1">Switch between different device views</p>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Device Tabs */}
        <div className="grid grid-cols-4 gap-4 bg-gray-100 p-1 rounded-lg">
          {devices.map(({ id, name, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveDevice(id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-md transition-all duration-200
                ${activeDevice === id 
                  ? 'bg-white shadow-md text-blue-600' 
                  : 'hover:bg-gray-50 text-gray-500 hover:text-gray-700'
                }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-sm font-medium">{name}</span>
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="mt-6">
          {devices.map(({ id, name }) => (
            activeDevice === id && (
              <div key={id} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">{name} View</h3>
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Content optimized for {name.toLowerCase()} viewing
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                    Cancel
                  </button>
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
                    Apply Changes
                  </button>
                </div>
              </div>
            )
          ))}
        </div>
      </div>
    </div>
  );
};

export default DeviceChange;