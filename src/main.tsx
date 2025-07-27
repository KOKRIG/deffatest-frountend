import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import PrivacyPolicy from './pages/PrivacyPolicy.tsx';
import CookiePolicy from './pages/CookiePolicy.tsx';
import ContactUs from './pages/ContactUs.tsx';
import Terms from './pages/Terms.tsx';
import UseCases from './pages/UseCases.tsx';
import Features from './pages/Features.tsx';
import HowItWorks from './pages/HowItWorks.tsx';
import Pricing from './pages/Pricing.tsx';
import Documentation from './pages/Documentation.tsx';
import Login from './pages/Login.tsx';
import Signup from './pages/Signup.tsx';
import ResetPassword from './pages/ResetPassword.tsx';
import UpdatePassword from './pages/UpdatePassword.tsx';
import Dashboard from './pages/Dashboard.tsx';
import Upload from './pages/Upload.tsx';
import Results from './pages/Results.tsx';
import TestReport from './pages/TestReport.tsx';
import Settings from './pages/Settings.tsx';
import DashboardPricing from './pages/DashboardPricing.tsx';
import LogoPage from './pages/LogoPage.tsx';
import ScrollToTop from './components/ScrollToTop.tsx';
import ProtectedRoute from './components/ProtectedRoute.tsx';
import LoadingScreen from './components/LoadingScreen.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { initializePaddle } from './lib/paddle.ts';
import './index.css';

// Preload the logo image first with robust handling
const preloadLogo = () => {
  return new Promise((resolve) => {
    // Try to load the main logo first
    const logoImg = new Image();
    logoImg.src = '/DEFFATEST-logo copy copy.png';
    
    // Set a reasonable timeout for loading
    const timeout = setTimeout(() => {
      console.warn('Logo preloading timed out, continuing anyway');
      resolve(false);
    }, 3000);
    
    // Success handler
    logoImg.onload = () => {
      clearTimeout(timeout);
      console.log('Logo preloaded successfully');
      resolve(true);
    };
    
    // Error handler
    logoImg.onerror = () => {
      clearTimeout(timeout);
      console.error('Failed to preload logo, continuing anyway');
      resolve(false);
    };
  });
};

// Initialize Paddle.js - but don't wait for it to complete before rendering
initializePaddle().catch(error => {
  console.error('Failed to initialize Paddle:', error);
});

// Clear any stale auth data from localStorage
const clearStaleAuthData = () => {
  try {
    // Check if there's a session expiry timestamp
    const expiryStr = localStorage.getItem('supabase.auth.expires_at');
    if (expiryStr) {
      const expiryTime = parseInt(expiryStr, 10) * 1000; // Convert to milliseconds
      const now = Date.now();
      
      // If expired, clear auth data
      if (now > expiryTime) {
        localStorage.removeItem('supabase.auth.token');
        localStorage.removeItem('supabase.auth.refreshToken');
        localStorage.removeItem('supabase.auth.expires_at');
      }
    }
  } catch (error) {
    console.error('Error checking auth expiry:', error);
  }
};

// Run cleanup before mounting the app
clearStaleAuthData();

// First preload the logo, then render the app
preloadLogo().finally(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <BrowserRouter>
        <AuthProvider>
          <LoadingScreen />
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/use-cases" element={<UseCases />} />
            <Route path="/features" element={<Features />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/docs" element={<Documentation />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/cookie-policy" element={<CookiePolicy />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/update-password" element={<UpdatePassword />} />
            <Route path="/logo" element={<LogoPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard/pricing" 
              element={
                <ProtectedRoute>
                  <DashboardPricing />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/upload" 
              element={
                <ProtectedRoute>
                  <Upload />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/results" 
              element={
                <ProtectedRoute>
                  <Results />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/results/:testId" 
              element={
                <ProtectedRoute>
                  <TestReport />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/settings" 
              element={
                <ProtectedRoute>
                  <Settings />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </StrictMode>
  );
});
