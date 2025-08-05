import React, { useState } from 'react';
import { Menu, X, Brain, FileText, Rocket, CheckCircle, Shield, Clock, Target } from 'lucide-react';
import Logo from './components/Logo';

function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
<div className="min-h-screen bg-black text-white relative overflow-x-hidden" data-sb-object-id="landingPage" data-sb-field-path=".">
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

      {/* Hero Section */}
      <section className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 pt-16">
        <div className="text-center max-w-5xl mx-auto">
<h1 className="font-orbitron font-black text-4xl sm:text-6xl lg:text-7xl xl:text-8xl mb-6 leading-tight bg-gradient-to-r from-purple-600 via-purple-500 to-blue-700 bg-clip-text text-transparent" data-sb-field-path="heading">
            LET OUR AI BREAK
            <br />
            YOUR APP BEFORE
            <br />
            YOUR USERS DO
          </h1>
          
<p className="font-inter text-xl sm:text-2xl lg:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed" data-sb-field-path="description">
            Experience autonomous testing that finds more bugs, faster, and saves you money.
          </p>
          
<a 
            href="/signup" 
            className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl neon-glow-strong hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-110 hover:shadow-2xl"
            data-sb-field-path="cta">
          
            <Rocket className="mr-3 w-6 h-6" />
            Start Your Free AI Test
          </a>
        </div>
      </section>

      {/* Problem/Solution Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl lg:text-5xl mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              The Future of Quality Assurance is Here
            </h2>
          </div>
          
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Problem Statement */}
            <div className="glass-card p-8 lg:p-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-500/20 rounded-lg flex items-center justify-center mr-4">
                  <X className="w-6 h-6 text-red-400" />
                </div>
                <h3 className="font-orbitron font-bold text-2xl text-red-400">The Problem</h3>
              </div>
              <p className="font-inter text-lg text-gray-300 mb-6 leading-relaxed">
                Manual testing is slow, expensive, and error-prone. Traditional automation requires constant maintenance and misses critical bugs that real users encounter.
              </p>
              <ul className="space-y-3 text-gray-400">
                <li className="flex items-center">
                  <X className="w-5 h-5 text-red-500 mr-3" />
                  <span>Days or weeks for comprehensive testing</span>
                </li>
                <li className="flex items-center">
                  <X className="w-5 h-5 text-red-500 mr-3" />
                  <span>High labor costs and human error</span>
                </li>
                <li className="flex items-center">
                  <X className="w-5 h-5 text-red-500 mr-3" />
                  <span>Brittle test scripts that break constantly</span>
                </li>
              </ul>
            </div>

            {/* Solution Statement */}
            <div className="glass-card p-8 lg:p-12">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-green-500/20 rounded-lg flex items-center justify-center mr-4">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                </div>
                <h3 className="font-orbitron font-bold text-2xl text-green-400">The Solution</h3>
              </div>
              <p className="font-inter text-lg text-gray-300 mb-6 leading-relaxed">
                DEFFATEST leverages autonomous AI to deliver unparalleled testing efficiency, ensuring flawless applications at a fraction of the time and cost.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="font-semibold">Save Thousands in Manual Labor</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="font-semibold">Cut QA Cycles by Days, Not Hours</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="font-semibold">Uncover Bugs That Humans Miss</span>
                </li>
                <li className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
                  <span className="font-semibold">Release with Confidence</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl lg:text-5xl mb-6 bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent">
              Unleash Unrivaled Testing Power
            </h2>
            <p className="font-inter text-xl text-gray-400 max-w-3xl mx-auto">
              Discover the features that make DEFFATEST the developer's favorite QA solution
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1 */}
            <div className="glass-card p-6 text-center group hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-orbitron font-bold text-xl mb-3 text-cyan-400">AI Autonomous Testing</h3>
              <p className="font-inter text-gray-400 leading-relaxed">
                Advanced AI explores your app like a human, uncovering deeply hidden bugs without scripts
              </p>
              <a href="/features" className="inline-block mt-4 text-purple-400 hover:text-purple-300 text-sm font-semibold">
                Learn More →
              </a>
            </div>

            {/* Feature 2 */}
            <div className="glass-card p-6 text-center group hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                <FileText className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-orbitron font-bold text-xl mb-3 text-cyan-400">Actionable Bug Reports</h3>
              <p className="font-inter text-gray-400 leading-relaxed">
                Comprehensive reports with reproduction steps, screenshots, and videos for instant fixes
              </p>
              <a href="/features" className="inline-block mt-4 text-purple-400 hover:text-purple-300 text-sm font-semibold">
                Learn More →
              </a>
            </div>

            {/* Feature 3 */}
            <div className="glass-card p-6 text-center group hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-green-500/50 transition-all">
                <Rocket className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-orbitron font-bold text-xl mb-3 text-cyan-400">CI/CD Ready API</h3>
              <p className="font-inter text-gray-400 leading-relaxed">
                Seamlessly integrate with your development pipeline for continuous quality assurance
              </p>
              <a href="/features" className="inline-block mt-4 text-purple-400 hover:text-purple-300 text-sm font-semibold">
                Learn More →
              </a>
            </div>

            {/* Feature 4 */}
            <div className="glass-card p-6 text-center group hover:scale-105 transition-all">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg group-hover:shadow-orange-500/50 transition-all">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-orbitron font-bold text-xl mb-3 text-cyan-400">Security & Performance</h3>
              <p className="font-inter text-gray-400 leading-relaxed">
                Comprehensive security vulnerability scanning and performance optimization insights
              </p>
              <a href="/features" className="inline-block mt-4 text-purple-400 hover:text-purple-300 text-sm font-semibold">
                Learn More →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="relative z-10 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="glass-card p-12 lg:p-16">
            <h2 className="font-orbitron font-bold text-3xl sm:text-4xl lg:text-5xl mb-6 bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
              Ready to See the Difference?
            </h2>
            <p className="font-inter text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              Join the Future of QA Today. No credit card required to start your Free AI Test.
            </p>
            <a 
              href="/signup" 
              className="inline-flex items-center px-8 py-4 text-lg font-semibold bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl neon-glow-strong hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-110 hover:shadow-2xl"
            >
              <Target className="mr-3 w-6 h-6" />
              Get Started for Free
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
<footer className="relative z-10 bg-black/50 backdrop-blur-sm border-t border-purple-500/20 py-12 px-4 sm:px-6 lg:px-8" data-sb-field-path="footer">
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

export default App;