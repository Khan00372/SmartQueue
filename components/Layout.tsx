import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Users, Home } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isCustomer = location.pathname.includes('/queue');

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 text-gray-900">
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2 font-bold text-xl text-blue-600">
            <Users className="w-6 h-6" />
            <span>SmartQueue</span>
          </Link>
          
          <div className="flex space-x-4">
            {!isCustomer && (
              <>
                <Link 
                  to="/admin" 
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/admin' ? 'bg-blue-50 text-blue-700' : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <LayoutDashboard className="w-4 h-4" />
                  <span>Admin</span>
                </Link>
              </>
            )}
            {isCustomer && (
               <Link 
               to="/" 
               className="flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
             >
               <Home className="w-4 h-4" />
               <span>Home</span>
             </Link>
            )}
          </div>
        </div>
      </nav>
      <main className="flex-1 w-full max-w-4xl mx-auto p-4 md:p-6">
        {children}
      </main>
      <footer className="bg-white border-t border-gray-200 py-6 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Smart Queue System. All rights reserved.</p>
      </footer>
    </div>
  );
};