import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from '../pages/Home'
import About from '../pages/About'
import Services from '../pages/Services'
import Portfolio from '../pages/Portfolio'
import Contact from '../pages/Contact'
import PrivacyPolicy from '../pages/PrivacyPolicy'
import TermsCondition from '../pages/TermsCondition'
import ReturnRefund from '../pages/ReturnRefund'
import Login from '../pages/admin/Login'

// Import Admin Routes component
import AdminRoutes from './AdminRoutes'

function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/home" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/services" element={<Services />} />
      <Route path="/portfolio" element={<Portfolio />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/privacy_policy" element={<PrivacyPolicy />} />
      <Route path="/terms_condition" element={<TermsCondition />} />
      <Route path="/return_refund" element={<ReturnRefund />} />
      <Route path="/login" element={<Login />} />
      
      {/* Admin Routes (Separated) */}
      <Route path="/admin/*" element={<AdminRoutes />} />
    </Routes>
  )
}

export default AppRoutes