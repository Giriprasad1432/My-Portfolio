import React, { useRef, useMemo, useEffect } from 'react';
import { Canvas, useFrame, extend } from "@react-three/fiber";
import { OrbitControls, useTexture, useGLTF, GizmoHelper, GizmoViewport, GizmoViewcube } from "@react-three/drei";
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';

extend({ TextGeometry });

export function ParticleCloud() {
  const texture = useTexture("particles.png");
  const pointsRef = useRef();
  const { scene } = useGLTF("heroText1.glb");
  const totalParticles = 20000;

  const [originalPositions, curPositions] = useMemo(() => {
    return [
      new Float32Array(totalParticles * 3),
      new Float32Array(totalParticles * 3)
    ];
  }, [totalParticles]);

  let textMesh = null;
  scene.traverse((child) => {
    if (child.isMesh) {
      textMesh = child;
    }
  });

  useEffect(() => {
    for(let i=0 ;i<totalParticles;i++){
      originalPositions[3*i] = curPositions[3*i] = (Math.random()-0.5)*9;
      originalPositions[3*i+1] = curPositions[3*i+1] = (Math.random()-0.5)*5;
    }
    pointsRef.current.geometry.setAttribute('position',new THREE.BufferAttribute(curPositions,3));
  });



  // useEffect(() => {
  //   if (!textMesh) return;

  //   const geometry = textMesh.geometry;
  //   geometry.rotateX(Math.PI / 4);
  //   geometry.center();

  //   const sampler = new MeshSurfaceSampler(textMesh).build();
  //   const temporaryPoint = new THREE.Vector3();

  //   for (let i = 0; i < totalParticles; i++) {
  //     sampler.sample(temporaryPoint);
  //     originalPositions[3*i] = curPositions[3*i] = temporaryPoint.x;
  //     originalPositions[3*i + 1] = curPositions[3*i + 1] = temporaryPoint.y;
  //     originalPositions[3*i + 2] = curPositions[3*i + 2] = temporaryPoint.z;
  //   }
  //   pointsRef.current.geometry.setAttribute("position", new THREE.BufferAttribute(curPositions, 3));
  // }, [scene]);

  const mouse3D = new THREE.Vector3();

  const prevMouseX = useRef(0);
  const prevMouseY = useRef(0);
  const currentVelocity = useRef(0);

  useFrame((state) => {
    if (!pointsRef.current) return;

    mouse3D.set(state.pointer.x, state.pointer.y, 0).unproject(state.camera);


    const mouseDeltaX = mouse3D.x - prevMouseX.current;
    const mouseDeltaY = mouse3D.y - prevMouseY.current;
    const rawVelocity = Math.sqrt(mouseDeltaX * mouseDeltaX + mouseDeltaY * mouseDeltaY);

    currentVelocity.current += (rawVelocity - currentVelocity.current) * 0.1;

    prevMouseX.current = mouse3D.x;
    prevMouseY.current = mouse3D.y;


    const maxRadius = 0.2;
    const r = maxRadius * Math.min(currentVelocity.current * 15, 1);

    const posAttribute = pointsRef.current.geometry.attributes.position;
    const array = posAttribute.array;

    for (let i = 0; i < totalParticles; i++) {
      const idxX = i * 3;
      const idxY = i * 3 + 1;
      const idxZ = i * 3 + 2;

      const deltaX = mouse3D.x - array[idxX];
      const deltaY = mouse3D.y - array[idxY];
      const dsq = deltaX * deltaX + deltaY * deltaY;

      if (r > 0 && dsq <= r * r) {
        const forceFactor = 0.7 * (r / maxRadius);
        array[idxX] -= deltaX * forceFactor;
        array[idxY] -= deltaY * forceFactor;
      } else {
        array[idxX] += (originalPositions[idxX] - array[idxX]) * 0.04;
        array[idxY] += (originalPositions[idxY] - array[idxY]) * 0.04;
      }

      array[idxZ] = originalPositions[idxZ];
    }

    posAttribute.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry />
      <pointsMaterial
        color={[3, 3, 3]}
        size={0.015}
        transparent
        alphaTest={0.0}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation={true}
        map={texture}
      />
    </points>
  );
}
