import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  size?: 'small' | 'medium' | 'large';
  className?: string;
  showText?: boolean;
}

function Logo({ size = 'medium', className = '', showText = false }: LogoProps) {
  const sizeClasses = {
    small: 'h-16',
    medium: 'h-20',
    large: 'h-28'
  };
  
  return (
    <Link to="/" className={`flex items-center space-x-2 ${className}`}>
      <div className="logo-container">
        <img 
          src="/DEFFATEST-logo copy copy.png" 
          alt="DEFFATEST"
          className={`${sizeClasses[size]} w-auto object-contain`}
          loading="eager"
          fetchpriority="high"
        />
      </div>
    </Link>
  );
}

export default Logo;