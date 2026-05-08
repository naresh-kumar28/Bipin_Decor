import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useSiteSettings } from '../context/SiteContext'
import SEO from '../components/common/SEO'

function About() {
    const { settings } = useSiteSettings();

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    return (
        <main className="flex-grow flex flex-col w-full overflow-x-hidden">
            <SEO 
                title={`About Us | ${settings?.website_name || 'Bipin Interior'}`}
                description="Learn more about Bipin Interior and our legacy of design excellence."
            />

            {/* Page Header */}
            <section className="relative min-h-[450px] flex items-center justify-center py-20 px-6 bg-slate-900 text-white text-center overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    animate={{ scale: 1, opacity: 0.1 }}
                    transition={{ duration: 1.5 }}
                    style={{ backgroundImage: `url(${settings?.about_hero_image_url || "https://placehold.co/1920x600/1a1a1a/C5A059?text=About+Our+Story"})` }}
                    className="absolute inset-0 bg-cover bg-center">
                </motion.div>
                <div className="max-w-3xl mx-auto relative z-10">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-primary text-sm font-bold uppercase tracking-widest mb-4 block"
                    >
                        {settings?.about_hero_subtitle || 'Our Story'}
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-bold mb-6"
                    >
                        {settings?.about_hero_title || 'About Bipin Decors'}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-white/80 font-light max-w-xl mx-auto"
                    >
                        {settings?.about_hero_description || 'Crafting luxurious, functional, and timeless spaces with uncompromising attention to detail.'}
                    </motion.p>
                </div>
            </section>

            {/* Brand Story */}
            <section className="py-24 px-6 bg-background">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeIn}
                        className="w-full lg:w-1/2"
                    >
                        <span className="text-primary text-sm font-bold uppercase tracking-widest">
                            {settings?.about_story_subtitle || 'The Beginning'}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mt-3 text-foreground mb-8">
                            {settings?.about_story_title || 'A Legacy of Design Excellence'}
                        </h2>
                        <p className="text-muted-foreground text-lg mb-6 leading-relaxed font-light">
                            {settings?.about_story_p1 || 'Founded with a passion for transforming ordinary rooms into extraordinary environments, Bipin Decors has grown into a premier Decor installation studio. We specialize in bringing high-end residential and commercial visions to life.'}
                        </p>
                        <p className="text-muted-foreground text-lg mb-10 leading-relaxed font-light">
                            {settings?.about_story_p2 || 'Our journey began over a decade ago with a simple philosophy: Decor design should not only look stunning but also withstand the test of time. Today, we are known for our meticulous craftsmanship in UV marble sheets, PVC paneling, and bespoke false ceilings.'}
                        </p>
                        <div className="flex items-center gap-6 border-l-4 border-primary pl-6 py-2">
                            <div>
                                <p className="text-3xl font-heading font-bold text-foreground">
                                    {settings?.about_story_years || '10+'}
                                </p>
                                <p className="text-xs uppercase tracking-widest mt-1 text-muted-foreground font-bold">Years Experience</p>
                            </div>
                            <div className="w-px h-12 bg-border"></div>
                            <div>
                                <p className="text-3xl font-heading font-bold text-foreground">
                                    {settings?.about_story_projects || '500+'}
                                </p>
                                <p className="text-xs uppercase tracking-widest mt-1 text-muted-foreground font-bold">Projects Delivered</p>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial={{ opacity: 0, x: 50 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 relative"
                    >
                        <div className="aspect-[4/5] overflow-hidden rounded-sm bg-muted shadow-lg ring-1 ring-border/50">
                            <img src={settings?.about_story_image_url || "https://placehold.co/800x1000/1a1a1a/C5A059?text=Our+Legacy"}
                                alt="Decor Design Studio" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Craftsmanship Focus */}
            <section className="py-24 px-6 bg-muted/30 border-y border-border">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                    >
                        <span className="text-primary text-sm font-bold uppercase tracking-widest">
                            {settings?.about_philosophy_subtitle || 'Our Philosophy'}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mt-3 text-foreground mb-16">
                            {settings?.about_philosophy_title || 'Uncompromising Craftsmanship'}
                        </h2>
                    </motion.div>
            
                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={staggerContainer}
                        className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left"
                    >
                        <motion.div
                            variants={fadeIn}
                            className="bg-card p-10 border border-border rounded-2xl hover:border-primary/50 transition-all duration-300 ease-in-out hover:-translate-y-2 group shadow-sm hover:shadow-md">
                            <div
                                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl mb-8 group-hover:scale-110 transition-transform">
                                <iconify-icon icon={settings?.about_card1_icon || 'lucide:gem'}></iconify-icon>
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-4 text-foreground">
                                {settings?.about_card1_title || 'Premium Materials'}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {settings?.about_card1_desc || 'We meticulously source the highest grade UV marble, PVC panels, and WPC louvers. Our materials are chosen for their durability, finish, and ability to elevate any space.'}
                            </p>
                        </motion.div>
            
                        <motion.div
                            variants={fadeIn}
                            className="bg-card p-10 border border-border rounded-2xl hover:border-primary/50 transition-all duration-300 ease-in-out hover:-translate-y-2 group shadow-sm hover:shadow-md">
                            <div
                                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl mb-8 group-hover:scale-110 transition-transform">
                                <iconify-icon icon={settings?.about_card2_icon || 'lucide:ruler'}></iconify-icon>
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-4 text-foreground">
                                {settings?.about_card2_title || 'Precision Execution'}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {settings?.about_card2_desc || 'Luxury is in the details. Our installation process is marked by exact measurements, seamless joints, and a flawless finish that defines high-end Decor design.'}
                            </p>
                        </motion.div>
            
                        <motion.div
                            variants={fadeIn}
                            className="bg-card p-10 border border-border rounded-2xl hover:border-primary/50 transition-all duration-300 ease-in-out hover:-translate-y-2 group shadow-sm hover:shadow-md">
                            <div
                                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl mb-8 group-hover:scale-110 transition-transform">
                                <iconify-icon icon={settings?.about_card3_icon || 'lucide:users'}></iconify-icon>
                            </div>
                            <h3 className="text-xl font-heading font-bold mb-4 text-foreground">
                                {settings?.about_card3_title || 'Client-Centric Approach'}
                            </h3>
                            <p className="text-muted-foreground text-sm leading-relaxed">
                                {settings?.about_card3_desc || 'We collaborate closely with our clients, ensuring their vision is translated into reality with transparency, timely delivery, and utmost professionalism.'}
                            </p>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Team Experience */}
            <section className="py-24 px-6 bg-background">
                <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="w-full lg:w-1/2 order-2 lg:order-1 relative"
                    >
                        <div className="grid grid-cols-2 gap-4">
                            <div className="aspect-square overflow-hidden rounded-sm bg-muted shadow-sm ring-1 ring-border/50">
                                <img src={settings?.about_expertise_image1_url || "https://placehold.co/600x600/1a1a1a/C5A059?text=Craftsmanship+1"}
                                    alt="Craftsman at work" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                            </div>
                            <div className="aspect-square overflow-hidden rounded-sm bg-muted shadow-sm translate-y-8 ring-1 ring-border/50">
                                <img src={settings?.about_expertise_image2_url || "https://placehold.co/600x600/1a1a1a/C5A059?text=Craftsmanship+2"}
                                    alt="Precision tools" className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                            </div>
                        </div>
                    </motion.div>

                    <motion.div 
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="w-full lg:w-1/2 order-1 lg:order-2"
                    >
                        <span className="text-primary text-sm font-bold uppercase tracking-widest">
                            {settings?.about_expertise_subtitle || 'Our Expertise'}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mt-3 text-foreground mb-8">
                            {settings?.about_expertise_title || 'Master Artisans at Work'}
                        </h2>
                        <p className="text-muted-foreground text-lg mb-8 leading-relaxed font-light">
                            {settings?.about_expertise_p1 || 'Behind every flawless installation is a team of dedicated artisans. Our installers are not just workers; they are craftsmen who take immense pride in their art.'}
                        </p>
                        <p className="text-muted-foreground text-lg mb-10 leading-relaxed font-light">
                            {settings?.about_expertise_p2 || 'With rigorous training and years of hands-on experience, our team handles complex architectural challenges with ease, ensuring that every panel, sheet, and louver is placed with absolute perfection.'}
                        </p>
                        <Link to="/contact"
                            className="inline-block px-10 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-sm hover:bg-primary-foreground hover:text-primary transition-all shadow-lg hover:shadow-xl">
                            Contact Us
                        </Link>
                    </motion.div>
                </div>
            </section>

        </main>
    )
}

export default About
