import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Check, 
  Zap, 
  Crown, 
  Rocket, 
  Star, 
  AlertCircle, 
  CheckCircle 
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
// V-- THIS LINE IS NOW FIXED --V
import { initializePaddle, openPaddleCheckout, PADDLE_CONFIG, PLAN_CONFIG } from '../lib/paddle';
import Layout from '../components/Layout';

function Pricing() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paddleInitialized, setPaddleInitialized] = useState(false);

  useEffect(() => {
    // Check for payment status from URL params
    const paymentParam = searchParams.get('payment');
    
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
  }, [searchParams]);

  const handlePlanSelect = async (planId: string) => {
    // Always redirect to signup page with plan parameter
    setLoading(true);
    navigate(`/signup?plan=${planId}`);
  };

  const getButtonText = (planId: string) => {
    if (loading) return 'Processing...';
    
    return planId === 'free' ? 'Get Started for Free' : `Start with ${PLAN_CONFIG[planId as keyof typeof PLAN_CONFIG].name}`;
  };

  const isCurrentPlan = (planId: string) => {
    return false; // Always allow clicking since we're redirecting to signup
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

  const renderFeatureList = (features: string[]) => {
    return features.map((feature, index) => (
      <li key={index} className="flex items-start">
        <Check className="w-5 h-5 text-green-400 mr-3 mt-0.5 flex-shrink-0" />
        <span className="text-gray-300">{feature}</span>
      </li>
    ));
  };

  return (
    <Layout title="Choose Your DEFFATEST Plan" data-sb-object-id="pricing">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
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
        
        {/* Introduction */}
        <div className="text-center my-16">
          <p className="text-xl lg:text-2xl text-gray-300 leading-relaxed max-w-4xl mx-auto" data-sb-field-path="introText">
            Experience the power of AI-driven testing. Start free, upgrade anytime to unlock unlimited potential.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {Object.entries(PLAN_CONFIG).map(([planId, plan]) => (
            <div
              key={planId}
              className={`glass-card p-8 relative group hover:scale-105 transition-all ${
                planId === 'pro' ? 'ring-2 ring-purple-500/50 shadow-lg shadow-purple-500/25' : ''
              }`}
            >
              {planId === 'pro' && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center">
                    <Star className="w-4 h-4 mr-2" />
                    Most Popular
                  </div>
                </div>
              )}

              <div className="text-center mb-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${
                    planId === 'free' ? 'from-gray-600 to-gray-700' :
                    planId === 'pro' ? 'from-blue-600 to-purple-600' :
                    'from-purple-600 to-pink-500'
                  } rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg transition-all`}>
                    {planId === 'free' ? <Zap className="w-8 h-8 text-white" /> :
                     planId === 'pro' ? <Rocket className="w-8 h-8 text-white" /> :
                     <Crown className="w-8 h-8 text-white" />}
                  </div>
              <h3 className="font-orbitron font-bold text-2xl text-cyan-400 mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold text-white">{plan.price}</span>
                  <span className="text-gray-400 ml-2">/{plan.period}</span>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <ul className="space-y-3">
                  {renderFeatureList(plan.features)}
                </ul>
              </div>

              <button
                onClick={() => handlePlanSelect(planId)}
                disabled={loading}
                className={`w-full py-4 rounded-lg font-semibold text-white transition-all transform hover:scale-105 ${
                  loading ? 'bg-gray-600 cursor-not-allowed' :
                  planId === 'pro'
                    ? 'bg-gradient-to-r from-purple-600 to-pink-500 neon-glow-strong hover:from-purple-700 hover:to-pink-600'
                    : planId === 'chaos'
                    ? 'bg-gradient-to-r from-yellow-600 to-orange-500 hover:from-yellow-700 hover:to-orange-600'
                    : 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800'
                }`}
              >
                {getButtonText(planId)}
              </button>
            </div>
          ))}
        </div>
        
        {/* ROI Comparison */}
        <div className="glass-card p-8 lg:p-12 mb-16">
          <h2 className="font-orbitron font-bold text-3xl lg:text-4xl text-center mb-12 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent" data-sb-field-path="roiSection.heading">
            Return on Investment
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Save Thousands in QA Costs</h3>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center mt-1 mr-4">
                    <span className="text-red-400 font-bold">VS</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-red-400 mb-2">Manual QA Team</h4>
                    <p className="text-gray-300">
                      A typical QA team of 2 full-time testers costs <span className="text-white font-bold">$150,000+</span> annually in salaries, benefits, and overhead.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center mt-1 mr-4">
                    <span className="text-green-400 font-bold">VS</span>
                  </div>
                  <div>
                    <h4 className="text-xl font-semibold text-green-400 mb-2">DEFFATEST Chaos Plan</h4>
                    <p className="text-gray-300">
                      Our Chaos plan costs just <span className="text-white font-bold">$4,200</span> annually with unlimited tests, 8 concurrent slots, and API access.
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-green-500/20 to-blue-500/20 border border-green-500/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold">Annual Savings:</span>
                  <span className="text-green-400 font-bold text-2xl">$145,800+</span>
                </div>
                <p className="text-gray-300 text-sm">
                  Plus, our AI finds more bugs, tests faster, and never needs vacation time.
                </p>
              </div>
            </div>
            
            <div className="h-80 bg-black/30 border border-purple-500/20 rounded-lg p-6">
              <div className="h-full flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-400 mb-4">97%</div>
                  <p className="text-xl text-white mb-2">Cost Reduction</p>
                  <p className="text-gray-400">Compared to traditional QA methods</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="glass-card p-8 lg:p-12 mb-16">
          <h2 className="font-orbitron font-bold text-3xl lg:text-4xl text-center mb-12 bg-gradient-to-r from-purple-500 to-cyan-400 bg-clip-text text-transparent" data-sb-field-path="faqSection.heading">
            Frequently Asked Questions
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white mb-2">Can I change plans later?</h3>
              <p className="text-gray-300">
                Yes, you can upgrade or downgrade your plan at any time. Changes take effect immediately.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white mb-2">How are tests counted?</h3>
              <p className="text-gray-300">
                Each test submission counts as one test. Test counts reset monthly on your billing date.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white mb-2">What payment methods do you accept?</h3>
              <p className="text-gray-300">
                We accept all major credit cards and PayPal through our secure payment processor, Paddle.
              </p>
            </div>
            
            <div className="space-y-2">
              <h3 className="text-xl font-semibold text-white mb-2">Is there a refund policy?</h3>
              <p className="text-gray-300">
                We offer a 14-day money-back guarantee if you haven't run any tests. Contact support for details.
              </p>
            </div>
          </div>
        </div>

        {/* Final Call to Action */}
        <div className="text-center">
          <div className="glass-card p-8 lg:p-12 max-w-2xl mx-auto">
            <h2 className="font-orbitron font-bold text-2xl lg:text-3xl mb-6 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent" data-sb-field-path="ctaSection.heading">
              Ready to Transform Your QA Process?
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed" data-sb-field-path="ctaSection.text">
              Start with our Free plan today, no credit card required.
            </p>
            <button 
              onClick={() => handlePlanSelect('free')}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-semibold text-white neon-glow-strong hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-110 hover:shadow-2xl"
            >
              Get Started Now
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Pricing;