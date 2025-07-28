
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import DashboardLayout from '../components/dashboard/DashboardLayout';
import DashboardHeader from '../components/dashboard/DashboardHeader';
import PlanUsage from '../components/dashboard/PlanUsage';
import RecentTests from '../components/dashboard/RecentTests';
import { supabase, Test } from '../lib/supabase';
import { initializePaddle } from '../lib/paddle';
import { preFetchDashboardData } from '../lib/api';
import { Rocket, Clock, Zap, Bug, TrendingUp, Eye, ArrowRight, Activity, Globe, Smartphone, CheckCircle, Play, XCircle, RefreshCw, AlertTriangle } from 'lucide-react';
import dashboardContent from '../../content/pages/dashboard.json';

function Dashboard() {
  const { user, profile } = useAuth();
  const navigate = useNavigate();
  const [recentTests, setRecentTests] = useState<Test[]>([]);
  const [liveTests, setLiveTests] = useState<Test[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchDashboardData();
    initializePaddle();
    preFetchDashboardData();
  }, [user, navigate]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');

      const { data: testsData, error: testsError } = await supabase
        .from('tests')
        .select('*')
        .order('submitted_at', { ascending: false })
        .limit(10);

      if (testsError) throw testsError;

      const completedTests = (testsData || []).filter(test => 
        test.status === 'completed' || test.status === 'failed'
      ).slice(0, 5);

      const activeTests = (testsData || []).filter(test => 
        test.status === 'queued' || test.status === 'running' || test.status === 'processing_results'
      );

      setRecentTests(completedTests);
      setLiveTests(activeTests);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load dashboard data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const getTestsRemaining = () => {
    if (!profile) return 0;
    
    const planType = profile.plan_type;
    const testsThisMonth = profile.tests_this_month_count || 0;
    
    if (planType === 'chaos') return Infinity;
    if (planType === 'pro') return Math.max(25 - testsThisMonth, 0);
    return Math.max(1 - testsThisMonth, 0);
  };

  const canStartNewTest = () => {
    if (!profile) return false;
    
    const usedSlots = liveTests.length;
    const totalSlots = profile.concurrent_test_slots || 1;
    
    return usedSlots < totalSlots;
  };

  const getPlanInfo = () => {
    if (!profile) return {
      planType: 'free',
      testsRemaining: 0,
      testsLimit: 1,
      concurrentSlots: 1,
      usedSlots: 0
    };

    const planType = profile.plan_type;
    let testsLimit = 1;
    
    if (planType === 'pro') testsLimit = 25;
    else if (planType === 'chaos') testsLimit = Infinity;
    
    return {
      planType,
      testsRemaining: getTestsRemaining(),
      testsLimit,
      concurrentSlots: profile.concurrent_test_slots || 1,
      usedSlots: liveTests.length
    };
  };

  const handleRefresh = () => {
    fetchDashboardData();
  };

  if (loading) {
    return (
      <DashboardLayout currentPage="dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 animated-grid-overlay opacity-30"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400 mx-auto mb-6"></div>
            <p className="text-xl text-gray-300">Loading your dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout currentPage="dashboard">
        <div className="min-h-screen flex items-center justify-center">
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 animated-grid-overlay opacity-30"></div>
          </div>
          
          <div className="relative z-10 text-center">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-400 text-3xl">!</span>
            </div>
            <h3 className="text-2xl font-bold text-red-400 mb-4">Error Loading Dashboard</h3>
            <p className="text-gray-400 mb-6">{error}</p>
            <button
              onClick={fetchDashboardData}
              className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-bold text-white neon-glow-strong hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              Retry
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout currentPage="dashboard" data-sb-object-id={dashboardContent.pageTitle}>
      <DashboardHeader 
        data-sb-field-path="header"
        userName={profile?.full_name || user?.email || 'User'}
        planType={profile?.plan_type || 'free'}
        stats={{
          testsThisMonth: profile?.tests_this_month_count || 0,
          testsRemaining: getTestsRemaining(),
          lastTestDate: recentTests[0]?.submitted_at
        }}
      />

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1" data-sb-field-path="planUsageSection">
          <PlanUsage planInfo={getPlanInfo()} />
        </div>
        
        <div className="lg:col-span-2">
          <RecentTests 
            tests={recentTests} 
            onRefresh={handleRefresh}
          />
        </div>
      </div>

      <div className="glass-card p-8 mb-8" data-sb-field-path=".quickActionsSection">
        <h2 className="font-orbitron font-bold text-2xl text-cyan-400 mb-6" data-sb-field-path=".title">{dashboardContent.quickActionsSection.title}</h2>
        
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6" data-sb-field-path=".actions">
          {dashboardContent.quickActionsSection.actions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.url)}
              disabled={action.url === '/upload' && !canStartNewTest()}
              className={`p-6 rounded-xl border-2 transition-all text-center ${
                action.url === '/upload' && !canStartNewTest() 
                  ? 'border-gray-700 bg-gray-800/50 cursor-not-allowed opacity-50' 
                  : 'border-purple-500/30 hover:border-purple-500/60 hover:bg-purple-500/10'
              }`}
              data-sb-field-path={`.${index}`}
            >
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mx-auto mb-3">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-lg mb-1 text-white" data-sb-field-path=".text">{action.text}</h3>
              <p className="text-sm text-gray-400" data-sb-field-path=".description">{action.description}</p>
            </button>
          ))}
        </div>
      </div>

      {liveTests.length > 0 && (
        <div className="glass-card p-8">
          <h2 className="font-orbitron font-bold text-2xl text-cyan-400 mb-6">Tests In Progress</h2>
          
          <div className="space-y-6">
            {liveTests.map(test => (
              <div key={test.id} className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                      {test.test_type.startsWith('web') ? 
                        <Globe className="w-6 h-6 text-white" /> : 
                        <Smartphone className="w-6 h-6 text-white" />
                      }
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{test.test_name}</h3>
                      <p className="text-sm text-gray-400">{test.status === 'queued' ? 'In queue' : 
                        test.status === 'running' ? 'AI actively testing' :
                        'Processing results'}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(test.status)}
                    <span className={`font-medium ${getStatusColor(test.status)}`}>
                      {test.status === 'queued' ? 'Queued' :
                       test.status === 'running' ? 'Running' :
                       'Processing'}
                    </span>
                  </div>
                </div>
                
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${test.progress || 0}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );

  function getStatusIcon(status: string) {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'running':
        return <Play className="w-5 h-5 text-blue-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'queued':
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'processing_results':
        return <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  }

  function getStatusColor(status: string) {
    switch (status) {
      case 'completed':
        return 'text-green-400';
      case 'running':
        return 'text-blue-400';
      case 'failed':
        return 'text-red-400';
      case 'queued':
        return 'text-yellow-400';
      case 'processing_results':
        return 'text-cyan-400';
      default:
        return 'text-gray-400';
    }
  }
}

export default Dashboard;
