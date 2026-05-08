import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const STATIC_TESTIMONIALS = [
  {
    name: 'Amit Sharma', role: 'Residential Client', rating: 5,
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    review: '"Bipin Decors completely transformed our living space. The finish is flawless and the result looks absolutely premium."',
  },
  {
    name: 'Priya Kapoor', role: 'Commercial Client', rating: 5,
    photo_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200&auto=format&fit=crop',
    review: '"The PVC paneling work was done with precision. The team was professional and delivered exactly what was promised."',
  },
  {
    name: 'Rahul Mehta', role: 'Home Owner', rating: 5,
    photo_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=200&auto=format&fit=crop',
    review: '"False ceiling and louvers work looks stunning. Attention to detail and finishing quality is top notch."',
  },
];

function StarRating({ value, onChange }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button key={s} type="button" onClick={() => onChange(s)}
          className={`text-2xl transition-colors ${s <= value ? 'text-amber-400' : 'text-border'}`}>
          <iconify-icon icon="material-symbols:star"></iconify-icon>
        </button>
      ))}
    </div>
  );
}

function AdminTestimonials() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({ name: '', role: 'Client', photo_url: '', rating: 5, review: '', order: 0, is_active: true });
  const [settings, setSettings] = useState({ testimonial_section_subtitle: 'CLIENT STORIES', testimonial_section_title: 'Words of Trust' });

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [itemsRes, settingsRes] = await Promise.allSettled([
        api.get('testimonials/'),
        api.get('settings/')
      ]);
      if (itemsRes.status === 'fulfilled') setItems(itemsRes.value.data);
      if (settingsRes.status === 'fulfilled') {
        const d = settingsRes.value.data;
        setSettings({
          testimonial_section_subtitle: d.testimonial_section_subtitle || 'CLIENT STORIES',
          testimonial_section_title: d.testimonial_section_title || 'Words of Trust',
        });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditingItem(null);
    setFormData({ name: '', role: 'Client', photo_url: '', rating: 5, review: '', order: items.length, is_active: true });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, role: item.role, photo_url: item.photo_url || '', rating: item.rating, review: item.review, order: item.order || 0, is_active: item.is_active });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await api.patch(`testimonials/${editingItem.id}/`, formData);
        showToast('Testimonial updated!');
      } else {
        await api.post('testimonials/', formData);
        showToast('Testimonial added!');
      }
      setShowModal(false);
      fetchAll();
    } catch { showToast('Failed to save.', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this testimonial?')) return;
    try {
      await api.delete(`testimonials/${id}/`);
      showToast('Deleted successfully!');
      fetchAll();
    } catch { showToast('Delete failed.', 'error'); }
  };

  const handleToggleActive = async (item) => {
    try {
      await api.patch(`testimonials/${item.id}/`, { is_active: !item.is_active });
      showToast(item.is_active ? 'Hidden from website' : 'Shown on website');
      fetchAll();
    } catch { showToast('Toggle failed.', 'error'); }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.patch('settings/', settings);
      showToast('Section settings saved!');
      setShowSettingsModal(false);
    } catch { showToast('Failed to save settings.', 'error'); }
    finally { setSavingSettings(false); }
  };

  const displayItems = items.length > 0 ? items : STATIC_TESTIMONIALS;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] px-5 py-3 rounded-xl shadow-lg text-sm font-bold flex items-center gap-2 ${toast.type === 'error' ? 'bg-destructive text-white' : 'bg-green-500 text-white'}`}>
          <iconify-icon icon={toast.type === 'error' ? 'lucide:x-circle' : 'lucide:check-circle'}></iconify-icon>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Client Stories / Testimonials</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage client testimonials shown on the home page.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setShowSettingsModal(true)}
            className="p-2.5 bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/30 rounded-lg shadow-sm transition-all"
            title="Edit Section Titles">
            <iconify-icon icon="lucide:settings" class="text-xl"></iconify-icon>
          </button>
          <button onClick={openAdd}
            className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg hover:bg-primary/90 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
            <iconify-icon icon="lucide:plus" class="text-lg"></iconify-icon>
            Add Testimonial
          </button>
        </div>
      </div>

      {/* Info Banner */}
      {!loading && items.length === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <iconify-icon icon="lucide:info" class="text-amber-600 text-xl shrink-0 mt-0.5"></iconify-icon>
          <div>
            <p className="text-sm font-bold text-amber-700">Showing Default Testimonials</p>
            <p className="text-xs text-amber-600 mt-0.5">No custom testimonials added yet. The website shows 3 built-in static stories. Add your own to override them.</p>
          </div>
        </div>
      )}

      {/* Section Preview */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Section Header Preview</p>
        <span className="text-amber-600 text-xs font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full">{settings.testimonial_section_subtitle}</span>
        <h3 className="text-2xl font-bold text-foreground mt-2">{settings.testimonial_section_title}</h3>
      </div>

      {/* Stats row */}
      {items.length > 0 && (
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-foreground">{items.length}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Total</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-green-500">{items.filter(i => i.is_active).length}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Active</p>
          </div>
          <div className="bg-card border border-border rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-amber-500">{items.length > 0 ? (items.reduce((a, i) => a + i.rating, 0) / items.length).toFixed(1) : '—'}</p>
            <p className="text-xs text-muted-foreground uppercase tracking-widest mt-1">Avg Rating</p>
          </div>
        </div>
      )}

      {/* Cards */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {displayItems.map((item, i) => {
            const isStatic = !item.id;
            return (
              <div key={item.id || item.name}
                className={`relative bg-card border rounded-2xl p-5 pt-14 shadow-sm group transition-all duration-300 ${isStatic ? 'border-dashed border-border/60 opacity-70' : !item.is_active ? 'border-border opacity-50' : 'border-border hover:shadow-md hover:-translate-y-0.5'}`}>

                {/* Avatar */}
                <img
                  src={item.photo_url || `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=C5A059&color=fff&size=96`}
                  alt={item.name}
                  className="w-16 h-16 rounded-full object-cover absolute -top-8 left-5 border-4 border-card shadow-md"
                  onError={(e) => { e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(item.name)}&background=C5A059&color=fff&size=96`; }}
                />

                {isStatic && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Default</span>
                )}

                {!isStatic && (
                  <div className="absolute top-3 right-3 flex items-center gap-1.5">
                    {/* Active Toggle */}
                    <button onClick={() => handleToggleActive(item)}
                      className={`p-1.5 rounded-lg border text-xs transition-all ${item.is_active ? 'text-green-600 border-green-200 hover:bg-green-50' : 'text-muted-foreground border-border hover:bg-muted'}`}
                      title={item.is_active ? 'Hide from website' : 'Show on website'}>
                      <iconify-icon icon={item.is_active ? 'lucide:eye' : 'lucide:eye-off'}></iconify-icon>
                    </button>
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      <button onClick={() => openEdit(item)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg border border-border/50 text-xs">
                        <iconify-icon icon="lucide:pencil"></iconify-icon>
                      </button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg border border-border/50 text-xs">
                        <iconify-icon icon="lucide:trash-2"></iconify-icon>
                      </button>
                    </div>
                  </div>
                )}

                <div className="mb-2">
                  <h4 className="text-base font-bold text-foreground">{item.name}</h4>
                  <p className="text-xs text-amber-600 font-medium">{item.role}</p>
                </div>

                {/* Stars */}
                <div className="flex gap-0.5 mb-3">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <iconify-icon key={j} icon="material-symbols:star"
                      class={`text-sm ${j < item.rating ? 'text-amber-400' : 'text-border'}`}></iconify-icon>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground leading-relaxed italic">{item.review}</p>

                {!isStatic && (
                  <div className="mt-3 pt-3 border-t border-border flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    <span className={item.is_active ? 'text-green-500' : 'text-muted-foreground'}>
                      {item.is_active ? '● Visible' : '○ Hidden'}
                    </span>
                    <span>Order: {item.order}</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add Card */}
          <button onClick={openAdd}
            className="border-2 border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 min-h-[180px]">
            <iconify-icon icon="lucide:plus-circle" class="text-3xl"></iconify-icon>
            <span className="text-xs font-bold uppercase tracking-widest">Add Testimonial</span>
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">{editingItem ? 'Edit Testimonial' : 'Add Testimonial'}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Client Name *</label>
                  <input type="text" required value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="e.g. Amit Sharma" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Role / Type *</label>
                  <input type="text" required value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="e.g. Residential Client" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Photo URL (optional)</label>
                <div className="flex gap-2 items-center">
                  <input type="url" value={formData.photo_url}
                    onChange={(e) => setFormData({...formData, photo_url: e.target.value})}
                    className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="https://..." />
                  {formData.photo_url && (
                    <img src={formData.photo_url} alt="" className="w-12 h-12 rounded-full object-cover border border-border shrink-0"
                      onError={(e) => e.target.style.display = 'none'} />
                  )}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 ml-1">Leave empty to auto-generate avatar from name</p>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Rating</label>
                <StarRating value={formData.rating} onChange={(v) => setFormData({...formData, rating: v})} />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Review Text *</label>
                <textarea required rows="4" value={formData.review}
                  onChange={(e) => setFormData({...formData, review: e.target.value})}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="What the client said about our work..."></textarea>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Display Order</label>
                  <input type="number" min="0" value={formData.order}
                    onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
                </div>
                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <div onClick={() => setFormData({...formData, is_active: !formData.is_active})}
                      className={`relative w-12 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-green-500' : 'bg-border'}`}>
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${formData.is_active ? 'translate-x-7' : 'translate-x-1'}`}></div>
                    </div>
                    <span className="text-sm font-medium text-foreground">Visible on site</span>
                  </label>
                </div>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-border text-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-muted transition-all">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2">
                  {saving && <iconify-icon icon="lucide:loader-2" class="animate-spin"></iconify-icon>}
                  {editingItem ? 'Update' : 'Add Testimonial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Settings Modal */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowSettingsModal(false)}></div>
          <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-foreground">Section Settings</h3>
                <p className="text-xs text-muted-foreground mt-0.5">Edit the "Client Stories" section headings</p>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="text-muted-foreground hover:text-foreground">
                <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
              </button>
            </div>
            <form onSubmit={handleSaveSettings} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Badge Subtitle</label>
                <input type="text" value={settings.testimonial_section_subtitle}
                  onChange={(e) => setSettings({...settings, testimonial_section_subtitle: e.target.value})}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="e.g. CLIENT STORIES" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Main Heading</label>
                <input type="text" value={settings.testimonial_section_title}
                  onChange={(e) => setSettings({...settings, testimonial_section_title: e.target.value})}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="e.g. Words of Trust" />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowSettingsModal(false)}
                  className="flex-1 py-3 border border-border text-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-muted transition-all">Cancel</button>
                <button type="submit" disabled={savingSettings}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2">
                  {savingSettings && <iconify-icon icon="lucide:loader-2" class="animate-spin"></iconify-icon>}
                  Save Settings
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminTestimonials;
