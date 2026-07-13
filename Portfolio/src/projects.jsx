import React, { useRef } from 'react'
import { OrbitControls, Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Projects = ({ progress }) => {
  const domRefs = useRef([]);

  const projects = [
    { id: 1, title: "Project 1", description: "Description 1" },
    { id: 2, title: "Project 2", description: "Description 2" },
    { id: 3, title: "Project 3", description: "Description 3" }
  ];


  useFrame(() => {
    if (!progress.current) return;

    const currentProg = progress.current.value; 

    const targetRotateX = 90 - (currentProg * 90);

    domRefs.current.forEach((el) => {
      if (el) {
        el.style.transform = `rotateX(${targetRotateX}deg)`;
      }
    });
  });

  const tilt = (e, index) => {
    const el = domRefs.current[index];
    if (!el || progress.current.value < 0.95) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const dX = x - centerX;
    const dY = y - centerY;
    const maxTilt = 12;
    
    let rotateY = Math.max(-maxTilt, Math.min(maxTilt, (dX / centerX) * maxTilt));
    let rotateX = Math.max(-maxTilt, Math.min(maxTilt, -(dY / centerY) * maxTilt));
    
    gsap.to(el, { rotateX, rotateY, duration: 0.5, ease: "power2.out", transformPerspective: 600 });
  };

  const resetTilt = (index) => {
    const el = domRefs.current[index];
    if (!el || progress.current.value < 0.95) return;
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 1, ease: "power2.out" });
  };

  return (
    <>
      {projects.map((p, index) => (
        <group key={p.id} position={[(index - 1) * 3.2, 0, 2]}>
          <directionalLight position={[0, 0, 2]} intensity={1} />
          <Html transform distanceFactor={2} scale={1} position={[0, 0, 0]}>
            <div 
              ref={(el) => (domRefs.current[index] = el)} 
              onMouseMove={(e) => tilt(e, index)} 
              onMouseLeave={() => resetTilt(index)}
              style={{ 
                transformStyle: "preserve-3d",
                transform: "rotateX(90deg)" // Baseline starting position
              }} 
              className="group relative overflow-hidden backface-hidden w-[300px] h-[200px] flex items-center flex-col p-4 border bg-slate-500/5 border-gray-400 rounded-3xl"
            >
              <div className="absolute inset-0 bg-linear-to-b from-violet-500/70 to-blue-950 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <h1 className="relative z-10 text-3xl font-bold">{p.title}</h1>
              <p className="relative z-10 text-sm">{p.description}</p>
            </div>
          </Html>
        </group>
      ))}
      <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
    </>
  );
};

export default Projects;