import React from 'react';
import { Link } from 'react-router-dom';
import { Store, UserPlus } from 'lucide-react';

export const Home: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] space-y-12">
      <div className="text-center space-y-4 max-w-lg">
        <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
          Smart Queue <span className="text-blue-600">System</span>
        </h1>
        <p className="text-lg text-gray-600">
          A seamless queuing experience for modern businesses. Real-time updates, QR code integration, and efficient management.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 w-full max-w-2xl px-4">
        <Link 
          to="/queue?shop_id=default" 
          className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-blue-500 hover:shadow-md transition-all duration-200"
        >
          <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-100 transition-colors">
            <UserPlus className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">I'm a Customer</h2>
          <p className="text-center text-gray-500 text-sm">
            Join a queue, get a token, and track your wait time.
          </p>
        </Link>

        <Link 
          to="/admin" 
          className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm border-2 border-transparent hover:border-gray-900 hover:shadow-md transition-all duration-200"
        >
          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-6 group-hover:bg-gray-100 transition-colors">
            <Store className="w-8 h-8 text-gray-700" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">I'm a Business</h2>
          <p className="text-center text-gray-500 text-sm">
            Manage the queue, call numbers, and view statistics.
          </p>
        </Link>
      </div>
    </div>
  );
};