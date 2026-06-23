import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import { useRef, useEffect } from "react";
import { Canvas, useThree } from "@react-three/fiber";
import * as THREE from 'three';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { ParticleCloud } from './Anim3d.jsx';
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Projects from "./projects.jsx";

gsap.registerPlugin(ScrollTrigger);

ScrollTrigger.config({ autoRefreshEvents: "visibilitychange,DOMContentLoaded,load,resize" });

const SceneManager = ({ containerRef, aboutRef }) => {
  const { camera } = useThree();

  useGSAP(() => {
    if (!containerRef.current || !camera) return;

    gsap.to(camera, {
      zoom: 3000,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=150%",
        scrub: 1,
        invalidateOnRefresh: true
      },
      onUpdate: () => {
        camera.updateProjectionMatrix();
      }
    });

    if (aboutRef.current) {
      gsap.to(camera.rotation, {
        y: Math.PI / 4,
        scrollTrigger: {
          trigger: aboutRef.current,
          start: "top top",
          end: "+=100%",
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
        onUpdate: () => {
          camera.updateProjectionMatrix();
        }
      });
    }
  }, [camera, containerRef, aboutRef]);

  return (
    <>
      <directionalLight position={[0, 0, 5]} intensity={1} />
      <ParticleCloud />
    </>
  );
};

const Home = () => {
  const introWrapperRef = useRef(null);
  const texRef = useRef(null);
  const tex1Ref = useRef(null);
  const blurRef = useRef(null);
  const containerRef = useRef(null);
  const aboutRef = useRef(null);
  const aboutContentRef = useRef(null);
  const projectRef=useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
      window.scrollTo({ top: 0, left: 0, behavior: "instant" });
      setTimeout(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        ScrollTrigger.clearScrollMemory();
        ScrollTrigger.refresh(true);
      }, 10);
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  useGSAP(() => {
    if (!containerRef.current) return;
    
    document.body.style.overflow = "hidden";
    
    const introTl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = "auto";
        window.scrollTo({ top: 0, left: 0, behavior: "instant" });
        ScrollTrigger.refresh(true);
      }
    });

    introTl.fromTo(texRef.current, { x: -200, opacity: 0 }, { x: 0, opacity: 1, duration: 1, ease: "power2.inOut" }, 6.5);
    introTl.fromTo(tex1Ref.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.inOut" }, 6.8);
    introTl.fromTo(blurRef.current, { opacity: 0 }, { opacity: 1, duration: 2, ease: "power2.inOut" }, 6);

    gsap.to(introWrapperRef.current, {
      opacity: 0,
      y: -50,
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top top",
        end: "+=40%",
        scrub: true,
      }
    });

    gsap.to(aboutContentRef.current, {
      opacity: 0,
      y: -100,
      scrollTrigger: {
        trigger: aboutRef.current,
        start: "top top",
        end: "+=100%",
        scrub: true,
      }
    });

  }, { scope: containerRef, dependencies: [aboutRef, aboutContentRef] });

  return (
    <main ref={containerRef} className="relative w-full bg-black select-none ">
      <div className="fixed top-0 left-0 w-full h-screen z-11 pointer-events-none" onWheel={(e) => e.stopPropagation()} >
        <Canvas orthographic camera={{ position:[0,0,3], zoom: 200, near: 0.1, far: 1000 }} gl={{ antialias: true }} >
          <SceneManager containerRef={containerRef} aboutRef={aboutRef} />
          <EffectComposer frameBufferType={THREE.HalfFloatType}>
            <Bloom intensity={2} luminanceThreshold={1} luminanceSmoothing={0.1} radius={0.5} mipmapBlur={true} />
          </EffectComposer>
        </Canvas>
      </div>

      <section className="relative z-10 h-screen w-full flex flex-col justify-center items-center overflow-hidden">
        <div ref={introWrapperRef} className="relative w-full h-full flex flex-col justify-center items-center">
          <div ref={texRef} className="z-1 absolute left-1/2 -translate-x-1/2 top-[62%] text-xl font-medium tracking-[0.5em] text-blue-200/80 uppercase whitespace-nowrap" >
            <span className="inline-block transition duration-300 hover:scale-[1.15]">MERN </span>{" "}
            <span className="inline-block transition duration-300 hover:scale-[1.15]">Stack </span>{" "}
            <span className="inline-block transition duration-300 hover:scale-[1.15]">Developer </span>{" "}
            &{" "}
            <span className="inline-block transition duration-300 hover:scale-[1.15]">AI </span>{" "}
            <span className="inline-block transition duration-300 hover:scale-[1.15]">Enthusiast </span>
          </div>
          <div ref={tex1Ref} className="z-1 transition hover:scale-[1.1] duration-300 hover:text-white/70 absolute left-1/2 -translate-x-1/2 top-[68%] text-sm text-white/50 tracking-wide whitespace-nowrap" >
            crafting intelligent apps with 3D experiences
          </div>
          <div ref={blurRef} className="absolute z-[-5] w-100 h-100 rounded-full blur-3xl bg-violet-400/10 bottom-0 left-1/2 -translate-x-1/2"></div>
        </div>
      </section>

      <section ref={aboutRef} className="relative z-10 h-screen w-full flex items-center justify-center bg-transparent mix-blend-difference">
        <div ref={aboutContentRef} className="relative max-w-4xl px-6 md:px-10 text-center z-10 will-change-transform">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-3xl pointer-events-none z-0" />
          <h2 className="relative z-10 bg-gradient-to-r from-blue-200/90 via-blue-400/50 to-purple-400/30 bg-clip-text text-transparent text-4xl md:text-6xl font-black mb-6 uppercase tracking-[0.1em] drop-shadow-[0_0_30px_rgba(147,197,253,0.15)]">
            About Me
          </h2>
          <p className="relative z-10 text-lg md:text-xl text-white font-light leading-relaxed max-w-2xl mx-auto tracking-wide balance">
            B.Tech CSE 3rd year student, Passionate about creating meaningful digital products. I love solving challenges through technology and thoughtful design. My work blends functionality, creativity, and user experience. Constantly learning and growing with every project.
          </p>
        </div>
      </section>

      {/* <section
      ref={projectRef}
      className="relative z-20  h-screen w-full flex items-center justify-center overflow-hidden"
    >
        <Canvas>
            <Projects />
        </Canvas>
    </section> */}
    </main>
  );
};

export default Home;
