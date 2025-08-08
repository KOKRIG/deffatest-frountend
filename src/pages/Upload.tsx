import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Globe, 
  Smartphone, 
  Upload as UploadIcon, 
  Play, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  MoreHorizontal,
  AlertTriangle,
  Zap,
  LogOut,
  Settings,
  Menu,
  X,
  Activity,
  Plus,
  ArrowRight,
  FileText,
  Link as LinkIcon,
  Trash2,
  AlertCircle,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { apiClient, handleApiError } from '../lib/api';
import { supabase, Profile, Test } from '../lib/supabase';

interface UserPlan {
  planType: string;
  maxConcurrentTests: number;
  availableDurations: string[];
  currentActiveTests: number;
}

const DURATION_OPTIONS = [
  { value: '5', label: '5 min', planRequirement: 'free' },
  { value: '10', label: '10 min', planRequirement: 'pro' },
  { value: '20', label: '20 min', planRequirement: 'pro' },
  { value: '30', label: '30 min', planRequirement: 'pro' },
  { value: '45', label: '45 min', planRequirement: 'pro' },
  { value: '70', label: '1 hour 10 min', planRequirement: 'pro' },
  { value: '90', label: '1 hour 30 min', planRequirement: 'pro' },
  { value: '110', label: '1 hour 50 min', planRequirement: 'pro' },
  { value: '120', label: '2 hours 0 min', planRequirement: 'pro' },
  { value: '200', label: '3 hours 20 min', planRequirement: 'chaos' },
  { value: '250', label: '4 hours 10 min', planRequirement: 'chaos' },
  { value: '300', label: '5 hours 0 min', planRequirement: 'chaos' },
  { value: '360', label: '6 hours 0 min', planRequirement: 'chaos' }
];

function Upload() {
  const { user, profile, session, signOut } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<'choose' | 'web' | 'app'>('choose');
  const [userPlan, setUserPlan] = useState<UserPlan | null>(null);
  const [liveTests, setLiveTests] = useState<Test[]>([]);
  const [testHistory, setTestHistory] = useState<Test[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);
  const [historyOffset, setHistoryOffset] = useState(0);
  const [hasMoreHistory, setHasMoreHistory] = useState(false);
  const [totalHistoryCount, setTotalHistoryCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter and sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filterBy, setFilterBy] = useState('all');

  // Form states - Updated for new schema
  const [webFormData, setWebFormData] = useState({
    test_name: '',
    inputType: 'url', // 'url' or 'bundle'
    test_source_url: '', // Changed from appUrl
    requested_duration_minutes: 5, // Changed from duration
    file: null as File | null
  });

  const [appFormData, setAppFormData] = useState({
    test_name: '',
    requested_duration_minutes: 5, // Changed from duration
    fileType: 'apk',
    file: null as File | null
  });

  const [showCancelModal, setShowCancelModal] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Set auth token for API client
    if (session?.access_token) {
      apiClient.setAuthToken(session.access_token);
    }
    fetchInitialData();
  }, [user, navigate, session]);

  useEffect(() => {
    fetchTestHistory();
  }, [sortBy, filterBy, searchQuery]);

  // Auto-refresh live tests every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (liveTests.length > 0) {
        fetchLiveTests();
      }
    }, 10000);

    return () => clearInterval(interval);
  }, [liveTests.length]);

  const fetchInitialData = async () => {
    try {
      await Promise.all([
        fetchUserPlan(),
        fetchLiveTests(),
        fetchTestHistory()
      ]);
    } catch (error) {
      console.error('Error fetching initial data:', error);
    }
  };

  const fetchUserPlan = async () => {
    try {
      if (!user?.id) return;
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (profileError) {
        throw new Error(`Failed to fetch profile: ${profileError.message}`);
      }
      
      const planType = profileData.plan_type || 'free';
      const maxConcurrentTests = profileData.concurrent_test_slots || (planType === 'free' ? 1 : planType === 'pro' ? 4 : 8);
      
      setUserPlan({
        planType,
        maxConcurrentTests,
        availableDurations: DURATION_OPTIONS
          .filter(option => {
            if (planType === 'free') return option.planRequirement === 'free';
            if (planType === 'pro') return ['free', 'pro'].includes(option.planRequirement);
            return true; // chaos can access all
          })
          .map(option => option.value),
        currentActiveTests: 0 // Will be updated by fetchLiveTests
      });
    } catch (error) {
      console.error('Error fetching user plan:', error);
      setError(handleApiError(error instanceof Error ? error.message : 'Failed to fetch user plan'));
    }
  };

  const fetchLiveTests = async () => {
    try {
      if (!user?.id) return;
      
      const { data: liveTestsData, error: liveTestsError } = await supabase
        .from('tests')
        .select('*')
        .eq('user_id', user.id)
        .in('status', ['queued', 'running', 'processing_results'])
        .order('submitted_at', { ascending: false });
      
      if (liveTestsError) {
        throw new Error(`Failed to fetch live tests: ${liveTestsError.message}`);
      }
      
      setLiveTests(liveTestsData || []);
      
      // Update current active tests count
      if (userPlan) {
        setUserPlan(prev => prev ? { ...prev, currentActiveTests: liveTestsData?.length || 0 } : null);
      }
    } catch (error) {
      console.error('Error fetching live tests:', error);
      setError(handleApiError(error instanceof Error ? error.message : 'Failed to fetch live tests'));
    }
  };

  const fetchTestHistory = async (offset = 0, append = false) => {
    try {
      setHistoryLoading(!append);
      
      if (!user?.id) return;
      
      let query = supabase
        .from('tests')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .eq('status', 'completed')
        .range(offset, offset + 9);
      
      // Apply search filter
      if (searchQuery.trim()) {
        query = query.ilike('test_name', `%${searchQuery.trim()}%`);
      }
      
      // Apply type filter
      if (filterBy !== 'all') {
        const typeFilter = filterBy === 'web' ? 'web_url' : 'android_apk';
        query = query.eq('test_type', typeFilter);
      }
      
      // Apply sorting
      const ascending = sortBy === 'oldest';
      query = query.order('submitted_at', { ascending });
      
      const { data: historyData, error: historyError, count } = await query;
      
      if (historyError) {
        throw new Error(`Failed to fetch test history: ${historyError.message}`);
      }
      
      const tests = historyData || [];
      
      if (append) {
        setTestHistory(prev => [...prev, ...tests]);
      } else {
        setTestHistory(tests);
        setHistoryOffset(0);
      }
      
      setTotalHistoryCount(count || 0);
      setHasMoreHistory(tests.length === 10 && offset + 10 < (count || 0));
      
    } catch (error) {
      console.error('Error fetching test history:', error);
      setError(handleApiError(error instanceof Error ? error.message : 'Failed to fetch test history'));
    } finally {
      setHistoryLoading(false);
    }
  };

  const handleLoadMore = () => {
    const newOffset = historyOffset + 10;
    setHistoryOffset(newOffset);
    fetchTestHistory(newOffset, true);
  };

  const handleFileUpload = (file: File, type: 'web' | 'app') => {
    if (type === 'web') {
      // Validate .zip file
      if (!file.name.toLowerCase().endsWith('.zip')) {
        setError('Error: The selected file\'s type does not match. Please upload a .zip file for a web bundle.');
        return;
      }
      setWebFormData(prev => ({ ...prev, file }));
    } else {
      // Validate .apk file
      if (!file.name.toLowerCase().endsWith('.apk')) {
        setError('Error: The selected file\'s type does not match the chosen file type. Please upload the correct format or change your selection from the dropdown.');
        return;
      }
      setAppFormData(prev => ({ ...prev, file }));
    }
    setError('');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, type: 'web' | 'app') => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0], type);
    }
  };

  const validateForm = (type: 'web' | 'app') => {
    if (type === 'web') {
      if (!webFormData.test_name.trim()) {
        setError('Test name is required');
        return false;
      }
      if (webFormData.inputType === 'url' && !webFormData.test_source_url.trim()) {
        setError('Application URL is required');
        return false;
      }
      if (webFormData.inputType === 'bundle' && !webFormData.file) {
        setError('Please upload a web bundle file');
        return false;
      }
    } else {
      if (!appFormData.test_name.trim()) {
        setError('Test name is required');
        return false;
      }
      if (!appFormData.file) {
        setError('Please upload an APK file');
        return false;
      }
    }
    return true;
  };

  const submitTest = async (type: 'web' | 'app') => {
    if (!validateForm(type)) return;
    
    // Check concurrent test limits
    if (userPlan && liveTests.length >= userPlan.maxConcurrentTests) {
      setError(`You have reached your maximum of ${userPlan.maxConcurrentTests} concurrent live test slots. Please wait for a test to complete or cancel one to submit a new test.`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      let testRequest;
      
      if (type === 'web') {
        testRequest = {
          test_name: webFormData.test_name,
          test_type: webFormData.inputType === 'url' ? 'web_url' as const : 'web_bundle' as const,
          test_source_url: webFormData.inputType === 'url' ? webFormData.test_source_url : undefined,
          requested_duration_minutes: webFormData.requested_duration_minutes,
          plan_type_at_submission: profile?.plan_type || 'free',
          file: webFormData.inputType === 'bundle' ? webFormData.file : undefined
        };
      } else {
        testRequest = {
          test_name: appFormData.test_name,
          test_type: 'android_apk' as const,
          requested_duration_minutes: appFormData.requested_duration_minutes,
          plan_type_at_submission: profile?.plan_type || 'free',
          file: appFormData.file
        };
      }

      const response = await apiClient.submitTest(testRequest);

      if (response.success && response.data) {
        setSuccess('Test initiated successfully! Tracking your progress below.');
        
        // Reset form
        if (type === 'web') {
          setWebFormData({
            test_name: '',
            inputType: 'url',
            test_source_url: '',
            requested_duration_minutes: 5,
            file: null
          });
        } else {
          setAppFormData({
            test_name: '',
            requested_duration_minutes: 5,
            fileType: 'apk',
            file: null
          });
        }

        // Refresh data
        await fetchLiveTests();
        
        // Hide form and show choose section
        setActiveSection('choose');
      } else {
        throw new Error(response.error || 'Failed to submit test');
      }
    } catch (error: any) {
      setError(handleApiError(error.message || 'An error occurred while submitting the test'));
    } finally {
      setLoading(false);
    }
  };

  const cancelTest = async (testId: string) => {
    try {
      const response = await apiClient.cancelTest(testId);

      if (response.success) {
        setSuccess('Test cancelled successfully');
        await fetchLiveTests();
        setShowCancelModal(null);
      } else {
        throw new Error(response.error || 'Failed to cancel test');
      }
    } catch (error: any) {
      setError(handleApiError(error.message || 'Failed to cancel test'));
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'running':
        return <Play className="w-5 h-5 text-blue-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'processing_results':
        return <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />;
      default: // For 'queued' (changed from 'pending')
        return <Clock className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'running':
        return 'text-blue-400';
      case 'failed':
        return 'text-red-400';
      case 'processing_results':
        return 'text-cyan-400';
      default: // For 'queued' (changed from 'pending')
        return 'text-yellow-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (minutes: number) => {
    if (!minutes) return 'N/A';
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  // Updated to handle new test types
  const getTestTypeLabel = (test: Test) => {
    switch(test.test_type) {
      case 'web_url':
        return 'Web (URL)';
      case 'web_bundle':
        return 'Web (Bundle)';
      case 'android_apk':
        return 'Android APK';
      default:
        return test.test_type;
    }
  };

  const getDurationOptions = () => {
    if (!userPlan) return [];
    
    return DURATION_OPTIONS.filter(option => {
      if (userPlan.planType === 'free') return option.planRequirement === 'free';
      if (userPlan.planType === 'pro') return ['free', 'pro'].includes(option.planRequirement);
      return true; // chaos can access all
    });
  };

  const canSubmitTest = () => {
    return userPlan && liveTests.length < userPlan.maxConcurrentTests;
  };

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
              <div className="flex items-center space-x-2">
                <Zap className="w-8 h-8 text-cyan-400" />
                <span className="font-orbitron font-bold text-xl bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
                  DEFFATEST
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="hidden sm:block text-gray-300">Welcome, {profile?.full_name || user?.email}</span>
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
          <nav className="space-y-2">
            <button
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center px-4 py-3 text-left rounded-lg text-gray-300 hover:text-white hover:bg-purple-500/10 transition-colors"
            >
              <Activity className="w-5 h-5 mr-3" />
              <span className="font-medium">Dashboard</span>
            </button>
            <div className="bg-purple-500/20 text-cyan-400 border border-purple-500/30 w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors">
              <Plus className="w-5 h-5 mr-3" />
              <span className="font-medium">Upload</span>
            </div>
            <button
              onClick={() => navigate('/results')}
              className="w-full flex items-center px-4 py-3 text-left rounded-lg text-gray-300 hover:text-white hover:bg-purple-500/10 transition-colors"
            >
              <Eye className="w-5 h-5 mr-3" />
              <span className="font-medium">Results</span>
            </button>
            <button
              onClick={() => navigate('/settings')}
              className="w-full flex items-center px-4 py-3 text-left rounded-lg text-gray-300 hover:text-white hover:bg-purple-500/10 transition-colors"
            >
              <Settings className="w-5 h-5 mr-3" />
              <span className="font-medium">Settings</span>
            </button>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 pt-24 pb-12 lg:ml-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          {/* Success/Error Messages */}
          {success && (
            <div className="bg-green-500/10 border border-green-500/50 rounded-lg p-4">
              <div className="flex items-center">
                <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                <p className="text-green-300 text-sm">{success}</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-red-400 mr-2" />
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            </div>
          )}

          {/* Choose What To Test Section */}
          {activeSection === 'choose' && canSubmitTest() && (
            <section className="space-y-8">
              <h1 className="font-orbitron font-bold text-4xl lg:text-6xl text-center bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-purple-500 bg-clip-text text-transparent">
                Choose What To Test
              </h1>
              <div className="flex justify-center gap-8 flex-wrap max-w-4xl mx-auto">
                <button
                  onClick={() => setActiveSection('web')}
                  className="glass-card p-12 text-center group hover:scale-105 transition-all min-w-[300px]"
                >
                  <div className="w-24 h-24 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all">
                    <Globe className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="font-orbitron font-bold text-3xl text-cyan-400 mb-4">Web</h2>
                  <p className="text-xl text-gray-300 leading-relaxed">Test web applications via URL or upload HTML/JS bundles</p>
                </button>

                <button
                  onClick={() => setActiveSection('app')}
                  className="glass-card p-12 text-center group hover:scale-105 transition-all min-w-[300px]"
                >
                  <div className="w-24 h-24 bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl flex items-center justify-center mx-auto mb-8 group-hover:shadow-lg group-hover:shadow-purple-500/50 transition-all">
                    <Smartphone className="w-12 h-12 text-white" />
                  </div>
                  <h2 className="font-orbitron font-bold text-3xl text-cyan-400 mb-4">App</h2>
                  <p className="text-xl text-gray-300 leading-relaxed">Test Android applications by uploading APK files</p>
                </button>
              </div>
            </section>
          )}

          {/* Slots Full Message */}
          {!canSubmitTest() && (
            <section className="space-y-8">
              <div className="glass-card p-12 text-center max-w-2xl mx-auto">
                <AlertTriangle className="w-20 h-20 text-yellow-400 mx-auto mb-6" />
                <h2 className="font-orbitron font-bold text-3xl text-yellow-400 mb-6">
                  Test Slots Full
                </h2>
                <p className="text-xl text-gray-300 mb-6 leading-relaxed">
                  You have reached your maximum of {userPlan?.maxConcurrentTests} concurrent live test slots. 
                  Please wait for a test to complete or cancel one to submit a new test.
                </p>
                <div className="text-lg text-gray-400">
                  Current plan: <span className="text-cyan-400 font-bold">{userPlan?.planType.toUpperCase()}</span>
                </div>
              </div>
            </section>
          )}

          {/* Web Test Form */}
          {activeSection === 'web' && (
            <section className="space-y-8">
              <div className="glass-card p-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-orbitron font-bold text-4xl text-cyan-400">Start a Web Test</h2>
                  <button
                    onClick={() => setActiveSection('choose')}
                    className="flex items-center px-6 py-3 text-gray-400 hover:text-white transition-colors"
                  >
                    ← Choose Test Type
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); submitTest('web'); }} className="space-y-8">
                  {/* Test Name */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-300 mb-3">
                      Test Name *
                    </label>
                    <input
                      type="text"
                      value={webFormData.test_name}
                      onChange={(e) => setWebFormData(prev => ({ ...prev, test_name: e.target.value }))}
                      className="w-full px-6 py-4 bg-black/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors text-lg"
                      placeholder="Enter test name"
                      required
                    />
                  </div>

                  {/* Input Type Selection */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-300 mb-3">
                      Test Input Type
                    </label>
                    <div className="grid grid-cols-2 gap-6">
                      <button
                        type="button"
                        onClick={() => setWebFormData(prev => ({ ...prev, inputType: 'url', file: null }))}
                        className={`p-6 rounded-xl border-2 transition-colors ${
                          webFormData.inputType === 'url'
                            ? 'border-cyan-400 bg-cyan-400/10'
                            : 'border-purple-500/30 hover:border-purple-500/50'
                        }`}
                      >
                        <LinkIcon className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                        <div className="text-white font-bold text-lg">Enter Web URL</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setWebFormData(prev => ({ ...prev, inputType: 'bundle', test_source_url: '' }))}
                        className={`p-6 rounded-xl border-2 transition-colors ${
                          webFormData.inputType === 'bundle'
                            ? 'border-cyan-400 bg-cyan-400/10'
                            : 'border-purple-500/30 hover:border-purple-500/50'
                        }`}
                      >
                        <FileText className="w-8 h-8 mx-auto mb-3 text-cyan-400" />
                        <div className="text-white font-bold text-lg">Upload Web Bundle</div>
                      </button>
                    </div>
                  </div>

                  {/* URL Input */}
                  {webFormData.inputType === 'url' && (
                    <div>
                      <label className="block text-lg font-semibold text-gray-300 mb-3">
                        Web Application URL *
                      </label>
                      <input
                        type="url"
                        value={webFormData.test_source_url}
                        onChange={(e) => setWebFormData(prev => ({ ...prev, test_source_url: e.target.value }))}
                        className="w-full px-6 py-4 bg-black/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors text-lg"
                        placeholder="https://www.your-app.com"
                        required
                      />
                    </div>
                  )}

                  {/* File Upload */}
                  {webFormData.inputType === 'bundle' && (
                    <div>
                      <label className="block text-lg font-semibold text-gray-300 mb-3">
                        Web Bundle Upload (.zip only) *
                      </label>
                      <div
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, 'web')}
                        className="border-2 border-dashed border-purple-500/30 rounded-xl p-12 text-center hover:border-purple-500/50 transition-colors cursor-pointer"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <UploadIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                        {webFormData.file ? (
                          <div>
                            <p className="text-green-400 font-bold text-xl">{webFormData.file.name}</p>
                            <p className="text-gray-400 text-lg mt-2">Click to change file</p>
                          </div>
                        ) : (
                          <div>
                            <p className="text-gray-300 mb-3 text-xl">Drag & Drop your Web Bundle Here</p>
                            <p className="text-gray-400 text-lg">or click to upload (.zip files only)</p>
                          </div>
                        )}
                      </div>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept=".zip"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(file, 'web');
                        }}
                        className="hidden"
                      />
                    </div>
                  )}

                  {/* Duration Selection */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-300 mb-3">
                      Test Duration
                    </label>
                    <select
                      value={webFormData.requested_duration_minutes.toString()}
                      onChange={(e) => setWebFormData(prev => ({ 
                        ...prev, 
                        requested_duration_minutes: parseInt(e.target.value)
                      }))}
                      className="w-full px-6 py-4 bg-black/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors text-lg"
                    >
                      {getDurationOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                      Available durations based on your {userPlan?.planType.toUpperCase()} plan
                    </p>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-bold text-white text-xl neon-glow-strong hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Submitting Test...
                      </div>
                    ) : (
                      'Start the Test'
                    )}
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* App Test Form */}
          {activeSection === 'app' && (
            <section className="space-y-8">
              <div className="glass-card p-8 max-w-4xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="font-orbitron font-bold text-4xl text-cyan-400">Start an App Test</h2>
                  <button
                    onClick={() => setActiveSection('choose')}
                    className="flex items-center px-6 py-3 text-gray-400 hover:text-white transition-colors"
                  >
                    ← Choose Test Type
                  </button>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); submitTest('app'); }} className="space-y-8">
                  {/* Test Name */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-300 mb-3">
                      Test Name *
                    </label>
                    <input
                      type="text"
                      value={appFormData.test_name}
                      onChange={(e) => setAppFormData(prev => ({ ...prev, test_name: e.target.value }))}
                      className="w-full px-6 py-4 bg-black/50 border border-purple-500/30 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors text-lg"
                      placeholder="Enter test name"
                      required
                    />
                  </div>

                  {/* Duration Selection */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-300 mb-3">
                      Test Duration
                    </label>
                    <select
                      value={appFormData.requested_duration_minutes.toString()}
                      onChange={(e) => setAppFormData(prev => ({ 
                        ...prev, 
                        requested_duration_minutes: parseInt(e.target.value)
                      }))}
                      className="w-full px-6 py-4 bg-black/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors text-lg"
                    >
                      {getDurationOptions().map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <p className="text-sm text-gray-500 mt-2">
                      Available durations based on your {userPlan?.planType.toUpperCase()} plan
                    </p>
                  </div>

                  {/* File Type Selection */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-300 mb-3">
                      App File Type
                    </label>
                    <select
                      value={appFormData.fileType}
                      onChange={(e) => setAppFormData(prev => ({ ...prev, fileType: e.target.value }))}
                      className="w-full px-6 py-4 bg-black/50 border border-purple-500/30 rounded-xl text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors text-lg"
                    >
                      <option value="apk">Android APK (.apk)</option>
                    </select>
                  </div>

                  {/* File Upload */}
                  <div>
                    <label className="block text-lg font-semibold text-gray-300 mb-3">
                      App File Upload (.apk only) *
                    </label>
                    <div
                      onDragOver={handleDragOver}
                      onDrop={(e) => handleDrop(e, 'app')}
                      className="border-2 border-dashed border-purple-500/30 rounded-xl p-12 text-center hover:border-purple-500/50 transition-colors cursor-pointer"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <UploadIcon className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                      {appFormData.file ? (
                        <div>
                          <p className="text-green-400 font-bold text-xl">{appFormData.file.name}</p>
                          <p className="text-gray-400 text-lg mt-2">Click to change file</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-gray-300 mb-3 text-xl">Drag & Drop your APK File Here</p>
                          <p className="text-gray-400 text-lg">or click to upload (.apk files only)</p>
                        </div>
                      )}
                    </div>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".apk"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFileUpload(file, 'app');
                      }}
                      className="hidden"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-6 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-bold text-white text-xl neon-glow-strong hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-white mr-3"></div>
                        Submitting Test...
                      </div>
                    ) : (
                      'Start the Test'
                    )}
                  </button>
                </form>
              </div>
            </section>
          )}

          {/* Live Tests Section */}
          {liveTests.length > 0 && (
            <section id="live-tests" className="space-y-8">
              <h2 className="font-orbitron font-bold text-4xl lg:text-5xl text-center bg-gradient-to-r from-purple-500 via-fuchsia-400 to-cyan-400 bg-clip-text text-transparent">
                Live Tests
              </h2>
              <div className="space-y-6">
                {liveTests.map((test) => (
                  <div key={test.id} className="glass-card p-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
                          {test.test_type.startsWith('web') ? (
                            <Globe className="w-8 h-8 text-white" />
                          ) : (
                            <Smartphone className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white mb-2">{test.test_name}</h3>
                          <div className="flex items-center space-x-6 text-lg text-gray-400 mb-2">
                            <span>{getTestTypeLabel(test)}</span>
                            <span>{formatDuration(test.requested_duration_minutes)}</span>
                            <span>{formatDate(test.submitted_at)}</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            {getStatusIcon(test.status)}
                            <span className={`font-bold capitalize text-lg ${getStatusColor(test.status)}`}>
                              {test.status === 'processing_results' ? 'Processing Results' : 
                               test.status === 'queued' ? 'Queued' : test.status}
                            </span>
                          </div>
                          <p className="text-yellow-400 text-lg mt-2 font-semibold">
                            {test.status === 'queued' ? 
                             'The test will start on your turn, so be patient and check back later.' : 
                             test.status === 'running' ?
                             'AI is actively testing your application.' :
                             'Processing results, report will be available soon.'}
                          </p>
                          
                          {/* Progress Bar */}
                          <div className="mt-4 w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500"
                              style={{ width: `${test.progress || 0}%` }}
                            ></div>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <button
                          onClick={() => setShowCancelModal(test.id)}
                          className="p-3 text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <MoreHorizontal className="w-6 h-6" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Test History Section */}
          <section className="space-y-8">
            <h2 className="font-orbitron font-bold text-4xl lg:text-5xl text-center bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
              TEST HISTORY
            </h2>

            {/* Sorting & Filtering Controls */}
            <div className="glass-card p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                    placeholder="Search by name or ID..."
                  />
                </div>

                {/* Sort By Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                >
                  <option value="newest">Newest to Oldest</option>
                  <option value="oldest">Oldest to Newest</option>
                  <option value="type">Type</option>
                </select>

                {/* Filter By Type Dropdown */}
                <select
                  value={filterBy}
                  onChange={(e) => setFilterBy(e.target.value)}
                  className="px-4 py-3 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="web">Web Tests</option>
                  <option value="app">App Tests</option>
                </select>
              </div>
            </div>

            {/* Test History List */}
            {historyLoading ? (
              <div className="text-center py-16">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400 mx-auto mb-6"></div>
                <p className="text-xl text-gray-400">Loading test history...</p>
              </div>
            ) : testHistory.length === 0 ? (
              <div className="glass-card p-16 text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-600 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                  <FileText className="w-10 h-10 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-4">No test history yet</h3>
                <p className="text-xl text-gray-400 mb-8">Start a new test above to see your progress here!</p>
              </div>
            ) : (
              <div className="space-y-6">
                {testHistory.map((test) => (
                  <div 
                    key={test.id} 
                    className="glass-card p-8 hover:scale-[1.02] transition-all cursor-pointer group"
                    onClick={() => navigate(`/results/${test.id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-6 flex-1">
                        <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-xl flex items-center justify-center">
                          {test.test_type.startsWith('web') ? (
                            <Globe className="w-8 h-8 text-white" />
                          ) : (
                            <Smartphone className="w-8 h-8 text-white" />
                          )}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-white group-hover:text-cyan-400 transition-colors mb-2">
                            {test.test_name}
                          </h3>
                          <div className="flex items-center space-x-4 text-lg text-gray-400">
                            <span>{getTestTypeLabel(test)}</span>
                            <span>{formatDuration(test.requested_duration_minutes)}</span>
                            <span>{formatDate(test.submitted_at)}</span>
                            <span>{test.bug_count} bugs found</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <span className={`font-bold capitalize text-lg ${getStatusColor(test.status)}`}>
                          {test.status}
                        </span>
                        <ArrowRight className="w-6 h-6 text-gray-400 group-hover:text-cyan-400 transition-colors" />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load More Button */}
                {hasMoreHistory && (
                  <div className="text-center pt-8">
                    <button
                      onClick={handleLoadMore}
                      className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-bold text-white text-lg neon-glow hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105"
                    >
                      Load More
                    </button>
                  </div>
                )}
              </div>
            )}
          </section>
        </div>
      </div>

      {/* Cancel Test Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="glass-card p-8 max-w-2xl w-full mx-4">
            <div className="text-center">
              <AlertTriangle className="w-20 h-20 text-red-400 mx-auto mb-6" />
              <h2 className="text-3xl font-bold text-red-400 mb-6">Confirm Test Cancellation</h2>
              <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-6 mb-8">
                <p className="text-red-300 text-lg leading-relaxed font-semibold">
                  <strong>WARNING:</strong> If this test is cancelled, the system will NOT provide any result file or any test report. 
                  It will immediately terminate the current session and permanently delete ALL files related 
                  to this test from the system. All progress will be irreversibly terminated and unrecoverable.
                </p>
              </div>
              <div className="flex space-x-6">
                <button
                  onClick={() => setShowCancelModal(null)}
                  className="flex-1 py-4 border border-gray-600 rounded-xl text-gray-300 hover:text-white hover:border-gray-500 transition-colors text-lg font-semibold"
                >
                  Don't Cancel
                </button>
                <button
                  onClick={() => cancelTest(showCancelModal)}
                  className="flex-1 py-4 bg-red-600 hover:bg-red-700 rounded-xl text-white font-bold text-lg transition-colors"
                >
                  Confirm Cancellation
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Upload;