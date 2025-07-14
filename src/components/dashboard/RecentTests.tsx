import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  Globe, 
  Smartphone, 
  Clock, 
  CheckCircle, 
  XCircle, 
  Play, 
  AlertTriangle,
  RefreshCw,
  FileText
} from 'lucide-react';
import { Test } from '../../lib/supabase';

interface RecentTestsProps {
  tests: Test[];
  onRefresh: () => void;
}

function RecentTests({ tests, onRefresh }: RecentTestsProps) {
  const navigate = useNavigate();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'running':
        return <Play className="w-5 h-5 text-blue-400" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'queued': // Changed from 'pending'
        return <Clock className="w-5 h-5 text-yellow-400" />;
      case 'processing_results':
        return <RefreshCw className="w-5 h-5 text-cyan-400 animate-spin" />;
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
      case 'queued': // Changed from 'pending'
        return 'text-yellow-400';
      case 'processing_results':
        return 'text-cyan-400';
      default:
        return 'text-gray-400';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const canViewDetails = (status: string) => {
    return status === 'completed' || status === 'failed';
  };

  // Updated to handle new test_type values
  const getTestIcon = (testType: string) => {
    if (testType === 'web_url' || testType === 'web_bundle') {
      return <Globe className="w-6 h-6 text-white" />;
    } else {
      return <Smartphone className="w-6 h-6 text-white" />;
    }
  };

  // Updated to display friendly test type labels
  const getTestTypeLabel = (testType: string) => {
    switch(testType) {
      case 'web_url':
        return 'Web (URL)';
      case 'web_bundle':
        return 'Web (Bundle)';
      case 'android_apk':
        return 'Android APK';
      default:
        return testType;
    }
  };

  return (
    <div className="glass-card p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron font-bold text-2xl text-cyan-400">Recent Tests</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={onRefresh}
            className="p-2 text-gray-400 hover:text-white transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
          <button
            onClick={() => navigate('/results')}
            className="flex items-center text-purple-400 hover:text-purple-300 transition-colors"
          >
            <span className="mr-2">View All</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {tests.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No tests yet</h3>
          <p className="text-gray-400 mb-6">Start your first test to see results here!</p>
          <button
            onClick={() => navigate('/upload')}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg font-semibold text-white neon-glow hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105"
          >
            Start Your First Test
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {tests.map((test) => (
            <div 
              key={test.id} 
              className={`bg-black/30 border border-purple-500/20 rounded-lg p-6 transition-all ${
                canViewDetails(test.status) ? 'hover:border-purple-500/40 cursor-pointer' : ''
              }`}
              onClick={() => {
                if (canViewDetails(test.status)) {
                  navigate(`/results/${test.id}`);
                }
              }}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 flex-1">
                  <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg flex items-center justify-center">
                    {getTestIcon(test.test_type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-white truncate">{test.test_name}</h3>
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{getTestTypeLabel(test.test_type)}</span>
                      <span>{formatDate(test.submitted_at)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(test.status)}
                    <span className={`font-medium capitalize ${getStatusColor(test.status)}`}>
                      {test.status === 'processing_results' ? 'Processing' : test.status}
                    </span>
                  </div>
                  {canViewDetails(test.status) && (
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default RecentTests;