import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  CreditCard, 
  Shield, 
  Key, 
  Save, 
  X, 
  Eye, 
  EyeOff, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  Crown,
  Rocket,
  Zap,
  MoreVertical,
  Plus,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import { supabase } from '../lib/supabase';

interface UserProfile {
  full_name: string;
  email: string;
  company_name: string;
  industry: string;
}

interface UserPlan {
  planType: string;
  subscriptionStatus: string;
  nextBillingDate?: string;
  testsThisMonthRemaining: number;
  maxConcurrentTests: number;
  paddleCustomerPortalUrl?: string;
}

interface ApiKey {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
  expires_at?: string;
}

function Settings() {
  const { user, profile, updateProfile } = useAuth();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Profile state
  const [profileData, setProfileData] = useState<UserProfile>({
    full_name: '',
    email: '',
    company_name: '',
    industry: 'Other'
  });
  const [originalProfileData, setOriginalProfileData] = useState<UserProfile>({
    full_name: '',
    email: '',
    company_name: '',
    industry: 'Other'
  });

  // Plan state
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);

  // Security state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  // API Keys state
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [showNewKeyModal, setShowNewKeyModal] = useState(false);
  const [newApiKey, setNewApiKey] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<string | null>(null);
  const [copiedKey, setCopiedKey] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchProfileData();
    fetchUserPlan();
    if (activeSection === 'api-access' && profile?.plan_type === 'chaos') {
      fetchApiKeys();
    }
  }, [user, navigate, activeSection, profile]);

  const fetchProfileData = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('full_name, email, company_name, industry')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      const profileInfo = {
        full_name: data.full_name || '',
        email: data.email || user?.email || '',
        company_name: data.company_name || '',
        industry: data.industry || 'Other'
      };

      setProfileData(profileInfo);
      setOriginalProfileData(profileInfo);
    } catch (error: any) {
      setError('Failed to load profile data');
      console.error('Error fetching profile:', error);
    }
  };

  const fetchUserPlan = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('plan_type, subscription_status, next_billing_date, tests_this_month_count, concurrent_test_slots, paddle_customer_id')
        .eq('user_id', user?.id)
        .single();

      if (error) throw error;

      if (data) {
        // Calculate tests remaining
        let testsLimit = 1; // Free plan
        if (data.plan_type === 'pro') testsLimit = 25;
        else if (data.plan_type === 'chaos') testsLimit = Infinity;
        
        const testsRemaining = testsLimit === Infinity ? Infinity : Math.max(0, testsLimit - (data.tests_this_month_count || 0));
        
        setUserPlan({
          planType: data.plan_type || 'free',
          subscriptionStatus: data.subscription_status || 'FREE',
          nextBillingDate: data.next_billing_date,
          testsThisMonthRemaining: testsRemaining,
          maxConcurrentTests: data.concurrent_test_slots || 1,
          paddleCustomerPortalUrl: data.paddle_customer_id ? `https://customers.paddle.com/customer/portal/${data.paddle_customer_id}` : undefined
        });
      }
    } catch (error: any) {
      setError('Failed to load plan data');
      console.error('Error fetching plan:', error);
    }
  };

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('id, name, is_active, created_at, expires_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setApiKeys(data || []);
    } catch (error: any) {
      setError('Failed to load API keys');
      console.error('Error fetching API keys:', error);
    }
  };

  const handleProfileSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          company_name: profileData.company_name,
          industry: profileData.industry
        })
        .eq('user_id', user?.id);

      if (error) throw error;

      setOriginalProfileData(profileData);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError('Failed to update profile. Please try again.');
      console.error('Error updating profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileCancel = () => {
    setProfileData(originalProfileData);
    setError('');
    setSuccess('');
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setSuccess('Password updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError(error.message || 'Failed to change password');
    } finally {
      setLoading(false);
    }
  };

  const generateApiKey = async () => {
    setLoading(true);
    setError('');

    try {
      const { data, error } = await supabase.rpc('generate_api_key');

      if (error) throw error;

      setNewApiKey(data.api_key);
      setShowNewKeyModal(true);
      await fetchApiKeys();
    } catch (error: any) {
      setError(error.message || 'Failed to generate API key');
    } finally {
      setLoading(false);
    }
  };

  const toggleApiKeyStatus = async (keyId: string, isActive: boolean) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ is_active: !isActive })
        .eq('id', keyId);

      if (error) throw error;
      await fetchApiKeys();
    } catch (error: any) {
      setError('Failed to update API key status');
    }
  };

  const deleteApiKey = async (keyId: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', keyId);

      if (error) throw error;
      await fetchApiKeys();
      setShowDeleteModal(null);
      setSuccess('API key deleted successfully');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error: any) {
      setError('Failed to delete API key');
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedKey(true);
      setTimeout(() => setCopiedKey(false), 2000);
    }
  };

  const getPlanIcon = (planType: string) => {
    switch (planType) {
      case 'chaos':
        return <Crown className="w-5 h-5 text-yellow-400" />;
      case 'pro':
        return <Rocket className="w-5 h-5 text-blue-400" />;
      default:
        return <Zap className="w-5 h-5 text-gray-400" />;
    }
  };

  const getPlanColor = (planType: string) => {
    switch (planType) {
      case 'chaos':
        return 'text-yellow-400';
      case 'pro':
        return 'text-blue-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canAccessApiKeys = profile?.plan_type === 'chaos';

  return (
    <DashboardLayout currentPage="settings">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="font-orbitron font-bold text-4xl lg:text-5xl mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
            Settings
          </h1>
          <p className="text-xl text-gray-300">
            Manage your account, billing, and preferences
          </p>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
            <div className="flex items-center">
              <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
              <p className="text-green-300">{success}</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
            <div className="flex items-center">
              <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
              <p className="text-red-300">{error}</p>
            </div>
          </div>
        )}

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6">
              <nav className="space-y-2">
                <button
                  onClick={() => setActiveSection('profile')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === 'profile'
                      ? 'bg-purple-500/20 text-cyan-400 border border-purple-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
                  }`}
                >
                  <User className="w-5 h-5 mr-3" />
                  <span className="font-medium">Profile</span>
                </button>
                <button
                  onClick={() => setActiveSection('billing')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === 'billing'
                      ? 'bg-purple-500/20 text-cyan-400 border border-purple-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mr-3" />
                  <span className="font-medium">Subscription & Billing</span>
                </button>
                <button
                  onClick={() => setActiveSection('security')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === 'security'
                      ? 'bg-purple-500/20 text-cyan-400 border border-purple-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
                  }`}
                >
                  <Shield className="w-5 h-5 mr-3" />
                  <span className="font-medium">Security</span>
                </button>
                <button
                  onClick={() => setActiveSection('api-access')}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeSection === 'api-access'
                      ? 'bg-purple-500/20 text-cyan-400 border border-purple-500/30'
                      : 'text-gray-300 hover:text-white hover:bg-purple-500/10'
                  } ${!canAccessApiKeys ? 'opacity-50' : ''}`}
                >
                  <Key className="w-5 h-5 mr-3" />
                  <span className="font-medium">API Access</span>
                </button>
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-3">
            {/* Profile Section */}
            {activeSection === 'profile' && (
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-cyan-400 mb-6">Profile Information</h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium text-gray-300 mb-2">
                      Full Name
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={profileData.full_name}
                      onChange={(e) => setProfileData({ ...profileData, full_name: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                      placeholder="Enter your full name"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                      Email Address
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={profileData.email}
                      disabled
                      className="w-full px-4 py-3 bg-black/30 border border-purple-500/20 rounded-lg text-gray-400 focus:outline-none transition-colors cursor-not-allowed"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      To change your email address, please contact support.
                    </p>
                  </div>

                  <div>
                    <label htmlFor="company" className="block text-sm font-medium text-gray-300 mb-2">
                      Company Name
                    </label>
                    <input
                      id="company"
                      type="text"
                      value={profileData.company_name}
                      onChange={(e) => setProfileData({ ...profileData, company_name: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                      placeholder="Enter your company name"
                    />
                  </div>

                  <div>
                    <label htmlFor="industry" className="block text-sm font-medium text-gray-300 mb-2">
                      Industry
                    </label>
                    <select
                      id="industry"
                      value={profileData.industry}
                      onChange={(e) => setProfileData({ ...profileData, industry: e.target.value })}
                      className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                    >
                      <option value="Software Development">Software Development</option>
                      <option value="QA & Testing">QA & Testing</option>
                      <option value="E-commerce">E-commerce</option>
                      <option value="Healthcare">Healthcare</option>
                      <option value="Finance">Finance</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      onClick={handleProfileSave}
                      disabled={loading}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5 mr-2" />
                          Save Changes
                        </>
                      )}
                    </button>
                    <button
                      onClick={handleProfileCancel}
                      className="flex items-center px-6 py-3 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
                    >
                      <X className="w-5 h-5 mr-2" />
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Subscription & Billing Section */}
            {activeSection === 'billing' && (
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-cyan-400 mb-6">Subscription & Billing</h2>
                
                {userPlan ? (
                  <div className="space-y-6">
                    {/* Current Plan */}
                    <div className={`bg-gradient-to-r ${
                      userPlan.planType === 'chaos' ? 'from-purple-600/20 to-pink-500/20 border-purple-500/30' :
                      userPlan.planType === 'pro' ? 'from-blue-600/20 to-purple-600/20 border-blue-500/30' :
                      'from-gray-600/20 to-gray-700/20 border-gray-500/30'
                    } border rounded-lg p-6`}>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          {getPlanIcon(userPlan.planType)}
                          <div>
                            <h3 className="text-xl font-bold text-white">
                              Your Current Plan: <span className={getPlanColor(userPlan.planType)}>
                                {userPlan.planType.toUpperCase()}
                              </span>
                            </h3>
                            <p className={`text-sm ${
                              userPlan.subscriptionStatus === 'ACTIVE' ? 'text-green-400' :
                              userPlan.subscriptionStatus === 'TRIALING' ? 'text-yellow-400' :
                              userPlan.subscriptionStatus === 'PAST_DUE' ? 'text-orange-400' :
                              'text-red-400'
                            }`}>
                              Status: {userPlan.subscriptionStatus}
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6">
                        {userPlan.nextBillingDate && (
                          <div className="flex justify-between">
                            <span className="text-gray-400">Next Billing Date:</span>
                            <span className="text-white">{formatDate(userPlan.nextBillingDate)}</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-gray-400">Tests Remaining:</span>
                          <span className="text-white">
                            {userPlan.planType === 'chaos' ? 'Unlimited' : 
                             `${userPlan.testsThisMonthRemaining} of ${userPlan.planType === 'pro' ? '25' : '1'} this month`}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-400">Concurrent Test Slots:</span>
                          <span className="text-white">{userPlan.maxConcurrentTests}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4">
                        {userPlan.paddleCustomerPortalUrl && (
                          <a 
                            href={userPlan.paddleCustomerPortalUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105"
                          >
                            <CreditCard className="w-5 h-5 mr-2" />
                            Manage Subscription
                          </a>
                        )}
                        <a 
                          href="/pricing"
                          className="flex items-center px-6 py-3 border border-purple-500/50 rounded-lg text-purple-400 hover:bg-purple-500/10 transition-all"
                        >
                          <ExternalLink className="w-5 h-5 mr-2" />
                          View All Plans
                        </a>
                        {userPlan.planType === 'free' && (
                          <a 
                            href="/pricing"
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-500 rounded-lg font-semibold text-white hover:from-yellow-700 hover:to-orange-600 transition-all transform hover:scale-105"
                          >
                            <Crown className="w-5 h-5 mr-2" />
                            Upgrade Now
                          </a>
                        )}
                        {userPlan.planType === 'pro' && (
                          <a 
                            href="/pricing"
                            className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105"
                          >
                            <Crown className="w-5 h-5 mr-2" />
                            Upgrade to Chaos
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Plan Features */}
                    <div className="border border-purple-500/20 rounded-lg p-6">
                      <h3 className="text-lg font-semibold text-white mb-4">Your Plan Features</h3>
                      <div className="space-y-2">
                        {userPlan.planType === 'free' && (
                          <>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                              <span className="text-gray-300">1 test per month</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                              <span className="text-gray-300">Max 5 min per test</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                              <span className="text-gray-300">Standard queue priority</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                              <span className="text-gray-300">Basic bug reports</span>
                            </div>
                          </>
                        )}
                        {userPlan.planType === 'pro' && (
                          <>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                              <span className="text-gray-300">25 tests per month</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                              <span className="text-gray-300">Max 2 hours per test</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                              <span className="text-gray-300">Priority queue</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                              <span className="text-gray-300">4 concurrent test slots (2 web, 2 app)</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                              <span className="text-gray-300">Detailed test logs</span>
                            </div>
                          </>
                        )}
                        {userPlan.planType === 'chaos' && (
                          <>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                              <span className="text-gray-300">Unlimited tests</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                              <span className="text-gray-300">Max 6 hours per test</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                              <span className="text-gray-300">Instant queue priority</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                              <span className="text-gray-300">8 concurrent test slots (4 web, 4 app)</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                              <span className="text-gray-300">API access for CI/CD integration</span>
                            </div>
                            <div className="flex items-center">
                              <CheckCircle className="w-4 h-4 text-green-400 mr-3" />
                              <span className="text-gray-300">Advanced analytics</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-40">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
                  </div>
                )}
              </div>
            )}

            {/* Security Section */}
            {activeSection === 'security' && (
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-cyan-400 mb-6">Security Settings</h2>
                <div className="space-y-6">
                  <div>
                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-300 mb-2">
                      Current Password
                    </label>
                    <div className="relative">
                      <input
                        id="currentPassword"
                        type={showPasswords.current ? 'text' : 'password'}
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                        placeholder="Enter your current password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPasswords.current ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-300 mb-2">
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        id="newPassword"
                        type={showPasswords.new ? 'text' : 'password'}
                        value={passwordData.newPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                        placeholder="Enter your new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPasswords.new ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  <div>
                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300 mb-2">
                      Confirm New Password
                    </label>
                    <div className="relative">
                      <input
                        id="confirmPassword"
                        type={showPasswords.confirm ? 'text' : 'password'}
                        value={passwordData.confirmPassword}
                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                        className="w-full px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                        placeholder="Confirm your new password"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                      >
                        {showPasswords.confirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                      </button>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={handlePasswordChange}
                      disabled={loading || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                      className="flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Changing...
                        </>
                      ) : (
                        <>
                          <Shield className="w-5 h-5 mr-2" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* API Access Section */}
            {activeSection === 'api-access' && (
              <div className="glass-card p-8">
                <h2 className="text-2xl font-bold text-cyan-400 mb-6">API Access</h2>
                
                {!canAccessApiKeys ? (
                  <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg p-8 text-center">
                    <Crown className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-white mb-4">Unlock Advanced Automation</h3>
                    <p className="text-gray-300 mb-6">
                      API Access is an exclusive feature for Chaos Mode users. Seamlessly integrate DEFFATEST into your CI/CD pipelines and automate your testing workflows.
                    </p>
                    <a 
                      href="/pricing"
                      className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105"
                    >
                      <Crown className="w-5 h-5 mr-2" />
                      Upgrade to Chaos Mode
                    </a>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h3 className="text-xl font-semibold text-purple-400">Your API Keys</h3>
                      <button
                        onClick={generateApiKey}
                        disabled={loading}
                        className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg text-sm font-semibold text-white hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            Generating...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Generate New API Key
                          </>
                        )}
                      </button>
                    </div>

                    {apiKeys.length === 0 ? (
                      <div className="bg-black/30 border border-purple-500/20 rounded-lg p-8 text-center">
                        <Key className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-white mb-2">No API Keys Found</h3>
                        <p className="text-gray-400 mb-6">
                          Generate your first key to start automating!
                        </p>
                        <button
                          onClick={generateApiKey}
                          disabled={loading}
                          className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {loading ? (
                            <>
                              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                              Generating...
                            </>
                          ) : (
                            <>
                              <Key className="w-5 h-5 mr-2" />
                              Generate New API Key
                            </>
                          )}
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {apiKeys.map((key) => (
                          <div key={key.id} className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <div className="flex items-center space-x-3 mb-2">
                                  <span className="font-mono text-lg text-white">{key.name}</span>
                                  <span className={`px-2 py-1 text-xs rounded-full ${
                                    key.is_active ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-400'
                                  }`}>
                                    {key.is_active ? 'ACTIVE' : 'INACTIVE'}
                                  </span>
                                </div>
                                <div className="text-sm text-gray-400">
                                  <span>Created: {formatDate(key.created_at)}</span>
                                  {key.expires_at && (
                                    <span className="ml-4">Expires: {formatDate(key.expires_at)}</span>
                                  )}
                                </div>
                              </div>
                              <div className="relative">
                                <button
                                  onClick={() => {
                                    const dropdown = document.getElementById(`dropdown-${key.id}`);
                                    if (dropdown) {
                                      dropdown.classList.toggle('hidden');
                                    }
                                  }}
                                  className="p-2 text-gray-400 hover:text-white transition-colors rounded-full hover:bg-gray-700/50"
                                >
                                  <MoreVertical className="w-5 h-5" />
                                </button>
                                <div 
                                  id={`dropdown-${key.id}`}
                                  className="absolute right-0 mt-2 w-48 bg-black/80 border border-purple-500/30 rounded-lg shadow-lg backdrop-blur-sm z-10 hidden"
                                >
                                  <div className="py-1">
                                    <button
                                      onClick={() => toggleApiKeyStatus(key.id, key.is_active)}
                                      className="w-full text-left px-4 py-2 text-gray-300 hover:bg-purple-500/20 hover:text-white transition-colors"
                                    >
                                      {key.is_active ? 'Deactivate Key' : 'Activate Key'}
                                    </button>
                                    <button
                                      onClick={() => setShowDeleteModal(key.id)}
                                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-colors"
                                    >
                                      Delete Key
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                      <h4 className="text-blue-400 font-semibold mb-2">API Documentation</h4>
                      <p className="text-gray-300 text-sm mb-3">
                        Use your API key to authenticate requests to the DEFFATEST API. All API requests should include your key in the Authorization header:
                      </p>
                      <div className="bg-black/50 p-3 rounded-lg font-mono text-sm text-gray-300 mb-3">
                        Authorization: Bearer sk-deffatest-your-api-key
                      </div>
                      <a 
                        href="/docs"
                        className="text-blue-400 hover:text-blue-300 transition-colors text-sm flex items-center"
                      >
                        <ExternalLink className="w-4 h-4 mr-1" />
                        View Full API Documentation
                      </a>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New API Key Modal */}
      {showNewKeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-card p-8 max-w-2xl w-full mx-4">
            <div className="text-center">
              <Key className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-400 mb-6">API Key Generated</h2>
              
              <div className="bg-black/50 border border-green-500/30 rounded-lg p-4 mb-6">
                <p className="text-yellow-300 font-bold mb-4">
                  WARNING: This key will only be shown once. Please copy it now and store it securely.
                </p>
                <div className="relative">
                  <div className="bg-black/70 p-4 rounded-lg font-mono text-sm text-white break-all">
                    {newApiKey}
                  </div>
                  <button
                    onClick={() => copyToClipboard(newApiKey)}
                    className="absolute top-2 right-2 p-2 bg-gray-800 rounded-lg text-gray-300 hover:text-white transition-colors"
                  >
                    {copiedKey ? <CheckCircle className="w-5 h-5 text-green-400" /> : <Copy className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              
              <button
                onClick={() => {
                  setShowNewKeyModal(false);
                  setNewApiKey('');
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete API Key Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div className="glass-card p-8 max-w-2xl w-full mx-4">
            <div className="text-center">
              <AlertTriangle className="w-16 h-16 text-red-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-red-400 mb-6">Confirm API Key Deletion</h2>
              
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-6">
                <p className="text-red-300 font-bold text-lg">
                  WARNING: Deleting this API key will immediately disable any integrations using it. This action is irreversible. You will need to generate a new key if you wish to re-enable automated testing.
                </p>
              </div>
              
              <div className="flex space-x-6">
                <button
                  onClick={() => setShowDeleteModal(null)}
                  className="flex-1 py-3 border border-gray-600 rounded-lg text-gray-300 hover:text-white hover:border-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => showDeleteModal && deleteApiKey(showDeleteModal)}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-700 rounded-lg text-white font-semibold transition-colors"
                >
                  Confirm Deletion
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Settings;