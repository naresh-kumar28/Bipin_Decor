import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useSiteSettings } from '../../context/SiteContext';

function AdminPortfolioHero() {
  const { settings, fetchSettings } = useSiteSettings();
  const [formData, setFormData] = useState({
    portfolio_hero_subtitle: '',
    portfolio_hero_title: '',
    portfolio_hero_description: '',
    portfolio_hero_image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        portfolio_hero_subtitle: settings.portfolio_hero_subtitle || '',
        portfolio_hero_title: settings.portfolio_hero_title || '',
        portfolio_hero_description: settings.portfolio_hero_description || '',
        portfolio_hero_image: null
      });
      if (settings.portfolio_hero_image_url) {
        setPreviewImage(settings.portfolio_hero_image_url);
      }
    }
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      setFormData(prev => ({ ...prev, [name]: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    const data = new FormData();
    data.append('portfolio_hero_subtitle', formData.portfolio_hero_subtitle);
    data.append('portfolio_hero_title', formData.portfolio_hero_title);
    data.append('portfolio_hero_description', formData.portfolio_hero_description);
    if (formData.portfolio_hero_image) {
      data.append('portfolio_hero_image', formData.portfolio_hero_image);
    }

    try {
      await api.patch('settings/', data);
      await fetchSettings();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to update Portfolio Hero section. Please try again.';
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Portfolio Hero Management</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage the hero section of your "Our Work" gallery.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <iconify-icon icon="lucide:type" class="text-primary"></iconify-icon>
                Hero Text Content
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Hero Subtitle</label>
                  <input 
                    type="text"
                    name="portfolio_hero_subtitle"
                    value={formData.portfolio_hero_subtitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Our Masterpieces"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Hero Title</label>
                  <input 
                    type="text"
                    name="portfolio_hero_title"
                    value={formData.portfolio_hero_title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Work Gallery"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Hero Description</label>
                  <textarea 
                    name="portfolio_hero_description"
                    value={formData.portfolio_hero_description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="Explore our curated portfolio..."
                    required
                  ></textarea>
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                {success && (
                  <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
                    <iconify-icon icon="lucide:check-circle"></iconify-icon>
                    Saved successfully!
                  </span>
                )}
                {error && (
                  <span className="text-destructive text-sm font-bold">
                    Error: {error}
                  </span>
                )}
                <button 
                  type="submit"
                  disabled={loading}
                  className="ml-auto px-8 py-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg hover:bg-primary/90 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
                >
                  {loading ? (
                    <iconify-icon icon="lucide:loader-2" class="animate-spin text-lg"></iconify-icon>
                  ) : (
                    <iconify-icon icon="lucide:save" class="text-lg"></iconify-icon>
                  )}
                  Save Portfolio Hero
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Media Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <iconify-icon icon="lucide:image" class="text-primary"></iconify-icon>
                Hero Background Image
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border-2 border-dashed border-border group">
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label htmlFor="portfolio-hero-image" className="cursor-pointer bg-white text-foreground px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all">
                        Change Image
                      </label>
                    </div>
                  </>
                ) : (
                  <label htmlFor="portfolio-hero-image" className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                    <iconify-icon icon="lucide:upload-cloud" class="text-4xl text-muted-foreground"></iconify-icon>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Click to upload Image</span>
                  </label>
                )}
                <input 
                  type="file" 
                  id="portfolio-hero-image" 
                  name="portfolio_hero_image"
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed italic text-center">
                * Recommended: High resolution landscape image (1920x1080).
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Live Preview */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <iconify-icon icon="lucide:eye" class="text-primary"></iconify-icon>
            Live Preview
          </h3>
        </div>
        <div className="p-8">
          <div className="relative w-full h-[300px] rounded-2xl overflow-hidden bg-slate-900 flex items-center justify-center text-center px-6">
            <div className="absolute inset-0 z-0">
               <img src={previewImage} className="w-full h-full object-cover opacity-10" alt="" />
            </div>
            <div className="relative z-10 space-y-3">
              <span className="text-primary tracking-widest uppercase text-[10px] block font-bold">
                {formData.portfolio_hero_subtitle || 'SUBTITLE PREVIEW'}
              </span>
              <h1 className="text-3xl md:text-5xl text-white font-heading font-bold">
                {formData.portfolio_hero_title || 'TITLE PREVIEW'}
              </h1>
              <p className="text-white/70 text-xs font-light max-w-md mx-auto line-clamp-2">
                {formData.portfolio_hero_description || 'Description preview text...'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminPortfolioHero;
