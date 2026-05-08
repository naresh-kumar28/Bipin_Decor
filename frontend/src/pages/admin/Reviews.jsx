import React, { useState, useEffect } from 'react';
import api from '../../api/api';

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      const response = await api.get('project-reviews/');
      setReviews(response.data);
    } catch (err) {
      console.error("Failed to fetch reviews", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this review? This will not affect the project rating unless recalculated.')) {
      try {
        await api.delete(`project-reviews/${id}/`);
        setReviews(reviews.filter(r => r.id !== id));
        if (selectedReview?.id === id) setSelectedReview(null);
      } catch (err) {
        console.error("Failed to delete review", err);
      }
    }
  };

  const filteredReviews = reviews.filter(rev => 
    rev.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    rev.comment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-card p-4 rounded-2xl border border-border shadow-sm">
        <div className="relative flex-1 max-w-md">
          <iconify-icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></iconify-icon>
          <input 
            type="text" 
            placeholder="Search by name, project or comment..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span className="font-bold text-foreground">{filteredReviews.length}</span> Reviews Found
        </div>
      </div>

      {/* Reviews Table */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Client</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Project</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Rating</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Comment</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Date</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  </td>
                </tr>
              ) : filteredReviews.length > 0 ? (
                filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-muted/30 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground">{rev.user_name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-primary">{rev.project_title}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex text-amber-400 text-xs">
                        {[...Array(5)].map((_, i) => (
                          <iconify-icon key={i} icon={i < rev.rating ? "material-symbols:star" : "material-symbols:star-outline"}></iconify-icon>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-xs text-muted-foreground line-clamp-1 max-w-[200px]" title={rev.comment}>
                        {rev.comment}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => setSelectedReview(rev)}
                          className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors border border-transparent hover:border-primary/20"
                          title="View Details"
                        >
                          <iconify-icon icon="lucide:eye" class="text-lg"></iconify-icon>
                        </button>
                        <button 
                          onClick={() => handleDelete(rev.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-transparent hover:border-destructive/20"
                          title="Delete Review"
                        >
                          <iconify-icon icon="lucide:trash-2" class="text-lg"></iconify-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-muted-foreground">
                    No reviews found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Details Modal */}
      {selectedReview && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedReview(null)}></div>
          <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl animate-scale-in border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Review Details</h3>
              <button onClick={() => setSelectedReview(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Client Name</label>
                  <p className="text-lg font-bold text-foreground">{selectedReview.user_name}</p>
                </div>
                <div className="text-right">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Rating Given</label>
                  <div className="flex text-amber-400 text-lg">
                    {[...Array(5)].map((_, i) => (
                      <iconify-icon key={i} icon={i < selectedReview.rating ? "material-symbols:star" : "material-symbols:star-outline"}></iconify-icon>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Design Reviewed</label>
                <p className="text-md font-semibold text-primary">{selectedReview.project_title}</p>
              </div>

              <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Review Comment</label>
                <p className="text-sm text-foreground leading-relaxed italic">
                  "{selectedReview.comment}"
                </p>
              </div>

              <div className="flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-widest pt-2">
                <span>ID: #{selectedReview.id}</span>
                <span>Submitted: {new Date(selectedReview.created_at).toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 bg-muted/30 border-t border-border flex justify-end gap-3">
              <button 
                onClick={() => setSelectedReview(null)}
                className="px-6 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground transition-colors"
              >
                Close
              </button>
              <button 
                onClick={() => handleDelete(selectedReview.id)}
                className="px-6 py-2 bg-destructive/10 text-destructive text-xs font-bold uppercase tracking-widest rounded-lg hover:bg-destructive transition-all hover:text-white"
              >
                Delete Forever
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Reviews;
