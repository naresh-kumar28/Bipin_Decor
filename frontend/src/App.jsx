import { useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar'
import Footer from './components/layout/Footer'
import FloatingWhatsApp from './components/layout/FloatingWhatsApp'
import AppRoutes from './routes/AppRoutes'
import SEO from './components/common/SEO'

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isDashboardPage = location.pathname === '/dashboard';
  const isEnquiriesPage = location.pathname === '/enquiries';
  const isAdminPage = location.pathname.startsWith('/admin/');
  const isOtherAdminPage = ['/bookings', '/categories', '/testimonials', '/customers'].includes(location.pathname);
  const hideLayout = isLoginPage || isDashboardPage || isEnquiriesPage || isAdminPage || isOtherAdminPage;

  return (
    <>
      <SEO />
      {!hideLayout && <Navbar />}
      <main className={!hideLayout ? "min-h-screen" : ""}>
        <AppRoutes />
      </main>
      {!hideLayout && <Footer />}
      {!hideLayout && <FloatingWhatsApp />}
    </>
  )
}

export default App
