import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame } from "@react-three/fiber";
import { useTexture, useGLTF } from "@react-three/drei";
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function ParticleCloud({ containerRef }) {
    const pointsRef = useRef();
    const texture = useTexture("particles.png");
    const { scene } = useGLTF("heroText1.glb");
    const totalParticles = 20000;

    const shape1 = useMemo(() => new Float32Array(totalParticles * 3), [totalParticles]);
    const shape2 = useMemo(() => new Float32Array(totalParticles * 3), [totalParticles]);
    const homeShape = useMemo(() => new Float32Array(totalParticles * 3), [totalParticles]);

    const morphProgress = useRef({ value: 0 });
    const mouse3D = new THREE.Vector3();
    const prevMouseX = useRef(0);
    const prevMouseY = useRef(0);
    const currentVelocity = useRef(0);

    const colorState = useRef({ r: 1.5, g: 3.5, b: 8.0 });

    let textMesh = null;
    scene.traverse((child) => {
        if (child.isMesh) {
            textMesh = child;
        }
    });

    useEffect(() => {
        if (textMesh) {
            textMesh.geometry.rotateX(Math.PI / 4);
            textMesh.geometry.center();
        }
    }, [textMesh]);

    useEffect(() => {
        for (let i = 0; i < totalParticles; i++) {
            const theta = Math.random() * Math.PI * 2;
            const coreBias = Math.pow(Math.random(), 4.0); 
            const radius = coreBias * 14; 

            let x = radius * Math.cos(theta);
            let y = radius * Math.sin(theta);
            let z = (Math.random() - 0.5) * 3;

            if (Math.random() > 0.7) {
                x += (Math.random() - 0.5) * 6;
                y += (Math.random() - 0.5) * 6;
            }

            if (Math.random() > 0.96) {
                shape1[3 * i] = (Math.random() - 0.5) * 45;
                shape1[3 * i + 1] = (Math.random() - 0.5) * 30;
                shape1[3 * i + 2] = (Math.random() - 0.5) * 12;
            } else {
                shape1[3 * i] = x;
                shape1[3 * i + 1] = y;
                shape1[3 * i + 2] = z;
            }
        }

        if (!textMesh) return;

        const sampler = new MeshSurfaceSampler(textMesh).build();
        const temporaryPoint = new THREE.Vector3();

        for (let i = 0; i < totalParticles; i++) {
            sampler.sample(temporaryPoint);
            shape2[3 * i] = temporaryPoint.x;
            shape2[3 * i + 1] = temporaryPoint.y;
            shape2[3 * i + 2] = temporaryPoint.z;
        }

        homeShape.set(shape1);
        if (pointsRef.current) {
            pointsRef.current.geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(homeShape), 3));
        }
    }, [scene, totalParticles, shape1, shape2, homeShape, textMesh]);

    useGSAP(() => {
        const tl = gsap.timeline();

        tl.to(morphProgress.current, {
            value: 1,
            duration: 3,
            ease: "power2.inOut"
        }, 1);

        if (!containerRef || !containerRef.current) return;

        gsap.to(colorState.current, {
            r: 6.0,
            g: 0.5,
            b: 9.0,
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top top",
                end: "+=150%",
                scrub: 1
            }
        });
    }, [shape1, shape2, homeShape, containerRef]);

    useFrame((state) => {
        if (!pointsRef.current || !pointsRef.current.material) return;

        pointsRef.current.material.color.setRGB(
            colorState.current.r,
            colorState.current.g,
            colorState.current.b
        );

        mouse3D.set(state.pointer.x, state.pointer.y, 0).unproject(state.camera);

        const mouseDeltaX = mouse3D.x - prevMouseX.current;
        const mouseDeltaY = mouse3D.y - prevMouseY.current;
        const rawVelocity = Math.sqrt(mouseDeltaX * mouseDeltaX + mouseDeltaY * mouseDeltaY);

        currentVelocity.current += (rawVelocity - currentVelocity.current) * 0.1;

        prevMouseX.current = mouse3D.x;
        prevMouseY.current = mouse3D.y;

        const maxRadius = 0.12;
        const r = maxRadius * Math.min(currentVelocity.current * 15, 1);

        const posAttribute = pointsRef.current.geometry.attributes.position;
        if (!posAttribute) return;
        const array = posAttribute.array;
        const t = morphProgress.current.value;
        const elapsedTime = state.clock.getElapsedTime();

        for (let i = 0; i < totalParticles; i++) {
            const idxX = i * 3;
            const idxY = i * 3 + 1;
            const idxZ = i * 3 + 2;

            const s1x = shape1[idxX]; const s1y = shape1[idxY]; const s1z = shape1[idxZ];
            const s2x = shape2[idxX]; const s2y = shape2[idxY]; const s2z = shape2[idxZ];

            let orgX = s1x + (s2x - s1x) * t;
            let orgY = s1y + (s2y - s1y) * t;
            let orgZ = s1z + (s2z - s1z) * t;

            const waveSpeed = 2.0;
            const waveFrequency = 5.0;
            const waveAmplitude = 0.05;

            const waveAngle = elapsedTime * waveSpeed + i * waveFrequency;
            const waveOffset = Math.sin(waveAngle) * waveAmplitude;

            orgY += waveOffset;
            orgZ += waveOffset * 0.5;

            homeShape[idxX] = orgX;
            homeShape[idxY] = orgY;
            homeShape[idxZ] = orgZ;

            const deltaX = mouse3D.x - array[idxX];
            const deltaY = mouse3D.y - array[idxY];
            const dsq = deltaX * deltaX + deltaY * deltaY;

            if (r > 0 && dsq <= r * r) {
                const forceFactor = 0.7 * (r / maxRadius);
                array[idxX] -= deltaX * forceFactor;
                array[idxY] -= deltaY * forceFactor;
            } else {
                array[idxX] += (orgX - array[idxX]) * 0.04;
                array[idxY] += (orgY - array[idxY]) * 0.04;
            }

            array[idxZ] = orgZ;
        }

        posAttribute.needsUpdate = true;
    });

    return (
        <group>
            <points ref={pointsRef}>
                <bufferGeometry />
                <pointsMaterial
                    size={0.028}
                    transparent
                    alphaTest={0.0}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                    sizeAttenuation={true}
                    map={texture}
                />
            </points>
        </group>
    );
}
