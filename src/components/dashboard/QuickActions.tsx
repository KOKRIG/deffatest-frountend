import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Globe, Smartphone, Eye, Settings, Zap, AlertTriangle, FileText, BarChart3, Crown } from 'lucide-react';

interface QuickActionsProps {
  canStartTest: boolean;
  testsRemaining: number;
  planType?: string;
}

function QuickActions({ canStartTest, testsRemaining, planType = 'free' }: QuickActionsProps) {
  const navigate = useNavigate();

  const primaryActions = [
    {
      title: 'Start Web Test',
      description: 'Test your web application with AI',
      icon: Globe,
      color: 'from-cyan-500 to-blue-500',
      action: () => navigate('/upload?type=web'),
      disabled: !canStartTest || testsRemaining <= 0,
      primary: true
    },
    {
      title: 'Start Mobile Test',
      description: 'Upload and test your Android APK',
      icon: Smartphone,
      color: 'from-purple-500 to-pink-500',
      action: () => navigate('/upload?type=mobile'),
      disabled: !canStartTest || testsRemaining <= 0,
      primary: true
    }
  ];

  const secondaryActions = [
    {
      title: 'View Results',
      description: 'Browse your test history and reports',
      icon: Eye,
      color: 'from-green-500 to-teal-500',
      action: () => navigate('/results'),
      disabled: false
    },
    {
      title: 'Analytics',
      description: 'View detailed testing analytics',
      icon: BarChart3,
      color: 'from-indigo-500 to-purple-500',
      action: () => navigate('/analytics'),
      disabled: false
    },
    {
      title: 'Documentation',
      description: 'Learn how to use DEFFATEST',
      icon: FileText,
      color: 'from-yellow-500 to-orange-500',
      action: () => navigate('/docs'),
      disabled: false
    },
    {
      title: 'Account Settings',
      description: 'Manage your profile and preferences',
      icon: Settings,
      color: 'from-gray-500 to-gray-600',
      action: () => navigate('/settings'),
      disabled: false
    }
  ];

  return (
    <div className="space-y-8">
      {/* Primary Actions */}
      <div className="glass-card p-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-orbitron font-bold text-2xl text-cyan-400">Start Testing</h2>
          {(!canStartTest || testsRemaining <= 0) && (
            <div className="flex items-center space-x-2 text-yellow-400">
              <AlertTriangle className="w-5 h-5" />
              <span className="text-sm">
                {testsRemaining <= 0 ? 'No tests remaining' : 'All test slots in use'}
              </span>
            </div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {primaryActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              disabled={action.disabled}
              className={`group p-8 rounded-xl border-2 transition-all ${
                action.disabled
                  ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed opacity-50'
                  : 'border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10 hover:scale-105'
              }`}
            >
              <div className={`w-16 h-16 bg-gradient-to-r ${action.color} rounded-2xl flex items-center justify-center mx-auto mb-6 ${
                action.disabled ? 'opacity-50' : 'group-hover:shadow-lg transition-all'
              }`}>
                <action.icon className="w-8 h-8 text-white" />
              </div>
              <h3 className={`font-semibold text-xl mb-3 ${
                action.disabled ? 'text-gray-500' : 'text-white group-hover:text-cyan-400'
              }`}>
                {action.title}
              </h3>
              <p className={`text-sm ${
                action.disabled ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {action.description}
              </p>
            </button>
          ))}
        </div>

        {/* Test Limit Warning */}
        {testsRemaining <= 0 && (
          <div className="p-6 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 rounded-lg">
            <div className="flex items-start space-x-4">
              <Zap className="w-6 h-6 text-yellow-400 flex-shrink-0 mt-1" />
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-yellow-300 mb-2">Test Limit Reached</h3>
                <p className="text-yellow-200 mb-4">
                  You've used all your tests for this month. Upgrade your plan to continue testing with unlimited power!
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    onClick={() => navigate('/dashboard/pricing')}
                    className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105"
                  >
                    <Crown className="w-5 h-5 mr-2" />
                    Upgrade Plan
                  </button>
                  <button
                    onClick={() => navigate('/contact-us')}
                    className="px-6 py-3 border border-yellow-500/50 rounded-lg text-yellow-300 hover:bg-yellow-500/10 transition-all"
                  >
                    Contact Sales
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Concurrent Slots Warning */}
        {testsRemaining > 0 && !canStartTest && (
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-5 h-5 text-blue-400" />
              <div>
                <p className="text-blue-300 font-semibold">All Test Slots Busy</p>
                <p className="text-blue-200 text-sm">
                  You have tests currently running. Wait for them to complete or upgrade for more concurrent slots.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Secondary Actions */}
      <div className="glass-card p-8">
        <h2 className="font-orbitron font-bold text-2xl text-cyan-400 mb-6">Quick Access</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {secondaryActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              disabled={action.disabled}
              className={`group p-6 rounded-xl border-2 transition-all ${
                action.disabled
                  ? 'border-gray-600 bg-gray-800/50 cursor-not-allowed opacity-50'
                  : 'border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10 hover:scale-105'
              }`}
            >
              <div className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mx-auto mb-4 ${
                action.disabled ? 'opacity-50' : 'group-hover:shadow-lg transition-all'
              }`}>
                <action.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`font-semibold text-lg mb-2 ${
                action.disabled ? 'text-gray-500' : 'text-white group-hover:text-cyan-400'
              }`}>
                {action.title}
              </h3>
              <p className={`text-sm ${
                action.disabled ? 'text-gray-600' : 'text-gray-400'
              }`}>
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default QuickActions;