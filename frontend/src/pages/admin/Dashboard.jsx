import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Helper for relative time
function formatRelativeTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours}h ago`;
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  return date.toLocaleDateString();
}

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('dashboard-stats/');
      setStats(response.data);
    } catch (err) {
      console.error("Failed to fetch dashboard stats", err);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartLabels = stats?.monthly_stats?.map(item => {
    const date = new Date(item.month);
    return date.toLocaleString('default', { month: 'short' });
  }).reverse() || ['May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'];

  const chartValues = stats?.monthly_stats?.map(item => item.count).reverse() || [0, 0, 0, 0, 0, 0];

  const chartData = {
    labels: chartLabels,
    datasets: [
      {
        label: 'Website Enquiries',
        data: chartValues,
        borderColor: '#C5A059',
        backgroundColor: 'rgba(197, 160, 89, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          font: { family: 'Inter', size: 12 },
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { color: 'rgba(0,0,0,0.05)', drawBorder: false },
      },
      x: {
        grid: { display: false, drawBorder: false },
      },
    },
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-6">
        <div className="bg-card rounded-xl p-5 shadow-sm border border-border flex items-start justify-between transition-transform hover:scale-[1.02]">
          <div>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Total Enquiries</p>
            <h3 className="text-2xl font-heading font-bold text-foreground">{stats?.stats?.total_enquiries || 0}</h3>
            <p className="text-xs font-medium mt-2 flex items-center gap-1 text-emerald-500">
              Live from website
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            <iconify-icon icon="lucide:message-square" class="text-xl"></iconify-icon>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-sm border border-border flex items-start justify-between transition-transform hover:scale-[1.02]">
          <div>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Bookings</p>
            <h3 className="text-2xl font-heading font-bold text-foreground">{stats?.stats?.total_bookings || 0}</h3>
            <p className="text-xs font-medium mt-2 flex items-center gap-1 text-blue-500">
              Site visits
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-600">
            <iconify-icon icon="lucide:calendar" class="text-xl"></iconify-icon>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-sm border border-border flex items-start justify-between transition-transform hover:scale-[1.02]">
          <div>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Pending Actions</p>
            <h3 className="text-2xl font-heading font-bold text-foreground">
              {(stats?.stats?.pending_enquiries || 0) + (stats?.stats?.pending_bookings || 0)}
            </h3>
            <p className="text-xs font-medium mt-2 flex items-center gap-1 text-primary">
              Needs attention
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-600">
            <iconify-icon icon="lucide:clock" class="text-xl"></iconify-icon>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-sm border border-border flex items-start justify-between transition-transform hover:scale-[1.02]">
          <div>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Total Projects</p>
            <h3 className="text-2xl font-heading font-bold text-foreground">{stats?.stats?.total_projects || 0}</h3>
            <p className="text-xs font-medium mt-2 flex items-center gap-1 text-indigo-500">
              In gallery
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-600">
            <iconify-icon icon="lucide:layout" class="text-xl"></iconify-icon>
          </div>
        </div>

        <div className="bg-card rounded-xl p-5 shadow-sm border border-border flex items-start justify-between transition-transform hover:scale-[1.02]">
          <div>
            <p className="text-muted-foreground text-[10px] font-bold uppercase tracking-widest mb-1">Total Reviews</p>
            <h3 className="text-2xl font-heading font-bold text-foreground">{stats?.stats?.total_reviews || 0}</h3>
            <p className="text-xs font-medium mt-2 flex items-center gap-1 text-emerald-500">
              Client feedback
            </p>
          </div>
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-600">
            <iconify-icon icon="material-symbols:star" class="text-xl"></iconify-icon>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-card rounded-xl border border-border shadow-sm lg:col-span-2 p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-heading font-semibold text-foreground">Enquiry Trends</h3>
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Last 6 Months</span>
          </div>
          <div className="h-64 w-full">
            <Line data={chartData} options={chartOptions} />
          </div>
        </div>

        <div className="bg-card rounded-xl border border-border shadow-sm p-5 flex flex-col">
          <h3 className="font-heading font-semibold text-foreground mb-4">Quick Actions</h3>
          <div className="space-y-3 flex-1">
            <Link to="/admin/bookings" className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group">
              <div className="w-8 h-8 rounded bg-blue-500/10 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
                <iconify-icon icon="lucide:calendar"></iconify-icon>
              </div>
              <div>
                <p className="font-bold text-xs text-foreground uppercase tracking-wider">Manage Bookings</p>
                <p className="text-[10px] text-muted-foreground">Site visit appointments</p>
              </div>
            </Link>
            <Link to="/admin/portfolio" className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group">
              <div className="w-8 h-8 rounded bg-indigo-500/10 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                <iconify-icon icon="lucide:image"></iconify-icon>
              </div>
              <div>
                <p className="font-bold text-xs text-foreground uppercase tracking-wider">Add Project</p>
                <p className="text-[10px] text-muted-foreground">Upload gallery work</p>
              </div>
            </Link>
            <Link to="/admin/enquiries" className="w-full flex items-center gap-3 p-3 rounded-lg border border-border hover:border-primary hover:bg-primary/5 transition-all text-left group">
              <div className="w-8 h-8 rounded bg-emerald-500/10 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <iconify-icon icon="lucide:message-circle"></iconify-icon>
              </div>
              <div>
                <p className="font-bold text-xs text-foreground uppercase tracking-wider">New Enquiries</p>
                <p className="text-[10px] text-muted-foreground">Respond to clients</p>
              </div>
            </Link>
          </div>
        </div>
      </div>

      {/* Tables Section - Styled according to Reference */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recent Enquiries Table (Reference Style) */}
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Recent Enquiries</h3>
            <Link to="/admin/enquiries" className="text-sm font-bold text-primary hover:underline">View All</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-muted/30 text-muted-foreground">
                <tr>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Customer</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Service</th>
                  <th className="px-6 py-4 text-[11px] font-bold uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {stats?.recent_enquiries?.length > 0 ? (
                  stats.recent_enquiries.map((enquiry) => (
                    <tr key={enquiry.id} className="hover:bg-muted/20 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-bold text-sm text-foreground">{enquiry.user_name}</p>
                        <p className="text-[11px] text-muted-foreground mt-0.5">{formatRelativeTime(enquiry.created_at)}</p>
                      </td>
                      <td className="px-6 py-4 text-sm text-muted-foreground font-medium">
                        {enquiry.title || 'General Enquiry'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold tracking-wide ${enquiry.status === 'Pending' ? 'bg-blue-100 text-blue-600' :
                            enquiry.status === 'Contacted' ? 'bg-amber-100 text-amber-600' :
                              enquiry.status === 'In Progress' ? 'bg-purple-100 text-purple-600' :
                                'bg-emerald-100 text-emerald-600'
                          }`}>
                          {enquiry.status === 'Pending' ? 'New' : enquiry.status}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-12 text-center text-muted-foreground text-sm italic">No enquiries found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Bookings List (Reference Style) */}
        <div className="bg-card rounded-2xl border border-border shadow-sm flex flex-col">
          <div className="p-6 border-b border-border flex items-center justify-between">
            <h3 className="text-lg font-bold text-foreground">Recent Bookings</h3>
            <Link to="/admin/bookings" className="text-sm font-bold text-primary hover:underline">View All</Link>
          </div>
          <div className="flex-1 divide-y divide-border">
            {stats?.recent_bookings?.length > 0 ? (
              stats.recent_bookings.map((booking) => (
                <div key={booking.id} className="p-6 flex items-start gap-5 hover:bg-muted/20 transition-colors group">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${booking.service_name?.includes('Marble') ? 'bg-orange-50 text-orange-500' :
                      booking.service_name?.includes('Bedroom') ? 'bg-stone-50 text-stone-500' :
                        'bg-amber-50 text-amber-500'
                    }`}>
                    <iconify-icon
                      icon={
                        booking.service_name?.includes('Marble') ? 'lucide:map-pin' :
                          booking.service_name?.includes('Bedroom') ? 'lucide:users' :
                            'lucide:ruler'
                      }
                      class="text-xl"
                    ></iconify-icon>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-foreground text-sm">
                      {booking.service_name ? `${booking.service_name} Measurement` : 'Site Visit / Consultation'}
                    </h4>
                    <p className="text-[11px] text-muted-foreground mt-1 font-medium">
                      {new Date(booking.consultation_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, {booking.consultation_time}
                      <span className="mx-2">•</span>
                      Assigned to: <span className="text-foreground">Staff</span>
                    </p>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <iconify-icon icon="lucide:chevron-right" class="text-muted-foreground"></iconify-icon>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center py-12 text-muted-foreground">
                <iconify-icon icon="lucide:calendar-x" class="text-4xl opacity-20 mb-3"></iconify-icon>
                <p className="text-sm italic">No bookings scheduled yet</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
