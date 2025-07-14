import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Zap, Rocket, ArrowRight, AlertTriangle } from 'lucide-react';

interface PlanUsageProps {
  planInfo: {
    planType: string;
    testsRemaining: number;
    testsLimit: number;
    concurrentSlots: number;
    usedSlots: number;
  };
}

function PlanUsage({ planInfo }: PlanUsageProps) {
  const navigate = useNavigate();

  const getPlanIcon = () => {
    switch (planInfo.planType) {
      case 'chaos':
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 'pro':
        return <Rocket className="w-6 h-6 text-blue-400" />;
      default:
        return <Zap className="w-6 h-6 text-gray-400" />;
    }
  };

  const getPlanColor = () => {
    switch (planInfo.planType) {
      case 'chaos':
        return 'from-yellow-500 to-orange-500';
      case 'pro':
        return 'from-blue-500 to-purple-500';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  const getUsagePercentage = () => {
    if (planInfo.planType === 'chaos') return 0; // Unlimited
    return ((planInfo.testsLimit - planInfo.testsRemaining) / planInfo.testsLimit) * 100;
  };

  const getConcurrentUsagePercentage = () => {
    return (planInfo.usedSlots / planInfo.concurrentSlots) * 100;
  };

  const isNearLimit = () => {
    return planInfo.testsRemaining <= 2 && planInfo.planType !== 'chaos';
  };

  return (
    <div className="glass-card p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-orbitron font-bold text-xl text-cyan-400">Plan Usage</h3>
        <button
          onClick={() => navigate('/dashboard/pricing')}
          className="flex items-center text-purple-400 hover:text-purple-300 transition-colors text-sm"
        >
          <span className="mr-1">Manage</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Plan Badge */}
      <div className={`bg-gradient-to-r ${getPlanColor()} p-4 rounded-xl mb-6`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getPlanIcon()}
            <div>
              <div className="text-white font-bold text-lg">
                {planInfo.planType.toUpperCase()} Plan
              </div>
              <div className="text-white/80 text-sm">
                {planInfo.planType === 'chaos' ? 'Unlimited Power' : 
                 planInfo.planType === 'pro' ? 'Professional' : 'Basic'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Usage Stats */}
      <div className="space-y-6">
        {/* Tests Remaining */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Tests This Month</span>
            <span className="text-sm text-gray-400">
              {planInfo.planType === 'chaos' ? 'Unlimited' : 
               `${planInfo.testsLimit - planInfo.testsRemaining}/${planInfo.testsLimit}`}
            </span>
          </div>
          {planInfo.planType !== 'chaos' && (
            <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${
                  isNearLimit() ? 'from-red-500 to-orange-500' : 'from-cyan-400 to-purple-500'
                } rounded-full transition-all duration-500`}
                style={{ width: `${getUsagePercentage()}%` }}
              ></div>
            </div>
          )}
        </div>

        {/* Concurrent Slots */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-300">Concurrent Slots</span>
            <span className="text-sm text-gray-400">
              {planInfo.usedSlots}/{planInfo.concurrentSlots}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-400 to-blue-500 rounded-full transition-all duration-500"
              style={{ width: `${getConcurrentUsagePercentage()}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Alerts and Actions */}
      <div className="mt-6 space-y-4">
        {isNearLimit() && (
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-400" />
              <span className="text-yellow-300 text-sm font-semibold">
                Only {planInfo.testsRemaining} test{planInfo.testsRemaining !== 1 ? 's' : ''} remaining
              </span>
            </div>
          </div>
        )}

        {planInfo.planType === 'free' && (
          <button
            onClick={() => navigate('/dashboard/pricing')}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white neon-glow hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            Upgrade Plan
          </button>
        )}

        {planInfo.planType === 'pro' && (
          <button
            onClick={() => navigate('/dashboard/pricing')}
            className="w-full py-3 border border-purple-500/50 rounded-lg font-semibold text-purple-400 hover:bg-purple-500/10 transition-all"
          >
            Upgrade to Chaos Mode
          </button>
        )}
      </div>

      {/* Plan Features */}
      <div className="mt-6 pt-6 border-t border-purple-500/20">
        <h4 className="text-sm font-semibold text-gray-400 mb-3">Current Plan Features</h4>
        <div className="space-y-2 text-sm text-gray-300">
          {planInfo.planType === 'free' && (
            <>
              <div>• 1 test per month</div>
              <div>• 1 concurrent slot</div>
              <div>• Basic reports</div>
              <div>• Community support</div>
            </>
          )}
          {planInfo.planType === 'pro' && (
            <>
              <div>• 25 tests per month</div>
              <div>• 3 concurrent slots</div>
              <div>• Detailed reports with videos</div>
              <div>• Priority support</div>
              <div>• Performance insights</div>
            </>
          )}
          {planInfo.planType === 'chaos' && (
            <>
              <div>• Unlimited tests</div>
              <div>• 8 concurrent slots</div>
              <div>• Complete analysis reports</div>
              <div>• API access</div>
              <div>• Security scanning</div>
              <div>• Dedicated support</div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlanUsage;