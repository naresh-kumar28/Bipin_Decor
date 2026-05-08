import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const STATIC_ITEMS = [
  { title: 'Experienced Team', description: 'Over a decade of specialized experience in high-end installations and Decor finishing.', icon: 'lucide:award' },
  { title: 'Premium Materials', description: 'We source only the finest quality UV marble, PVC, and WPC materials for lasting beauty.', icon: 'lucide:gem' },
  { title: 'Clean Finishing', description: 'Impeccable attention to detail ensuring seamless joints, perfect alignment, and a flawless look.', icon: 'lucide:check-circle' },
];

const ICON_BG_COLORS = ['bg-indigo-50 group-hover:bg-indigo-600','bg-cyan-50 group-hover:bg-cyan-500','bg-emerald-50 group-hover:bg-emerald-500','bg-amber-50 group-hover:bg-amber-500','bg-violet-50 group-hover:bg-violet-500'];
const ICON_TEXT_COLORS = ['text-indigo-600','text-cyan-600','text-emerald-600','text-amber-600','text-violet-600'];

function AdminWhyChooseUs() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({ title: '', description: '', icon: 'lucide:award', order: 0 });
  const [settings, setSettings] = useState({ why_choose_subtitle: 'Why Choose Us', why_choose_title: 'Craftsmanship Meets Elegance', why_choose_description: '', why_choose_image: null });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [itemsRes, settingsRes] = await Promise.all([api.get('why-choose-us/'), api.get('settings/')]);
      setItems(itemsRes.data);
      const d = settingsRes.data;
      setSettings({
        why_choose_subtitle: d.why_choose_subtitle || 'Why Choose Us',
        why_choose_title: d.why_choose_title || 'Craftsmanship Meets Elegance',
        why_choose_description: d.why_choose_description || '',
        why_choose_image_url: d.why_choose_image_url || null,
      });
      setImagePreview(d.why_choose_image_url || null);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditingItem(null);
    setFormData({ title: '', description: '', icon: 'lucide:award', order: items.length });
    setShowModal(true);
  };

  const openEdit = (item) => {
    setEditingItem(item);
    setFormData({ title: item.title, description: item.description, icon: item.icon || 'lucide:award', order: item.order || 0 });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingItem) {
        await api.patch(`why-choose-us/${editingItem.id}/`, formData);
        showToast('Feature updated!');
      } else {
        await api.post('why-choose-us/', formData);
        showToast('Feature added!');
      }
      setShowModal(false);
      fetchAll();
    } catch { showToast('Failed to save.', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this feature?')) return;
    try {
      await api.delete(`why-choose-us/${id}/`);
      showToast('Deleted successfully!');
      fetchAll();
    } catch { showToast('Delete failed.', 'error'); }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      const fd = new FormData();
      fd.append('why_choose_subtitle', settings.why_choose_subtitle);
      fd.append('why_choose_title', settings.why_choose_title);
      fd.append('why_choose_description', settings.why_choose_description);
      if (imageFile) fd.append('why_choose_image', imageFile);
      await api.patch('settings/', fd);
      showToast('Section settings saved!');
      setShowSettingsModal(false);
      setImageFile(null);
      fetchAll();
    } catch { showToast('Failed to save settings.', 'error'); }
    finally { setSavingSettings(false); }
  };

  const displayItems = items.length > 0 ? items : STATIC_ITEMS;

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-6 right-6 z-[200] px-5 py-3 rounded-xl shadow-lg text-sm font-bold flex items-center gap-2 transition-all ${toast.type === 'error' ? 'bg-destructive text-white' : 'bg-green-500 text-white'}`}>
          <iconify-icon icon={toast.type === 'error' ? 'lucide:x-circle' : 'lucide:check-circle'}></iconify-icon>
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Why Choose Us</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage features shown in the "Why Choose Us" section on the home page.</p>
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
            Add Feature
          </button>
        </div>
      </div>

      {/* Info Banner when using static data */}
      {!loading && items.length === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <iconify-icon icon="lucide:info" class="text-amber-600 text-xl shrink-0 mt-0.5"></iconify-icon>
          <div>
            <p className="text-sm font-bold text-amber-700">Showing Default Items</p>
            <p className="text-xs text-amber-600 mt-0.5">No custom features added yet. The website is showing 3 built-in static items. Add your own to override them.</p>
          </div>
        </div>
      )}

      {/* Section Preview Header */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Section Header Preview</p>
        <div className="flex gap-4 items-start">
          {imagePreview && (
            <img src={imagePreview} alt="Section" className="w-24 h-24 rounded-xl object-cover border border-border shrink-0" />
          )}
          <div>
            <span className="text-amber-600 text-xs font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full">{settings.why_choose_subtitle}</span>
            <h3 className="text-2xl font-bold text-foreground mt-2">{settings.why_choose_title}</h3>
            {settings.why_choose_description && <p className="text-sm text-muted-foreground mt-1 max-w-xl">{settings.why_choose_description}</p>}
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayItems.map((item, i) => {
            const isStatic = !item.id;
            const bgColor = ICON_BG_COLORS[i % ICON_BG_COLORS.length];
            const textColor = ICON_TEXT_COLORS[i % ICON_TEXT_COLORS.length];
            return (
              <div key={item.id || item.title} className={`relative bg-card border rounded-2xl p-5 shadow-sm group transition-all duration-300 ${isStatic ? 'border-dashed border-border/60 opacity-70' : 'border-border hover:shadow-md hover:-translate-y-0.5'}`}>
                {isStatic && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Default</span>
                )}
                {!isStatic && (
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(item)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg border border-border/50 text-xs">
                      <iconify-icon icon="lucide:pencil"></iconify-icon>
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg border border-border/50 text-xs">
                      <iconify-icon icon="lucide:trash-2"></iconify-icon>
                    </button>
                  </div>
                )}
                <div className={`group w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${bgColor} transition-colors duration-300`}>
                  <iconify-icon icon={item.icon || 'lucide:award'} class={`text-xl ${textColor} group-hover:text-white`}></iconify-icon>
                </div>
                <h4 className="text-base font-bold text-foreground mb-1">{item.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                {!isStatic && (
                  <div className="mt-3 pt-3 border-t border-border flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    <span>Icon: {item.icon}</span>
                    <span>Order: {item.order}</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add New Card */}
          <button onClick={openAdd}
            className="border-2 border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 min-h-[160px]">
            <iconify-icon icon="lucide:plus-circle" class="text-3xl"></iconify-icon>
            <span className="text-xs font-bold uppercase tracking-widest">Add New Feature</span>
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">{editingItem ? 'Edit Feature' : 'Add New Feature'}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Title *</label>
                <input type="text" required value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="e.g. Experienced Team" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Description *</label>
                <textarea required rows="3" value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Short description of this feature..."></textarea>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Icon (Iconify)</label>
                <div className="flex gap-2">
                  <input type="text" value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="e.g. lucide:award" />
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20 shrink-0">
                    <iconify-icon icon={formData.icon || 'lucide:award'} class="text-xl"></iconify-icon>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 ml-1">Browse icons at <a href="https://icon-sets.iconify.design" target="_blank" rel="noreferrer" className="text-primary underline">iconify.design</a></p>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Display Order</label>
                <input type="number" min="0" value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-border text-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-muted transition-all">
                  Cancel
                </button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2">
                  {saving && <iconify-icon icon="lucide:loader-2" class="animate-spin"></iconify-icon>}
                  {editingItem ? 'Update' : 'Create'}
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
                <p className="text-xs text-muted-foreground mt-0.5">Edit the heading of "Why Choose Us" section</p>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="text-muted-foreground hover:text-foreground">
                <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
              </button>
            </div>
            <form onSubmit={handleSaveSettings} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Section Image</label>
                <div className="flex gap-4 items-start">
                  <div className="flex-1">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-border rounded-xl cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                      <iconify-icon icon="lucide:upload-cloud" class="text-3xl text-muted-foreground mb-1"></iconify-icon>
                      <span className="text-xs text-muted-foreground">Click to upload image</span>
                      <input type="file" accept="image/*" className="hidden"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setImageFile(file);
                            setImagePreview(URL.createObjectURL(file));
                          }
                        }} />
                    </label>
                  </div>
                  {imagePreview && (
                    <div className="relative shrink-0 group">
                      <img src={imagePreview} alt="Preview" className="w-24 h-24 rounded-xl object-cover border border-border" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none rounded-xl">
                         <span className="bg-white text-foreground px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-wider shadow-lg">Change</span>
                      </div>
                      <button type="button"
                        onClick={() => { setImageFile(null); setImagePreview(settings.why_choose_image_url || null); }}
                        className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center text-[10px] z-10">
                        <iconify-icon icon="lucide:x"></iconify-icon>
                      </button>
                    </div>
                  )}
                </div>
                {imageFile && <p className="text-[10px] text-green-600 mt-1 ml-1">New image selected: {imageFile.name}</p>}
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Badge Subtitle</label>
                <input type="text" value={settings.why_choose_subtitle}
                  onChange={(e) => setSettings({...settings, why_choose_subtitle: e.target.value})}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="e.g. Why Choose Us" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Main Heading</label>
                <input type="text" value={settings.why_choose_title}
                  onChange={(e) => setSettings({...settings, why_choose_title: e.target.value})}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="e.g. Craftsmanship Meets Elegance" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Description Paragraph</label>
                <textarea rows="3" value={settings.why_choose_description}
                  onChange={(e) => setSettings({...settings, why_choose_description: e.target.value})}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Brief intro text below the heading..."></textarea>
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowSettingsModal(false)}
                  className="flex-1 py-3 border border-border text-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-muted transition-all">
                  Cancel
                </button>
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

export default AdminWhyChooseUs;
