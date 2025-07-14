import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Rocket, Crown, Zap, TrendingUp, Calendar, Clock } from 'lucide-react';

interface DashboardHeaderProps {
  userName: string;
  planType: string;
  stats?: {
    testsThisMonth: number;
    testsRemaining: number;
    lastTestDate?: string;
  };
}

function DashboardHeader({ userName, planType, stats }: DashboardHeaderProps) {
  const navigate = useNavigate();

  const getPlanIcon = () => {
    switch (planType) {
      case 'chaos':
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 'pro':
        return <Rocket className="w-6 h-6 text-blue-400" />;
      default:
        return <Zap className="w-6 h-6 text-gray-400" />;
    }
  };

  const getPlanColor = () => {
    switch (planType) {
      case 'chaos':
        return 'text-yellow-400';
      case 'pro':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const getPlanGradient = () => {
    switch (planType) {
      case 'chaos':
        return 'from-yellow-500 to-orange-500';
      case 'pro':
        return 'from-blue-500 to-purple-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const firstName = userName.split(' ')[0] || userName.split('@')[0] || 'User';

  return (
    <div className="glass-card p-8 mb-8">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div className="mb-6 lg:mb-0">
          <div className="flex items-center space-x-3 mb-4">
            <h1 className="font-orbitron font-bold text-4xl lg:text-5xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              {getGreeting()}, {firstName}!
            </h1>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 space-y-3 sm:space-y-0">
            {/* Plan Badge */}
            <div className={`inline-flex items-center space-x-2 px-4 py-2 bg-gradient-to-r ${getPlanGradient()} rounded-full`}>
              {getPlanIcon()}
              <span className="text-white font-semibold">
                {planType.toUpperCase()} Plan
              </span>
            </div>

            {/* Quick Stats */}
            {stats && (
              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>{stats.testsThisMonth} tests this month</span>
                </div>
                {planType !== 'chaos' && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{stats.testsRemaining} remaining</span>
                  </div>
                )}
                {stats.lastTestDate && (
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>Last test: {new Date(stats.lastTestDate).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-xl text-gray-300 mt-4">
            {planType === 'free' 
              ? 'Ready to start testing? Upgrade for unlimited power!'
              : planType === 'chaos'
              ? 'Unlimited testing power at your fingertips!'
              : 'Professional testing tools ready for your projects!'
            }
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/upload')}
            className="flex items-center justify-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-semibold text-white neon-glow-strong hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            <Rocket className="w-5 h-5 mr-2" />
            Start New Test
          </button>
          
          <button
            onClick={() => navigate('/results')}
            className="flex items-center justify-center px-8 py-4 border border-purple-500/50 rounded-xl font-semibold text-purple-400 hover:bg-purple-500/10 transition-all"
          >
            View All Results
          </button>

          {planType === 'free' && (
            <button
              onClick={() => navigate('/dashboard/pricing')}
              className="flex items-center justify-center px-6 py-4 bg-gradient-to-r from-yellow-600 to-orange-500 rounded-xl font-semibold text-white hover:from-yellow-700 hover:to-orange-600 transition-all transform hover:scale-105"
            >
              <Crown className="w-5 h-5 mr-2" />
              Upgrade
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardHeader;