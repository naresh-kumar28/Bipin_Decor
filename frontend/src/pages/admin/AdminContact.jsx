import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useSiteSettings } from '../../context/SiteContext';

function AdminContact() {
  const { settings, fetchSettings } = useSiteSettings();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    contact_hero_subtitle: '',
    contact_hero_title: '',
    contact_hero_description: '',
    contact_card_badge: '',
    contact_card_title: '',
    contact_card_p1: '',
    contact_card_p2: '',
  });

  const [heroImage, setHeroImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  useEffect(() => {
    if (settings) {
      setFormData({
        contact_hero_subtitle: settings.contact_hero_subtitle || '',
        contact_hero_title: settings.contact_hero_title || '',
        contact_hero_description: settings.contact_hero_description || '',
        contact_card_badge: settings.contact_card_badge || '',
        contact_card_title: settings.contact_card_title || '',
        contact_card_p1: settings.contact_card_p1 || '',
        contact_card_p2: settings.contact_card_p2 || '',
      });
      if (settings.contact_hero_image_url) {
        setPreviewImage(settings.contact_hero_image_url);
      }
    }
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setHeroImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    if (heroImage) {
      data.append('contact_hero_image', heroImage);
    }

    try {
      await api.patch('settings/', data);
      await fetchSettings();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Contact Page Management</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage how clients reach out to you.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-8">
          {/* Hero Content */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <iconify-icon icon="lucide:layout-template" class="text-primary"></iconify-icon>
                Hero Section
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Subtitle</label>
                <input type="text" name="contact_hero_subtitle" value={formData.contact_hero_subtitle} onChange={handleInputChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Main Title</label>
                <input type="text" name="contact_hero_title" value={formData.contact_hero_title} onChange={handleInputChange} className="admin-input w-full" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Description</label>
                <textarea name="contact_hero_description" value={formData.contact_hero_description} onChange={handleInputChange} rows="3" className="admin-input w-full resize-none" />
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <iconify-icon icon="lucide:id-card" class="text-primary"></iconify-icon>
                Support Card
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Badge</label>
                  <input type="text" name="contact_card_badge" value={formData.contact_card_badge} onChange={handleInputChange} className="admin-input w-full" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Headline</label>
                  <input type="text" name="contact_card_title" value={formData.contact_card_title} onChange={handleInputChange} className="admin-input w-full" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Paragraph 1</label>
                <textarea name="contact_card_p1" value={formData.contact_card_p1} onChange={handleInputChange} rows="2" className="admin-input w-full resize-none" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Paragraph 2</label>
                <textarea name="contact_card_p2" value={formData.contact_card_p2} onChange={handleInputChange} rows="2" className="admin-input w-full resize-none" />
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-8">
           {/* Hero Image */}
           <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <iconify-icon icon="lucide:image" class="text-primary"></iconify-icon>
                Hero Background
              </h3>
            </div>
            <div className="p-6">
              <div className="relative aspect-video rounded-xl border-2 border-dashed border-border overflow-hidden bg-muted flex items-center justify-center group">
                {previewImage ? (
                  <>
                    <img src={previewImage} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                       <label htmlFor="contact-hero-image" className="cursor-pointer bg-white text-foreground px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg hover:bg-primary hover:text-white transition-all">
                          Change Image
                       </label>
                    </div>
                  </>
                ) : (
                  <label htmlFor="contact-hero-image" className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-2 hover:bg-primary/5 transition-colors">
                    <iconify-icon icon="lucide:upload" class="text-3xl text-muted-foreground"></iconify-icon>
                  </label>
                )}
                <input id="contact-hero-image" type="file" onChange={handleFileChange} className="hidden" />
              </div>
              <p className="text-[10px] text-muted-foreground mt-3 italic text-center">* Recommended size: 1920x1080px</p>
            </div>
          </div>

          {/* Action Button */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-4">
             <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-4 bg-primary text-primary-foreground rounded-xl shadow-lg hover:bg-primary/90 font-bold text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {loading ? <iconify-icon icon="lucide:loader-2" class="animate-spin text-lg"></iconify-icon> : <iconify-icon icon="lucide:save" class="text-lg"></iconify-icon>}
                Save Contact Settings
              </button>
              {success && (
                <p className="text-center text-emerald-500 text-xs font-bold animate-fade-in flex items-center justify-center gap-1">
                  <iconify-icon icon="lucide:check-circle"></iconify-icon>
                  All changes saved successfully!
                </p>
              )}
              {error && (
                <p className="text-center text-destructive text-xs font-bold animate-fade-in">
                  Error: {error}
                </p>
              )}
          </div>

          <div className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
            <div className="flex gap-3">
              <iconify-icon icon="lucide:info" class="text-amber-600 text-xl shrink-0 mt-0.5"></iconify-icon>
              <div className="space-y-2">
                <p className="text-xs font-bold text-amber-900 uppercase tracking-widest">Quick Tip</p>
                <p className="text-xs text-amber-800 leading-relaxed italic">
                  Changes here affect the "Contact Us" page. WhatsApp and Email details are managed globally in <strong>General Settings</strong>.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .admin-input {
          @apply px-4 py-3 bg-muted/40 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm;
        }
      `}</style>
    </div>
  );
}

export default AdminContact;
