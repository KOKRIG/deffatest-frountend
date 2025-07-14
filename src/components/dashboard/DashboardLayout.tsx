import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Settings, 
  Menu, 
  X, 
  Activity, 
  Plus, 
  Eye,
  Home,
  Bell,
  User,
  CreditCard
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import Logo from '../Logo';

interface DashboardLayoutProps {
  children: React.ReactNode;
  currentPage?: string;
}

function DashboardLayout({ children, currentPage = 'dashboard' }: DashboardLayoutProps) {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navigationItems = [
    { 
      name: 'Dashboard', 
      icon: Activity, 
      path: '/dashboard', 
      active: currentPage === 'dashboard' 
    },
    { 
      name: 'Upload Test', 
      icon: Plus, 
      path: '/upload', 
      active: currentPage === 'upload' 
    },
    { 
      name: 'Results', 
      icon: Eye, 
      path: '/results', 
      active: currentPage === 'results' 
    },
    { 
      name: 'Upgrade Plan', 
      icon: CreditCard, 
      path: '/dashboard/pricing', 
      active: currentPage === 'pricing' 
    },
    { 
      name: 'Settings', 
      icon: Settings, 
      path: '/settings', 
      active: currentPage === 'settings' 
    }
  ];

  return (
    <div className="min-h-screen bg-black text-white relative overflow-x-hidden">
      {/* Animated Background Overlay */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 animated-grid-overlay opacity-30"></div>
      </div>

      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-md border-b border-purple-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors"
              >
                {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
              <Logo size="small" />
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-white transition-colors relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center space-x-3">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                  <User className="w-4 h-4 text-white" />
                </div>
                <span className="text-gray-300">
                  {profile?.full_name || user?.email?.split('@')[0] || 'User'}
                </span>
              </div>
              <button
                onClick={() => navigate('/settings')}
                className="p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Settings className="w-5 h-5" />
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span className="hidden sm:block">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Sidebar */}
      <div className={`fixed left-0 top-16 h-full w-80 bg-black/50 backdrop-blur-lg border-r border-purple-500/20 transform transition-transform duration-300 z-40 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        <div className="p-6">
          {/* User Profile Section */}
          <div className="mb-8 p-4 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 border border-purple-500/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold text-white">
                  {profile?.full_name || 'User'}
                </div>
                <div className="text-sm text-gray-400">
                  {profile?.plan_type?.toUpperCase() || 'FREE'} Plan
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {navigationItems.map((item) => (
              <button
                key={item.name}
                onClick={() => {
                  navigate(item.path);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                  item.active
                    ? 'bg-purple-500/20 text-cyan-400 border border-purple-500/30'
                    : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
                }`}
              >
                <item.icon className="w-5 h-5 mr-3" />
                <span className="font-medium">{item.name}</span>
              </button>
            ))}
          </nav>

          {/* Quick Links */}
          <div className="mt-8 pt-8 border-t border-purple-500/20">
            <h3 className="text-sm font-semibold text-gray-400 mb-4 uppercase tracking-wider">
              Quick Links
            </h3>
            <div className="space-y-2">
              <button
                onClick={() => navigate('/')}
                className="w-full flex items-center px-4 py-2 text-left rounded-lg text-gray-400 hover:text-white hover:bg-purple-500/10 transition-colors text-sm"
              >
                <Home className="w-4 h-4 mr-3" />
                <span>Homepage</span>
              </button>
              <button
                onClick={() => navigate('/docs')}
                className="w-full flex items-center px-4 py-2 text-left rounded-lg text-gray-400 hover:text-white hover:bg-purple-500/10 transition-colors text-sm"
              >
                <span className="w-4 h-4 mr-3 text-center">📚</span>
                <span>Documentation</span>
              </button>
              <button
                onClick={() => navigate('/contact-us')}
                className="w-full flex items-center px-4 py-2 text-left rounded-lg text-gray-400 hover:text-white hover:bg-purple-500/10 transition-colors text-sm"
              >
                <span className="w-4 h-4 mr-3 text-center">💬</span>
                <span>Support</span>
              </button>
            </div>
          </div>

          {/* Plan Upgrade CTA */}
          {profile?.plan_type === 'free' && (
            <div className="mt-8 p-4 bg-gradient-to-r from-purple-600/20 to-pink-500/20 border border-purple-500/30 rounded-lg">
              <h4 className="font-semibold text-white mb-2">Upgrade Your Plan</h4>
              <p className="text-sm text-gray-300 mb-3">
                Unlock unlimited tests and advanced features
              </p>
              <button
                onClick={() => navigate('/dashboard/pricing')}
                className="w-full py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg text-white text-sm font-medium hover:from-purple-700 hover:to-pink-600 transition-all"
              >
                View Plans
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12 lg:ml-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {children}
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;