import React, { useRef, useMemo, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { OrbitControls, Html, Billboard, Stars } from '@react-three/drei';
import * as THREE from 'three';

const SKILLS_DATA = [
  { name: "React", category: "Frontend", icon: "⚛️", glow: "shadow-cyan-500/50" },
  { name: "Three.js", category: "3D Graphics", icon: "📐", glow: "shadow-white/50" },
  { name: "R3F", category: "3D Graphics", icon: "🎮", glow: "shadow-pink-500/50" },
  { name: "GSAP", category: "Animation", icon: "⚡", glow: "shadow-green-500/50" },
  { name: "Node.js", category: "Backend", icon: "🟢", glow: "shadow-green-600/50" },
  { name: "Express.js", category: "Backend", icon: "🚂", glow: "shadow-slate-400/50" },
  { name: "MongoDB", category: "Database", icon: "🍃", glow: "shadow-emerald-500/50" },
  { name: "Blender", category: "3D Modeling", icon: "🟠", glow: "shadow-orange-500/50" },
  { name: "FastAPI", category: "Backend", icon: "⚡", glow: "shadow-teal-500/50" },
  { name: "Python", category: "Backend", icon: "🐍", glow: "shadow-yellow-500/50" },
  { name: "Tailwind CSS", category: "Frontend", icon: "🎨", glow: "shadow-sky-500/50" },
  { name: "Git", category: "DevOps", icon: "📦", glow: "shadow-red-500/50" }
];

const isMobile = window.innerWidth < 768;

function SkillBadge({ name, category, icon, glow }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`flex flex-col items-center justify-center p-3 w-32 h-20 rounded-2xl border transition-all duration-500 select-none cursor-pointer text-center backdrop-blur-md ${
        hovered
          ? `bg-slate-900/90 border-cyan-400 scale-110 shadow-lg ${glow}`
          : 'bg-slate-950/40 border-white/10'
      }`}
    >
      <span className="text-xl mb-1 filter drop-shadow-[0_0_4px_rgba(255,255,255,0.2)]">{icon}</span>
      <span className="text-xs font-bold text-white tracking-wide">{name}</span>
      <span className="text-[7px] font-semibold uppercase tracking-[0.2em] text-slate-400 mt-1">
        {category}
      </span>
    </div>
  );
}

function SkillsSphere({ radius = 4.2 }) {
  const groupRef = useRef();

  const points = useMemo(() => {
    const count = SKILLS_DATA.length;
    const tempPoints = [];
    for (let i = 0; i < count; i++) {
      const phi = Math.acos(1 - 2 * (i + 0.5) / count);
      const theta = Math.PI * (1 + Math.sqrt(5)) * i;
      let x;
      if(!isMobile)
          x=(radius+4) * Math.cos(theta) * Math.sin(phi);
      else 
        x=(radius-2) * Math.cos(theta) * Math.sin(phi);
      const y = radius * Math.sin(theta) * Math.sin(phi);
      const z = radius * Math.cos(phi);
      tempPoints.push(new THREE.Vector3(x, y, z));
    }
    return tempPoints;
  }, [radius]);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.getElapsedTime() * 0.03;
      groupRef.current.rotation.x = Math.sin(state.clock.getElapsedTime() * 0.08) * 0.04;
    }
  });

  return (
    <group ref={groupRef}>
      {SKILLS_DATA.map((skill, index) => {
        const point = points[index];
        return (
          <group key={skill.name} position={point}>
            <Billboard>
              <Html distanceFactor={8.5} center>
                <SkillBadge {...skill} />
              </Html>
            </Billboard>
          </group>
        );
      })}
    </group>
  );
}

const Skills = () => {
  return (
    <>
      <ambientLight intensity={0.7} />
      <directionalLight position={[0, 0, 5]} intensity={1} />
      <Stars radius={90} depth={40} count={700} factor={3} saturation={0.5} fade speed={1.2} />
      <SkillsSphere />
      <OrbitControls enableZoom={false} enablePan={false} autoRotate={false} />
    </>
  );
};

export default Skills;