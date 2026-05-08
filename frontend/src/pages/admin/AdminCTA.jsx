import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useSiteSettings } from '../../context/SiteContext';

function AdminCTA() {
  const { settings, fetchSettings } = useSiteSettings();
  const [formData, setFormData] = useState({
    cta_title: '',
    cta_description: '',
    cta_button_text: '',
    cta_background_image: null
  });
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (settings) {
      setFormData({
        cta_title: settings.cta_title || '',
        cta_description: settings.cta_description || '',
        cta_button_text: settings.cta_button_text || '',
        cta_background_image: null
      });
      if (settings.cta_image_url) {
        setPreviewImage(settings.cta_image_url);
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
      setFormData(prev => ({ ...prev, cta_background_image: file }));
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    const data = new FormData();
    data.append('cta_title', formData.cta_title);
    data.append('cta_description', formData.cta_description);
    data.append('cta_button_text', formData.cta_button_text);
    if (formData.cta_background_image) {
      data.append('cta_background_image', formData.cta_background_image);
    }

    try {
      await api.patch('settings/', data);
      await fetchSettings();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : 'Failed to update CTA section. Please try again.';
      setError(errorMsg);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">CTA Section Management</h2>
          <p className="text-muted-foreground text-sm mt-1">Edit the "Ready to Transform Your Space" section content.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-2">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <iconify-icon icon="lucide:edit-3" class="text-primary"></iconify-icon>
                Content Details
              </h3>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Section Title</label>
                  <input 
                    type="text"
                    name="cta_title"
                    value={formData.cta_title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Ready to Transform Your Space?"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Section Description</label>
                  <textarea 
                    name="cta_description"
                    value={formData.cta_description}
                    onChange={handleInputChange}
                    rows="4"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all resize-none"
                    placeholder="Enter the description text..."
                    required
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Button Text</label>
                  <input 
                    type="text"
                    name="cta_button_text"
                    value={formData.cta_button_text}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none transition-all"
                    placeholder="Schedule Consultation"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-border flex items-center justify-between">
                {success && (
                  <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
                    <iconify-icon icon="lucide:check-circle"></iconify-icon>
                    Settings saved successfully!
                  </span>
                )}
                {error && (
                  <span className="text-destructive text-sm font-bold flex items-center gap-1">
                    <iconify-icon icon="lucide:alert-circle"></iconify-icon>
                    {error}
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
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Media & Preview Section */}
        <div className="space-y-6">
          <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
            <div className="p-6 border-b border-border bg-muted/30">
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <iconify-icon icon="lucide:image" class="text-primary"></iconify-icon>
                Background Image
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border-2 border-dashed border-border group">
                {previewImage ? (
                  <>
                    <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <label htmlFor="cta-image" className="cursor-pointer bg-white text-foreground px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-primary hover:text-white transition-all">
                        Change Image
                      </label>
                    </div>
                  </>
                ) : (
                  <label htmlFor="cta-image" className="absolute inset-0 cursor-pointer flex flex-col items-center justify-center gap-2 hover:bg-muted/50 transition-colors">
                    <iconify-icon icon="lucide:upload-cloud" class="text-4xl text-muted-foreground"></iconify-icon>
                    <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Click to upload</span>
                  </label>
                )}
                <input 
                  type="file" 
                  id="cta-image" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              <p className="text-[10px] text-muted-foreground leading-relaxed italic">
                * Recommended: High resolution image (1920x1080). Image will be shown with low opacity on dark background.
              </p>
            </div>
          </div>

          {/* Mini Preview Card */}
          <div className="bg-slate-900 rounded-2xl border border-white/10 shadow-xl overflow-hidden relative p-8 text-center">
            <div 
              className="absolute inset-0 opacity-10 bg-cover bg-center"
              style={{ backgroundImage: `url(${previewImage})` }}
            ></div>
            <div className="relative z-10 space-y-3">
              <h4 className="text-white font-heading font-bold text-sm line-clamp-1">{formData.cta_title || 'Title Preview'}</h4>
              <p className="text-white/60 text-[10px] line-clamp-2 leading-relaxed">{formData.cta_description || 'Description preview text...'}</p>
              <div className="pt-2">
                <span className="inline-block px-4 py-2 bg-primary text-primary-foreground text-[10px] font-bold uppercase tracking-widest rounded-sm">
                  {formData.cta_button_text || 'Button'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCTA;
