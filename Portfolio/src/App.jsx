import { useState } from 'react'
import gsap from 'gsap'
import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'
import './App.css'
import Home from './Home.jsx'
import { ScrollTrigger, SplitText } from 'gsap/all'


gsap.registerPlugin(ScrollTrigger, SplitText);

function App() {


  return (
    <>
      <Home/>
    </>
  )
}

export default App
