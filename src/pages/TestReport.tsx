import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Play, Pause, Volume2, VolumeX, Maximize, ChevronLeft, ChevronRight, Eye, Clock, CheckCircle, XCircle, AlertTriangle, Globe, Smartphone, Zap, LogOut, Settings, Menu, X, Activity, Plus, Shield, TrendingUp, Monitor, Cpu, Wifi, Image as ImageIcon, Video, ExternalLink, DownloadCloud as CloudDownload } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface Bug {
  bug_id: string;
  title: string;
  severity: 'Critical' | 'Major' | 'Minor';
  reproduction_steps: string[];
  screenshots: string[];
  bug_video_link: string;
  additional_context?: string;
}

interface TestReport {
  test_id: string;
  test_name: string;
  status: string;
  test_type: string;
  submitted_at: string;
  duration_seconds: number;
  environment_info: {
    browser?: string;
    os?: string;
    device?: string;
    android_version?: string;
    device_model?: string;
  };
  total_bugs_found: {
    critical: number;
    major: number;
    minor: number;
  };
  report_download_link: string;
  bugs: Bug[];
  performance_metrics?: {
    page_load_time_ms: number;
    avg_fps: number;
    max_memory_mb: number;
    cpu_usage_percent: number;
    network_latency_ms: number;
  };
  security_findings?: Array<{
    type: string;
    description: string;
    affected_area: string;
  }>;
}

function TestReport() {
  const { testId } = useParams<{ testId: string }>();
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [report, setReport] = useState<TestReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState<Bug | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showImageModal, setShowImageModal] = useState(false);
  const [downloadingReport, setDownloadingReport] = useState(false);
  const [selectedSeverity, setSelectedSeverity] = useState<string>('all');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!testId) {
      navigate('/results');
      return;
    }
    fetchTestReport();
  }, [user, testId, navigate]);

  const fetchTestReport = async () => {
    try {
      setLoading(true);
      
      // First, get the test basic info from Supabase
      const { data: testData, error: testError } = await supabase
        .from('tests')
        .select('*')
        .eq('id', testId)
        .single();

      if (testError) throw testError;

      // Check if test is ready for viewing
      if (testData.status !== 'completed' && testData.status !== 'failed') {
        navigate('/results');
        return;
      }

      // Mock detailed report data (in production, this would come from your API endpoint GET /api/tests/{test_id}/report)
      const mockReport: TestReport = {
        test_id: testData.id,
        test_name: testData.test_name,
        status: testData.status,
        test_type: testData.test_type,
        submitted_at: testData.created_at,
        duration_seconds: (testData.config?.duration || 5) * 60, // Convert minutes to seconds
        environment_info: {
          browser: testData.test_type === 'web' ? 'Chrome 120.0.6099.129' : undefined,
          os: testData.test_type === 'web' ? 'Windows 11' : 'Android 13',
          device: testData.test_type === 'web' ? 'Desktop (1920x1080)' : 'Google Pixel 6',
          android_version: testData.test_type === 'mobile' ? '13.0' : undefined,
          device_model: testData.test_type === 'mobile' ? 'Google Pixel 6' : undefined,
        },
        total_bugs_found: {
          critical: Math.floor(Math.random() * 3) + 1,
          major: Math.floor(Math.random() * 5) + 2,
          minor: Math.floor(Math.random() * 8) + 3,
        },
        report_download_link: `https://mock-r2-domain.r2.cloudflarestorage.com/${testData.id}/full_report.zip`, // Mock Cloudflare R2 link
        bugs: generateMockBugs(testData.test_type),
        performance_metrics: testData.test_type === 'web' ? {
          page_load_time_ms: Math.floor(Math.random() * 2000) + 1500,
          avg_fps: Math.floor(Math.random() * 20) + 45,
          max_memory_mb: Math.floor(Math.random() * 150) + 120,
          cpu_usage_percent: Math.floor(Math.random() * 30) + 25,
          network_latency_ms: Math.floor(Math.random() * 80) + 40,
        } : undefined,
        security_findings: Math.random() > 0.4 ? [
          {
            type: 'XSS Vulnerability',
            description: 'Input field vulnerable to cross-site scripting attacks on the login page. User input is not properly sanitized before rendering.',
            affected_area: 'Login Form - Username Field'
          },
          {
            type: 'Insecure Data Storage',
            description: 'Sensitive user data including authentication tokens are stored in browser localStorage without encryption.',
            affected_area: 'User Session Management'
          },
          {
            type: 'Missing HTTPS Enforcement',
            description: 'Some API endpoints accept HTTP requests, potentially exposing data in transit.',
            affected_area: 'API Communication Layer'
          }
        ] : undefined,
      };

      setReport(mockReport);
    } catch (error: any) {
      setError(error.message || 'Failed to load test report');
    } finally {
      setLoading(false);
    }
  };

  const generateMockBugs = (testType: string): Bug[] => {
    const webBugs = [
      {
        bug_id: 'bug-1',
        title: 'Checkout button unresponsive on mobile viewport',
        severity: 'Critical' as const,
        reproduction_steps: [
          'Navigate to the checkout page at /checkout',
          'Resize browser window to mobile viewport (375px width)',
          'Add at least one item to the shopping cart',
          'Proceed to the payment section',
          'Attempt to click the "Complete Purchase" button',
          'Observe that the button does not respond to clicks or touch events'
        ],
        screenshots: [
          'https://mock-r2-domain.r2.cloudflarestorage.com/test_id/bug1_ss1.png',
          'https://mock-r2-domain.r2.cloudflarestorage.com/test_id/bug1_ss2.png'
        ],
        bug_video_link: 'https://mock-r2-domain.r2.cloudflarestorage.com/test_id/bug1_repro_video.mp4',
        additional_context: 'CSS z-index issue causing an invisible overlay element to block button interaction. The overlay has z-index: 9999 while the button has z-index: 1.'
      },
      {
        bug_id: 'bug-2',
        title: 'Form validation errors not displaying properly',
        severity: 'Major' as const,
        reproduction_steps: [
          'Navigate to the contact form page at /contact',
          'Leave all required fields (Name, Email, Message) empty',
          'Click the "Submit" button',
          'Observe that no error messages appear to guide the user',
          'Form appears to submit but fails silently in the background',
          'User receives no feedback about the failed submission'
        ],
        screenshots: [
          'https://mock-r2-domain.r2.cloudflarestorage.com/test_id/bug2_ss1.png'
        ],
        bug_video_link: 'https://mock-r2-domain.r2.cloudflarestorage.com/test_id/bug2_repro_video.mp4',
        additional_context: 'JavaScript validation function is not properly bound to form submission event. Error display elements exist in DOM but are not being populated with validation messages.'
      },
      {
        bug_id: 'bug-3',
        title: 'Search results pagination broken on page 3+',
        severity: 'Minor' as const,
        reproduction_steps: [
          'Navigate to the search page',
          'Enter any search term that returns more than 20 results',
          'Click "Next" to go to page 2 - works correctly',
          'Click "Next" again to go to page 3',
          'Observe that page 3 shows the same results as page 2',
          'Subsequent pages also show duplicate content'
        ],
        screenshots: [
          'https://mock-r2-domain.r2.cloudflarestorage.com/test_id/bug3_ss1.png',
          'https://mock-r2-domain.r2.cloudflarestorage.com/test_id/bug3_ss2.png'
        ],
        bug_video_link: 'https://mock-r2-domain.r2.cloudflarestorage.com/test_id/bug3_repro_video.mp4'
      }
    ];

    const mobileBugs = [
      {
        bug_id: 'bug-1',
        title: 'App crashes when accessing camera functionality',
        severity: 'Critical' as const,
        reproduction_steps: [
          'Open the application from the home screen',
          'Navigate to the user profile section',
          'Tap on "Change Profile Picture" button',
          'Select "Take Photo" option from the menu',
          'App immediately crashes and returns to Android home screen',
          'No error message or recovery option is provided'
        ],
        screenshots: [
          'https://mock-r2-domain.r2.cloudflarestorage.com/test_id/bug1_ss1.png',
          'https://mock-r2-domain.r2.cloudflarestorage.com/test_id/bug1_ss2.png'
        ],
        bug_video_link: 'https://mock-r2-domain.r2.cloudflarestorage.com/test_id/bug1_repro_video.mp4',
        additional_context: 'Missing camera permission handling in AndroidManifest.xml. App attempts to access camera without proper runtime permission checks for Android 6.0+ devices.'
      },
      {
        bug_id: 'bug-2',
        title: 'Login form keyboard covers submit button',
        severity: 'Major' as const,
        reproduction_steps: [
          'Open the app and navigate to login screen',
          'Tap on the password input field',
          'On-screen keyboard appears',
          'Observe that the "Login" button is completely hidden behind the keyboard',
          'User cannot scroll or access the submit button',
          'Must close keyboard to access button, then reopen to see password field'
        ],
        screenshots: [
          'https://mock-r2-domain.r2.cloudflarestorage.com/test_id/bug2_ss1.png'
        ],
        bug_video_link: 'https://mock-r2-domain.r2.cloudflarestorage.com/test_id/bug2_repro_video.mp4',
        additional_context: 'Layout does not properly adjust for soft keyboard. Missing android:windowSoftInputMode="adjustResize" in activity configuration.'
      }
    ];

    return testType === 'web' ? webBugs : mobileBugs;
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDownloadReport = async () => {
    if (!report) return;
    
    setDownloadingReport(true);
    
    try {
      // In production, this would use the actual report_download_link from Cloudflare R2
      const link = document.createElement('a');
      link.href = report.report_download_link;
      link.download = `${report.test_name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_full_report.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
    } catch (error) {
      console.error('Error downloading report:', error);
    } finally {
      setTimeout(() => {
        setDownloadingReport(false);
      }, 2000);
    }
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${remainingSeconds}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${remainingSeconds}s`;
    } else {
      return `${remainingSeconds}s`;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'critical':
        return 'text-red-400 bg-red-500/20 border-red-500/50';
      case 'major':
        return 'text-orange-400 bg-orange-500/20 border-orange-500/50';
      case 'minor':
        return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/50';
      default:
        return 'text-gray-400 bg-gray-500/20 border-gray-500/50';
    }
  };

  const handleImageClick = (bugId: string, imageIndex: number) => {
    const bug = report?.bugs.find(b => b.bug_id === bugId);
    if (bug) {
      setSelectedBug(bug);
      setCurrentImageIndex(imageIndex);
      setShowImageModal(true);
    }
  };

  const nextImage = () => {
    if (selectedBug && currentImageIndex < selectedBug.screenshots.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const getFilteredBugs = () => {
    if (!report) return [];
    if (selectedSeverity === 'all') return report.bugs;
    return report.bugs.filter(bug => bug.severity.toLowerCase() === selectedSeverity);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 animated-grid-overlay opacity-30"></div>
        </div>
        <div className="relative z-10 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading test report...</p>
        </div>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="fixed inset-0 z-0 pointer-events-none">
          <div className="absolute inset-0 animated-grid-overlay opacity-30"></div>
        </div>
        <div className="relative z-10 text-center">
          <XCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-red-400 mb-4">Error Loading Report</h2>
          <p className="text-gray-400 mb-6">{error || 'Test report not found or not ready'}</p>
          <button
            onClick={() => navigate('/results')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white neon-glow hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            Back to Results
          </button>
        </div>
      </div>
    );
  }

  const filteredBugs = getFilteredBugs();

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
            <button
              onClick={() => navigate('/results')}
              className="flex items-center text-cyan-400 hover:text-cyan-300 transition-colors mb-4"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to All Results
            </button>
            <h1 className="font-orbitron font-bold text-4xl lg:text-5xl mb-4 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              Test Report: {report.test_name}
            </h1>
          </div>

          {/* Report Summary Card */}
          <div className="glass-card p-8 mb-8">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">Test Information</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Test ID:</span>
                    <span className="text-white font-mono">{report.test_id.slice(0, 8)}...</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Status:</span>
                    <span className={`font-semibold capitalize ${
                      report.status === 'completed' ? 'text-green-400' : 'text-red-400'
                    }`}>
                      {report.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Type:</span>
                    <span className="text-white flex items-center">
                      {report.test_type === 'web' ? (
                        <>
                          <Globe className="w-4 h-4 mr-1" />
                          Web Application
                        </>
                      ) : (
                        <>
                          <Smartphone className="w-4 h-4 mr-1" />
                          Android APK
                        </>
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Duration:</span>
                    <span className="text-white">{formatDuration(report.duration_seconds)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Submitted:</span>
                    <span className="text-white">
                      {new Date(report.submitted_at).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">Environment</h3>
                <div className="space-y-2 text-sm">
                  {report.environment_info.browser && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Browser:</span>
                      <span className="text-white">{report.environment_info.browser}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-400">OS:</span>
                    <span className="text-white">{report.environment_info.os}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Device:</span>
                    <span className="text-white">{report.environment_info.device}</span>
                  </div>
                  {report.environment_info.android_version && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Android:</span>
                      <span className="text-white">{report.environment_info.android_version}</span>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-cyan-400 mb-4">Bugs Found</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-red-400 font-semibold">Critical</span>
                    <span className="text-red-400 font-bold text-lg">{report.total_bugs_found.critical}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-orange-400 font-semibold">Major</span>
                    <span className="text-orange-400 font-bold text-lg">{report.total_bugs_found.major}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-yellow-400 font-semibold">Minor</span>
                    <span className="text-yellow-400 font-bold text-lg">{report.total_bugs_found.minor}</span>
                  </div>
                  <div className="pt-2 border-t border-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-semibold">Total</span>
                      <span className="text-cyan-400 font-bold text-xl">
                        {report.total_bugs_found.critical + report.total_bugs_found.major + report.total_bugs_found.minor}
                      </span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleDownloadReport}
                  disabled={downloadingReport}
                  className="w-full mt-4 flex items-center justify-center px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white neon-glow hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {downloadingReport ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <CloudDownload className="w-5 h-5 mr-2" />
                      Download Full Report (ZIP)
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Bugs Found Section */}
          <div className="glass-card p-8 mb-8">
            <h2 className="font-orbitron font-bold text-3xl text-cyan-400 mb-6">Bugs Found</h2>
            
            {/* Bug Severity Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <button
                onClick={() => setSelectedSeverity('all')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedSeverity === 'all' 
                    ? 'border-cyan-400 bg-cyan-400/20 text-cyan-400' 
                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <span>All ({report.bugs.length})</span>
              </button>
              <button
                onClick={() => setSelectedSeverity('critical')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedSeverity === 'critical' 
                    ? 'border-red-400 bg-red-400/20 text-red-400' 
                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Critical ({report.total_bugs_found.critical})</span>
              </button>
              <button
                onClick={() => setSelectedSeverity('major')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedSeverity === 'major' 
                    ? 'border-orange-400 bg-orange-400/20 text-orange-400' 
                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span>Major ({report.total_bugs_found.major})</span>
              </button>
              <button
                onClick={() => setSelectedSeverity('minor')}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                  selectedSeverity === 'minor' 
                    ? 'border-yellow-400 bg-yellow-400/20 text-yellow-400' 
                    : 'border-gray-600 text-gray-400 hover:border-gray-500'
                }`}
              >
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>Minor ({report.total_bugs_found.minor})</span>
              </button>
            </div>

            {/* Bug List */}
            <div className="space-y-6">
              {filteredBugs.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-400">No bugs found for the selected severity level.</p>
                </div>
              ) : (
                filteredBugs.map((bug, index) => (
                  <div key={bug.bug_id} className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-white mb-2">{bug.title}</h3>
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold border ${getSeverityColor(bug.severity)}`}>
                          {bug.severity}
                        </span>
                      </div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-6">
                      {/* Reproduction Steps */}
                      <div>
                        <h4 className="text-lg font-semibold text-purple-400 mb-3">Reproduction Steps</h4>
                        <ol className="space-y-2">
                          {bug.reproduction_steps.map((step, stepIndex) => (
                            <li key={stepIndex} className="flex items-start">
                              <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-sm font-semibold mr-3 mt-0.5">
                                {stepIndex + 1}
                              </span>
                              <span className="text-gray-300">{step}</span>
                            </li>
                          ))}
                        </ol>
                        {bug.additional_context && (
                          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                            <h5 className="text-blue-400 font-semibold mb-1">Additional Context</h5>
                            <p className="text-gray-300 text-sm">{bug.additional_context}</p>
                          </div>
                        )}
                      </div>

                      {/* Screenshots and Video */}
                      <div>
                        <h4 className="text-lg font-semibold text-purple-400 mb-3">Visual Evidence</h4>
                        
                        {/* Screenshots */}
                        {bug.screenshots.length > 0 && (
                          <div className="mb-4">
                            <h5 className="text-sm font-semibold text-gray-400 mb-2">Screenshots</h5>
                            <div className="grid grid-cols-2 gap-2">
                              {bug.screenshots.map((screenshot, imgIndex) => (
                                <div
                                  key={imgIndex}
                                  className="relative group cursor-pointer"
                                  onClick={() => handleImageClick(bug.bug_id, imgIndex)}
                                >
                                  <div className="w-full h-24 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg border border-purple-500/30 group-hover:border-purple-500/60 transition-colors flex items-center justify-center">
                                    <ImageIcon className="w-8 h-8 text-purple-400" />
                                  </div>
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                                    <Eye className="w-6 h-6 text-white" />
                                  </div>
                                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-1 rounded">
                                    {imgIndex + 1}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Video */}
                        {bug.bug_video_link && (
                          <div>
                            <h5 className="text-sm font-semibold text-gray-400 mb-2">Reproduction Video</h5>
                            <div className="relative bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg overflow-hidden border border-purple-500/30">
                              <div className="w-full h-48 flex items-center justify-center">
                                <Video className="w-12 h-12 text-purple-400" />
                              </div>
                              <div className="absolute inset-0 flex items-center justify-center">
                                <button className="bg-black/70 hover:bg-black/90 rounded-full p-3 transition-colors">
                                  <Play className="w-6 h-6 text-white" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Performance Metrics Section */}
          {report.performance_metrics && (
            <div className="glass-card p-8 mb-8">
              <h2 className="font-orbitron font-bold text-3xl text-cyan-400 mb-6">Performance Overview</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {report.performance_metrics.page_load_time_ms}ms
                  </div>
                  <div className="text-sm text-gray-400">Page Load Time</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {report.performance_metrics.avg_fps} FPS
                  </div>
                  <div className="text-sm text-gray-400">Average FPS</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Monitor className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {report.performance_metrics.max_memory_mb}MB
                  </div>
                  <div className="text-sm text-gray-400">Peak Memory</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Cpu className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-orange-400 mb-1">
                    {report.performance_metrics.cpu_usage_percent}%
                  </div>
                  <div className="text-sm text-gray-400">CPU Usage</div>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Wifi className="w-8 h-8 text-white" />
                  </div>
                  <div className="text-2xl font-bold text-cyan-400 mb-1">
                    {report.performance_metrics.network_latency_ms}ms
                  </div>
                  <div className="text-sm text-gray-400">Network Latency</div>
                </div>
              </div>
            </div>
          )}

          {/* Security Findings Section */}
          {report.security_findings && report.security_findings.length > 0 && (
            <div className="glass-card p-8">
              <h2 className="font-orbitron font-bold text-3xl text-cyan-400 mb-6">Security Findings</h2>
              <div className="space-y-4">
                {report.security_findings.map((finding, index) => (
                  <div key={index} className="bg-red-500/10 border border-red-500/30 rounded-lg p-6">
                    <div className="flex items-start space-x-3">
                      <Shield className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-red-400 mb-2">{finding.type}</h3>
                        <p className="text-gray-300 mb-3 leading-relaxed">{finding.description}</p>
                        <div className="text-sm text-gray-400">
                          <span className="font-semibold">Affected Area:</span> {finding.affected_area}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Image Modal */}
      {showImageModal && selectedBug && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="relative max-w-4xl max-h-full">
            <button
              onClick={() => setShowImageModal(false)}
              className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="w-full h-96 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 rounded-lg flex items-center justify-center border border-purple-500/30">
              <div className="text-center">
                <ImageIcon className="w-16 h-16 text-purple-400 mx-auto mb-4" />
                <p className="text-gray-300">Screenshot {currentImageIndex + 1}</p>
                <p className="text-sm text-gray-400 mt-2">Mock screenshot preview</p>
              </div>
            </div>
            
            {selectedBug.screenshots.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  disabled={currentImageIndex === 0}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  disabled={currentImageIndex === selectedBug.screenshots.length - 1}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/50 rounded-full px-3 py-1 text-white text-sm">
                  {currentImageIndex + 1} / {selectedBug.screenshots.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default TestReport;