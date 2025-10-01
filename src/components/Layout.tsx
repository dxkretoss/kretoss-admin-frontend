import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Login from './Login';

const Layout: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <div className="w-58 flex-shrink-0">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
