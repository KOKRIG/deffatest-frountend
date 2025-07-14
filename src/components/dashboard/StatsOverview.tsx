import React from 'react';
import { TrendingUp, Bug, Clock, Target, AlertTriangle, CheckCircle, Zap, Shield } from 'lucide-react';

interface StatsOverviewProps {
  stats: {
    totalTests: number;
    testsThisMonth: number;
    totalBugs: number;
    criticalBugs: number;
    testHoursUsed: number;
    testHoursLimit: number;
  };
}

function StatsOverview({ stats }: StatsOverviewProps) {
  const successRate = stats.totalTests > 0 ? Math.round(((stats.totalTests - stats.criticalBugs) / stats.totalTests) * 100) : 100;
  const hoursUsagePercent = stats.testHoursLimit > 0 ? Math.round((stats.testHoursUsed / stats.testHoursLimit) * 100) : 0;

  const statCards = [
    {
      title: 'Total Tests Run',
      value: stats.totalTests,
      icon: TrendingUp,
      color: 'from-blue-500 to-cyan-500',
      textColor: 'text-blue-400',
      bgColor: 'bg-blue-500/10',
      change: '+12%',
      changeType: 'positive' as const,
      description: 'All time'
    },
    {
      title: 'Tests This Month',
      value: stats.testsThisMonth,
      icon: Target,
      color: 'from-green-500 to-teal-500',
      textColor: 'text-green-400',
      bgColor: 'bg-green-500/10',
      change: '+8%',
      changeType: 'positive' as const,
      description: 'Current month'
    },
    {
      title: 'Total Bugs Found',
      value: stats.totalBugs,
      icon: Bug,
      color: 'from-orange-500 to-red-500',
      textColor: 'text-orange-400',
      bgColor: 'bg-orange-500/10',
      change: '-5%',
      changeType: 'negative' as const,
      description: 'Across all tests'
    },
    {
      title: 'Critical Issues',
      value: stats.criticalBugs,
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-500',
      textColor: 'text-red-400',
      bgColor: 'bg-red-500/10',
      change: '-15%',
      changeType: 'negative' as const,
      description: 'Need immediate attention'
    },
    {
      title: 'Test Hours Used',
      value: `${stats.testHoursUsed}/${stats.testHoursLimit}`,
      icon: Clock,
      color: 'from-purple-500 to-indigo-500',
      textColor: 'text-purple-400',
      bgColor: 'bg-purple-500/10',
      change: `${hoursUsagePercent}%`,
      changeType: 'neutral' as const,
      description: 'This month'
    },
    {
      title: 'Success Rate',
      value: `${successRate}%`,
      icon: CheckCircle,
      color: 'from-emerald-500 to-green-500',
      textColor: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
      change: '+2%',
      changeType: 'positive' as const,
      description: 'Tests without critical bugs'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <div key={index} className="glass-card p-6 group hover:scale-105 transition-all">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 bg-gradient-to-r ${stat.color} rounded-xl flex items-center justify-center group-hover:shadow-lg transition-all`}>
              <stat.icon className="w-6 h-6 text-white" />
            </div>
            <div className={`text-xs font-medium px-2 py-1 rounded-full ${
              stat.changeType === 'positive' ? 'text-green-400 bg-green-500/20' : 
              stat.changeType === 'negative' ? 'text-red-400 bg-red-500/20' : 'text-gray-400 bg-gray-500/20'
            }`}>
              {stat.change}
            </div>
          </div>
          
          <div className={`text-2xl font-bold ${stat.textColor} mb-1`}>
            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
          </div>
          
          <div className="text-sm font-medium text-white mb-1">{stat.title}</div>
          <div className="text-xs text-gray-400">{stat.description}</div>

          {/* Progress bar for certain stats */}
          {stat.title === 'Test Hours Used' && stats.testHoursLimit > 0 && (
            <div className="mt-3">
              <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`}
                  style={{ width: `${Math.min(hoursUsagePercent, 100)}%` }}
                ></div>
              </div>
            </div>
          )}

          {stat.title === 'Success Rate' && (
            <div className="mt-3">
              <div className="w-full bg-gray-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-500`}
                  style={{ width: `${successRate}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default StatsOverview;