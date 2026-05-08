import React, { useState, useEffect } from 'react';
import api from '../../api/api';

const STATIC_STEPS = [
  { title: 'Consultation', description: 'Tell us about your space, style, and installation requirements.', icon: 'lucide:phone-call' },
  { title: 'Site Visit', description: 'We inspect the area carefully and take accurate measurements.', icon: 'lucide:ruler' },
  { title: 'Quotation', description: 'Receive a clear and transparent estimate with no hidden surprises.', icon: 'lucide:file-text' },
  { title: 'Installation', description: 'Our skilled team executes the work with precision and clean finishing.', icon: 'lucide:hammer' },
  { title: 'Final Handover', description: 'We complete the final review and deliver a polished finished space.', icon: 'lucide:badge-check' },
];

function AdminOurProcess() {
  const [steps, setSteps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [editingStep, setEditingStep] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingSettings, setSavingSettings] = useState(false);
  const [toast, setToast] = useState(null);

  const [formData, setFormData] = useState({ title: '', description: '', icon: 'lucide:circle', order: 0 });
  const [settings, setSettings] = useState({
    process_section_subtitle: 'Our Process',
    process_section_title: 'A Refined Journey From Concept to Completion',
    process_section_description: 'Every project is handled with thoughtful planning, premium craftsmanship, and a seamless execution process.',
  });

  useEffect(() => { fetchAll(); }, []);

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [stepsRes, settingsRes] = await Promise.allSettled([
        api.get('our-process/'),
        api.get('settings/')
      ]);
      if (stepsRes.status === 'fulfilled') setSteps(stepsRes.value.data);
      if (settingsRes.status === 'fulfilled') {
        const d = settingsRes.value.data;
        setSettings({
          process_section_subtitle: d.process_section_subtitle || 'Our Process',
          process_section_title: d.process_section_title || 'A Refined Journey From Concept to Completion',
          process_section_description: d.process_section_description || '',
        });
      }
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const openAdd = () => {
    setEditingStep(null);
    setFormData({ title: '', description: '', icon: 'lucide:circle', order: steps.length });
    setShowModal(true);
  };

  const openEdit = (step) => {
    setEditingStep(step);
    setFormData({ title: step.title, description: step.description, icon: step.icon || 'lucide:circle', order: step.order || 0 });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editingStep) {
        await api.patch(`our-process/${editingStep.id}/`, formData);
        showToast('Step updated successfully!');
      } else {
        await api.post('our-process/', formData);
        showToast('Step added successfully!');
      }
      setShowModal(false);
      fetchAll();
    } catch { showToast('Failed to save step.', 'error'); }
    finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this process step?')) return;
    try {
      await api.delete(`our-process/${id}/`);
      showToast('Step deleted!');
      fetchAll();
    } catch { showToast('Delete failed.', 'error'); }
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

  const displaySteps = steps.length > 0 ? steps : STATIC_STEPS;

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
          <h2 className="text-2xl font-heading font-bold text-foreground">Our Process</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage the step-by-step process shown on the home page.</p>
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
            Add Step
          </button>
        </div>
      </div>

      {/* Info Banner */}
      {!loading && steps.length === 0 && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <iconify-icon icon="lucide:info" class="text-amber-600 text-xl shrink-0 mt-0.5"></iconify-icon>
          <div>
            <p className="text-sm font-bold text-amber-700">Showing Default Steps</p>
            <p className="text-xs text-amber-600 mt-0.5">No custom steps added yet. The website shows 5 built-in default steps. Add your own to override them.</p>
          </div>
        </div>
      )}

      {/* Section Preview */}
      <div className="bg-card border border-border rounded-2xl p-6">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-3">Section Header Preview</p>
        <span className="text-amber-600 text-xs font-bold uppercase tracking-widest bg-amber-500/10 px-3 py-1 rounded-full">{settings.process_section_subtitle}</span>
        <h3 className="text-2xl font-bold text-foreground mt-2">{settings.process_section_title}</h3>
        {settings.process_section_description && (
          <p className="text-sm text-muted-foreground mt-1 max-w-xl">{settings.process_section_description}</p>
        )}
      </div>

      {/* Step Cards */}
      {loading ? (
        <div className="flex justify-center py-16">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {displaySteps.map((step, i) => {
            const isStatic = !step.id;
            return (
              <div key={step.id || step.title}
                className={`relative bg-card border rounded-2xl p-5 shadow-sm group transition-all duration-300 ${isStatic ? 'border-dashed border-border/60 opacity-70' : 'border-border hover:shadow-md hover:-translate-y-0.5'}`}>
                {/* Step Number Badge */}
                <span className="absolute top-4 left-4 w-6 h-6 rounded-full bg-amber-500/20 text-amber-600 text-[10px] font-bold flex items-center justify-center">
                  {i + 1}
                </span>

                {isStatic && (
                  <span className="absolute top-3 right-3 text-[9px] font-bold uppercase tracking-widest bg-muted text-muted-foreground px-2 py-0.5 rounded-full">Default</span>
                )}
                {!isStatic && (
                  <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => openEdit(step)} className="p-1.5 text-primary hover:bg-primary/10 rounded-lg border border-border/50">
                      <iconify-icon icon="lucide:pencil"></iconify-icon>
                    </button>
                    <button onClick={() => handleDelete(step.id)} className="p-1.5 text-destructive hover:bg-destructive/10 rounded-lg border border-border/50">
                      <iconify-icon icon="lucide:trash-2"></iconify-icon>
                    </button>
                  </div>
                )}

                <div className="w-12 h-12 rounded-full border border-amber-100 bg-amber-500/10 flex items-center justify-center mb-4 mt-4">
                  <iconify-icon icon={step.icon || 'lucide:circle'} class="text-xl text-amber-600"></iconify-icon>
                </div>
                <h4 className="text-base font-bold text-foreground mb-1">{step.title}</h4>
                <p className="text-xs text-muted-foreground leading-relaxed">{step.description}</p>
                {!isStatic && (
                  <div className="mt-3 pt-3 border-t border-border flex justify-between text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
                    <span>Icon: {step.icon}</span>
                    <span>Order: {step.order}</span>
                  </div>
                )}
              </div>
            );
          })}

          {/* Add New Card */}
          <button onClick={openAdd}
            className="border-2 border-dashed border-border rounded-2xl p-5 flex flex-col items-center justify-center gap-3 text-muted-foreground hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-300 min-h-[160px]">
            <iconify-icon icon="lucide:plus-circle" class="text-3xl"></iconify-icon>
            <span className="text-xs font-bold uppercase tracking-widest">Add New Step</span>
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-md" onClick={() => setShowModal(false)}></div>
          <div className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">{editingStep ? 'Edit Step' : 'Add New Step'}</h3>
              <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Step Title *</label>
                <input type="text" required value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="e.g. Consultation" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Description *</label>
                <textarea required rows="3" value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Brief description of this step..."></textarea>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Icon (Iconify)</label>
                <div className="flex gap-2">
                  <input type="text" value={formData.icon}
                    onChange={(e) => setFormData({...formData, icon: e.target.value})}
                    className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                    placeholder="e.g. lucide:phone-call" />
                  <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-600 border border-amber-200 shrink-0">
                    <iconify-icon icon={formData.icon || 'lucide:circle'} class="text-xl"></iconify-icon>
                  </div>
                </div>
                <p className="text-[10px] text-muted-foreground mt-1 ml-1">Browse at <a href="https://icon-sets.iconify.design" target="_blank" rel="noreferrer" className="text-primary underline">iconify.design</a></p>
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Display Order</label>
                <input type="number" min="0" value={formData.order}
                  onChange={(e) => setFormData({...formData, order: parseInt(e.target.value)})}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all" />
              </div>
              <div className="pt-2 flex gap-3">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-border text-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-muted transition-all">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-primary/90 transition-all shadow-lg flex items-center justify-center gap-2">
                  {saving && <iconify-icon icon="lucide:loader-2" class="animate-spin"></iconify-icon>}
                  {editingStep ? 'Update Step' : 'Add Step'}
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
                <p className="text-xs text-muted-foreground mt-0.5">Edit the heading of "Our Process" section</p>
              </div>
              <button onClick={() => setShowSettingsModal(false)} className="text-muted-foreground hover:text-foreground">
                <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
              </button>
            </div>
            <form onSubmit={handleSaveSettings} className="p-6 space-y-4">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Badge Subtitle</label>
                <input type="text" value={settings.process_section_subtitle}
                  onChange={(e) => setSettings({...settings, process_section_subtitle: e.target.value})}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="e.g. Our Process" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Main Heading</label>
                <input type="text" value={settings.process_section_title}
                  onChange={(e) => setSettings({...settings, process_section_title: e.target.value})}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all"
                  placeholder="e.g. A Refined Journey From Concept to Completion" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Description Paragraph</label>
                <textarea rows="3" value={settings.process_section_description}
                  onChange={(e) => setSettings({...settings, process_section_description: e.target.value})}
                  className="w-full px-4 py-3 bg-muted border border-border rounded-xl text-foreground focus:ring-2 focus:ring-primary/20 outline-none transition-all resize-none"
                  placeholder="Brief intro text below the heading..."></textarea>
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

export default AdminOurProcess;
