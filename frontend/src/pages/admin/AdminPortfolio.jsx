import React, { useState, useEffect } from 'react';
import api from '../../api/api';

function AdminPortfolio() {
  const [projects, setProjects] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [projectsRes, categoriesRes] = await Promise.all([
        api.get('projects/'),
        api.get('categories/')
      ]);
      setProjects(projectsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error("Failed to fetch data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (project = null) => {
    if (project) {
      setEditingProject(project);
      setFormData({
        title: project.title,
        category: project.category,
        description: project.description || '',
        image: null
      });
      setImagePreview(project.image);
    } else {
      setEditingProject(null);
      setFormData({
        title: '',
        category: '',
        description: '',
        image: null
      });
      setImagePreview(null);
    }
    setError('');
    setIsModalOpen(true);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const data = new FormData();
    data.append('title', formData.title);
    data.append('category', formData.category);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingProject) {
        const response = await api.put(`projects/${editingProject.id}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setProjects(projects.map(p => p.id === editingProject.id ? response.data : p));
      } else {
        const response = await api.post('projects/', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setProjects([response.data, ...projects]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError("Failed to save project. Please check all fields.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await api.delete(`projects/${id}/`);
        setProjects(projects.filter(p => p.id !== id));
      } catch (err) {
        console.error("Failed to delete project", err);
      }
    }
  };

  const filteredProjects = projects.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          p.category_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category_slug === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Manage Projects</h2>
          <p className="text-muted-foreground text-sm mt-1">Total {projects.length} designs in gallery.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="px-6 py-2.5 bg-primary text-primary-foreground rounded-xl shadow-lg hover:bg-primary/90 font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all"
        >
          <iconify-icon icon="lucide:plus" class="text-lg"></iconify-icon>
          Add New Design
        </button>
      </div>

      {/* Modern Filter Bar (matching reference image) */}
      <div className="bg-card border border-border rounded-[24px] p-2 flex flex-col md:flex-row items-center gap-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-1 flex-grow">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 font-bold text-[10px] uppercase tracking-widest rounded-[18px] transition-all ${selectedCategory === 'all' ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
          >
            All Projects
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`px-5 py-2.5 font-bold text-[10px] uppercase tracking-widest rounded-[18px] transition-all ${selectedCategory === cat.slug ? 'bg-primary text-primary-foreground shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        <div className="relative w-full md:w-auto md:min-w-[250px] px-2 md:pr-2">
          <iconify-icon icon="lucide:search" class="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground"></iconify-icon>
          <input 
            type="text" 
            placeholder="Search projects..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-muted/30 border border-transparent focus:border-primary/20 rounded-[18px] text-xs outline-none transition-all placeholder:text-muted-foreground/50"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProjects.map((project) => (
            <div key={project.id} className="group bg-card rounded-xl border border-border overflow-hidden shadow-sm hover:shadow-md transition-all relative">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                  <button 
                    onClick={() => handleOpenModal(project)}
                    className="w-10 h-10 rounded-full bg-white text-foreground flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors shadow-lg"
                  >
                    <iconify-icon icon="lucide:pencil"></iconify-icon>
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)}
                    className="w-10 h-10 rounded-full bg-white text-destructive flex items-center justify-center hover:bg-destructive hover:text-white transition-colors shadow-lg"
                  >
                    <iconify-icon icon="lucide:trash-2"></iconify-icon>
                  </button>
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{project.category_name}</span>
                  <div className="flex items-center gap-1 text-[10px] text-amber-500 font-bold uppercase">
                    <iconify-icon icon="material-symbols:star"></iconify-icon> {parseFloat(project.rating).toFixed(1)}
                  </div>
                </div>
                <h3 className="font-heading font-bold text-foreground truncate">{project.title}</h3>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-border">
          <iconify-icon icon="lucide:image-off" class="text-5xl text-muted-foreground/20 mb-4"></iconify-icon>
          <h3 className="text-lg font-bold text-foreground">No designs found</h3>
          <p className="text-muted-foreground text-sm">We couldn't find any projects matching your filters.</p>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl animate-scale-in border border-border">
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h3 className="text-xl font-bold text-foreground">{editingProject ? 'Edit Design' : 'Add New Design'}</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground transition-colors">
                <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Project Image</label>
                <div className="flex flex-col gap-3">
                  {imagePreview && (
                    <div className="w-full h-40 rounded-xl overflow-hidden border border-border relative group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <label htmlFor="p-image" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity text-white text-xs font-bold uppercase">Change Image</label>
                    </div>
                  )}
                  {!imagePreview && (
                    <label htmlFor="p-image" className="w-full h-40 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-primary/5 transition-all">
                      <iconify-icon icon="lucide:image-plus" class="text-3xl text-muted-foreground"></iconify-icon>
                      <span className="text-xs font-bold text-muted-foreground uppercase">Upload Photo</span>
                    </label>
                  )}
                  <input id="p-image" type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Design Title</label>
                  <input 
                    type="text" 
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
                    placeholder="e.g. Modern TV Unit"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Category</label>
                  <select 
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                    className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none"
                  >
                    <option value="" disabled>Select Category</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-muted-foreground mb-1.5 uppercase tracking-widest">Description</label>
                <textarea 
                  rows="3"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-background border border-border rounded-xl text-sm focus:ring-2 focus:ring-primary outline-none resize-none"
                  placeholder="Details about materials used..."
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 bg-muted text-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-muted/80 transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3 bg-primary text-primary-foreground font-bold uppercase tracking-widest text-[10px] rounded-xl hover:bg-secondary transition-all disabled:opacity-50"
                >
                  {isSubmitting ? 'Saving...' : 'Save Design'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AdminPortfolio;
