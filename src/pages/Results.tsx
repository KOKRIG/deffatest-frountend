import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Calendar, Clock, CheckCircle, XCircle, Play, AlertTriangle, Eye, Download, Zap, LogOut, Settings, Menu, X, Activity, Plus, ArrowRight, Globe, Smartphone, FileText, ChevronDown, DownloadCloud as CloudDownload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Test } from '../lib/supabase';

interface TestFilters {
  search: string;
  sortBy: string;
  filterByStatus: string;
  filterByType: string;
  startDate: string;
  endDate: string;
}

function Results() {
  const { user, profile, session, signOut } = useAuth();
  const navigate = useNavigate();
  const [tests, setTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [loadingMore, setLoadingMore] = useState(false);
  const [downloadingTests, setDownloadingTests] = useState<Set<string>>(new Set());
  
  const [filters, setFilters] = useState<TestFilters>({
    search: '',
    sortBy: 'newest',
    filterByStatus: 'all',
    filterByType: 'all',
    startDate: '',
    endDate: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchTests();
  }, [user, navigate, filters]);

  // Listen for live test updates
  useEffect(() => {
    if (!session?.access_token) return;

    const getWsUrl = () => {
      const url = import.meta.env.VITE_API_BASE_URL || 'https://api.deffatest.com';
      const protocol = url.startsWith('https') ? 'wss' : 'ws';
      const bareUrl = url.replace(/^https?:\/\//, '');
      return `${protocol}://${bareUrl}`;
    };

    const wsUrl = `${getWsUrl()}/ws?token=${session.access_token}`;
    const socket = new WebSocket(wsUrl);

    socket.onopen = () => console.log('Live status connection established.');
    socket.onclose = () => console.log('Live status connection closed.');
    socket.onerror = (error) => console.error('WebSocket error:', error);

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        const { type, test_id, ...data } = message;

        if (!test_id) return;

        setTests(prevTests => {
          const testIndex = prevTests.findIndex(t => t.id === test_id);
          if (testIndex === -1) return prevTests;

          const updatedTests = [...prevTests];
          const testToUpdate = { ...updatedTests[testIndex] };

          switch (type) {
            case 'test.progress':
              testToUpdate.progress = data.progress ?? testToUpdate.progress;
              testToUpdate.bug_count = data.bugs_found ?? testToUpdate.bug_count;
              testToUpdate.status = 'running';
              break;
            
            case 'test.status_change':
                testToUpdate.status = data.status || 'running';
                break;
            
            case 'test.completed':
              testToUpdate.status = 'completed';
              testToUpdate.progress = 100;
              testToUpdate.report_download_url = data.report_url ?? testToUpdate.report_download_url;
              testToUpdate.bug_count = data.bugs_found ?? testToUpdate.bug_count;
              break;
            
            case 'test.failed':
              testToUpdate.status = 'failed';
              testToUpdate.progress = 100;
              break;

            case 'test.cancelled':
              testToUpdate.status = 'cancelled';
              testToUpdate.progress = 100;
              break;
          }
          
          updatedTests[testIndex] = testToUpdate;
          return updatedTests;
        });
      } catch (error) {
        console.error('Error processing live update:', error);
      }
    };

    return () => {
      if (socket.readyState === 1) { // WebSocket.OPEN
        socket.close();
      }
    };
  }, [session]);

  const fetchTests = async (loadMore = false) => {
    try {
      if (!loadMore) {
        setLoading(true);
        setOffset(0);
      } else {
        setLoadingMore(true);
      }

      const currentOffset = loadMore ? offset : 0;
      const limit = 15;

      let query = supabase
        .from('tests')
        .select('*', { count: 'exact' })
        .range(currentOffset, currentOffset + limit - 1);

      // Apply search filter
      if (filters.search) {
        query = query.or(`test_name.ilike.%${filters.search}%,id.ilike.%${filters.search}%`);
      }

      // Apply status filter
      if (filters.filterByStatus !== 'all') {
        query = query.eq('status', filters.filterByStatus);
      }

      // Apply type filter
      if (filters.filterByType !== 'all') {
        if (filters.filterByType === 'web_url') {
          query = query.eq('test_type', 'web').not('app_url', 'is', null);
        } else if (filters.filterByType === 'web_bundle') {
          query = query.eq('test_type', 'web').is('app_url', null);
        } else if (filters.filterByType === 'android_apk') {
          query = query.eq('test_type', 'mobile');
        }
      }

      // Apply date range filter
      if (filters.startDate) {
        query = query.gte('created_at', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('created_at', filters.endDate + 'T23:59:59');
      }

      // Apply sorting
      switch (filters.sortBy) {
        case 'newest':
          query = query.order('created_at', { ascending: false });
          break;
        case 'oldest':
          query = query.order('created_at', { ascending: true });
          break;
        case 'alphabetical_az':
          query = query.order('test_name', { ascending: true });
          break;
        case 'alphabetical_za':
          query = query.order('test_name', { ascending: false });
          break;
        case 'duration_longest':
          query = query.order('config->duration', { ascending: false });
          break;
        case 'duration_shortest':
          query = query.order('config->duration', { ascending: true });
          break;
        default:
          query = query.order('created_at', { ascending: false });
      }

      const { data, error, count } = await query;
      if (error) throw error;

      const newTests = data || [];
      
      if (loadMore) {
        setTests(prev => [...prev, ...newTests]);
        setOffset(currentOffset + limit);
      } else {
        setTests(newTests);
        setOffset(limit);
      }
      
      setTotalCount(count || 0);
      setHasMore(newTests.length === limit);
    } catch (error) {
      console.error('Error fetching tests:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const handleLoadMore = () => {
    fetchTests(true);
  };

  const handleFilterChange = (key: keyof TestFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDownloadReport = async (testId: string, testName: string) => {
    setDownloadingTests(prev => new Set(prev).add(testId));
    
    try {
      // Mock download - in production, this would use the actual report_download_link from Cloudflare R2
      const mockDownloadUrl = `https://mock-r2-domain.r2.cloudflarestorage.com/${testId}/full_report.zip`;
      
      // Create a temporary link and trigger download
      const link = document.createElement('a');
      link.href = mockDownloadUrl;
      link.download = `${testName.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_report.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // In production, you would make an API call to get the actual download link:
      // const response = await fetch(`/api/tests/${testId}/download`);
      // const { download_url } = await response.json();
      // window.open(download_url, '_blank');
      
    } catch (error) {
      console.error('Error downloading report:', error);
    } finally {
      setTimeout(() => {
        setDownloadingTests(prev => {
          const newSet = new Set(prev);
          newSet.delete(testId);
          return newSet;
        });
      }, 2000);
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
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'processing_results':
        return <Settings className="w-5 h-5 text-cyan-400 animate-spin" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-gray-400" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
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
      case 'pending':
        return 'text-yellow-400';
      case 'processing_results':
        return 'text-cyan-400';
      case 'cancelled':
        return 'text-gray-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusGlow = (status: string) => {
    switch (status) {
      case 'completed':
        return 'shadow-green-500/20 border-green-500/20';
      case 'running':
        return 'shadow-blue-500/20 animate-pulse border-blue-500/20';
      case 'failed':
        return 'shadow-red-500/20 border-red-500/20';
      case 'pending':
        return 'shadow-yellow-500/20 border-yellow-500/20';
      case 'processing_results':
        return 'shadow-cyan-500/20 border-cyan-500/20';
      case 'cancelled':
        return 'shadow-gray-500/20 border-gray-500/20';
      default:
        return 'shadow-gray-500/20 border-gray-500/20';
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

  const formatDuration = (config: any) => {
    if (!config?.duration) return 'N/A';
    const minutes = parseInt(config.duration);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
  };

  const getTestTypeLabel = (test: Test) => {
    if (test.test_type === 'web') {
      return test.app_url ? 'Web (URL)' : 'Web (Bundle)';
    }
    return 'Android APK';
  };

  const canViewReport = (status: string) => {
    return status === 'completed' || status === 'failed';
  };

  const handleViewDetails = (testId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigate(`/results/${testId}`);
  };

  const handleDownloadClick = (testId: string, testName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    handleDownloadReport(testId, testName);
  };

  const getInProgressMessage = (status: string) => {
    switch (status) {
      case 'pending':
        return 'The test is currently queued. It will be available shortly.';
      case 'running':
        return 'The test is currently running. It will be available shortly.';
      case 'processing_results':
        return 'The test is currently processing results. It will be available shortly.';
      case 'cancelled':
        return 'This test was cancelled and no results are available.';
      default:
        return 'The test is being processed. It will be available shortly.';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 animated-grid-overlay opacity-30"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your test results...</p>
        </div>
      </div>
    );
  }

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
            <button
              onClick={() => navigate('/upload')}
              className="w-full flex items-center px-4 py-3 text-left rounded-lg text-gray-300 hover:text-white hover:bg-purple-500/10 transition-colors"
            >
              <Plus className="w-5 h-5 mr-3" />
              <span className="font-medium">Upload</span>
            </button>
            <div className="bg-purple-500/20 text-cyan-400 border border-purple-500/30 w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors">
              <Eye className="w-5 h-5 mr-3" />
              <span className="font-medium">Results</span>
            </div>
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="font-orbitron font-bold text-4xl lg:text-5xl mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Your Test Results
            </h1>
            <p className="text-xl text-gray-300">
              Browse and analyze all your testing efforts. Total tests: {totalCount}
            </p>
          </div>

          {/* Filters and Controls */}
          <div className="glass-card p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              {/* Search */}
              <div className="xl:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Search Tests
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={filters.search}
                    onChange={(e) => handleFilterChange('search', e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                    placeholder="Search by name or ID..."
                  />
                </div>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                >
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="alphabetical_az">Alphabetical (A-Z)</option>
                  <option value="alphabetical_za">Alphabetical (Z-A)</option>
                  <option value="duration_longest">Duration (Longest First)</option>
                  <option value="duration_shortest">Duration (Shortest First)</option>
                </select>
              </div>

              {/* Filter by Status */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Status
                </label>
                <select
                  value={filters.filterByStatus}
                  onChange={(e) => handleFilterChange('filterByStatus', e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                >
                  <option value="all">All Statuses</option>
                  <option value="pending">Queued</option>
                  <option value="running">Running</option>
                  <option value="processing_results">Processing Results</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>

              {/* Filter by Type */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Type
                </label>
                <select
                  value={filters.filterByType}
                  onChange={(e) => handleFilterChange('filterByType', e.target.value)}
                  className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors"
                >
                  <option value="all">All Types</option>
                  <option value="web_url">Web (URL)</option>
                  <option value="web_bundle">Web (Bundle)</option>
                  <option value="android_apk">Android APK</option>
                </select>
              </div>

              {/* Date Range */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Date Range
                </label>
                <div className="space-y-2">
                  <input
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors text-sm"
                  />
                  <input
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                    className="w-full px-3 py-2 bg-black/50 border border-purple-500/30 rounded-lg text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 transition-colors text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Test Results List */}
          <div className="space-y-4">
            {tests.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-2xl font-semibold text-white mb-4">No test results found</h3>
                <p className="text-gray-400 mb-6">
                  {filters.search || filters.filterByStatus !== 'all' || filters.filterByType !== 'all' 
                    ? 'No test results match your current filters. Try adjusting your criteria.'
                    : 'You haven\'t run any tests yet. Start your first test to see results here!'
                  }
                </p>
                <button
                  onClick={() => navigate('/upload')}
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white neon-glow hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105"
                >
                  Start New Test
                </button>
              </div>
            ) : (
              <>
                {tests.map((test) => (
                  <div 
                    key={test.id} 
                    className={`glass-card p-6 transition-all ${getStatusGlow(test.status)} ${
                      canViewReport(test.status) ? 'hover:scale-[1.01] cursor-pointer' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                          {test.test_type === 'web' ? (
                            <Globe className="w-6 h-6 text-white" />
                          ) : (
                            <Smartphone className="w-6 h-6 text-white" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-lg font-semibold text-white truncate">{test.test_name}</h3>
                          <div className="flex items-center space-x-4 text-sm text-gray-400">
                            <span>ID: {test.id.slice(0, 8)}...</span>
                            <span>{getTestTypeLabel(test)}</span>
                            <span>{formatDate(test.created_at)}</span>
                            <span>Duration: {formatDuration(test.config)}</span>
                          </div>
                          {!canViewReport(test.status) && (
                            <p className="text-sm text-yellow-400 mt-1">
                              {getInProgressMessage(test.status)}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-2">
                          {getStatusIcon(test.status)}
                          <span className={`font-medium capitalize ${getStatusColor(test.status)}`}>
                            {test.status === 'processing_results' ? 'Processing Results' : test.status}
                          </span>
                        </div>
                        {canViewReport(test.status) && (
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={(e) => handleViewDetails(test.id, e)}
                              className="flex items-center px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-500 rounded-lg text-white text-sm font-medium hover:from-cyan-700 hover:to-blue-600 transition-all"
                            >
                              <Eye className="w-4 h-4 mr-2" />
                              View Details
                            </button>
                            <button
                              onClick={(e) => handleDownloadClick(test.id, test.test_name, e)}
                              disabled={downloadingTests.has(test.id)}
                              className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg text-white text-sm font-medium hover:from-purple-700 hover:to-pink-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {downloadingTests.has(test.id) ? (
                                <>
                                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                  Downloading...
                                </>
                              ) : (
                                <>
                                  <CloudDownload className="w-4 h-4 mr-2" />
                                  Download (ZIP)
                                </>
                              )}
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Load More Button */}
                {hasMore && (
                  <div className="text-center pt-8">
                    <button
                      onClick={handleLoadMore}
                      disabled={loadingMore}
                      className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white neon-glow hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                    >
                      {loadingMore ? (
                        <div className="flex items-center">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                          Loading More...
                        </div>
                      ) : (
                        'Load More Results'
                      )}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Results;