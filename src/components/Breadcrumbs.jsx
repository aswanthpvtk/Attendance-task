import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const Breadcrumbs = () => {
    const location = useLocation();
    const pathnames = location.pathname.split('/').filter(x => x);
    const state = location.state || {}; 

    return (
      <nav className="text-sm mb-6">
        <ol className="flex items-center space-x-1 text-gray-500">
          <li>
            <Link to="/" className="hover:text-blue-600">Home</Link>
          </li>
          {pathnames.map((value, index) => {
            const to = `/${pathnames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathnames.length - 1;
            
          
            const displayText = value === "details" && state.batchName ? state.batchName : value;

            return (
              <li key={to} className="flex items-center">
                <ChevronRight size={16} className="mx-1" />
                {isLast ? (
                  <span className="text-gray-800 font-medium capitalize">{displayText}</span>
                ) : (
                  <Link to={to} className="hover:text-blue-600 capitalize">{displayText}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    );
};

export default Breadcrumbs;
