import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../context/AdminContext';
import { useSiteSettings } from '../../context/SiteContext';

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const { pendingRequests } = useAdmin();
  const { settings } = useSiteSettings();
  const location = useLocation();
  const [isPagesOpen, setIsPagesOpen] = useState(location.pathname.includes('/admin/pages'));

  const menuItems = [
    { name: 'Dashboard', icon: 'lucide:layout-dashboard', path: '/admin/dashboard' },
    { name: 'Enquiries', icon: 'lucide:message-circle', path: '/admin/enquiries', badge: pendingRequests > 0 ? pendingRequests.toString() : null },
    { name: 'Bookings', icon: 'lucide:calendar', path: '/admin/bookings' },
    { name: 'Services', icon: 'lucide:layers', path: '/admin/services' },
    { name: 'Portfolio', icon: 'lucide:image', path: '/admin/portfolio' },
    { name: 'Categories', icon: 'lucide:grid-3x3', path: '/admin/categories' },
    { name: 'Reviews', icon: 'lucide:star', path: '/admin/reviews' },
    { name: 'Customers', icon: 'lucide:users', path: '/admin/customers' },
  ];

  const systemItems = [
    { 
      name: 'Pages', 
      icon: 'lucide:file-text', 
      isDropdown: true,
      isOpen: isPagesOpen,
      toggle: () => setIsPagesOpen(!isPagesOpen),
      subItems: [
        { name: 'Hero Section', icon: 'lucide:layout', path: '/admin/pages/hero' },
        { name: 'About Page', icon: 'lucide:info', path: '/admin/pages/about' },
        { name: 'Contact Page', icon: 'lucide:phone', path: '/admin/pages/contact' },
        { name: 'Portfolio Page', icon: 'lucide:image', path: '/admin/pages/portfolio' },
        { name: 'Why Choose Us', icon: 'lucide:check-circle', path: '/admin/pages/why-choose-us' },
        { name: 'Our Process', icon: 'lucide:git-branch', path: '/admin/pages/our-process' },
        { name: 'Client Stories', icon: 'lucide:message-square-heart', path: '/admin/pages/testimonials' },
        { name: 'CTA Section', icon: 'lucide:megaphone', path: '/admin/pages/cta' },
      ]
    },
    { name: 'Website Settings', icon: 'lucide:settings', path: '/admin/settings' },
    { name: 'Users / Admins', icon: 'lucide:shield', path: '/admin/users' },
    { name: 'Reports', icon: 'lucide:bar-chart-2', path: '/admin/reports' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border flex flex-col flex-shrink-0 h-screen transition-transform duration-300 lg:sticky lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center px-6 border-b border-border justify-between">
          <Link to="/admin/dashboard" className="flex items-center gap-2 text-primary overflow-hidden" onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}>
            {settings?.logo ? (
              <img src={settings.logo} alt={settings.website_name} className="h-7 w-7 object-contain shrink-0" />
            ) : (
              <iconify-icon icon="lucide:sofa" class="text-2xl shrink-0"></iconify-icon>
            )}
            <span className="font-heading font-bold text-base text-foreground tracking-tight whitespace-nowrap truncate">
              {settings?.website_name || 'Bipin Decor'}
            </span>
          </Link>
          <button className="lg:hidden text-muted-foreground hover:text-foreground" onClick={toggleSidebar}>
            <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${isActive(item.path)
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
            >
              <iconify-icon icon={item.icon} class="text-lg"></iconify-icon>
              {item.name}
              {item.badge && (
                <span className="ml-auto bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </Link>
          ))}

          <div className="pt-4 pb-2">
            <p className="px-3 text-xs font-bold uppercase tracking-wider text-muted-foreground/60">System</p>
          </div>

          {systemItems.map((item) => (
            <div key={item.name} className="space-y-1">
              {item.isDropdown ? (
                <>
                  <button
                    onClick={item.toggle}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                      item.isOpen ? 'text-foreground bg-muted/50' : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    }`}
                  >
                    <iconify-icon icon={item.icon} class="text-lg"></iconify-icon>
                    {item.name}
                    <iconify-icon 
                      icon="lucide:chevron-down" 
                      class={`ml-auto text-sm transition-transform duration-300 ${item.isOpen ? 'rotate-180' : ''}`}
                    ></iconify-icon>
                  </button>
                  
                  {item.isOpen && (
                    <div className="space-y-1 mt-1 animate-in fade-in slide-in-from-top-2 duration-300">
                      {item.subItems.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
                          className={`flex items-center gap-3 pl-10 pr-3 py-2 rounded-lg font-medium text-sm transition-all duration-200 ${
                            isActive(sub.path)
                              ? 'text-primary bg-primary/5 font-bold border-l-2 border-primary'
                              : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                          }`}
                        >
                          <iconify-icon icon={sub.icon} class="text-base"></iconify-icon>
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  onClick={() => { if (window.innerWidth < 1024) toggleSidebar(); }}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20'
                      : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  <iconify-icon icon={item.icon} class="text-lg"></iconify-icon>
                  {item.name}
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border">
          <button
            onClick={logout}
            className="flex items-center gap-3 px-3 py-2.5 w-full text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg font-medium transition-colors"
          >
            <iconify-icon icon="lucide:log-out" class="text-lg"></iconify-icon>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
