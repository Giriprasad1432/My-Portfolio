import React, { useState, useRef, useMemo, useEffect } from 'react';
import gsap from 'gsap'
import './App.css'
import Home from './Home.jsx'
import { ScrollTrigger, SplitText } from "gsap/all";
import Projects from './projects.jsx';


gsap.registerPlugin(ScrollTrigger, SplitText);

function App() {


  return (
    <div>
      <Home/>
    </div>
  )
}

export default App
