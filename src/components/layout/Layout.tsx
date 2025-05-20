
import React from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="flex">
        {user && <Sidebar />}
        <main className={`flex-1 ${user ? 'ml-64' : ''} p-6`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
