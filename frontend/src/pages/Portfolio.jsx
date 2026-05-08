import React, { useState, useEffect, useRef, useCallback } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/api'
import { useSiteSettings } from '../context/SiteContext'

function Portfolio() {
    const { settings } = useSiteSettings();
    const [searchParams, setSearchParams] = useSearchParams();
    const activeCategory = searchParams.get('category') || 'all';

    const [categories, setCategories] = useState([]);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProject, setSelectedProject] = useState(null);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [showReviewForm, setShowReviewForm] = useState(false);

    // Load More State
    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 6;
    const loaderRef = useRef(null);

    const [requestData, setRequestData] = useState({
        user_name: '',
        user_email: '',
        user_phone: '',
        message: ''
    });

    const [reviewData, setReviewData] = useState({
        user_name: '',
        rating: 0,
        comment: ''
    });

    const [requestStatus, setRequestStatus] = useState({ type: '', message: '' });
    const [reviewStatus, setReviewStatus] = useState({ type: '', message: '' });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catsRes, projectsRes] = await Promise.all([
                    api.get('categories/'),
                    api.get('projects/')
                ]);
                setCategories(catsRes.data);
                setProjects(projectsRes.data);
            } catch (err) {
                console.error("Failed to fetch data", err);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory]);

    // Truncate words helper
    const truncateWords = (text, limit) => {
        if (!text) return "";
        const words = text.split(" ");
        if (words.length <= limit) return text;
        return words.slice(0, limit).join(" ") + "...";
    };

    const filteredProjects = activeCategory === 'all'
        ? projects
        : projects.filter(p => p.category_slug === activeCategory || p.category === parseInt(activeCategory));

    // Infinite Scroll Logic
    const hasMore = currentPage * ITEMS_PER_PAGE < filteredProjects.length;
    const currentProjects = filteredProjects.slice(0, currentPage * ITEMS_PER_PAGE);

    const handleLoadMore = () => {
        if (hasMore) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    const handleRate = async (projectId, rating) => {
        try {
            const response = await api.post(`projects/${projectId}/rate/`, { rating });
            const updatedRating = response.data.rating;
            const updatedCount = response.data.rating_count;

            setProjects(projects.map(p => p.id === projectId ? { ...p, rating: updatedRating, rating_count: updatedCount } : p));

            if (selectedProject?.id === projectId) {
                setSelectedProject({ ...selectedProject, rating: updatedRating, rating_count: updatedCount });
            }
        } catch (err) {
            console.error("Failed to rate", err);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (reviewData.rating === 0) {
            setReviewStatus({ type: 'error', message: 'Please select a star rating.' });
            return;
        }
        setReviewStatus({ type: 'loading', message: 'Submitting review...' });
        try {
            await api.post('project-reviews/', {
                project: selectedProject.id,
                ...reviewData
            });

            // Refresh project data to show new review and updated rating
            const projRes = await api.get(`projects/${selectedProject.id}/`);
            const updatedProj = projRes.data;

            setProjects(projects.map(p => p.id === updatedProj.id ? updatedProj : p));
            setSelectedProject(updatedProj);

            setReviewStatus({ type: 'success', message: 'Thank you for your review!' });
            setReviewData({ user_name: '', rating: 0, comment: '' });
            setTimeout(() => {
                setShowReviewForm(false);
                setReviewStatus({ type: '', message: '' });
            }, 2000);
        } catch (err) {
            setReviewStatus({ type: 'error', message: 'Failed to submit review.' });
        }
    };

    const handleRequestSubmit = async (e) => {
        e.preventDefault();
        setRequestStatus({ type: 'loading', message: 'Sending request...' });
        try {
            await api.post('project-requests/', {
                project: selectedProject.id,
                ...requestData
            });
            setRequestStatus({ type: 'success', message: 'Your request has been sent! We will contact you soon.' });
            setRequestData({ user_name: '', user_email: '', user_phone: '', message: '' });
            setTimeout(() => {
                setShowRequestModal(false);
                setRequestStatus({ type: '', message: '' });
            }, 3000);
        } catch (err) {
            setRequestStatus({ type: 'error', message: 'Failed to send request. Please try again.' });
        }
    };

    return (
        <main className="flex-grow flex flex-col w-full">
            {/* Page Header */}
            <section className="relative min-h-[450px] flex items-center justify-center py-20 px-6 bg-slate-900 text-white text-center overflow-hidden">
                <div
                    style={{ backgroundImage: `url(${settings?.portfolio_hero_image_url || "https://placehold.co/1920x600/1a1a1a/C5A059?text=Our+Portfolio"})` }}
                    className="absolute inset-0 opacity-10 bg-cover bg-center">
                </div>
                <div className="max-w-3xl mx-auto relative z-10">
                    <motion.span 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                        className="text-primary text-sm font-bold uppercase tracking-widest mb-4 block"
                    >
                        {settings?.portfolio_hero_subtitle || 'Our Masterpieces'}
                    </motion.span>
                    <motion.h1 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-heading font-bold mb-6"
                    >
                        {settings?.portfolio_hero_title || 'Work Gallery'}
                    </motion.h1>
                    <motion.p 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="text-lg text-white/80 font-light max-w-xl mx-auto"
                    >
                        {settings?.portfolio_hero_description || 'Explore our curated portfolio of stunning transformations and bespoke installations.'}
                    </motion.p>
                </div>
            </section>

            {/* Portfolio Section */}
            <section className="py-16 px-6 bg-background">
                <div className="max-w-7xl mx-auto">
                    {/* Filters */}
                    <div className="flex flex-wrap items-center justify-center gap-4 mb-16">
                        <button
                            onClick={() => setSearchParams({})}
                            className={`px-6 py-2.5 font-medium text-sm rounded-sm shadow-sm transition-all ${activeCategory === 'all' ? 'bg-primary text-primary-foreground' : 'bg-transparent border border-border text-foreground hover:border-primary hover:text-primary'}`}
                        >
                            All Projects
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => setSearchParams({ category: cat.slug })}
                                className={`px-6 py-2.5 font-medium text-sm rounded-sm transition-all ${activeCategory === cat.slug ? 'bg-primary text-primary-foreground' : 'bg-transparent border border-border text-foreground hover:border-primary hover:text-primary'}`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                        </div>
                    ) : filteredProjects.length > 0 ? (
                        <div className="space-y-12">
                            <motion.div 
                                layout
                                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                            >
                                <AnimatePresence mode="popLayout">
                                    {currentProjects.map((project, index) => (
                                        <motion.div
                                            layout
                                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                                            whileInView={{ opacity: 1, scale: 1, y: 0 }}
                                            viewport={{ once: true, margin: "-50px" }}
                                            transition={{ 
                                                duration: 0.5, 
                                                delay: (index % 3) * 0.1,
                                                type: "spring",
                                                stiffness: 100
                                            }}
                                            key={project.id}
                                            className="group relative overflow-hidden rounded-xl shadow-lg aspect-[4/3] bg-muted cursor-pointer transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 border border-border/50 hover:border-primary/20"
                                            onClick={() => setSelectedProject(project)}
                                        >
                                            <img
                                                src={project.image}
                                                alt={project.title}
                                                loading="lazy"
                                                onLoad={(e) => e.target.classList.add('opacity-100')}
                                                className="w-full h-full object-cover transition-all duration-1000 opacity-0 group-hover:scale-110"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>

                                            <div className="absolute inset-0 p-6 flex flex-col justify-end text-white">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <span className="bg-primary/90 text-primary-foreground text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm">
                                                        {project.category_name}
                                                    </span>
                                                    <div className="flex items-center text-amber-400 text-xs">
                                                        <iconify-icon icon="material-symbols:star" class="fill-current"></iconify-icon>
                                                        <span className="ml-1 font-bold">{parseFloat(project.rating).toFixed(1)}</span>
                                                        <span className="ml-1 text-[10px] text-white/60">({project.rating_count})</span>
                                                    </div>
                                                </div>
                                                <h3 className="text-xl font-heading font-bold mb-1 translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                                                    {project.title}
                                                </h3>
                                                <p className="text-xs text-white/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100 line-clamp-1">
                                                    {project.description}
                                                </p>
                                            </div>

                                            <div className="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100 border border-white/30">
                                                <iconify-icon icon="lucide:maximize" className="text-white text-xl"></iconify-icon>
                                            </div>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </motion.div>

                            {/* Load More Button */}
                            {hasMore && (
                                <div className="flex justify-center pt-12 pb-8">
                                    <button
                                        onClick={handleLoadMore}
                                        className="group relative px-12 py-4 bg-transparent border-2 border-primary text-primary font-bold uppercase tracking-widest text-xs rounded-full overflow-hidden transition-all hover:bg-primary hover:text-primary-foreground shadow-lg hover:shadow-primary/20"
                                    >
                                        <span className="relative z-10 flex items-center gap-2">
                                            Load More Masterpieces
                                            <iconify-icon icon="lucide:chevron-down" class="text-lg group-hover:translate-y-1 transition-transform"></iconify-icon>
                                        </span>
                                    </button>
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-border">
                            <iconify-icon icon="lucide:image-off" class="text-6xl text-muted-foreground/30 mb-4"></iconify-icon>
                            <h3 className="text-xl font-bold text-foreground mb-2">No projects found</h3>
                            <p className="text-muted-foreground">We haven't added any work in this category yet.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Project Details Modal */}
            {selectedProject && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-sm" onClick={() => setSelectedProject(null)}></div>
                    <div className="relative w-full max-w-6xl bg-card rounded-3xl overflow-hidden shadow-2xl animate-scale-in flex flex-col lg:flex-row h-full max-h-[90vh]">
                        <button
                            onClick={() => setSelectedProject(null)}
                            className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 text-white rounded-full flex items-center justify-center hover:bg-black transition-colors"
                        >
                            <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
                        </button>

                        <div className="w-full lg:w-3/5 bg-muted relative overflow-hidden">
                            <img src={selectedProject.image} alt={selectedProject.title} loading="lazy" className="w-full h-full object-cover" />
                        </div>

                        <div className="w-full lg:w-2/5 p-6 md:p-10 overflow-y-auto bg-card flex flex-col">
                            <div className="mb-6">
                                <span className="text-primary text-xs font-bold uppercase tracking-widest mb-2 block">{selectedProject.category_name}</span>
                                <h2 className="text-3xl font-heading font-bold text-foreground mb-4">{selectedProject.title}</h2>
                                <div className="flex items-center gap-4 mb-6">
                                    <div className="flex items-center text-amber-400 bg-amber-400/10 px-3 py-1.5 rounded-full border border-amber-400/20">
                                        <iconify-icon icon="material-symbols:star" class="text-lg"></iconify-icon>
                                        <span className="ml-1.5 font-bold text-sm">{parseFloat(selectedProject.rating).toFixed(1)}</span>
                                    </div>
                                    <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{selectedProject.rating_count} Reviews</span>
                                </div>
                                <p className="text-muted-foreground leading-relaxed text-sm">
                                    {selectedProject.description || "No detailed description available for this project. Contact us for more information."}
                                </p>
                            </div>

                            {/* Review Section */}
                            <div className="space-y-6 mb-8">
                                <div className="flex items-center justify-between border-b border-border pb-4">
                                    <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Client Reviews</h4>
                                    <button
                                        onClick={() => setShowReviewForm(!showReviewForm)}
                                        className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
                                    >
                                        <iconify-icon icon="lucide:plus-circle"></iconify-icon>
                                        {showReviewForm ? "Close Form" : "Add Review"}
                                    </button>
                                </div>

                                {showReviewForm ? (
                                    <div className="bg-muted/50 p-6 rounded-2xl border border-border animate-slide-up">
                                        <h5 className="text-xs font-bold text-foreground mb-4 uppercase tracking-widest">Write a Review</h5>
                                        <form onSubmit={handleReviewSubmit} className="space-y-4">
                                            <div>
                                                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Your Name</label>
                                                <input
                                                    type="text"
                                                    required
                                                    value={reviewData.user_name}
                                                    onChange={(e) => setReviewData({ ...reviewData, user_name: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                                                    placeholder="Enter your name"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Rating</label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <button
                                                            key={s}
                                                            type="button"
                                                            onClick={() => setReviewData({ ...reviewData, rating: s })}
                                                            className={`text-xl transition-all ${s <= reviewData.rating ? 'text-amber-400 scale-110' : 'text-muted-foreground/30'}`}
                                                        >
                                                            <iconify-icon icon={s <= reviewData.rating ? "material-symbols:star" : "material-symbols:star-outline"}></iconify-icon>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Your Experience</label>
                                                <textarea
                                                    rows="3"
                                                    required
                                                    value={reviewData.comment}
                                                    onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                                                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                                    placeholder="Tell us what you like about this design..."
                                                ></textarea>
                                            </div>
                                            {reviewStatus.message && (
                                                <p className={`text-xs font-bold ${reviewStatus.type === 'success' ? 'text-emerald-500' : 'text-primary'}`}>
                                                    {reviewStatus.message}
                                                </p>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={reviewStatus.type === 'loading'}
                                                className="w-full py-3 bg-foreground text-background font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center gap-2"
                                            >
                                                Submit Review
                                            </button>
                                        </form>
                                    </div>
                                ) : (
                                    <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                        {selectedProject.reviews && selectedProject.reviews.length > 0 ? (
                                            selectedProject.reviews.map((review, idx) => (
                                                <div key={idx} className="bg-muted/30 p-4 rounded-xl border border-border/50">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <p className="font-bold text-xs text-foreground">{review.user_name}</p>
                                                        <div className="flex text-amber-400 text-[10px]">
                                                            {[...Array(5)].map((_, i) => (
                                                                <iconify-icon key={i} icon={i < review.rating ? "material-symbols:star" : "material-symbols:star-outline"}></iconify-icon>
                                                            ))}
                                                        </div>
                                                    </div>
                                                    <p className="text-xs text-muted-foreground italic leading-relaxed">"{truncateWords(review.comment, 20)}"</p>
                                                    <p className="text-[9px] text-muted-foreground/50 mt-2 uppercase">{new Date(review.created_at).toLocaleDateString()}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8">
                                                <p className="text-xs text-muted-foreground">No reviews yet. Be the first to share your thoughts!</p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            <div className="mt-auto pt-6 border-t border-border">
                                <button
                                    onClick={() => setShowRequestModal(true)}
                                    className="w-full py-4 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2"
                                >
                                    <iconify-icon icon="lucide:send" class="text-lg"></iconify-icon>
                                    Request this Design
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Request Form Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowRequestModal(false)}></div>
                    <div className="relative w-full max-w-md bg-card rounded-3xl overflow-hidden shadow-2xl animate-scale-in p-8 border border-border">
                        <div className="text-center mb-8">
                            <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                                <iconify-icon icon="lucide:home" class="text-3xl"></iconify-icon>
                            </div>
                            <h3 className="text-2xl font-bold text-foreground">Design Request</h3>
                            <p className="text-muted-foreground text-sm mt-2">Interested in <strong>{selectedProject.title}</strong>? Fill the form below.</p>
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
                                    onChange={(e) => setRequestData({ ...requestData, user_name: e.target.value })}
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
                                        onChange={(e) => setRequestData({ ...requestData, user_phone: e.target.value })}
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
                                        onChange={(e) => setRequestData({ ...requestData, user_email: e.target.value })}
                                        className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary outline-none transition-all"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Message (Optional)</label>
                                <textarea
                                    rows="3"
                                    value={requestData.message}
                                    onChange={(e) => setRequestData({ ...requestData, message: e.target.value })}
                                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                                    placeholder="I want this design for my bedroom..."
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
                                        Submit Request
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </main>
    )
}

export default Portfolio
