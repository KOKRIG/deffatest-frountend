import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Play, 
  Clock, 
  Globe, 
  Smartphone, 
  MoreHorizontal, 
  X,
  RefreshCw
} from 'lucide-react';
import { Test } from '../../lib/supabase';

interface TestProgressProps {
  tests: Test[];
}

function TestProgress({ tests }: TestProgressProps) {
  const navigate = useNavigate();

  const getProgressPercentage = (test: Test) => {
    // Mock progress calculation based on status and time
    const now = new Date().getTime();
    const startTime = new Date(test.created_at).getTime();
    const elapsed = now - startTime;
    const estimatedDuration = (test.config?.duration || 5) * 60 * 1000; // Convert to milliseconds
    
    if (test.status === 'pending') return 0;
    if (test.status === 'processing_results') return 95;
    
    const progress = Math.min((elapsed / estimatedDuration) * 90, 90); // Cap at 90% for running tests
    return Math.max(progress, 10); // Minimum 10% for running tests
  };

  const getStatusMessage = (test: Test) => {
    switch (test.status) {
      case 'pending':
        return 'Queued - Waiting to start';
      case 'running':
        return 'AI is actively testing your application';
      case 'processing_results':
        return 'Analyzing results and generating report';
      default:
        return 'Processing...';
    }
  };

  const formatTimeRemaining = (test: Test) => {
    const now = new Date().getTime();
    const startTime = new Date(test.created_at).getTime();
    const elapsed = now - startTime;
    const estimatedDuration = (test.config?.duration || 5) * 60 * 1000;
    const remaining = Math.max(estimatedDuration - elapsed, 0);
    
    if (test.status === 'pending') return 'Starting soon...';
    if (test.status === 'processing_results') return 'Almost done...';
    
    const minutes = Math.ceil(remaining / (60 * 1000));
    return minutes > 0 ? `~${minutes} min remaining` : 'Finishing up...';
  };

  return (
    <div className="glass-card p-8">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron font-bold text-2xl text-cyan-400">Tests in Progress</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-400">
          <RefreshCw className="w-4 h-4" />
          <span>{tests.length} active test{tests.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      <div className="space-y-6">
        {tests.map((test) => {
          const progress = getProgressPercentage(test);
          
          return (
            <div key={test.id} className="bg-black/30 border border-purple-500/20 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
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
                    <p className="text-sm text-gray-400">
                      {test.test_type === 'web' ? 'Web Application' : 'Android APK'} • 
                      Started {new Date(test.created_at).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-white transition-colors">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-300">
                    {getStatusMessage(test)}
                  </span>
                  <span className="text-sm text-gray-400">
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Status and Time */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {test.status === 'running' ? (
                    <Play className="w-4 h-4 text-blue-400" />
                  ) : test.status === 'processing_results' ? (
                    <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4 text-yellow-400" />
                  )}
                  <span className="text-sm text-gray-400 capitalize">
                    {test.status === 'processing_results' ? 'Processing Results' : test.status}
                  </span>
                </div>
                <span className="text-sm text-gray-400">
                  {formatTimeRemaining(test)}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
        <div className="flex items-start space-x-3">
          <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center mt-0.5">
            <span className="text-white text-xs">i</span>
          </div>
          <div>
            <p className="text-blue-300 font-semibold text-sm">Live Testing in Progress</p>
            <p className="text-blue-200 text-sm">
              Our AI is actively exploring your application. You'll receive detailed reports once testing completes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TestProgress;