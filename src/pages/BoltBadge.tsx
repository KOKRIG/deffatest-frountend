import React from 'react';

function BoltBadge() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0 animated-grid-overlay opacity-30"></div>
      </div>
      
      <div className="relative z-10 text-center">
        <img 
          src="/white_circle_360x360.png" 
          alt="Built with Bolt Badge" 
          className="w-96 h-96 mx-auto"
        />
        <h1 className="font-orbitron font-bold text-4xl mt-8 bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent">
          Built with Bolt
        </h1>
        <p className="text-xl text-gray-300 mt-4">
          This page serves the Bolt badge image for the application
        </p>
      </div>
    </div>
  );
}

export default BoltBadge;