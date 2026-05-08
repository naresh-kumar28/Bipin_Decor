import React, { useState, useEffect } from 'react';
import api from '../../api/api';

function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const response = await api.get('bookings/');
      setBookings(response.data);
    } catch (err) {
      console.error("Failed to fetch bookings", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const response = await api.patch(`bookings/${id}/`, { status: newStatus });
      setBookings(bookings.map(b => b.id === id ? response.data : b));
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      try {
        await api.delete(`bookings/${id}/`);
        setBookings(bookings.filter(b => b.id !== id));
      } catch (err) {
        console.error("Failed to delete booking", err);
      }
    }
  };

  const filteredBookings = bookings.filter(b => 
    filterStatus === 'all' || b.status.toLowerCase() === filterStatus.toLowerCase()
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-heading font-bold text-foreground">Consultation Bookings</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage site visit requests and appointments.</p>
        </div>
        <div className="flex bg-muted p-1 rounded-xl">
          {['all', 'Pending', 'Confirmed', 'Cancelled'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                filterStatus === status ? 'bg-primary text-primary-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredBookings.length > 0 ? (
        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-muted/50 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Customer & Site</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Appointment</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Service</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 font-bold text-[10px] uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {filteredBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-foreground">{booking.full_name}</p>
                      <p className="text-[10px] text-muted-foreground font-medium">{booking.email}</p>
                      <p className="text-[10px] text-muted-foreground">{booking.phone}</p>
                      <p className="text-[10px] text-muted-foreground mt-1 flex items-center gap-1">
                        <iconify-icon icon="lucide:map-pin"></iconify-icon>
                        {booking.address}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-foreground">{new Date(booking.consultation_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      <p className="text-[10px] font-bold text-primary uppercase">{booking.consultation_time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-muted rounded-md text-[10px] font-medium text-foreground">
                        {booking.service_name || 'General Consultation'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select 
                        value={booking.status}
                        onChange={(e) => handleUpdateStatus(booking.id, e.target.value)}
                        className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border-none outline-none cursor-pointer ${
                          booking.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                          booking.status === 'Confirmed' ? 'bg-emerald-100 text-emerald-700' :
                          'bg-red-100 text-red-700'
                        }`}
                      >
                        <option value="Pending">Pending</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button 
                        onClick={() => handleDelete(booking.id)}
                        className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                        title="Delete Booking"
                      >
                        <iconify-icon icon="lucide:trash-2" class="text-lg"></iconify-icon>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="text-center py-20 bg-muted/30 rounded-2xl border-2 border-dashed border-border">
          <iconify-icon icon="lucide:calendar-x" class="text-5xl text-muted-foreground/20 mb-4"></iconify-icon>
          <h3 className="text-lg font-bold text-foreground">No bookings found</h3>
          <p className="text-muted-foreground text-sm">Appointments scheduled via the website will appear here.</p>
        </div>
      )}
    </div>
  );
}

export default AdminBookings;
