import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, Zap, Rocket, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { initializePaddle, openPaddleCheckout, PADDLE_CONFIG, PLAN_CONFIG } from '../lib/paddle';
import DashboardLayout from '../components/dashboard/DashboardLayout';

function DashboardPricing() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [paddleInitialized, setPaddleInitialized] = useState(false);

  useEffect(() => {
    // Check for payment status from URL params
    const paymentParam = new URLSearchParams(window.location.search).get('payment');
    
    if (paymentParam === 'success') {
      setSuccess('Payment successful! Your plan has been updated.');
      setTimeout(() => {
        setSuccess(null);
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 5000);
    } else if (paymentParam === 'cancelled') {
      setError('Payment was cancelled. Your plan remains unchanged.');
      setTimeout(() => {
        setError(null);
        window.history.replaceState({}, document.title, window.location.pathname);
      }, 5000);
    }

    // Initialize Paddle
    const initPaddle = async () => {
      try {
        await initializePaddle();
        setPaddleInitialized(true);
        console.log('Paddle initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Paddle:', error);
        setError("Could not initialize payment system.");
      }
    };

    initPaddle();
  }, []);

  const handlePlanSelect = async (planId: string) => {
    if (!user || !profile) {
      navigate('/login');
      return;
    }

    // Don't allow selecting the current plan
    if (profile.plan_type === planId) {
      setError("You're already on this plan.");
      setTimeout(() => setError(null), 3000);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const priceId = getPriceIdForPlan(planId);
      
      if (!priceId) {
        throw new Error('Invalid plan selected');
      }
      
      if (!paddleInitialized) {
        await initializePaddle();
        setPaddleInitialized(true);
      }
      
      // Wait a moment for Paddle to be ready
      await new Promise(resolve => setTimeout(resolve, 200));
      
      openPaddleCheckout({
        items: [
          {
            priceId: priceId,
            quantity: 1
          }
        ],
        customer: {
          email: user.email || '',
          id: profile.paddle_customer_id
        },
        settings: {
          displayMode: 'overlay',
          theme: 'dark',
          locale: 'en',
          // FIXED: Added the required cancel_url
          cancelUrl: `${window.location.origin}/dashboard/pricing?payment=cancelled`
        }
      });
      
    } catch (error) {
      console.error('Error opening Paddle checkout:', error);
      setError('Failed to open checkout. Please try again.');
      setTimeout(() => setError(null), 5000);
    } finally {
      setLoading(false);
    }
  };

  const getPriceIdForPlan = (planId: string): string => {
    switch (planId) {
      case 'free':
        return PADDLE_CONFIG.FREE_PLAN_PRICE_ID;
      case 'pro':
        return PADDLE_CONFIG.PRO_PLAN_PRICE_ID;
      case 'chaos':
        return PADDLE_CONFIG.CHAOS_PLAN_PRICE_ID;
      default:
        return '';
    }
  };

  const getButtonText = (planId: string) => {
    if (loading) return 'Processing...';
    
    if (profile?.plan_type === planId) {
      return 'Current Plan';
    }
    
    return planId === 'free' ? 'Downgrade to Free' : 
           planId === 'pro' ? 'Upgrade to Pro' : 
           'Upgrade to Chaos';
  };

  const isCurrentPlan = (planId: string) => {
    return profile?.plan_type === planId;
  };

  return (
    <DashboardLayout currentPage="pricing">
      <div className="space-y-8">
        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4 my-6">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-green-300 text-center flex-1">{success}</p>
            </div>
          </div>
        )}
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 my-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-300 text-center flex-1">{error}</p>
            </div>
          </div>
        )}
        
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-300">
            Upgrade to unlock more features and capabilities
          </p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Free Plan */}
          <div className={`${isCurrentPlan('free') ? 'bg-gradient-to-r from-gray-700/50 to-gray-600/50 border-gray-500' : 'bg-gray-900/50 border-gray-700'} border rounded-lg p-6`}>
            <div className="flex items-center mb-4">
              <Zap className="w-6 h-6 text-gray-400 mr-2" />
              <h3 className="text-xl font-semibold text-white">Free</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-6">$0<span className="text-lg text-gray-400">/month</span></div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span>1 test per month</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span>5 min max test duration</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span>Standard queue priority</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span>Basic bug reports</span>
              </li>
            </ul>
            <button 
              onClick={() => handlePlanSelect('free')}
              disabled={loading || isCurrentPlan('free')}
              className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-colors ${
                isCurrentPlan('free') 
                  ? 'bg-gray-600 text-white cursor-not-allowed' 
                  : 'bg-gray-700 text-white hover:bg-gray-600'
              }`}
            >
              {getButtonText('free')}
            </button>
          </div>

          {/* Pro Plan */}
          <div className={`${isCurrentPlan('pro') ? 'bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-blue-500/50' : 'bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-purple-500/30'} border rounded-lg p-6 relative`}>
            {!isCurrentPlan('pro') && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                  Most Popular
                </span>
              </div>
            )}
            <div className="flex items-center mb-4">
              <Rocket className="w-6 h-6 text-blue-400 mr-2" />
              <h3 className="text-xl font-semibold text-white">Pro</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-6">$110<span className="text-lg text-gray-400">/month</span></div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span>25 tests per month</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span>2 hours max test duration</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span>Priority queue</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span>4 concurrent test slots</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span>Detailed test logs</span>
              </li>
            </ul>
            <button 
              onClick={() => handlePlanSelect('pro')}
              disabled={loading || isCurrentPlan('pro')}
              className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-all ${
                isCurrentPlan('pro') 
                  ? 'bg-blue-600/50 text-white cursor-not-allowed' 
                  : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 transform hover:scale-105'
              }`}
            >
              {getButtonText('pro')}
            </button>
          </div>

          {/* Chaos Plan */}
          <div className={`${isCurrentPlan('chaos') ? 'bg-gradient-to-r from-purple-600/20 to-pink-500/20 border-purple-500/50' : 'bg-gradient-to-r from-purple-600/10 to-pink-500/10 border-purple-500/30'} border rounded-lg p-6`}>
            <div className="flex items-center mb-4">
              <Crown className="w-6 h-6 text-yellow-400 mr-2" />
              <h3 className="text-xl font-semibold text-white">Chaos</h3>
            </div>
            <div className="text-3xl font-bold text-white mb-6">$350<span className="text-lg text-gray-400">/month</span></div>
            <ul className="space-y-3 text-gray-300">
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span>Unlimited tests</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span>6 hours max test duration</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span>Instant queue priority</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span>8 concurrent test slots</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span>API access for CI/CD integration</span>
              </li>
              <li className="flex items-start">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2 mt-0.5" />
                <span>Advanced analytics</span>
              </li>
            </ul>
            <button 
              onClick={() => handlePlanSelect('chaos')}
              disabled={loading || isCurrentPlan('chaos')}
              className={`w-full mt-6 py-3 px-4 rounded-lg font-semibold transition-all ${
                isCurrentPlan('chaos') 
                  ? 'bg-purple-600/50 text-white cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:from-purple-700 hover:to-pink-600 transform hover:scale-105'
              }`}
            >
              {getButtonText('chaos')}
            </button>
          </div>
        </div>

        {/* Plan Comparison */}
        <div className="glass-card p-8 mt-12">
          <h2 className="text-2xl font-bold text-center text-cyan-400 mb-8">Plan Comparison</h2>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-purple-500/30">
                  <th className="px-4 py-3 text-left text-white">Feature</th>
                  <th className="px-4 py-3 text-center text-gray-400">Free</th>
                  <th className="px-4 py-3 text-center text-blue-400">Pro</th>
                  <th className="px-4 py-3 text-center text-yellow-400">Chaos</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-purple-500/10">
                  <td className="px-4 py-3 text-white">Monthly Tests</td>
                  <td className="px-4 py-3 text-center text-gray-300">1</td>
                  <td className="px-4 py-3 text-center text-gray-300">25</td>
                  <td className="px-4 py-3 text-center text-gray-300">Unlimited</td>
                </tr>
                <tr className="border-b border-purple-500/10">
                  <td className="px-4 py-3 text-white">Max Test Duration</td>
                  <td className="px-4 py-3 text-center text-gray-300">5 min</td>
                  <td className="px-4 py-3 text-center text-gray-300">2 hours</td>
                  <td className="px-4 py-3 text-center text-gray-300">6 hours</td>
                </tr>
                <tr className="border-b border-purple-500/10">
                  <td className="px-4 py-3 text-white">Concurrent Test Slots</td>
                  <td className="px-4 py-3 text-center text-gray-300">1</td>
                  <td className="px-4 py-3 text-center text-gray-300">4</td>
                  <td className="px-4 py-3 text-center text-gray-300">8</td>
                </tr>
                <tr className="border-b border-purple-500/10">
                  <td className="px-4 py-3 text-white">Queue Priority</td>
                  <td className="px-4 py-3 text-center text-gray-300">Standard</td>
                  <td className="px-4 py-3 text-center text-gray-300">Priority</td>
                  <td className="px-4 py-3 text-center text-gray-300">Instant</td>
                </tr>
                <tr className="border-b border-purple-500/10">
                  <td className="px-4 py-3 text-white">API Access</td>
                  <td className="px-4 py-3 text-center text-gray-300">❌</td>
                  <td className="px-4 py-3 text-center text-gray-300">❌</td>
                  <td className="px-4 py-3 text-center text-green-400">✓</td>
                </tr>
                <tr>
                  <td className="px-4 py-3 text-white">Detailed Test Logs</td>
                  <td className="px-4 py-3 text-center text-gray-300">Basic</td>
                  <td className="px-4 py-3 text-center text-green-400">✓</td>
                  <td className="px-4 py-3 text-center text-green-400">✓</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="glass-card p-8 mt-12">
          <h2 className="text-2xl font-bold text-center text-cyan-400 mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">How do I change my plan?</h3>
              <p className="text-gray-300">
                Simply select the plan you want to upgrade or downgrade to and follow the checkout process. Your plan will be updated immediately after payment is processed.
              </p>
            </div>
            
            <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">When will my plan renew?</h3>
              <p className="text-gray-300">
                Your plan will automatically renew on your billing date. You can view your next billing date in your account settings.
              </p>
            </div>
            
            <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">Can I cancel my subscription?</h3>
              <p className="text-gray-300">
                Yes, you can cancel your subscription at any time from your account settings. Your plan will remain active until the end of your current billing period.
              </p>
            </div>
            
            <div className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-white mb-2">What happens to my data if I downgrade?</h3>
              <p className="text-gray-300">
                Your test history and results will be preserved when you downgrade. However, you'll be limited to the features and limits of your new plan.
              </p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DashboardPricing;