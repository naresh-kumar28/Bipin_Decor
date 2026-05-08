import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSiteSettings } from '../context/SiteContext'

function Contact() {
    const { settings } = useSiteSettings();

    // Prepare WhatsApp URL
    const waNumber = settings?.whatsapp_number?.replace(/\D/g, '') || '15551234567';
    const waMessage = settings?.whatsapp_message ? encodeURIComponent(settings.whatsapp_message) : '';
    const waUrl = `https://wa.me/${waNumber}${waMessage ? `?text=${waMessage}` : ''}`;

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <main className="flex-grow flex flex-col w-full overflow-x-hidden">

            {/* Page Header */}
            <section className="relative min-h-[450px] flex items-center justify-center py-20 px-6 bg-slate-900 text-white text-center overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.1 }}
                    transition={{ duration: 1.5 }}
                    style={{ backgroundImage: `url(${settings?.contact_hero_image_url || "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1000"})` }}
                    className="absolute inset-0 bg-cover bg-center">
                </motion.div>
                <div className="max-w-3xl mx-auto relative z-10">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-primary text-sm font-bold uppercase tracking-widest mb-4 block"
                    >
                        {settings?.contact_hero_subtitle || 'Get in Touch'}
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-bold mb-6"
                    >
                        {settings?.contact_hero_title || "Let's Discuss Your Project"}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-white/80 font-light max-w-xl mx-auto"
                    >
                        {settings?.contact_hero_description || 'Whether you have a clear vision or need expert guidance, our team is here to bring your ideas to life.'}
                    </motion.p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-24 px-6 bg-gradient-to-b from-background via-primary/5 to-background">
                <div className="max-w-7xl mx-auto flex justify-center">

                    {/* Direct Contact Section */}
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="w-full max-w-4xl flex flex-col items-center justify-center text-center"
                    >
                        <div className="relative overflow-hidden bg-card p-8 md:p-12 rounded-2xl shadow-xl border border-border/60 h-full w-full flex flex-col items-center justify-center group transition-all duration-500 hover:shadow-2xl hover:border-primary/30">

                            {/* Soft background decorations */}
                            <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125"></div>
                            <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-[#25D366]/10 rounded-full blur-3xl transition-transform duration-700 group-hover:scale-125"></div>

                            {/* Icon Box */}
                            <motion.div 
                                initial={{ scale: 0.8, opacity: 0 }}
                                whileInView={{ scale: 1, opacity: 1 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.3, duration: 0.5 }}
                                className="relative z-10 mb-8 w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shadow-sm group-hover:bg-primary/20 transition-colors duration-500"
                            >
                                <iconify-icon icon="lucide:headphones" className="text-5xl text-primary"></iconify-icon>
                            </motion.div>

                            {/* Headline & Description */}
                            <div className="relative z-10">
                                <span className="inline-flex items-center justify-center px-4 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-5">
                                    {settings?.contact_card_badge || 'Direct Support'}
                                </span>

                                <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
                                    {settings?.contact_card_title || 'Talk to Us Directly 😊'}
                                </h2>

                                <p className="text-muted-foreground text-base max-w-xl mx-auto mb-3">
                                    {settings?.contact_card_p1 || 'Feel free to contact us for false ceiling, PVC paneling, renovation, or interior decoration work.'}
                                </p>

                                <p className="text-muted-foreground text-sm max-w-md mx-auto mb-10">
                                    {settings?.contact_card_p2 || 'No bots, no delay — direct interaction with our team.'}
                                </p>
                            </div>

                            {/* Call to Action Buttons */}
                            <motion.div 
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: 0.4, duration: 0.6 }}
                                className="relative z-10 flex flex-col sm:flex-row gap-4 w-full justify-center"
                            >
                                <a
                                    href={waUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-[#25D366] text-white font-bold rounded-sm hover:bg-[#20b858] transition-all shadow-md hover:shadow-xl hover:-translate-y-1"
                                >
                                    <iconify-icon icon="logos:whatsapp-icon" class="text-xl"></iconify-icon>
                                    Message on Whatsapp
                                </a>

                                <a
                                    href={`mailto:${settings?.contact_email || "hello@bipinDecors.com"}`}
                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-background border border-border text-foreground font-semibold rounded-sm hover:bg-card hover:border-primary/30 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md"
                                >
                                    <iconify-icon icon="lucide:mail" className="text-xl"></iconify-icon>
                                    Email Us
                                </a>

                                <a
                                    href={`tel:${settings?.contact_phone?.replace(/\s/g, '') || "+15551234567"}`}
                                    className="flex items-center justify-center gap-2 px-8 py-4 bg-background border border-border text-foreground font-semibold rounded-sm hover:bg-card hover:border-primary/30 transition-all hover:-translate-y-1 shadow-sm hover:shadow-md"
                                >
                                    <iconify-icon icon="lucide:phone" className="text-xl"></iconify-icon>
                                    Call Us
                                </a>
                            </motion.div>

                        </div>
                    </motion.div>

                </div>
            </section>

        </main>
    )
}

export default Contact