import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import api from '../api/api';
import CategoryCard from '../components/CategoryCard';
import BookingModal from '../components/BookingModal';
import { useSiteSettings } from '../context/SiteContext';
import SEO from '../components/common/SEO';


function Home() {
    const { settings } = useSiteSettings();
    const [categories, setCategories] = useState([]);
    const [services, setServices] = useState([]);
    const [whyChooseUs, setWhyChooseUs] = useState([]);
    const [ourProcess, setOurProcess] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, servicesRes, whyChooseRes, processRes, testimonialsRes] = await Promise.allSettled([
                    api.get('categories/'),
                    api.get('services/'),
                    api.get('why-choose-us/'),
                    api.get('our-process/'),
                    api.get('testimonials/')
                ]);
                if (catsRes.status === 'fulfilled') setCategories(catsRes.value.data);
                if (servicesRes.status === 'fulfilled') setServices(servicesRes.value.data);
                if (whyChooseRes.status === 'fulfilled') setWhyChooseUs(whyChooseRes.value.data);
                if (processRes.status === 'fulfilled') setOurProcess(processRes.value.data);
                if (testimonialsRes.status === 'fulfilled') setTestimonials(testimonialsRes.value.data);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Truncate words helper
    const truncateWords = (text, limit) => {
        if (!text) return "";
        const words = text.split(" ");
        if (words.length <= limit) return text;
        return words.slice(0, limit).join(" ") + "...";
    };

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
                staggerChildren: 0.15
            }
        }
    };

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
    };



    return (
        <main className="flex-grow flex flex-col w-full overflow-x-hidden">
            <SEO />

            {/* Hero Section */}
            <section
                className="relative w-full h-[600px] lg:h-[700px] flex items-center justify-center overflow-hidden bg-black">

                {/* Video */}
                <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
                    <motion.video
                        key={settings?.hero_video_url || 'static'}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 2 }}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                        poster={settings?.hero_image_url || "https://placehold.co/1920x1080/1a1a1a/C5A059?text=Bipin+Interior"}
                    >
                        {settings?.hero_video_url && (
                            <source src={settings.hero_video_url} type="video/mp4" />
                        )}
                    </motion.video>
                </div>

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 z-10"></div>

                {/* Content */}
                <div className="relative z-20 text-center px-6 max-w-3xl mx-auto">
                    <motion.span
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-amber-400 tracking-[0.25em] uppercase text-xs md:text-sm mb-6 block font-medium"
                    >
                        {settings?.hero_subtitle || 'Bipin Decor Studio'}
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-4xl md:text-6xl text-white mb-6 leading-[1.2] font-serif font-medium"
                    >
                        {settings?.hero_title || 'Elevate Your Living Space'}
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        className="text-gray-300 text-base md:text-lg mb-10 leading-relaxed font-light"
                    >
                        {settings?.hero_description || 'Crafted with precision, designed with elegance — we transform everyday spaces into timeless Decors.'}
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 0.6 }}
                        className="flex flex-col sm:flex-row gap-5 justify-center items-center"
                    >
                        <button
                            onClick={() => setIsBookingModalOpen(true)}
                            className="group inline-flex items-center gap-3 px-8 py-3 border border-amber-400 text-amber-400 hover:bg-amber-400 hover:text-black transition-all duration-300 text-xs tracking-[0.2em] uppercase"
                        >
                            Start Your Project
                            <iconify-icon icon="lucide:arrow-right"
                                className="text-sm transition-transform duration-300 group-hover:translate-x-1"></iconify-icon>
                        </button>
                    </motion.div>
                </div>
            </section>

            {/* Categories Section */}
            <section className="py-16 md:py-16 px-6 bg-background min-h-[400px]">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="flex items-end justify-between mb-7"
                    >
                        <div>
                            <span className="text-primary text-sm font-bold uppercase tracking-widest mb-1 block">
                                {settings?.category_section_subtitle || 'Explore Spaces'}
                            </span>
                            <h2 className="text-3xl md:text-5xl font-heading font-bold text-foreground leading-tight">
                                {settings?.category_section_title || 'Design by Category'}
                            </h2>
                        </div>
                    </motion.div>

                    {loading ? (
                        <div className="flex gap-8 overflow-hidden pb-10">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="w-[280px] md:w-[360px] aspect-square rounded-2xl bg-muted animate-pulse shrink-0"></div>
                            ))}
                        </div>
                    ) : categories.length > 0 ? (
                        <div className="flex overflow-x-auto gap-8 pb-10 -mb-10 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] group/carousel">
                            {categories.map((category, index) => (
                                <motion.div
                                    key={category.id}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.6, delay: index * 0.1 }}
                                >
                                    <CategoryCard category={category} />
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-10 text-muted-foreground italic">
                            No categories available at the moment.
                        </div>
                    )}
                </div>
            </section>

            {/* Services Section */}
            <section className="py-16 md:py-16 px-6 bg-muted/30">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="mb-12"
                    >
                        <span className="text-primary text-sm font-bold uppercase tracking-widest">
                            {settings?.service_section_subtitle || 'Our Expertise'}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-heading font-bold mt-3 text-foreground">
                            {settings?.service_section_title || 'Bipin Decor Services'}
                        </h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
                        {services.length > 0 ? services.slice(0, 6).map((service, index) => (
                            <motion.div
                                key={service.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: index * 0.1 }}
                                className="group bg-card rounded-2xl shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-700 border border-border overflow-hidden flex flex-col h-full"
                            >
                                <div className="relative h-48 sm:h-56 overflow-hidden bg-muted">
                                    <img src={service.image}
                                        alt={service.title}
                                        loading="lazy"
                                        className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-110" />
                                </div>
                                <div className="p-6 flex flex-col flex-grow">
                                    <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
                                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">
                                        {truncateWords(service.description, 25)}
                                    </p>
                                    <Link to={`/services#service-${service.id}`}
                                        className="inline-flex items-center justify-center px-6 py-2.5 border border-primary/20 text-primary font-semibold text-sm rounded-sm hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all w-full">
                                        View Service
                                    </Link>
                                </div>
                            </motion.div>
                        )) : (
                            <div className="col-span-full text-center py-10">
                                <p className="text-muted-foreground italic">Adding our premium services soon...</p>
                            </div>
                        )}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="text-center"
                    >
                        <Link to="/services"
                            className="inline-flex items-center justify-center px-10 py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm rounded-sm hover:bg-primary/90 transition-all shadow-md hover:shadow-lg">
                            View All Services
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="py-24 px-6 bg-background relative overflow-hidden">
                <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={scaleIn}
                        className="relative w-full group"
                    >
                        <div className="relative aspect-[4/3] lg:aspect-square overflow-hidden rounded-2xl shadow-xl transition-transform duration-700 group-hover:scale-[1.02]">
                            <img
                                src={settings?.why_choose_image_url || "https://placehold.co/1200x1200/1a1a1a/C5A059?text=Our+Craftsmanship"}
                                alt="Craftsmanship"
                                loading="lazy"
                                className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                        </div>
                    </motion.div>

                    <div className="w-full">
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                            className="inline-block mb-4"
                        >
                            <span className="text-amber-600 text-xs md:text-sm font-bold uppercase tracking-widest bg-amber-500/10 text-amber-600 px-4 py-1.5 rounded-full">
                                {settings?.why_choose_subtitle || 'Why Choose Us'}
                            </span>
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-5 leading-tight"
                        >
                            {settings?.why_choose_title || (
                                <>Craftsmanship <br /><span className="text-foreground">Meets Elegance</span></>
                            )}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-muted-foreground text-base mb-8 leading-relaxed max-w-lg"
                        >
                            {settings?.why_choose_description || "We don't just renovate spaces; we craft environments that reflect your personal style while ensuring durability and flawless execution."}
                        </motion.p>

                        <div className="space-y-3">
                            {whyChooseUs.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, x: 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="group flex gap-4 p-3 -ml-3 rounded-2xl hover:bg-card hover:shadow-lg hover:shadow-amber-100/50 transition-all duration-300 border border-transparent hover:border-border cursor-default"
                                >
                                    <div className="w-14 h-14 rounded-xl bg-primary/10 group-hover:bg-primary flex items-center justify-center shrink-0 transition-colors duration-300">
                                        <iconify-icon icon={item.icon || 'lucide:award'}
                                            className="text-2xl text-primary group-hover:text-white transition-colors duration-300"></iconify-icon>
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-bold text-foreground mb-1">{item.title}</h4>
                                        <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Work Process */}
            <section className="py-24 px-6 bg-background text-foreground relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="text-center max-w-2xl mx-auto mb-14"
                    >
                        <span className="text-amber-600 text-xs font-bold md:text-sm uppercase tracking-[0.3em] block mb-4">
                            {settings?.process_section_subtitle || 'Our Process'}
                        </span>
                        <h2 className="text-3xl md:text-5xl font-semibold leading-tight mb-4 text-foreground">
                            {settings?.process_section_title || (<>A Refined Journey <br className="hidden md:block" /> From Concept to Completion</>)}
                        </h2>
                        <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                            {settings?.process_section_description || 'Every project is handled with thoughtful planning, premium craftsmanship, and a seamless execution process.'}
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
                        {ourProcess.map((step, i) => (
                            <motion.div
                                key={step.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5, delay: i * 0.1 }}
                                className="group relative rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-xl hover:shadow-amber-500/5 hover:border-amber-200 transition-all duration-500 hover:-translate-y-2 cursor-default"
                            >
                                <div className="absolute -top-3 -left-3 w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 text-[10px] font-bold flex items-center justify-center border border-amber-200">
                                    {i + 1}
                                </div>
                                <div className="w-12 h-12 rounded-full border border-amber-100 bg-amber-500/10 text-amber-600 flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110">
                                    <iconify-icon icon={step.icon || 'lucide:circle'} className="text-xl text-amber-600"></iconify-icon>
                                </div>
                                <h4 className="text-lg font-semibold mb-2 text-foreground">{step.title}</h4>
                                <p className="text-sm text-muted-foreground leading-relaxed">{step.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-24 px-6 bg-muted relative overflow-hidden">
                <div className="max-w-7xl mx-auto text-center relative z-10">
                    <motion.div
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeIn}
                        className="mb-20 space-y-3"
                    >
                        <span className="text-amber-600 text-sm font-bold uppercase tracking-widest block">
                            {settings?.testimonial_section_subtitle || 'CLIENT STORIES'}
                        </span>
                        <h2 className="text-4xl md:text-6xl font-heading font-extrabold text-foreground">
                            {settings?.testimonial_section_title || 'Words of Trust'}
                        </h2>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="relative group/testimonials px-4 md:px-0"
                    >
                        <Swiper
                            modules={[Autoplay, Pagination, Navigation]}
                            spaceBetween={30}
                            slidesPerView={1}
                            autoplay={{
                                delay: 5000,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                                dynamicBullets: true
                            }}
                            navigation={{
                                nextEl: '.swiper-button-next-custom',
                                prevEl: '.swiper-button-prev-custom',
                            }}
                            breakpoints={{
                                640: { slidesPerView: 1, spaceBetween: 20 },
                                768: { slidesPerView: 2, spaceBetween: 30 },
                                1024: { slidesPerView: 3, spaceBetween: 40 },
                            }}
                            className="testimonial-swiper pb-16"
                        >
                            {testimonials.map((t) => (
                                <SwiperSlide key={t.id}>
                                    <div className="group/card relative h-full py-12">
                                        <div className="relative bg-card rounded-2xl p-9 pt-20 pb-10 shadow-lg border border-border h-full transition-all duration-300 ease-in-out group-hover/card:-translate-y-2 group-hover/card:shadow-2xl group-hover/card:border-amber-100 flex flex-col items-center">
                                            <iconify-icon icon="lucide:quote-right"
                                                className="absolute top-6 right-6 text-border text-6xl rotate-180 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300">
                                            </iconify-icon>
                                            <img
                                                src={t.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(t.name)}&background=C5A059&color=fff&size=96`}
                                                alt={t.name} loading="lazy"
                                                className="w-24 h-24 rounded-full object-cover absolute -top-12 left-1/2 -translate-x-1/2 border-8 border-card shadow-md" />
                                            <h4 className="text-xl font-semibold text-foreground mt-1">{t.name}</h4>
                                            <p className="text-sm text-amber-600 font-medium mb-4">{t.role}</p>
                                            <div className="flex justify-center mb-6 gap-0.5 text-amber-400">
                                                {Array.from({ length: 5 }).map((_, j) => (
                                                    <iconify-icon key={j} icon="material-symbols:star"
                                                        className={`text-xl ${j < t.rating ? 'text-amber-400' : 'text-border'}`}>
                                                    </iconify-icon>
                                                ))}
                                            </div>
                                            <p className="text-base text-muted-foreground leading-relaxed font-light text-center">"{truncateWords(t.review, 20)}"</p>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Custom Navigation Buttons */}
                        <div className="hidden md:flex justify-center gap-4 mt-4">
                            <button className="swiper-button-prev-custom w-12 h-12 rounded-full border border-amber-200 text-amber-600 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 cursor-pointer shadow-sm">
                                <iconify-icon icon="lucide:arrow-left" className="text-xl"></iconify-icon>
                            </button>
                            <button className="swiper-button-next-custom w-12 h-12 rounded-full border border-amber-200 text-amber-600 flex items-center justify-center hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-300 cursor-pointer shadow-sm">
                                <iconify-icon icon="lucide:arrow-right" className="text-xl"></iconify-icon>
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-24 px-6 bg-slate-900 text-white text-center relative overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1, opacity: 0 }}
                    whileInView={{ scale: 1, opacity: 0.1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5 }}
                    style={{ backgroundImage: `url(${settings?.cta_image_url || "https://placehold.co/1920x600/1a1a1a/C5A059?text=Ready+to+Transform?"})` }}
                    className="absolute inset-0 bg-cover bg-center">
                </motion.div>

                <div className="max-w-3xl mx-auto relative z-10">
                    <motion.h2
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-4xl md:text-6xl font-heading font-bold mb-6"
                    >
                        {settings?.cta_title || 'Ready to Transform Your Space?'}
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-white/80 mb-10 font-light max-w-xl mx-auto"
                    >
                        {settings?.cta_description || 'Book a consultation with our experts today and take the first step towards your dream Decor.'}
                    </motion.p>
                    <motion.button
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.4 }}
                        onClick={() => setIsBookingModalOpen(true)}
                        className="inline-block px-10 py-5 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-sm rounded-sm hover:bg-primary-foreground hover:text-primary transition-all shadow-lg hover:shadow-xl"
                    >
                        {settings?.cta_button_text || 'Schedule Consultation'}
                    </motion.button>
                </div>
            </section>

            {/* Modals */}
            <BookingModal
                isOpen={isBookingModalOpen}
                onClose={() => setIsBookingModalOpen(false)}
            />

        </main>
    )
}

export default Home
