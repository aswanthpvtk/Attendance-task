import React from 'react'

const SettingsPage = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Settings</h2>
      <p>Configure your application settings here.</p>
      <div className="mt-4">
        <Link to="/settings/profile" className="text-blue-600 hover:underline mr-4">Profile Settings</Link>
        <Link to="/settings/security" className="text-blue-600 hover:underline">Security Settings</Link>
      </div>
    </div>
  );
  

export default SettingsPage