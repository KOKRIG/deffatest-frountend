import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import Logo from './Logo';

interface LayoutProps {
  children: React.ReactNode;
  title?: string;
}

function Layout({ children, title }: LayoutProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Animated Background Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 animated-grid-overlay"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Logo />
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-8">
                <a href="/use-cases" className="nav-link">Use Cases</a>
                <a href="/features" className="nav-link">Features</a>
                <a href="/how-it-works" className="nav-link">How It Works</a>
                <a href="/pricing" className="nav-link">Pricing</a>
                <a href="/docs" className="nav-link">Documentation</a>
                <a href="/contact-us" className="nav-link">Contact Us</a>
                <a href="/terms" className="nav-link">Terms</a>
              </div>
            </div>

            {/* Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              <a href="/login" className="px-4 py-2 text-sm font-medium text-white hover:text-cyan-400 transition-colors">
                Login
              </a>
              <a href="/signup" className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg neon-glow hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105">
                Sign Up
              </a>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
              >
                {mobileMenuOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-black/95 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="/use-cases" className="mobile-nav-link">Use Cases</a>
              <a href="/features" className="mobile-nav-link">Features</a>
              <a href="/how-it-works" className="mobile-nav-link">How It Works</a>
              <a href="/pricing" className="mobile-nav-link">Pricing</a>
              <a href="/docs" className="mobile-nav-link">Documentation</a>
              <a href="/contact-us" className="mobile-nav-link">Contact Us</a>
              <a href="/terms" className="mobile-nav-link">Terms</a>
              <div className="pt-4 pb-3 border-t border-gray-700">
                <div className="flex items-center space-x-3">
                  <a href="/login" className="block px-3 py-2 text-base font-medium text-gray-400 hover:text-white">
                    Login
                  </a>
                  <a href="/signup" className="block px-3 py-2 text-base font-medium bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg neon-glow">
                    Sign Up
                  </a>
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="relative z-10 pt-16">
        {title && (
          <div className="text-center py-12 px-4 sm:px-6 lg:px-8">
            <h1 className="font-orbitron font-bold text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {title}
            </h1>
          </div>
        )}
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-black/50 backdrop-blur-sm border-t border-purple-500/20 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-6 md:mb-0">
              <p className="font-inter text-gray-400">
                © {new Date().getFullYear()} DEFFATEST. All rights reserved.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <a href="/privacy" className="font-inter text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="/cookie-policy" className="font-inter text-gray-400 hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="/terms" className="font-inter text-gray-400 hover:text-white transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Layout;