import React, { useState, useEffect } from 'react';

function LoadingScreen() {
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [logoLoaded, setLogoLoaded] = useState(false);

  useEffect(() => {
    // Preload the logo
    const logoImg = new Image();
    logoImg.src = '/DEFFATEST-logo copy copy.png';
    logoImg.onload = () => {
      setLogoLoaded(true);
    };

    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setIsLoading(false), 500);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 100);

    // Ensure loading screen disappears after maximum 3 seconds
    const timeout = setTimeout(() => {
      setProgress(100);
      setTimeout(() => setIsLoading(false), 500);
    }, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-[9999] bg-black flex items-center justify-center">
      {/* Animated Background */}
      <div className="absolute inset-0 animated-grid-overlay opacity-50"></div>
      
      {/* Loading Content */}
      <div className="relative z-10 text-center">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3 mb-8">
          <div className="relative">
            {logoLoaded ? (
              <img 
                src="/DEFFATEST-logo copy copy.png" 
                alt="DEFFATEST Logo" 
                className="h-36 w-auto animate-pulse object-contain" 
                loading="eager"
                decoding="async"
                fetchpriority="high"
                style={{ maxWidth: '100%', objectPosition: 'center' }}
              />
            ) : (
              <div className="h-36 w-36 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400"></div>
              </div>
            )}
            <div className="absolute inset-0 w-36 h-36 bg-cyan-400/20 rounded-full animate-ping"></div>
          </div>
        </div>
        
        {/* Loading Text */}
        <div className="mb-8">
          <h2 className="text-xl text-white mb-2">Initializing AI Testing Platform</h2>
          <p className="text-gray-400">Preparing your testing environment...</p>
        </div>
        
        {/* Progress Bar */}
        <div className="w-80 mx-auto">
          <div className="bg-gray-800 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-cyan-400 to-purple-500 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            ></div>
          </div>
          <div className="text-center mt-2 text-sm text-gray-400">
            {Math.round(Math.min(progress, 100))}%
          </div>
        </div>
        
        {/* Loading Animation */}
        <div className="mt-8 flex justify-center space-x-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-3 h-3 bg-purple-500 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.2}s` }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LoadingScreen;