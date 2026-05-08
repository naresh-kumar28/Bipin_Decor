import React, { useState, useEffect } from 'react';
import api from '../../api/api';

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Settings Edit States
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [settingsData, setSettingsData] = useState({
    category_section_subtitle: '',
    category_section_title: ''
  });
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await api.get('settings/');
      setSettingsData({
        category_section_subtitle: response.data.category_section_subtitle || 'Explore Spaces',
        category_section_title: response.data.category_section_title || 'Design by Category'
      });
    } catch (err) {
      console.error("Failed to fetch settings", err);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('categories/');
      setCategories(response.data);
    } catch (err) {
      console.error("Failed to fetch categories", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (category = null) => {
    if (category) {
      setEditingCategory(category);
      setFormData({
        name: category.name,
        description: category.description || '',
        image: null
      });
      setImagePreview(category.image);
    } else {
      setEditingCategory(null);
      setFormData({
        name: '',
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
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editingCategory) {
        const response = await api.put(`categories/${editingCategory.id}/`, data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setCategories(categories.map(c => c.id === editingCategory.id ? response.data : c));
      } else {
        const response = await api.post('categories/', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setCategories([response.data, ...categories]);
      }
      setIsModalOpen(false);
    } catch (err) {
      setError(err.response?.data?.name || "Failed to save category. Make sure the name is unique.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this category?")) {
      try {
        await api.delete(`categories/${id}/`);
        setCategories(categories.filter(c => c.id !== id));
      } catch (err) {
        alert("Failed to delete category.");
      }
    }
  };

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    try {
      const formData = new FormData();
      formData.append('category_section_subtitle', settingsData.category_section_subtitle);
      formData.append('category_section_title', settingsData.category_section_title);

      await api.patch('settings/', formData);
      setIsSettingsModalOpen(false);
      // Refresh to ensure site-wide updates
      window.location.reload(); 
    } catch (err) {
      console.error("Failed to save category settings", err);
      const errorMsg = err.response?.data ? JSON.stringify(err.response.data) : "Failed to save settings. Please try again.";
      alert(errorMsg);
    } finally {
      setIsSavingSettings(false);
    }
  };

  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Service Categories</h2>
          <p className="text-muted-foreground text-sm mt-1">Organize your services and portfolio into groups.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsSettingsModalOpen(true)}
            className="p-2.5 bg-card border border-border text-muted-foreground hover:text-primary hover:border-primary/30 rounded-lg shadow-sm transition-all"
            title="Section Titles Settings"
          >
            <iconify-icon icon="lucide:settings" class="text-xl"></iconify-icon>
          </button>
          <button 
            onClick={() => handleOpenModal()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg shadow-md hover:bg-secondary font-medium text-sm flex items-center gap-2 transition-all transform hover:-translate-y-1"
          >
            <iconify-icon icon="lucide:plus"></iconify-icon>
            Add Category
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-card rounded-xl border border-border p-4 shadow-sm animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <div className="relative w-full md:w-80">
          <iconify-icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></iconify-icon>
          <input 
            type="text" 
            placeholder="Search category name..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" 
          />
        </div>
      </div>

      {/* Data Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <iconify-icon icon="lucide:loader-2" class="text-4xl text-primary animate-spin"></iconify-icon>
          <p className="text-muted-foreground mt-4 font-medium">Fetching categories...</p>
        </div>
      ) : filteredCategories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '0.2s' }}>
          {filteredCategories.map((category) => (
            <div key={category.id} className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity z-50">
                <button 
                  onClick={() => handleOpenModal(category)}
                  className="p-2 bg-background w-10 h-10 rounded-full border border-border text-muted-foreground hover:text-primary hover:border-primary/30 rounded-lg transition-all"
                  title="Edit"
                >
                  <iconify-icon icon="lucide:edit-3"></iconify-icon>
                </button>
                <button 
                  onClick={() => handleDelete(category.id)}
                  className="p-2 bg-background w-10 h-10 rounded-full border border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 rounded-lg transition-all"
                  title="Delete"
                >
                  <iconify-icon icon="lucide:trash-2"></iconify-icon>
                </button>
              </div>
              
              <div className="flex flex-col h-full">
                <div className="w-full h-40 bg-muted rounded-xl overflow-hidden mb-4 transition-transform group-hover:scale-[1.02]">
                  {category.image ? (
                    <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/30">
                      <iconify-icon icon="lucide:grid-3x3" class="text-4xl"></iconify-icon>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">{category.name}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 flex-grow">
                  {category.description || 'No description provided.'}
                </p>
                <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  <span>Slug: {category.slug}</span>
                  <span>ID: #{category.id}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-card rounded-2xl border border-dashed border-border py-20 flex flex-col items-center justify-center animate-fade-in">
          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
            <iconify-icon icon="lucide:grid-3x3" class="text-3xl text-muted-foreground"></iconify-icon>
          </div>
          <h3 className="text-xl font-bold text-foreground">No Categories Found</h3>
          <p className="text-muted-foreground mt-2">Start by adding your first service category.</p>
          <button 
            onClick={() => handleOpenModal()}
            className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-secondary transition-all"
          >
            Add New Category
          </button>
        </div>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="bg-card border border-border w-full max-w-lg rounded-2xl shadow-2xl z-10 overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="text-xl font-bold text-foreground">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-muted-foreground hover:text-foreground p-1">
                <iconify-icon icon="lucide:x" class="text-2xl"></iconify-icon>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {error && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg flex items-center gap-2">
                  <iconify-icon icon="lucide:alert-circle"></iconify-icon>
                  {error}
                </div>
              )}
              
              <div>
                <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">Category Image</label>
                <div className="flex flex-col gap-4">
                  {imagePreview && (
                    <div className="w-full h-48 rounded-xl overflow-hidden border border-border relative group">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <label htmlFor="category-image" className="cursor-pointer bg-white text-black px-4 py-2 rounded-lg font-bold text-sm shadow-lg">Change Image</label>
                      </div>
                    </div>
                  )}
                  <div className={imagePreview ? 'hidden' : 'block'}>
                    <label 
                      htmlFor="category-image"
                      className="w-full h-48 border-2 border-dashed border-border rounded-xl flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition-all"
                    >
                      <iconify-icon icon="lucide:image-plus" class="text-4xl text-muted-foreground"></iconify-icon>
                      <span className="text-sm font-medium text-muted-foreground">Click to upload image</span>
                    </label>
                  </div>
                  <input 
                    id="category-image"
                    type="file" 
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">Category Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="e.g. PVC Wall Panels"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">Description (Optional)</label>
                <textarea 
                  rows="4"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all resize-none"
                  placeholder="Describe what services fall under this category..."
                ></textarea>
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-muted text-foreground font-bold rounded-xl hover:bg-border transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="flex-1 py-3 px-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-secondary transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSubmitting && <iconify-icon icon="lucide:loader-2" class="animate-spin"></iconify-icon>}
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Category Section Titles Settings Modal */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsSettingsModalOpen(false)}></div>
          <div className="bg-card border border-border w-full max-w-md rounded-2xl shadow-2xl z-10 overflow-hidden animate-fade-in">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between bg-muted/30">
              <h3 className="text-xl font-bold text-foreground">Section Title Settings</h3>
              <button onClick={() => setIsSettingsModalOpen(false)} className="text-muted-foreground hover:text-foreground p-1">
                <iconify-icon icon="lucide:x" class="text-2xl"></iconify-icon>
              </button>
            </div>
            
            <form onSubmit={handleSaveSettings} className="p-6 space-y-5">
              <p className="text-xs text-muted-foreground italic mb-2">Update the titles shown in the "Category" section on the Home page.</p>
              
              <div>
                <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">Section Subtitle (Top)</label>
                <input 
                  type="text" 
                  value={settingsData.category_section_subtitle}
                  onChange={(e) => setSettingsData({...settingsData, category_section_subtitle: e.target.value})}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="e.g. Explore Spaces"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-foreground mb-2 uppercase tracking-wider">Main Section Title</label>
                <input 
                  type="text" 
                  value={settingsData.category_section_title}
                  onChange={(e) => setSettingsData({...settingsData, category_section_title: e.target.value})}
                  className="w-full px-4 py-3 bg-background border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
                  placeholder="e.g. Design by Category"
                  required
                />
              </div>

              <div className="pt-4 flex gap-3">
                <button 
                  type="button" 
                  onClick={() => setIsSettingsModalOpen(false)}
                  className="flex-1 py-3 px-4 bg-muted text-foreground font-bold rounded-xl hover:bg-border transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isSavingSettings}
                  className="flex-1 py-3 px-4 bg-primary text-primary-foreground font-bold rounded-xl shadow-lg hover:bg-secondary transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isSavingSettings && <iconify-icon icon="lucide:loader-2" class="animate-spin"></iconify-icon>}
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Categories;
