import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Services from './pages/Services';
import Blog from './pages/Blog';
import Appointment from './pages/Appointment';
import Results from './pages/Results';
import Profile from './pages/Profile';
import UserManagement from './pages/UserManagement';
import AppointmentManagement from './pages/AppointmentManagement';
import AdminLogin from './pages/AdminLogin';
import StaffLogin from './pages/StaffLogin';
import CustomerLogin from './pages/CustomerLogin';
import AdminRegister from './pages/AdminRegister';
import CustomerRegister from './pages/CustomerRegister';
import StaffRegister from './pages/StaffRegister';
import VerifyEmail from './pages/VerifyEmail';
import CustomerVerifyEmail from './pages/CustomerVerifyEmail';
import StaffVerifyEmail from './pages/StaffVerifyEmail';

import BlogDetail from './pages/BlogDetail';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/customer/login" element={<CustomerLogin />} />
          <Route path="/customer/register" element={<CustomerRegister />} />
          <Route path="/customer/verify-email" element={<CustomerVerifyEmail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/staff/login" element={<StaffLogin />} />
          <Route path="/staff/register" element={<StaffRegister />} />
          <Route path="/staff/verify-email" element={<StaffVerifyEmail />} />
          <Route path="/admin/register" element={<AdminRegister />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/services" element={<Layout><Services /></Layout>} />
          <Route path="/blog" element={<Layout><Blog /></Layout>} />
          
          <Route path="/blog-detail" element={<Layout><BlogDetail /></Layout>} />
          
          {/* Customer Routes */}
          <Route 
            path="/appointment" 
            element={
              <Layout>
                <ProtectedRoute allowedRoles={['customer']}>
                  <Appointment />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route 
            path="/results" 
            element={
              <Layout>
                <ProtectedRoute allowedRoles={['customer']}>
                  <Results />
                </ProtectedRoute>
              </Layout>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <Layout>
                <ProtectedRoute allowedRoles={['customer']}>
                  <Profile />
                </ProtectedRoute>
              </Layout>
            } 
          />

          {/* Admin Routes */}
          <Route 
            path="/admin/users" 
            element={
              <AdminLayout>
                <ProtectedRoute allowedRoles={['admin']}>
                  <UserManagement />
                </ProtectedRoute>
              </AdminLayout>
            } 
          />

          {/* Staff Routes */}
          <Route 
            path="/staff/appointments" 
            element={
              <AdminLayout>
                <ProtectedRoute allowedRoles={['staff']}>
                  <AppointmentManagement />
                </ProtectedRoute>
              </AdminLayout>
            } 
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
