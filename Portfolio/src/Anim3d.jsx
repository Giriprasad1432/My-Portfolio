import React, { useRef, useMemo, useEffect } from 'react';
import { useFrame, extend } from "@react-three/fiber";
import { useTexture, useGLTF } from "@react-three/drei";
import { MeshSurfaceSampler } from 'three/examples/jsm/math/MeshSurfaceSampler.js';
import * as THREE from 'three';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

export function ParticleCloud() {
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

    let textMesh = null;
    scene.traverse((child) => {
        if (child.isMesh) {
            textMesh = child;
        }
    });

    if (textMesh) {
        textMesh.geometry.rotateX(Math.PI / 4);
        textMesh.geometry.center();
    }

    useEffect(() => {
        for (let i = 0; i < totalParticles; i++) {
            shape1[3 * i] = (Math.random() - 0.5) * 9;
            shape1[3 * i + 1] = (Math.random() - 0.5) * 5;
            shape1[3 * i + 2] = (Math.random() - 0.5) * 2;
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
        pointsRef.current.geometry.setAttribute("position", new THREE.BufferAttribute(new Float32Array(homeShape), 3));
    }, [scene, totalParticles, shape1, shape2, homeShape]);

    useGSAP(() => {
        const tl = gsap.timeline({ repeat: -1 });

        tl.to(morphProgress.current, {
            value: 1,
            duration: 1.5,
            ease: "power2.inOut"
        }, 5)
        .to(morphProgress.current, {
            value: 0,
            duration: 1.5,
            ease: "power2.inOut"
        }, 16.5);
    }, [shape1, shape2, homeShape]);

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
        const t = morphProgress.current.value;

        for (let i = 0; i < totalParticles; i++) {
            const idxX = i * 3;
            const idxY = i * 3 + 1;
            const idxZ = i * 3 + 2;

            const s1x = shape1[idxX];
            const s1y = shape1[idxY];
            const s1z = shape1[idxZ];

            const s2x = shape2[idxX];
            const s2y = shape2[idxY];
            const s2z = shape2[idxZ];

            const orgX = s1x + (s2x - s1x) * t;
            const orgY = s1y + (s2y - s1y) * t;
            const orgZ = s1z + (s2z - s1z) * t;

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
