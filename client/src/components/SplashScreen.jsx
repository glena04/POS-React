import React, { useEffect, useState } from 'react';
import '../CSS/SplashScreen.css'; 


const SplashScreen = ({ onLoadingComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(onLoadingComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [onLoadingComplete]);

  return (
    <div className="splash-container">
      <div className="floating-shapes">
        <div className="shape shape1"></div>
        <div className="shape shape2"></div>
        <div className="shape shape3"></div>
      </div>
      
      <div className="content">
        <h1 className="logo">POS<span>Pro</span></h1>
        
        <div className="spinner">
          <div className="loader">
            <span className="progress-text">{progress}%</span>
          </div>
        </div>
        
        <p className="loading-text">Initializing System...</p>
      </div>
    </div>
  );
};

export default SplashScreen;