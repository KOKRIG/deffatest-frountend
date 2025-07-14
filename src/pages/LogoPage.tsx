import React, { useState, useEffect } from 'react';

function LogoPage() {
  const [logoLoaded, setLogoLoaded] = useState(false);
  const [loadingError, setLoadingError] = useState(false);

  useEffect(() => {
    // Preload the logo
    const img = new Image();
    img.src = '/DEFFATEST-logo copy copy.png';
    
    // Set a timeout to prevent infinite waiting
    const timeout = setTimeout(() => {
      if (!logoLoaded) {
        setLoadingError(true);
        console.error('Logo loading timed out');
      }
    }, 5000);
    
    img.onload = () => {
      clearTimeout(timeout);
      setLogoLoaded(true);
    };
    
    img.onerror = (e) => {
      clearTimeout(timeout);
      setLoadingError(true);
      console.error('Error loading logo:', e);
    };
    
    return () => clearTimeout(timeout);
  }, [logoLoaded]);
  
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 animated-grid-overlay opacity-30"></div>
      </div>
      
      <div className="relative z-10 text-center p-4">
        {loadingError ? (
          <div className="space-y-4">
            <div className="bg-red-500/20 border border-red-500/40 rounded-lg p-6 max-w-md">
              <p className="text-red-400 text-xl mb-4">Error loading the logo image</p>
              <p className="text-gray-300">Please check that the image file exists and is accessible.</p>
            </div>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-500 rounded-lg text-white"
            >
              Retry
            </button>
          </div>
        ) : logoLoaded ? (
          <div className="max-w-full overflow-visible">
            <img 
              src="/DEFFATEST-logo copy copy.png" 
              alt="DEFFATEST Logo" 
              className="max-w-full h-auto mx-auto object-contain"
              style={{ maxHeight: '80vh' }}
              loading="eager"
              decoding="async"
              fetchpriority="high"
            />
            <h1 className="font-orbitron font-bold text-4xl mt-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
              DEFFATEST
            </h1>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="w-36 h-36 flex items-center justify-center">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-cyan-400"></div>
            </div>
            <p className="text-gray-400">Loading logo...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default LogoPage;