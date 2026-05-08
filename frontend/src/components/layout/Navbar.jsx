import React, { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Sofa, Moon, Sun, Menu, User, LogOut, LayoutDashboard, X, ChevronRight } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSiteSettings } from '../../context/SiteContext'

function Navbar() {
    const { user, logout } = useAuth();
    const { settings } = useSiteSettings();
    const [isDarkMode, setIsDarkMode] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showFloatingButton, setShowFloatingButton] = useState(true);
    const observerRef = useRef(null);

    useEffect(() => {
        const storedTheme = localStorage.getItem('theme');
        if (storedTheme === 'dark' || (!storedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            setIsDarkMode(true);
            document.documentElement.classList.add('dark');
        } else {
            setIsDarkMode(false);
            document.documentElement.classList.remove('dark');
        }

        // Intersection Observer for Footer
        const observer = new IntersectionObserver(
            ([entry]) => {
                setShowFloatingButton(!entry.isIntersecting);
            },
            { threshold: 0.1 }
        );

        const footer = document.getElementById('site-footer');
        if (footer) observer.observe(footer);

        return () => {
            if (footer) observer.unobserve(footer);
        };
    }, []);

    const toggleDarkMode = () => {
        setIsDarkMode((prev) => {
            const newMode = !prev;
            if (newMode) {
                document.documentElement.classList.add('dark');
                localStorage.setItem('theme', 'dark');
            } else {
                document.documentElement.classList.remove('dark');
                localStorage.setItem('theme', 'light');
            }
            return newMode;
        });
    };

    const navLinkClass = ({ isActive }) =>
        isActive
            ? "relative text-[13px] uppercase tracking-[0.18em] text-foreground after:absolute after:left-0 after:-bottom-2 after:h-[2px] after:w-full after:bg-primary text-primary"
            : "text-[13px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition-colors";

    return (
        <>
            {/* Desktop Header */}
            <header className="sticky top-0 z-50 w-full border-b border-card/10 bg-white dark:bg-card hidden lg:block">
                <div className="max-w-7xl mx-auto px-6 lg:px-8">
                    <div className="flex h-[78px] items-center justify-between">
                        <Link to="/" className="flex items-center gap-3 shrink-0">
                            {settings?.logo ? (
                                <img src={settings.logo} alt={settings?.website_name || "Logo"} className="h-10 object-contain" />
                            ) : (
                                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-sm">
                                    <Sofa className="w-[18px] h-[18px]" />
                                </div>
                            )}
                            <div className="leading-tight">
                                <h1 className="text-[22px] font-bold tracking-[0.08em] text-foreground">
                                    {settings?.website_name ? (
                                        settings.website_name.split(' ').length > 1 ? (
                                            <>
                                                {settings.website_name.split(' ')[0]} <span className="font-bold text-primary">{settings.website_name.split(' ').slice(1).join(' ')}</span>
                                            </>
                                        ) : settings.website_name
                                    ) : (
                                        <>BIPIN <span className="font-bold text-primary">DECOR</span></>
                                    )}
                                </h1>
                            </div>
                        </Link>

                        <nav className="flex items-center gap-8 font-bold">
                            <NavLink to="/" className={navLinkClass}>Home</NavLink>
                            <NavLink to="/about" className={navLinkClass}>About</NavLink>
                            <NavLink to="/services" className={navLinkClass}>Services</NavLink>
                            <NavLink to="/portfolio" className={navLinkClass}>Our Work</NavLink>
                            <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
                        </nav>

                        <div className="flex items-center gap-3">
                            <button onClick={toggleDarkMode} className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary transition-all duration-300">
                                {isDarkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                            </button>

                            {user && (
                                <div className="relative">
                                    <button onClick={() => setIsProfileOpen(!isProfileOpen)} className="flex items-center gap-2 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-all font-medium">
                                        <User className="w-4 h-4" />
                                        <span className="text-sm">Hi, {user.first_name || user.username}</span>
                                    </button>
                                    {isProfileOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl py-2 z-50">
                                            <Link to="/admin/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted" onClick={() => setIsProfileOpen(false)}>
                                                <LayoutDashboard className="w-4 h-4" /> Dashboard
                                            </Link>
                                            <button onClick={() => { logout(); setIsProfileOpen(false); }} className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/5">
                                                <LogOut className="w-4 h-4" /> Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </header>

            {/* Mobile Header */}
            <div className="lg:hidden w-full bg-white dark:bg-card border-b border-border py-4 px-6 flex items-center justify-between sticky top-0 z-50">
                <Link to="/" className="flex items-center gap-3 shrink-0">
                    {settings?.logo ? (
                        <img src={settings.logo} alt={settings?.website_name || "Logo"} className="h-10 object-contain" />
                    ) : (
                        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-primary shadow-sm">
                            <Sofa className="w-[18px] h-[18px]" />
                        </div>
                    )}
                    <div className="leading-tight">
                        <h1 className="text-[20px] font-bold tracking-[0.08em] text-foreground">
                            {settings?.website_name ? (
                                settings.website_name.split(' ').length > 1 ? (
                                    <>
                                        {settings.website_name.split(' ')[0]} <span className="font-bold text-primary">{settings.website_name.split(' ').slice(1).join(' ')}</span>
                                    </>
                                ) : settings.website_name
                            ) : (
                                <>BIPIN <span className="font-bold text-primary">DECOR</span></>
                            )}
                        </h1>
                    </div>
                </Link>
                <button onClick={toggleDarkMode} className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:border-primary/50 hover:text-primary transition-all">
                    {isDarkMode ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
                </button>
            </div>

            {/* Mobile Bottom Tab Bar */}
            <div className={`lg:hidden fixed bottom-0 left-0 w-full z-[60] transition-transform duration-500 transform ${showFloatingButton ? 'translate-y-0' : 'translate-y-full'}`}>
                <nav className="bg-white dark:bg-card border-t border-border shadow-[0_-4px_20px_rgba(0,0,0,0.05)] flex items-center justify-around px-2 pt-2 pb-3">
                    <NavLink to="/" className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-1 transition-all duration-300 relative ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        {({ isActive }) => (
                            <>
                                {isActive && <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-b-full bg-primary shadow-[0_0_8px_rgba(197,160,89,0.5)]"></span>}
                                <iconify-icon icon="lucide:home" class={`text-[22px] transition-transform ${isActive ? 'scale-110' : ''}`}></iconify-icon>
                                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>Home</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink to="/services" className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-1 transition-all duration-300 relative ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        {({ isActive }) => (
                            <>
                                {isActive && <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-b-full bg-primary shadow-[0_0_8px_rgba(197,160,89,0.5)]"></span>}
                                <iconify-icon icon="lucide:layers" class={`text-[22px] transition-transform ${isActive ? 'scale-110' : ''}`}></iconify-icon>
                                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>Services</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink to="/portfolio" className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-1 transition-all duration-300 relative ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        {({ isActive }) => (
                            <>
                                {isActive && <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-b-full bg-primary shadow-[0_0_8px_rgba(197,160,89,0.5)]"></span>}
                                <iconify-icon icon="lucide:image" class={`text-[22px] transition-transform ${isActive ? 'scale-110' : ''}`}></iconify-icon>
                                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>Our Work</span>
                            </>
                        )}
                    </NavLink>

                    <NavLink to="/contact" className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-1 transition-all duration-300 relative ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                        {({ isActive }) => (
                            <>
                                {isActive && <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-b-full bg-primary shadow-[0_0_8px_rgba(197,160,89,0.5)]"></span>}
                                <iconify-icon icon="lucide:mail" class={`text-[22px] transition-transform ${isActive ? 'scale-110' : ''}`}></iconify-icon>
                                <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>Contact</span>
                            </>
                        )}
                    </NavLink>

                    {user && (
                        <NavLink to="/admin/dashboard" className={({ isActive }) => `flex flex-col items-center gap-1 px-4 py-1 transition-all duration-300 relative ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'}`}>
                            {({ isActive }) => (
                                <>
                                    {isActive && <span className="absolute -top-2 left-1/2 -translate-x-1/2 w-10 h-[3px] rounded-b-full bg-primary shadow-[0_0_8px_rgba(197,160,89,0.5)]"></span>}
                                    <iconify-icon icon="lucide:layout-dashboard" class={`text-[22px] transition-transform ${isActive ? 'scale-110' : ''}`}></iconify-icon>
                                    <span className={`text-[10px] ${isActive ? 'font-bold' : 'font-medium'}`}>Admin</span>
                                </>
                            )}
                        </NavLink>
                    )}
                </nav>
            </div>
        </>
    )
}

export default Navbar