import React, { useEffect, useRef, useState } from 'react'
import { OrbitControls, Html } from '@react-three/drei'
import gsap from 'gsap'

const Projects = () => {
    const cardRef = useRef();

    const [projects, setProjects] = useState([
        {
            id: 1,
            title: "Project 1",
            description: "Description 1",
            image: "image1.jpg"
        },
        {
            id: 2,
            title: "Project 2",
            description: "Description 2",
            image: "image2.jpg"
        },
        {
            id: 3,
            title: "Project 3",
            description: "Description 3",
            image: "image3.jpg"
        }
    ])

    const tilt = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const dX = x - centerX;
        const dY = y - centerY;

        const maxTilt = 0.25;

        let rotateY = dX / 200;
        let rotateX = -dY / 200;

        rotateY = Math.max(-maxTilt, Math.min(maxTilt, rotateY));
        rotateX = Math.max(-maxTilt, Math.min(maxTilt, rotateX));

        gsap.to(cardRef.current.rotation, {
            x: rotateX,
            y: rotateY,
            duration: 0.5,
            ease: "power2.out"
        });
    };

    const resetTilt = () => {
        gsap.to(cardRef.current.rotation, {
            x: 0,
            y: 0,
            duration: 1,
            ease: "power2.out"
        });
    };


    return (
        <>
            {projects.map((p, index) => (

                <group ref={cardRef}>
                    <directionalLight position={[0, 0, 0]} />
                    <Html
                        transform
                        distanceFactor={2}
                        scale={1}
                        position={[0, 0, 0]}
                    >
                        <div
                            onMouseMove={tilt}
                            onMouseLeave={resetTilt}
                            className="group relative overflow-hidden backface-hidden [transform-style:preserve-3d] w-[300px] h-[200px] flex items-center flex-col p-4 border border-gray-400 rounded-3xl"
                        >

                            <div
                                className="absolute inset-0 bg-linear-to-b from-violet-500/70 to-blue-950 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                            />

                            <h1 className="relative z-10 text-3xl font-bold">
                                {projects.title}
                            </h1>

                            <p className="relative z-10 text-sm">
                                {projects.description}
                            </p>

                        </div>
                    </Html>
                    <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
                </group>))}
        </>
    )
}

export default Projects