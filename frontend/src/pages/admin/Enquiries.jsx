import React, { useState, useEffect } from 'react';
import api from '../../api/api';
import { useAdmin } from '../../context/AdminContext';

const WhatsAppSVG = ({ className = "w-5 h-5" }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .018 5.393 0 12.03c0 2.12.556 4.188 1.613 6.012L0 24l6.117-1.605a11.81 11.81 0 005.925 1.597h.005c6.632 0 12.032-5.391 12.035-12.031a11.817 11.817 0 00-3.517-8.489"/>
  </svg>
);

function Enquiries() {
  const { refreshStats } = useAdmin();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('project-requests/');
        setRequests(response.data);
      } catch (err) {
        console.error("Failed to fetch requests", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.patch(`project-requests/${id}/`, { status: newStatus });
      setRequests(requests.map(r => r.id === id ? { ...r, status: newStatus } : r));
      refreshStats();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this request?')) {
      try {
        await api.delete(`project-requests/${id}/`);
        setRequests(requests.filter(r => r.id !== id));
        if (selectedRequest?.id === id) setSelectedRequest(null);
        refreshStats();
      } catch (err) {
        console.error("Failed to delete request", err);
      }
    }
  };

  const filteredRequests = requests.filter(r => 
    r.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.project_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.user_phone.includes(searchTerm)
  );

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'contacted': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Customer Requests</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage leads from the Portfolio "Request this Design" feature.</p>
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border p-4 shadow-sm">
        <div className="relative w-full md:w-80">
          <iconify-icon icon="lucide:search" class="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"></iconify-icon>
          <input 
            type="text" 
            placeholder="Search name, phone, or design..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary transition-all" 
          />
        </div>
      </div>

      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-muted/50 text-muted-foreground border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Customer Details</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Requested Design</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px] text-center">Message</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Date</th>
                <th className="px-6 py-4 font-medium uppercase tracking-wider text-[10px]">Status</th>
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
              ) : filteredRequests.length > 0 ? (
                filteredRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground">{req.user_name}</p>
                      <p className="text-[10px] text-muted-foreground uppercase tracking-tight">{req.user_phone}</p>
                      <p className="text-[10px] text-muted-foreground">{req.user_email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {req.project_image && (
                          <a 
                            href={req.project_image} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="w-12 h-12 rounded-lg overflow-hidden border border-border flex-shrink-0 hover:ring-2 hover:ring-primary transition-all shadow-sm"
                          >
                            <img src={req.project_image} alt={req.project_title} className="w-full h-full object-cover" />
                          </a>
                        )}
                        <a 
                          href={req.project_image} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {req.project_title}
                        </a>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                          onClick={() => setSelectedRequest(req)}
                          className="w-9 h-9 rounded-full bg-primary/5 text-primary flex items-center justify-center hover:bg-primary hover:text-white transition-all border border-primary/10 group mx-auto"
                          title="View Message"
                      >
                          <iconify-icon icon="lucide:eye" class="text-lg"></iconify-icon>
                      </button>
                    </td>
                    <td className="px-6 py-4 text-xs text-muted-foreground">
                      {new Date(req.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={req.status}
                        onChange={(e) => handleStatusChange(req.id, e.target.value)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border focus:outline-none ${getStatusColor(req.status)}`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <a 
                          href={`https://wa.me/${req.user_phone.replace(/[^0-9]/g, '')}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors border border-emerald-100 flex items-center justify-center" 
                          title="WhatsApp"
                        >
                          <WhatsAppSVG className="w-4 h-4" />
                        </a>
                        <button 
                          onClick={() => handleDelete(req.id)}
                          className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-destructive/10" 
                          title="Delete"
                        >
                          <iconify-icon icon="lucide:trash-2"></iconify-icon>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-20 text-center text-muted-foreground">
                    No requests found matching your search.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Request Details Modal */}
      {selectedRequest && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSelectedRequest(null)}></div>
          <div className="relative w-full max-w-lg bg-card rounded-2xl shadow-2xl animate-scale-in border border-border overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-xl font-bold text-foreground">Request Details</h3>
              <button onClick={() => setSelectedRequest(null)} className="text-muted-foreground hover:text-foreground transition-colors">
                <iconify-icon icon="lucide:x" class="text-xl"></iconify-icon>
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="flex items-start justify-between">
                <div>
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Customer</label>
                  <p className="text-lg font-bold text-foreground">{selectedRequest.user_name}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.user_phone}</p>
                  <p className="text-sm text-muted-foreground">{selectedRequest.user_email}</p>
                </div>
                <div className="text-right">
                  <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-1">Status</label>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase border ${getStatusColor(selectedRequest.status)}`}>
                    {selectedRequest.status}
                  </span>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Requested Design</label>
                <div className="flex items-center gap-4 p-3 bg-muted/30 rounded-xl border border-border">
                  {selectedRequest.project_image && (
                    <a 
                      href={selectedRequest.project_image} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="w-16 h-16 rounded-lg overflow-hidden border border-border flex-shrink-0"
                    >
                      <img src={selectedRequest.project_image} alt={selectedRequest.project_title} className="w-full h-full object-cover" />
                    </a>
                  )}
                  <div className="flex flex-col">
                    <p className="text-md font-semibold text-foreground">{selectedRequest.project_title}</p>
                    <a 
                      href={selectedRequest.project_image} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs text-primary font-bold hover:underline mt-1 flex items-center gap-1"
                    >
                      <iconify-icon icon="lucide:external-link"></iconify-icon>
                      View Original Design
                    </a>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-muted/50 rounded-xl border border-border">
                <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">Message from Customer</label>
                <p className="text-sm text-foreground leading-relaxed italic">
                  {selectedRequest.message ? `"${selectedRequest.message}"` : "The customer did not leave a specific message."}
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <a 
                  href={`https://wa.me/${selectedRequest.user_phone.replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 py-3 bg-emerald-500 text-white font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-emerald-600 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  <WhatsAppSVG className="w-5 h-5" />
                  Reply on WhatsApp
                </a>
                <button 
                  onClick={() => handleDelete(selectedRequest.id)}
                  className="px-6 py-3 bg-destructive/10 text-destructive font-bold uppercase tracking-widest text-xs rounded-xl hover:bg-destructive hover:text-white transition-all border border-destructive/20"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Enquiries;
