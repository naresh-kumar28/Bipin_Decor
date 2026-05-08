import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import ThemeToggle from './ThemeToggle';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';

const AdminLayout = ({ children, title }) => {
  const { user, logout } = useAuth();
  const { pendingRequests } = useAdmin();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen w-full bg-background flex flex-col relative transition-colors duration-300">
      <div className="flex flex-1 h-full">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content Wrapper */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Top Navbar */}
          <header className="h-16 bg-card border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8 flex-shrink-0 sticky top-0 z-10 transition-colors duration-300">
            <div className="flex items-center gap-4">
              <button 
                className="lg:hidden text-muted-foreground hover:text-foreground p-1"
                onClick={toggleSidebar}
              >
                <iconify-icon icon="lucide:menu" class="text-2xl"></iconify-icon>
              </button>
              <h1 className="text-xl font-heading font-semibold text-foreground hidden sm:block">{title || 'Admin Dashboard'}</h1>
              <h1 className="text-lg font-heading font-semibold text-foreground sm:hidden truncate max-w-[150px]">{title || 'Admin'}</h1>
            </div>
            
            <div className="flex items-center gap-4 sm:gap-6">
              <div className="relative hidden sm:block">
                <iconify-icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></iconify-icon>
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="pl-9 pr-4 py-2 bg-background border border-border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-primary w-40 md:w-64 transition-colors" 
                />
              </div>
              
              <div className="flex items-center gap-2 sm:gap-3">
                <ThemeToggle />
                
                <button className="text-muted-foreground hover:text-primary transition-colors relative p-2">
                  <iconify-icon icon="lucide:bell" class="text-xl"></iconify-icon>
                  {pendingRequests > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-destructive text-white text-[9px] font-bold flex items-center justify-center rounded-full border border-card animate-pulse">
                      {pendingRequests > 99 ? '99+' : pendingRequests}
                    </span>
                  )}
                </button>
              </div>
              
              <div className="h-8 w-px bg-border hidden xs:block"></div>
              
              <div className="flex items-center gap-3 cursor-pointer group relative">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-primary/10 border-2 border-primary/20 flex items-center justify-center text-primary font-bold text-sm sm:text-base uppercase">
                  {(user?.first_name || user?.username || 'A').charAt(0)}
                </div>
                <div className="hidden md:block text-sm">
                  <p className="font-medium text-foreground leading-none">{user?.first_name ? `${user.first_name} ${user.last_name || ''}` : user?.username || 'Admin'}</p>
                  <p className="text-muted-foreground text-xs mt-1">{user?.is_superuser ? 'Super Admin' : 'Staff'}</p>
                </div>
                <iconify-icon icon="lucide:chevron-down" class="text-muted-foreground text-sm"></iconify-icon>
                
                {/* Simple Hover Dropdown for Logout */}
                <div className="absolute right-0 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                  <div className="bg-card border border-border rounded-lg shadow-xl py-2 w-40">
                    <button 
                      onClick={logout}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/5 transition-colors"
                    >
                      <iconify-icon icon="lucide:log-out"></iconify-icon>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
              {children || <Outlet />}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;
