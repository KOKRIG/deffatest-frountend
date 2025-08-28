import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log the error to console for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);
    
    // You can also log the error to an error reporting service here
    // For example: errorReportingService.captureException(error, { extra: errorInfo });
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: undefined });
  };

  private handleGoHome = () => {
    window.location.href = '/dashboard';
  };

  public render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-black">
          <div className="fixed inset-0 z-0 pointer-events-none">
            <div className="absolute inset-0 animated-grid-overlay opacity-30"></div>
          </div>
          
          <div className="relative z-10 text-center max-w-md mx-auto p-8">
            <div className="w-24 h-24 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-12 h-12 text-red-400" />
            </div>
            
            <h1 className="text-3xl font-orbitron font-bold text-red-400 mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-400 mb-6 text-lg">
              We encountered an unexpected error. Don't worry, our AI system is working to fix this!
            </p>
            
            {this.state.error && (
              <details className="text-left mb-6 bg-gray-800/50 rounded-lg p-4">
                <summary className="text-cyan-400 cursor-pointer text-sm font-medium mb-2">
                  Technical Details (Click to expand)
                </summary>
                <code className="text-xs text-gray-300 block overflow-auto">
                  {this.state.error.message}
                </code>
              </details>
            )}
            
            <div className="space-y-4">
              <button
                onClick={this.handleRetry}
                className="w-full px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-500 rounded-xl font-bold text-white neon-glow-strong hover:from-purple-700 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <RefreshCw className="w-5 h-5" />
                <span>Try Again</span>
              </button>
              
              <button
                onClick={this.handleGoHome}
                className="w-full px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-500 rounded-xl font-bold text-white hover:from-cyan-700 hover:to-blue-600 transition-all transform hover:scale-105 flex items-center justify-center space-x-2"
              >
                <Home className="w-5 h-5" />
                <span>Go to Dashboard</span>
              </button>
            </div>
            
            <p className="text-sm text-gray-500 mt-6">
              If this problem persists, please contact our support team.
            </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
