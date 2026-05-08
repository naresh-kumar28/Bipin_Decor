import React, { useState, useEffect } from 'react';
import { useSiteSettings } from '../../context/SiteContext';

function FloatingWhatsApp() {
    const { settings } = useSiteSettings();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        // Show after a slight delay to avoid initial page load pop-in distraction
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 1500);
        return () => clearTimeout(timer);
    }, []);

    if (!settings?.whatsapp_number) return null;

    const waNumber = settings.whatsapp_number.replace(/\D/g, '');
    const waMessage = settings.whatsapp_message ? encodeURIComponent(settings.whatsapp_message) : '';
    const waUrl = `https://wa.me/${waNumber}${waMessage ? `?text=${waMessage}` : ''}`;

    return (
        <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`fixed bottom-24 right-6 lg:bottom-8 lg:right-8 z-50 flex items-center justify-center w-14 h-14 bg-[#25D366] text-white rounded-full shadow-lg hover:scale-110 hover:shadow-xl transition-all duration-300 group ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            aria-label="Chat on WhatsApp"
        >
            {/* Ping animation effect */}
            <span className="absolute w-full h-full rounded-full bg-[#25D366] opacity-30 animate-ping"></span>
            
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" className="w-8 h-8 fill-current relative z-10">
                <path d="M16.04 2.003C8.302 2.003 2 8.305 2 16.043c0 2.475.647 4.892 1.878 7.02L2.08 29.997l7.106-1.864a14.005 14.005 0 0 0 6.854 1.746h.006c7.738 0 14.04-6.302 14.04-14.04S23.784 2.003 16.04 2.003Zm0 25.506h-.005a11.65 11.65 0 0 1-5.94-1.626l-.426-.253-4.216 1.106 1.126-4.108-.278-.421a11.637 11.637 0 0 1-1.93-6.164c0-6.434 5.234-11.669 11.675-11.669 3.117 0 6.048 1.215 8.25 3.419a11.596 11.596 0 0 1 3.417 8.25c-.001 6.434-5.235 11.466-11.673 11.466Zm6.4-8.734c-.35-.175-2.07-1.022-2.39-1.137-.32-.117-.554-.175-.787.175-.233.35-.904 1.137-1.108 1.37-.204.233-.408.262-.758.087-.35-.175-1.477-.544-2.814-1.734-1.04-.927-1.742-2.071-1.946-2.421-.204-.35-.022-.539.153-.714.157-.156.35-.408.525-.612.175-.204.233-.35.35-.583.117-.233.058-.437-.029-.612-.087-.175-.787-1.895-1.079-2.596-.284-.682-.573-.59-.787-.601l-.671-.012c-.233 0-.612.087-.933.437-.32.35-1.225 1.196-1.225 2.916s1.254 3.383 1.429 3.616c.175.233 2.468 3.769 5.978 5.287.836.361 1.488.576 1.996.737.839.267 1.602.229 2.205.139.672-.1 2.07-.846 2.362-1.662.292-.816.292-1.516.204-1.662-.087-.146-.32-.233-.67-.408Z" />
            </svg>
            
            {/* Tooltip on hover */}
            <span className="absolute right-full mr-4 bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden lg:block">
                Chat with us
                <div className="absolute top-1/2 -translate-y-1/2 -right-1 border-t-4 border-b-4 border-l-4 border-transparent border-l-foreground"></div>
            </span>
        </a>
    );
}

export default FloatingWhatsApp;
