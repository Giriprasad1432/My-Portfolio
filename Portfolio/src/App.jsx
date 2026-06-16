import React, { useState, useRef, useMemo, useEffect } from 'react';
import gsap from 'gsap'
import './App.css'
import Home from './Home.jsx'
import { ScrollTrigger, SplitText } from 'gsap/all'
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, useTexture, useGLTF, GizmoHelper, GizmoViewport, GizmoViewcube } from "@react-three/drei";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ParticleCloud } from './Anim3d.jsx';


gsap.registerPlugin(ScrollTrigger, SplitText);

function App() {


  return (
    <section className="h-screen w-screen bg-neutral-900">

      <Canvas
        orthographic
        camera={{ position: [0, 0, 3], zoom: 200, near: 0.1, far: 1000 }}
        gl={{ antialias: true }}
      >
        <OrbitControls enableRotate={false} minZoom={200}
          maxZoom={200}
        />
        <GizmoHelper alignment="bottom-right" margin={[100, 100]}>
          <GizmoViewcube />
        </GizmoHelper>
        <ParticleCloud />
        <EffectComposer frameBufferType={THREE.HalfFloatType}>
          <Bloom intensity={2} luminanceThreshold={1} luminanceSmoothing={0.1} radius={0.5} mipmapBlur={true} />
        </EffectComposer>
      </Canvas>
    </section>
  )
}

export default App
