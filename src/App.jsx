import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { Toaster } from '@/components/ui/toaster';
import Layout from '@/components/Layout';
import Home from '@/pages/Home';
import Login from '@/pages/Login';
import Register from '@/pages/Register';
import Profile from '@/pages/Profile';
import Explore from '@/pages/Explore';
import AdminDashboard from '@/pages/AdminDashboard';
import Notifications from '@/pages/Notifications';
import Messages from '@/pages/Messages';
import Saved from '@/pages/Saved';
import Settings from '@/pages/Settings';
import AccountSettings from '@/pages/settings/AccountSettings';
import PrivacySettings from '@/pages/settings/PrivacySettings';
import NotificationSettings from '@/pages/settings/NotificationSettings';
import 'slick-carousel/slick/slick.css'; 
import 'slick-carousel/slick/slick-theme.css';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return user ? children : <Navigate to="/login" replace />;
};

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <>
      <Helmet>
        <title>TreeBeard - Share Your Moments</title>
        <meta name="description" content="A modern social media platform for sharing photos and videos with friends and followers." />
      </Helmet>
      <AuthProvider>
        <Router>
          <div className="min-h-screen">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/" 
                element={
                  <ProtectedRoute>
                    <Layout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Home />} />
                <Route path="explore" element={<Explore />} />
                <Route path="profile/:username" element={<Profile />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="messages" element={<Messages />} />
                <Route path="messages/:username" element={<Messages />} />
                <Route path="saved" element={<Saved />} />
                <Route path="settings" element={<Settings />} />
                <Route path="settings/account" element={<AccountSettings />} />
                <Route path="settings/privacy" element={<PrivacySettings />} />
                <Route path="settings/notifications" element={<NotificationSettings />} />
                <Route 
                  path="admin" 
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } 
                />
              </Route>
            </Routes>
            <Toaster />
          </div>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App;