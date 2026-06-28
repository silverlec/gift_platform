import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { Dashboard } from './pages/giver/Dashboard';
import { EventForm } from './pages/giver/EventForm';
import { EventDetail } from './pages/giver/EventDetail';
import { InviteLanding } from './pages/recipient/InviteLanding';
import { GiftSelect } from './pages/recipient/GiftSelect';
import { GiftSelected } from './pages/recipient/GiftSelected';

// Auth Guard for Giver routes
const GiverRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  
  if (!currentUser || currentUser.role !== 'GIVER') {
    return <Navigate to="/login?role=GIVER" replace />;
  }
  
  return <>{children}</>;
};

// Auth Guard for Recipient routes
const RecipientRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser } = useApp();
  
  if (!currentUser || currentUser.role !== 'RECIPIENT') {
    return <Navigate to="/login?role=RECIPIENT" replace />;
  }
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <div className="app-container">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Giver (Administrator) Protected Routes */}
          <Route path="/admin/dashboard" element={
            <GiverRoute>
              <Dashboard />
            </GiverRoute>
          } />
          <Route path="/admin/events/new" element={
            <GiverRoute>
              <EventForm />
            </GiverRoute>
          } />
          <Route path="/admin/events/:eventId/edit" element={
            <GiverRoute>
              <EventForm />
            </GiverRoute>
          } />
          <Route path="/admin/events/:eventId" element={
            <GiverRoute>
              <EventDetail />
            </GiverRoute>
          } />

          {/* Recipient Gifting Flow Routes */}
          <Route path="/invite/:eventId" element={<InviteLanding />} />
          <Route path="/events/:eventId/select" element={
            <RecipientRoute>
              <GiftSelect />
            </RecipientRoute>
          } />
          <Route path="/events/:eventId/selected" element={
            <RecipientRoute>
              <GiftSelected />
            </RecipientRoute>
          } />

          {/* Fallback redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
