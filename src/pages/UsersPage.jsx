import React from 'react';
import { Link } from 'react-router-dom';

const UsersPage = () => (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold mb-4">Users Management</h2>
      <p>Manage your users here.</p>
      <div className="mt-4">
        <Link to="/users/list" className="text-blue-600 hover:underline">View User List</Link>
      </div>
    </div>
  );

export default UsersPage;
