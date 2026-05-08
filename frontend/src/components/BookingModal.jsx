import React, { useState, useEffect } from 'react';
import api from '../api/api';

function BookingModal({ isOpen, onClose, selectedServiceId = null }) {
    const [services, setServices] = useState([]);
    const [status, setStatus] = useState({ type: '', message: '' });
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        phone: '',
        address: '',
        consultation_date: '',
        consultation_time: '',
        service_interested: selectedServiceId || '',
        message: ''
    });

    useEffect(() => {
        if (isOpen) {
            fetchServices();
            if (selectedServiceId) {
                setFormData(prev => ({ ...prev, service_interested: selectedServiceId }));
            }
        }
    }, [isOpen, selectedServiceId]);

    const fetchServices = async () => {
        try {
            const response = await api.get('services/');
            setServices(response.data);
        } catch (err) {
            console.error("Failed to fetch services", err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ type: 'loading', message: 'Scheduling your consultation...' });
        try {
            await api.post('bookings/', formData);
            setStatus({ type: 'success', message: 'Consultation scheduled successfully! We will contact you to confirm.' });
            setFormData({
                full_name: '',
                email: '',
                phone: '',
                address: '',
                consultation_date: '',
                consultation_time: '',
                service_interested: '',
                message: ''
            });
            setTimeout(() => {
                onClose();
                setStatus({ type: '', message: '' });
            }, 3000);
        } catch (err) {
            const errorMsg = err.response?.data ? Object.values(err.response.data).flat().join(' ') : 'Failed to schedule. Please check your details.';
            setStatus({ type: 'error', message: errorMsg });
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={onClose}></div>
            <div className="relative w-full max-w-2xl bg-card rounded-3xl overflow-hidden shadow-2xl animate-scale-in flex flex-col md:flex-row max-h-[90vh]">
                
                {/* Left Side - Info */}
                <div className="hidden md:flex md:w-1/3 bg-slate-900 p-8 text-white flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2"></div>
                    <div className="relative z-10">
                        <h3 className="text-2xl font-heading font-bold mb-4">Book a Expert Visit</h3>
                        <p className="text-sm text-white/70 leading-relaxed mb-6 font-light">
                            Our design experts will visit your site, take measurements, and provide a detailed quote.
                        </p>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <iconify-icon icon="lucide:check"></iconify-icon>
                                </div>
                                <span className="text-xs font-medium">Site Measurement</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <iconify-icon icon="lucide:check"></iconify-icon>
                                </div>
                                <span className="text-xs font-medium">Material Selection</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary">
                                    <iconify-icon icon="lucide:check"></iconify-icon>
                                </div>
                                <span className="text-xs font-medium">Instant Quotation</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side - Form */}
                <div className="w-full md:w-2/3 p-6 md:p-8 overflow-y-auto">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-xl font-bold text-foreground">Schedule Consultation</h3>
                        <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                            <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
                        </button>
                    </div>

                    {status.message && (
                        <div className={`mb-6 p-4 rounded-xl text-xs font-bold ${
                            status.type === 'success' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 
                            status.type === 'error' ? 'bg-primary/10 text-primary border border-primary/20' : 
                            'bg-muted text-muted-foreground'
                        }`}>
                            {status.message}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Full Name</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.full_name}
                                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="Your name"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Email Address</label>
                                <input 
                                    type="email" 
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="your@email.com"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Phone Number</label>
                                <input 
                                    type="tel" 
                                    required
                                    value={formData.phone}
                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="+91..."
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Site Address</label>
                                <input 
                                    type="text" 
                                    required
                                    value={formData.address}
                                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                    placeholder="Site address"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Preferred Date</label>
                                <input 
                                    type="date" 
                                    required
                                    min={new Date().toISOString().split('T')[0]}
                                    value={formData.consultation_date}
                                    onChange={(e) => setFormData({...formData, consultation_date: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Preferred Time</label>
                                <select 
                                    required
                                    value={formData.consultation_time}
                                    onChange={(e) => setFormData({...formData, consultation_time: e.target.value})}
                                    className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                >
                                    <option value="" disabled>Select Time Slot</option>
                                    <option value="10:00 AM - 12:00 PM">Morning (10-12)</option>
                                    <option value="12:00 PM - 02:00 PM">Noon (12-2)</option>
                                    <option value="02:00 PM - 05:00 PM">Afternoon (2-5)</option>
                                    <option value="05:00 PM - 08:00 PM">Evening (5-8)</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Service Interested</label>
                            <select 
                                value={formData.service_interested}
                                onChange={(e) => setFormData({...formData, service_interested: e.target.value})}
                                className="w-full px-4 py-2.5 bg-muted border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                            >
                                <option value="">General Consultation</option>
                                {services.map(s => (
                                    <option key={s.id} value={s.id}>{s.title}</option>
                                ))}
                            </select>
                        </div>

                        <button 
                            type="submit"
                            disabled={status.type === 'loading'}
                            className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 mt-4"
                        >
                            {status.type === 'loading' ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            ) : (
                                <>
                                    <iconify-icon icon="lucide:calendar-check" class="text-lg"></iconify-icon>
                                    Confirm Consultation
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default BookingModal;
