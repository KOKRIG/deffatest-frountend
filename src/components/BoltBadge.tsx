import React from 'react';

function BoltBadge() {
  const handleBadgeClick = () => {
    window.open('https://bolt.new', '_blank', 'noopener,noreferrer');
  };

  return (
    <button
      onClick={handleBadgeClick}
      className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-4 focus:ring-purple-500/50 group"
      title="Built with Bolt - Click to visit bolt.new"
      aria-label="Built with Bolt - Visit bolt.new"
    >
      <img 
        src="/white_circle_360x360.png" 
        alt="Built with Bolt" 
        className="w-full h-full rounded-full object-cover group-hover:brightness-110 transition-all duration-300"
      />
      
      {/* Subtle glow effect */}
      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 animate-pulse"></div>
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap backdrop-blur-sm">
        Built with Bolt
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-black/80"></div>
      </div>
    </button>
  );
}

export default BoltBadge;