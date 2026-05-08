import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useSiteSettings } from '../../context/SiteContext';

function AdminAbout() {
  const { settings, fetchSettings } = useSiteSettings();
  const [activeTab, setActiveTab] = useState('hero');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    about_hero_subtitle: '',
    about_hero_title: '',
    about_hero_description: '',
    about_story_subtitle: '',
    about_story_title: '',
    about_story_p1: '',
    about_story_p2: '',
    about_story_years: '',
    about_story_projects: '',
    about_philosophy_subtitle: '',
    about_philosophy_title: '',
    about_card1_title: '',
    about_card1_desc: '',
    about_card1_icon: '',
    about_card2_title: '',
    about_card2_desc: '',
    about_card2_icon: '',
    about_card3_title: '',
    about_card3_desc: '',
    about_card3_icon: '',
    about_expertise_subtitle: '',
    about_expertise_title: '',
    about_expertise_p1: '',
    about_expertise_p2: '',
  });

  const [files, setFiles] = useState({
    about_hero_image: null,
    about_story_image: null,
    about_expertise_image1: null,
    about_expertise_image2: null,
  });

  const [previews, setPreviews] = useState({});

  useEffect(() => {
    if (settings) {
      const data = {};
      Object.keys(formData).forEach(key => {
        data[key] = settings[key] || '';
      });
      setFormData(data);

      const p = {};
      if (settings.about_hero_image_url) p.about_hero_image = settings.about_hero_image_url;
      if (settings.about_story_image_url) p.about_story_image = settings.about_story_image_url;
      if (settings.about_expertise_image1_url) p.about_expertise_image1 = settings.about_expertise_image1_url;
      if (settings.about_expertise_image2_url) p.about_expertise_image2 = settings.about_expertise_image2_url;
      setPreviews(p);
    }
  }, [settings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const { name, files: selectedFiles } = e.target;
    const file = selectedFiles[0];
    if (file) {
      setFiles(prev => ({ ...prev, [name]: file }));
      setPreviews(prev => ({ ...prev, [name]: URL.createObjectURL(file) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);
    setError('');

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    Object.keys(files).forEach(key => {
      if (files[key]) data.append(key, files[key]);
    });

    try {
      await api.patch('settings/', data);
      await fetchSettings();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError('Failed to update. Please check all fields.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const TabButton = ({ id, label, icon }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 text-xs font-bold uppercase tracking-widest transition-all border-b-2 ${
        activeTab === id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
      }`}
    >
      <iconify-icon icon={icon} class="text-lg"></iconify-icon>
      {label}
    </button>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-12">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">About Page Management</h2>
          <p className="text-muted-foreground text-sm mt-1">Customize every detail of your brand story.</p>
        </div>
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="px-8 py-3 bg-primary text-primary-foreground rounded-xl shadow-lg hover:bg-primary/90 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all disabled:opacity-50"
        >
          {loading ? <iconify-icon icon="lucide:loader-2" class="animate-spin text-lg"></iconify-icon> : <iconify-icon icon="lucide:save" class="text-lg"></iconify-icon>}
          Save All Changes
        </button>
      </div>

      {success && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 flex items-center gap-3 text-emerald-600 font-bold text-sm animate-fade-in">
          <iconify-icon icon="lucide:check-circle" class="text-xl"></iconify-icon>
          Changes saved successfully!
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="flex border-b border-border bg-muted/30 overflow-x-auto no-scrollbar">
          <TabButton id="hero" label="Hero Section" icon="lucide:layout" />
          <TabButton id="story" label="Brand Story" icon="lucide:book-open" />
          <TabButton id="philosophy" label="Philosophy" icon="lucide:gem" />
          <TabButton id="expertise" label="Expertise" icon="lucide:users" />
        </div>

        <div className="p-8">
          <form className="space-y-8">
            {activeTab === 'hero' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                <div className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Subtitle (Badge)</label>
                    <input type="text" name="about_hero_subtitle" value={formData.about_hero_subtitle} onChange={handleInputChange} className="admin-input w-full" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Main Title</label>
                    <input type="text" name="about_hero_title" value={formData.about_hero_title} onChange={handleInputChange} className="admin-input w-full" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Description</label>
                    <textarea name="about_hero_description" value={formData.about_hero_description} onChange={handleInputChange} rows="4" className="admin-input w-full resize-none" />
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Background Image</label>
                  <div className="relative aspect-video rounded-2xl border-2 border-dashed border-border overflow-hidden bg-muted flex items-center justify-center group">
                    {previews.about_hero_image ? (
                      <>
                        <img src={previews.about_hero_image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                           <label htmlFor="about-hero-image" className="cursor-pointer bg-white text-foreground px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg hover:bg-primary hover:text-white transition-all">Change Image</label>
                        </div>
                      </>
                    ) : (
                      <label htmlFor="about-hero-image" className="absolute inset-0 cursor-pointer flex items-center justify-center">
                        <iconify-icon icon="lucide:upload" class="text-3xl text-muted-foreground"></iconify-icon>
                      </label>
                    )}
                    <input id="about-hero-image" type="file" name="about_hero_image" onChange={handleFileChange} className="hidden" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'story' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Subtitle</label>
                        <input type="text" name="about_story_subtitle" value={formData.about_story_subtitle} onChange={handleInputChange} className="admin-input w-full" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Title</label>
                        <input type="text" name="about_story_title" value={formData.about_story_title} onChange={handleInputChange} className="admin-input w-full" />
                      </div>
                   </div>
                   <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Paragraph 1</label>
                    <textarea name="about_story_p1" value={formData.about_story_p1} onChange={handleInputChange} rows="3" className="admin-input w-full resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Paragraph 2</label>
                    <textarea name="about_story_p2" value={formData.about_story_p2} onChange={handleInputChange} rows="3" className="admin-input w-full resize-none" />
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-2">
                      <div className="p-4 bg-muted/50 rounded-xl border border-border">
                         <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Experience (e.g. 10+)</label>
                         <input type="text" name="about_story_years" value={formData.about_story_years} onChange={handleInputChange} className="bg-transparent border-none text-xl font-bold w-full p-0" />
                      </div>
                      <div className="p-4 bg-muted/50 rounded-xl border border-border">
                         <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Projects (e.g. 500+)</label>
                         <input type="text" name="about_story_projects" value={formData.about_story_projects} onChange={handleInputChange} className="bg-transparent border-none text-xl font-bold w-full p-0" />
                      </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Side Image</label>
                  <div className="relative aspect-[4/5] rounded-2xl border-2 border-dashed border-border overflow-hidden bg-muted flex items-center justify-center group">
                    {previews.about_story_image ? (
                      <>
                        <img src={previews.about_story_image} className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                           <label htmlFor="about-story-image" className="cursor-pointer bg-white text-foreground px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg hover:bg-primary hover:text-white transition-all">Change Image</label>
                        </div>
                      </>
                    ) : (
                      <label htmlFor="about-story-image" className="absolute inset-0 cursor-pointer flex items-center justify-center">
                        <iconify-icon icon="lucide:upload" class="text-3xl text-muted-foreground"></iconify-icon>
                      </label>
                    )}
                    <input id="about-story-image" type="file" name="about_story_image" onChange={handleFileChange} className="hidden" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'philosophy' && (
              <div className="space-y-8 animate-fade-in">
                <div className="grid grid-cols-2 gap-4">
                   <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Section Subtitle</label>
                    <input type="text" name="about_philosophy_subtitle" value={formData.about_philosophy_subtitle} onChange={handleInputChange} className="admin-input w-full" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Section Title</label>
                    <input type="text" name="about_philosophy_title" value={formData.about_philosophy_title} onChange={handleInputChange} className="admin-input w-full" />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="p-6 bg-muted/20 border border-border rounded-2xl space-y-4">
                       <p className="text-[9px] font-bold text-primary uppercase tracking-widest border-b border-border pb-2">Card {i}</p>
                       <div>
                          <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Icon (Iconify)</label>
                          <input type="text" name={`about_card${i}_icon`} value={formData[`about_card${i}_icon`]} onChange={handleInputChange} className="admin-input w-full text-xs" />
                       </div>
                       <div>
                          <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Title</label>
                          <input type="text" name={`about_card${i}_title`} value={formData[`about_card${i}_title`]} onChange={handleInputChange} className="admin-input w-full text-xs" />
                       </div>
                       <div>
                          <label className="block text-[9px] font-bold text-muted-foreground uppercase mb-1">Description</label>
                          <textarea name={`about_card${i}_desc`} value={formData[`about_card${i}_desc`]} onChange={handleInputChange} rows="3" className="admin-input w-full text-xs resize-none" />
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'expertise' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                <div className="space-y-4">
                   <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Section Title</label>
                    <input type="text" name="about_expertise_title" value={formData.about_expertise_title} onChange={handleInputChange} className="admin-input w-full font-bold" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Paragraph 1</label>
                    <textarea name="about_expertise_p1" value={formData.about_expertise_p1} onChange={handleInputChange} rows="3" className="admin-input w-full resize-none" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1.5">Paragraph 2</label>
                    <textarea name="about_expertise_p2" value={formData.about_expertise_p2} onChange={handleInputChange} rows="3" className="admin-input w-full resize-none" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Image 1</label>
                    <div className="relative aspect-square rounded-xl border-2 border-dashed border-border overflow-hidden bg-muted flex items-center justify-center group">
                      {previews.about_expertise_image1 ? (
                        <>
                          <img src={previews.about_expertise_image1} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                             <label htmlFor="about-exp-image1" className="cursor-pointer bg-white text-foreground px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider shadow-lg hover:bg-primary hover:text-white transition-all">Change</label>
                          </div>
                        </>
                      ) : (
                        <label htmlFor="about-exp-image1" className="absolute inset-0 cursor-pointer flex items-center justify-center">
                          <iconify-icon icon="lucide:upload" class="text-2xl text-muted-foreground"></iconify-icon>
                        </label>
                      )}
                      <input id="about-exp-image1" type="file" name="about_expertise_image1" onChange={handleFileChange} className="hidden" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-widest text-center">Image 2</label>
                    <div className="relative aspect-square rounded-xl border-2 border-dashed border-border overflow-hidden bg-muted flex items-center justify-center group">
                      {previews.about_expertise_image2 ? (
                        <>
                          <img src={previews.about_expertise_image2} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-10">
                             <label htmlFor="about-exp-image2" className="cursor-pointer bg-white text-foreground px-4 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider shadow-lg hover:bg-primary hover:text-white transition-all">Change</label>
                          </div>
                        </>
                      ) : (
                        <label htmlFor="about-exp-image2" className="absolute inset-0 cursor-pointer flex items-center justify-center">
                          <iconify-icon icon="lucide:upload" class="text-2xl text-muted-foreground"></iconify-icon>
                        </label>
                      )}
                      <input id="about-exp-image2" type="file" name="about_expertise_image2" onChange={handleFileChange} className="hidden" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>

      <style jsx="true">{`
        .admin-input {
          @apply px-4 py-3 bg-muted/40 border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
}

export default AdminAbout;
