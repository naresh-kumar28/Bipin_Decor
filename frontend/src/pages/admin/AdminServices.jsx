import React, { useState, useEffect } from 'react';
import api from '../../api/api';

function AdminServices() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    features: '',
    icon: 'lucide:grid-3x3',
    image: null
  });
  
  // Settings Edit States
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsData, setSettingsData] = useState({
    service_section_subtitle: '',
    service_section_title: '',
    service_hero_subtitle: '',
    service_hero_title: '',
    service_hero_description: '',
    service_hero_image: null
  });
  const [heroPreview, setHeroPreview] = useState(null);
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    fetchServices();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('settings/');
      const data = response.data;
      setSettingsData({
        service_section_subtitle: data.service_section_subtitle || 'Our Expertise',
        service_section_title: data.service_section_title || 'Bipin Decor Services',
        service_hero_subtitle: data.service_hero_subtitle || 'What We Do',
        service_hero_title: data.service_hero_title || 'Expert Solutions for Modern Living',
        service_hero_description: data.service_hero_description || 'Discover our range of premium Decor services, from precision false ceilings to elegant wall paneling.',
        service_hero_image: null
      });
      if (data.service_hero_image_url) {
        setHeroPreview(data.service_hero_image_url);
      }
    } catch (err) {
      console.error("Failed to fetch settings", err);
    }
  };

  const fetchServices = async () => {
    try {
      const response = await api.get('services/');
      setServices(response.data);
    } catch (err) {
      console.error("Failed to fetch services", err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleHeroImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSettingsData({ ...settingsData, service_hero_image: file });
      setHeroPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('title', formData.title);
    data.append('description', formData.description);
    data.append('features', formData.features);
    data.append('icon', formData.icon);
    if (formData.image instanceof File) {
      data.append('image', formData.image);
    }

    try {
      if (editingService) {
        await api.patch(`services/${editingService.id}/`, data);
      } else {
        await api.post('services/', data);
      }
      setShowModal(false);
      setEditingService(null);
      setFormData({ title: '', description: '', features: '', icon: 'lucide:grid-3x3', image: null });
      fetchServices();
    } catch (err) {
      console.error("Failed to save service", err);
    }
  };

  const handleEdit = (service) => {
    setEditingService(service);
    setFormData({
      title: service.title,
      description: service.description,
      features: service.features || '',
      icon: service.icon || 'lucide:grid-3x3',
      image: service.image
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      try {
        await api.delete(`services/${id}/`);
        setServices(services.filter(s => s.id !== id));
      } catch (err) {
        console.error("Failed to delete service", err);
      }
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    const data = new FormData();
    data.append('service_section_subtitle', settingsData.service_section_subtitle);
    data.append('service_section_title', settingsData.service_section_title);
    data.append('service_hero_subtitle', settingsData.service_hero_subtitle);
    data.append('service_hero_title', settingsData.service_hero_title);
    data.append('service_hero_description', settingsData.service_hero_description);
    if (settingsData.service_hero_image) {
      data.append('service_hero_image', settingsData.service_hero_image);
    }

    try {
      await api.patch('settings/', data);
      setIsSettingsModalOpen(false);
      // We don't need a reload if we use context, but AdminServices uses local state for settings modal
      // Let's just update the local state or reload for simplicity as before
      window.location.reload(); 
    } catch (err) {
      console.error("Failed to save service settings", err);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : "Failed to save settings. Please try again.";
      alert(errorMsg);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const filteredServices = services.filter(s => 
    s.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Our Services</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage the services displayed on the website.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSettingsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-card border border-border text-foreground hover:text-primary hover:border-primary/30 rounded-xl shadow-sm transition-all font-bold text-[10px] uppercase tracking-widest"
          >
            <iconify-icon icon="lucide:settings" class="text-lg"></iconify-icon>
            Hero & Titles
          </button>
          <button 
            onClick={() => { setEditingService(null); setFormData({title:'', description:'', features: '', icon: 'lucide:grid-3x3', image:null}); setShowModal(true); }}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg hover:bg-primary/90 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
          >
            <iconify-icon icon="lucide:plus" class="text-lg"></iconify-icon>
            Add New Service
          </button>
        </div>
      </div>

      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="p-4 border-b border-border bg-muted/30">
          <div className="relative w-full sm:w-80">
            <iconify-icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></iconify-icon>
            <input 
              type="text" 
              placeholder="Search services..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all" 
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Icon/Image</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Service Title</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px]">Created At</th>
                <th className="px-6 py-4 font-bold uppercase tracking-widest text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </td>
                </tr>
              ) : filteredServices.length > 0 ? filteredServices.map((service) => (
                <tr key={service.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                        <iconify-icon icon={service.icon || 'lucide:grid-3x3'} class="text-xl"></iconify-icon>
                      </div>
                      <div className="w-14 h-10 rounded-lg bg-muted overflow-hidden border border-border shrink-0">
                        {service.image ? (
                          <img src={service.image} className="w-full h-full object-cover" alt={service.title} />
                        ) : (
                          <iconify-icon icon="lucide:image" class="text-xl text-muted-foreground"></iconify-icon>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-foreground">{service.title}</p>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-widest line-clamp-1 max-w-[200px] mt-0.5">
                      {service.description}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-xs text-muted-foreground uppercase tracking-wider">
                    {new Date(service.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(service)}
                        className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20"
                      >
                        <iconify-icon icon="lucide:pencil" class="text-lg"></iconify-icon>
                      </button>
                      <button 
                        onClick={() => handleDelete(service.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/20"
                      >
                        <iconify-icon icon="lucide:trash-2" class="text-lg"></iconify-icon>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-muted-foreground italic">
                    No services found. Add your first service to get started!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-2xl bg-card rounded-2xl shadow-2xl animate-scale-in border border-border overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">{editingService ? 'Edit Service' : 'Add New Service'}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Service Title</label>
                  <input 
                    type="text" 
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="e.g. UV Marble Sheet Installation"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Icon (Iconify Name)</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      name="icon"
                      required
                      value={formData.icon}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                      placeholder="e.g. lucide:grid-3x3"
                    />
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0 border border-primary/20">
                      <iconify-icon icon={formData.icon}></iconify-icon>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Description</label>
                <textarea 
                  name="description"
                  required
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Explain what this service offers..."
                ></textarea>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Features (One per line)</label>
                <textarea 
                  name="features"
                  value={formData.features}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Feature 1&#10;Feature 2&#10;Feature 3"
                ></textarea>
                <p className="text-[10px] text-muted-foreground mt-1 ml-1 italic">Each line will appear as a bullet point on the services page.</p>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest ml-1">Service Image</label>
                <div className="mt-1 flex items-center gap-4">
                  <div className="w-32 h-24 rounded-xl bg-muted border-2 border-dashed border-border overflow-hidden flex items-center justify-center shrink-0">
                    {formData.image ? (
                      <img 
                        src={formData.image instanceof File ? URL.createObjectURL(formData.image) : formData.image} 
                        className="w-full h-full object-cover" 
                        alt="Preview" 
                      />
                    ) : (
                      <iconify-icon icon="lucide:image-plus" class="text-3xl text-muted-foreground/30"></iconify-icon>
                    )}
                  </div>
                  <div className="flex-grow">
                    <input 
                      type="file" 
                      onChange={handleImageChange}
                      accept="image/*"
                      className="hidden" 
                      id="service-image"
                    />
                    <label 
                      htmlFor="service-image"
                      className="inline-flex items-center px-4 py-2 bg-background border border-border rounded-lg text-xs font-bold uppercase tracking-widest cursor-pointer hover:bg-muted transition-colors"
                    >
                      Choose Image
                    </label>
                    <p className="text-[10px] text-muted-foreground mt-2">Recommended: High quality horizontal image</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-border text-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-primary/90 transition-all shadow-lg"
                >
                  {editingService ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Service Settings Modal (Hero & Section Titles) */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setIsSettingsModalOpen(false)}></div>
          <div className="relative w-full max-w-3xl bg-card rounded-2xl shadow-2xl animate-scale-in border border-border overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b border-border flex items-center justify-between bg-muted/30">
              <div>
                <h3 className="text-xl font-bold text-foreground">Service Page Settings</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Customize Hero section and Section titles.</p>
              </div>
              <button onClick={() => setIsSettingsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
              </button>
            </div>
            
            <form onSubmit={handleSaveSettings} className="p-6 space-y-6 overflow-y-auto">
              {/* Services Page Hero Section */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] border-b border-border pb-2">Services Page Hero</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                   <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Hero Subtitle</label>
                        <input 
                          type="text" 
                          value={settingsData.service_hero_subtitle}
                          onChange={(e) => setSettingsData({...settingsData, service_hero_subtitle: e.target.value})}
                          className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Hero Title</label>
                        <input 
                          type="text" 
                          value={settingsData.service_hero_title}
                          onChange={(e) => setSettingsData({...settingsData, service_hero_title: e.target.value})}
                          className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                        />
                      </div>
                   </div>
                   <div>
                      <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest text-center">Hero Background</label>
                      <div className="relative aspect-video rounded-xl border-2 border-dashed border-border overflow-hidden bg-muted flex items-center justify-center group">
                        {heroPreview ? (
                          <>
                            <img src={heroPreview} className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                               <span className="bg-white text-foreground px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider shadow-lg">Change Image</span>
                            </div>
                          </>
                        ) : (
                          <iconify-icon icon="lucide:upload" class="text-3xl text-muted-foreground"></iconify-icon>
                        )}
                        <input type="file" onChange={handleHeroImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                   </div>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Hero Description</label>
                  <textarea 
                    value={settingsData.service_hero_description}
                    onChange={(e) => setSettingsData({...settingsData, service_hero_description: e.target.value})}
                    rows="2"
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              {/* Home Page Section Titles */}
              <div className="space-y-4 pt-4">
                <h4 className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] border-b border-border pb-2">Home Page Section Titles</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Section Subtitle</label>
                    <input 
                      type="text" 
                      value={settingsData.service_section_subtitle}
                      onChange={(e) => setSettingsData({...settingsData, service_section_subtitle: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Section Title</label>
                    <input 
                      type="text" 
                      value={settingsData.service_section_title}
                      onChange={(e) => setSettingsData({...settingsData, service_section_title: e.target.value})}
                      className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="flex-1 py-3 border border-border text-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-muted transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSavingSettings}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSavingSettings && <iconify-icon icon="lucide:loader-2" class="animate-spin text-lg"></iconify-icon>}
                  Save All Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminServices;
