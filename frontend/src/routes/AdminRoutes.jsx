import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute from '../components/ProtectedRoute'
import AdminLayout from '../components/admin/AdminLayout'
import Dashboard from '../pages/admin/Dashboard'
import Enquiries from '../pages/admin/Enquiries'
import AdminPortfolio from '../pages/admin/AdminPortfolio'
import AdminServices from '../pages/admin/AdminServices'
import AdminSettings from '../pages/admin/AdminSettings'
import Categories from '../pages/admin/Categories'
import Reviews from '../pages/admin/Reviews'
import AdminBookings from '../pages/admin/AdminBookings'
import PlaceholderPage from '../pages/admin/PlaceholderPage'
import AdminWhyChooseUs from '../pages/admin/AdminWhyChooseUs';
import AdminOurProcess from '../pages/admin/AdminOurProcess';
import AdminTestimonials from '../pages/admin/AdminTestimonials';
import AdminCTA from '../pages/admin/AdminCTA';
import AdminHero from '../pages/admin/AdminHero';
import AdminAbout from '../pages/admin/AdminAbout';
import AdminContact from '../pages/admin/AdminContact';
import AdminPortfolioHero from '../pages/admin/AdminPortfolioHero';

const AdminRoutes = () => {
  return (
    <ProtectedRoute>
      <Routes>
        <Route element={<AdminLayout />}>
          {/* Default admin route redirects to dashboard */}
          <Route index element={<Navigate to="dashboard" replace />} />

          <Route path="dashboard" element={<Dashboard />} />
          <Route path="enquiries" element={<Enquiries />} />
          <Route path="portfolio" element={<AdminPortfolio />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="settings" element={<AdminSettings />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="bookings" element={<AdminBookings />} />
          <Route path="categories" element={<Categories />} />
          <Route path="pages/hero" element={<AdminHero />} />
          <Route path="pages/about" element={<AdminAbout />} />
          <Route path="pages/contact" element={<AdminContact />} />
          <Route path="pages/portfolio" element={<AdminPortfolioHero />} />
          <Route path="pages/why-choose-us" element={<AdminWhyChooseUs />} />
          <Route path="pages/our-process" element={<AdminOurProcess />} />
          <Route path="pages/testimonials" element={<AdminTestimonials />} />
          <Route path="pages/cta" element={<AdminCTA />} />
          <Route path="testimonials" element={<Reviews />} />
          <Route path="customers" element={<PlaceholderPage title="Customers Management" />} />
          <Route path="users" element={<PlaceholderPage title="Users & Admins" />} />
          <Route path="reports" element={<PlaceholderPage title="Reports & Analytics" />} />

          {/* Catch-all for /admin/* */}
          <Route path="*" element={<PlaceholderPage title="404" />} />
        </Route>
      </Routes>
    </ProtectedRoute>
  )
}

export default AdminRoutes
