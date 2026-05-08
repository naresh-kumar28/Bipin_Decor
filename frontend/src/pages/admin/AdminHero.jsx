import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useSiteSettings } from '../../context/SiteContext';

function AdminHero() {
  const { settings, fetchSettings } = useSiteSettings();
  const [formData, setFormData] = useState({
    hero_subtitle: '',
    hero_title: '',
    hero_description: '',
    hero_video: null,
    hero_background_image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [previewVideo, setPreviewVideo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        hero_subtitle: settings.hero_subtitle || '',
        hero_title: settings.hero_title || '',
        hero_description: settings.hero_description || '',
        hero_video: null,
        hero_background_image: null
      });
      if (settings.hero_image_url) {
        setPreviewImage(settings.hero_image_url);
      }
      if (settings.hero_video_url) {
        setPreviewVideo(settings.hero_video_url);
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
      if (name === 'hero_background_image') {
        setPreviewImage(URL.createObjectURL(file));
      } else if (name === 'hero_video') {
        setPreviewVideo(URL.createObjectURL(file));
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    const data = new FormData();
    data.append('hero_subtitle', formData.hero_subtitle);
    data.append('hero_title', formData.hero_title);
    data.append('hero_description', formData.hero_description);
    if (formData.hero_video) {
      data.append('hero_video', formData.hero_video);
    }
    if (formData.hero_background_image) {
      data.append('hero_background_image', formData.hero_background_image);
    }

    try {
      await api.patch('settings/', data);
      await fetchSettings();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to update Hero section. Please try again.';
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
          <h2 className="text-2xl font-heading font-bold text-foreground">Hero Section Management</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage the first impression of your website.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <iconify-icon icon="lucide:type" class="text-primary"></iconify-icon>
                Text Content
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Hero Tagline (Subtitle)</label>
                  <input 
                    type="text"
                    name="hero_subtitle"
                    value={formData.hero_subtitle}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Bipin Decor Studio"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Main Heading</label>
                  <input 
                    type="text"
                    name="hero_title"
                    value={formData.hero_title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Elevate Your Living Space"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Description Text</label>
                  <textarea 
                    name="hero_description"
                    value={formData.hero_description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="Enter the hero description..."
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
                  Save Hero Section
                </button>
              </div>
            </form>
          </div>

          <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-4 flex gap-3">
            <iconify-icon icon="lucide:info" class="text-amber-600 text-xl shrink-0 mt-0.5"></iconify-icon>
            <p className="text-xs text-amber-800 leading-relaxed italic">
              <strong>Tip:</strong> Keep your heading short (3-5 words) and description concise (under 20 words) for the best visual impact on mobile devices.
            </p>
          </div>
        </div>

        {/* Media Section */}
        <div className="lg:col-span-5 space-y-6">
          {/* Background Video */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <iconify-icon icon="lucide:video" class="text-primary"></iconify-icon>
                Background Video
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border-2 border-dashed border-border group">
                {previewVideo ? (
                  <>
                    <video src={previewVideo} className="w-full h-full object-cover" autoPlay muted loop playsInline />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label htmlFor="hero-video" className="cursor-pointer bg-white text-foreground px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all">
                        Change Video
                      </label>
                    </div>
                  </>
                ) : (
                  <label htmlFor="hero-video" className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                    <iconify-icon icon="lucide:upload-cloud" class="text-4xl text-muted-foreground"></iconify-icon>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Click to upload Video</span>
                  </label>
                )}
                <input 
                  type="file" 
                  id="hero-video" 
                  name="hero_video"
                  className="hidden" 
                  accept="video/mp4,video/webm"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed italic text-center">
                * Recommended: MP4 format, under 5MB for fast loading.
              </p>
            </div>
          </div>

          {/* Fallback Image */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <iconify-icon icon="lucide:image" class="text-primary"></iconify-icon>
                Fallback Image (Poster)
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border-2 border-dashed border-border group">
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label htmlFor="hero-image" className="cursor-pointer bg-white text-foreground px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all">
                        Change Image
                      </label>
                    </div>
                  </>
                ) : (
                  <label htmlFor="hero-image" className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                    <iconify-icon icon="lucide:upload-cloud" class="text-4xl text-muted-foreground"></iconify-icon>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Click to upload Image</span>
                  </label>
                )}
                <input 
                  type="file" 
                  id="hero-image" 
                  name="hero_background_image"
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed italic text-center">
                * Shown while video is loading or on slow connections.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Preview Card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border bg-muted/30">
          <h3 className="font-bold text-foreground flex items-center gap-2">
            <iconify-icon icon="lucide:eye" class="text-primary"></iconify-icon>
            Live Preview
          </h3>
        </div>
        <div className="p-8">
          <div className="relative w-full h-[400px] rounded-2xl overflow-hidden bg-black flex items-center justify-center text-center px-6">
            <div className="absolute inset-0 z-0">
               {previewVideo ? (
                  <video src={previewVideo} className="w-full h-full object-cover opacity-50" autoPlay muted loop playsInline />
               ) : (
                  <img src={previewImage} className="w-full h-full object-cover opacity-50" alt="" />
               )}
            </div>
            <div className="relative z-10 space-y-4">
              <span className="text-amber-400 tracking-[0.2em] uppercase text-[10px] block font-medium">
                {formData.hero_subtitle || 'Tagline Preview'}
              </span>
              <h1 className="text-3xl md:text-5xl text-white leading-tight font-serif">
                {formData.hero_title || 'Title Preview'}
              </h1>
              <p className="text-white/70 text-sm font-light max-w-lg mx-auto line-clamp-2">
                {formData.hero_description || 'Description preview text...'}
              </p>
              <div className="pt-4 flex justify-center">
                 <div className="px-6 py-2.5 border border-amber-400 text-amber-400 text-[10px] tracking-widest uppercase font-bold">
                    Start Your Project
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminHero;
