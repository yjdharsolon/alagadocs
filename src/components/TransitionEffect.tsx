
import React, { useEffect, useState } from 'react';

type TransitionEffectProps = {
  children: React.ReactNode;
};

const TransitionEffect: React.FC<TransitionEffectProps> = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Start animation after component mounts
    setIsVisible(true);
    
    // Handle page changes and route transitions
    const handleRouteChange = () => {
      setIsVisible(false);
      setTimeout(() => setIsVisible(true), 100);
    };
    
    // Cleanup function
    return () => {
      setIsVisible(false);
    };
  }, []);
  
  return (
    <div className={`transition-opacity duration-1000 ease-apple ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      {children}
    </div>
  );
};

export default TransitionEffect;
