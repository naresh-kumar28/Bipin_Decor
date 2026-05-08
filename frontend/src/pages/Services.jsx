import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import api from '../api/api'
import BookingModal from '../components/BookingModal'
import { useSiteSettings } from '../context/SiteContext'

function Services() {
    const { settings } = useSiteSettings();
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedService, setSelectedService] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showBookingModal, setShowBookingModal] = useState(false);
    const [requestStatus, setRequestStatus] = useState({ type: '', message: '' });
    const [requestData, setRequestData] = useState({
        user_name: '',
        user_email: '',
        user_phone: '',
        requirements: ''
    });

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await api.get('services/');
                setServices(response.data);
            } catch (err) {
                console.error("Failed to fetch services", err);
            } finally {
                setLoading(false);
            }
        };
        fetchServices();
    }, []);

    // Handle anchor scroll
    useEffect(() => {
        if (!loading && services.length > 0) {
            const hash = window.location.hash;
            if (hash) {
                const id = hash.replace('#', '');
                setTimeout(() => {
                    const element = document.getElementById(id);
                    if (element) {
                        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    }
                }, 100);
            }
        }
    }, [loading, services]);

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        setRequestStatus({ type: 'loading', message: 'Sending request...' });
        try {
            await api.post('service-requests/', {
                service: selectedService.id,
                ...requestData
            });
            setRequestStatus({ type: 'success', message: 'Your quote request has been sent! We will contact you soon.' });
            setRequestData({ user_name: '', user_email: '', user_phone: '', requirements: '' });
            setTimeout(() => {
                setShowRequestModal(false);
                setRequestStatus({ type: '', message: '' });
            }, 3000);
        } catch (err) {
            setRequestStatus({ type: 'error', message: 'Failed to send request. Please try again.' });
        }
    };

    const openRequestModal = (service) => {
        setSelectedService(service);
        setShowRequestModal(true);
    };

    return (
        <main className="flex-grow flex flex-col w-full">

            {/* Page Header */}
            <section className="py-24 px-6 bg-slate-900 text-white text-center relative overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.1 }}
                    transition={{ duration: 1.5 }}
                    style={{ backgroundImage: `url(${settings?.service_hero_image_url || "https://placehold.co/1920x600/1a1a1a/C5A059?text=Expert+Solutions"})` }}
                    className="absolute inset-0 bg-cover bg-center">
                </motion.div>
                <div className="max-w-3xl mx-auto relative z-10">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-primary text-sm font-bold uppercase tracking-widest mb-4 block"
                    >
                        {settings?.service_hero_subtitle || 'What We Do'}
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-bold mb-6"
                    >
                        {settings?.service_hero_title || 'Expert Solutions for Modern Living'}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-white/80 font-light max-w-xl mx-auto"
                    >
                        {settings?.service_hero_description || 'Discover our range of premium Decor services, from precision false ceilings to elegant wall paneling.'}
                    </motion.p>
                </div>
            </section>

            {/* Services Detailed Breakdown */}
            <section className="py-24 px-6 bg-background">
                <div className="max-w-7xl mx-auto space-y-32">
                    {loading ? (
                        <div className="py-20 text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        </div>
                    ) : services.length > 0 ? services.map((service, index) => (
                        <motion.div 
                            key={service.id} 
                            id={`service-${service.id}`}
                            initial={{ opacity: 0, y: 50 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true, margin: "-100px" }}
                            transition={{ duration: 0.8 }}
                            className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 scroll-mt-24`}
                        >
                            <div className="w-full lg:w-1/2 relative">
                                <div className="aspect-[4/3] overflow-hidden rounded-sm bg-muted shadow-lg group/img">
                                    <img src={service.image}
                                        alt={service.title} 
                                        loading="lazy"
                                        onLoad={(e) => e.target.classList.add('opacity-100')}
                                        className="w-full h-full object-cover transition-all duration-1000 opacity-0 group-hover/img:scale-110" />
                                </div>
                                <div
                                    className={`absolute ${index % 2 === 1 ? '-top-6 -left-6' : '-bottom-6 -right-6'} w-32 h-32 bg-primary/10 rounded-full border border-primary/20 -z-10`}>
                                </div>
                            </div>
                            <div className="w-full lg:w-1/2">
                                <div className="flex items-center gap-4 mb-6">
                                    <div
                                        className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl">
                                        <iconify-icon icon={service.icon || 'lucide:layers'}></iconify-icon>
                                    </div>
                                    <h2 className="text-3xl font-bold text-foreground">
                                        {service.title}
                                    </h2>
                                </div>
                                <p className="text-muted-foreground text-lg mb-6 leading-relaxed font-light">
                                    {service.description}
                                </p>
                                
                                {service.features && (
                                    <ul className="space-y-4 mb-8">
                                        {service.features.split('\n').filter(f => f.trim()).map((feature, fIndex) => (
                                            <li key={fIndex} className="flex items-start gap-3">
                                                <iconify-icon icon="lucide:check"
                                                    className="text-primary text-lg shrink-0 mt-1"></iconify-icon>
                                                <span className="text-muted-foreground">
                                                    {feature.trim()}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                                
                                <button
                                    onClick={() => openRequestModal(service)}
                                    className="inline-block px-8 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-primary/90 transition-all shadow-md">
                                    Request Quote
                                </button>
                            </div>
                        </motion.div>
                    )) : (
                        <div className="py-20 text-center">
                            <p className="text-muted-foreground italic">Adding our services soon...</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Request Form Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowRequestModal(false)}></div>
                    <div className="relative w-full max-w-md bg-card rounded-3xl overflow-hidden shadow-2xl animate-scale-in p-8 border border-border">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <iconify-icon icon={selectedService?.icon || 'lucide:layers'} class="text-3xl"></iconify-icon>
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">Request a Quote</h3>
                            <p className="text-muted-foreground text-sm mt-2">Get a bespoke estimate for <strong>{selectedService?.title}</strong>.</p>
                        </div>

                        {requestStatus.message && (
                            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${requestStatus.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                                {requestStatus.message}
                            </div>
                        )}

                        <form onSubmit={handleRequestSubmit} className="space-y-4">
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={requestData.user_name}
                                    onChange={(e) => setRequestData({...requestData, user_name: e.target.value})}
                                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Phone</label>
                                    <input 
                                        type="tel" 
                                        required
                                        value={requestData.user_phone}
                                        onChange={(e) => setRequestData({...requestData, user_phone: e.target.value})}
                                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                        placeholder="+91..."
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Email</label>
                                    <input 
                                        type="email" 
                                        required
                                        value={requestData.user_email}
                                        onChange={(e) => setRequestData({...requestData, user_email: e.target.value})}
                                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Requirements / Message</label>
                                <textarea 
                                    rows="3"
                                    required
                                    value={requestData.requirements}
                                    onChange={(e) => setRequestData({...requestData, requirements: e.target.value})}
                                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                    placeholder="Tell us about your space and needs..."
                                ></textarea>
                            </div>

                            <button 
                                type="submit"
                                disabled={requestStatus.type === 'loading'}
                                className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                            >
                                {requestStatus.type === 'loading' ? (
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                ) : (
                                    <>
                                        <iconify-icon icon="lucide:check" class="text-lg"></iconify-icon>
                                        Submit Quote Request
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* CTA Section */}
            <section className="py-24 px-6 bg-slate-900 text-white text-center relative overflow-hidden">
                <div
                    style={{ backgroundImage: `url(${settings?.cta_image_url || "https://placehold.co/1920x600/1a1a1a/C5A059?text=Transform+Your+Space"})` }}
                    className="absolute inset-0 opacity-10 bg-cover bg-center">
                </div>

                <div className="max-w-3xl mx-auto relative z-10">
                    <h2 className="text-4xl md:text-6xl font-bold mb-6">
                        {settings?.cta_title || 'Ready to Transform Your Space?'}
                    </h2>
                    <p className="text-lg text-white/80 mb-10 font-light max-w-xl mx-auto">
                        {settings?.cta_description || 'Book a consultation with our experts today and take the first step towards your dream Decor.'}
                    </p>
                    <button 
                        onClick={() => setShowBookingModal(true)}
                        className="inline-block px-10 py-5 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm rounded-sm hover:bg-primary-foreground hover:text-primary transition-all shadow-lg hover:shadow-xl">
                        {settings?.cta_button_text || 'Schedule Consultation'}
                    </button>
                </div>
            </section>

            {/* Booking Modal */}
            <BookingModal 
                isOpen={showBookingModal} 
                onClose={() => setShowBookingModal(false)} 
            />

        </main>
    )
}

export default Services
