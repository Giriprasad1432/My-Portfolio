import React, { useState, useEffect } from 'react';
import gsap from 'gsap'
import './App.css'
import Home from './Home.jsx'
import { ScrollTrigger, SplitText } from "gsap/all";
import { useProgress } from '@react-three/drei';

gsap.registerPlugin(ScrollTrigger, SplitText);

function CustomLoader({ faded, progress }) {
  return (
    <div 
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black transition-all duration-700 ease-in-out ${
        faded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 rounded-full bg-indigo-500/10 blur-3xl pointer-events-none animate-pulse" />
      
      {/* Loading title */}
      <div className="relative z-10 text-2xl md:text-3xl font-black tracking-[0.2em] uppercase bg-gradient-to-r from-blue-300 via-indigo-300 to-cyan-300 bg-clip-text text-transparent mb-6 select-none animate-pulse">
        Giri Prasad
      </div>

      {/* Progress Bar Container */}
      <div className="relative z-10 w-64 md:w-80 bg-white/5 rounded-full h-1 overflow-hidden border border-white/10">
        <div 
          className="bg-gradient-to-r from-indigo-500 via-violet-500 to-cyan-400 h-full transition-all duration-300 ease-out shadow-[0_0_12px_rgba(6,182,212,0.6)]" 
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Percentage Text */}
      <div className="relative z-10 mt-4 text-xs font-mono tracking-[0.15em] text-slate-400 uppercase select-none">
        {Math.round(progress)}% loaded
      </div>
    </div>
  );
}

function App() {
  const { active, progress } = useProgress();
  const [faded, setFaded] = useState(false);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (!active && progress === 100) {
      // Short delay to allow Three.js to render the first frame before fading out
      const fadeTimer = setTimeout(() => {
        setFaded(true);
      }, 600);
      
      const removeTimer = setTimeout(() => {
        setShowLoader(false);
      }, 1400); 
      
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [active, progress]);

  return (
    <div>
      <Home startAnimation={faded} />
      {showLoader && <CustomLoader faded={faded} progress={progress} />}
    </div>
  );
}

export default App;
