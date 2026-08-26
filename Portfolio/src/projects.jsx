import React, { useRef, useState, useEffect } from 'react'
import { Html } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

const Projects = ({ progress, idx }) => {
  const domRefs = useRef([]);
  const isMobileRef = useRef(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const projects = [
    { id: 1, title: "AI Note Saver", description: "AI-powered note management application that lets users create, organize, summarize, rewrite, and enhance notes using Llama 3.3 AI.", features: ["🔐 JWT Auth", "🤖 AI Suggestions", "✏️ AI Rewrite", "📝 Note Management", "🌙 Light/Dark Mode", "📱 Responsive UI",], techstack: ["React", "Express.js", "Node.js", "Tailwind CSS", "Groq API", "Vercel AI SDK", "Llama 3.3",], github:"https://github.com", live:"https://vercel.app" },
    {
      id: 2,
      title: "Blog Application",
      description: "Modern full-stack blogging platform where users can create, edit, delete, and browse blog posts with a clean and responsive interface.",
      features: ["✍️ Create Blogs", "📝 Edit & Delete Posts", "🔍 Browse Articles", "⚡ Fast Navigation", "📱 Responsive UI", "🎨 Modern Design"],
      techstack: ["React", "TanStack Query", "Tailwind CSS", "JavaScript"],
      github:"", live:""
    },
    {
      id: 3,
      title: "Dynamic Career Guidance",
      description: "AI-powered career guidance platform that provides personalized career recommendations through dynamic questionnaires using Llama 3.3.",
      features: ["🤖 AI Career Guidance", "📋 Dynamic Questionnaire", "🎯 Personalized Recommendations", "⚡ Fast API Backend", "📊 Career Analysis", "🌐 Responsive Interface"],
      techstack: ["Python", "FastAPI", "Groq API", "Llama 3.3", "HTML", "CSS", "JavaScript"],
      github:"", live:""
    },
    {
      id: 4,
      title: "DTI Project",
      description: "Full-stack MERN application developed as a team project with secure authentication, scalable APIs, an interactive 3D experience, and cloud deployment.",
      features: ["🔐 User Authentication", "📊 Dashboard", "🌐 REST APIs", "🎮 Interactive 3D Models", "☁️ Render Deployment", "📱 Responsive Design"],
      techstack: ["MongoDB", "Express.js", "React", "Node.js", "Tailwind CSS", "Blender", "Three.js"],
      github:"", live:""
    }
  ];

  const carouselRef = useRef();

  useGSAP(() => {
    gsap.to(carouselRef.current.position, {
      x: -idx * 3.2,
      duration: 0.8,
      ease: "power2.out"
    });
  }, [idx]);

  useEffect(() => {
    domRefs.current = domRefs.current.slice(0, projects.length);
  }, [projects.length]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const mq = window.matchMedia('(max-width: 768px)');
    const setMobile = (ev) => {
      isMobileRef.current = ev.matches;
    };
    setMobile(mq);
    mq.addEventListener?.('change', setMobile);
    return () => mq.removeEventListener?.('change', setMobile);
  }, []);

  useFrame(() => {
    if (!progress.current) return;

    const currentProg = progress.current.value;

    const targetRotateX = 0;

    domRefs.current.forEach((el) => {
      if (el && currentProg < 0.95) {
  
        el.style.transform = `perspective(600px) rotateX(${targetRotateX}deg)`;
      }
    });
  });

  const tilt = (e, index) => {
    // disable tilt on mobile
    if (isMobileRef.current) return;
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

  const resetTilt = (e, index) => {
    if (isMobileRef.current) return;
    if (e.relatedTarget && e.currentTarget.contains(e.relatedTarget)) return;
    const el = domRefs.current[index];
    if (!el || progress.current.value < 0.95) return;
    gsap.to(el, { rotateX: 0, rotateY: 0, duration: 1, ease: "power2.out" });
  };

  return (
    <>
      <group ref={carouselRef}>
        {projects.map((p, index) => (
          <group key={p.id} position={[(index - 1) * 3.2, 0, 2]}>
            <directionalLight position={[0, 0, 2]} intensity={1} />
            <Html transform distanceFactor={2} scale={1} position={[0, 0, 0]}>
              <div
                ref={(el) => (domRefs.current[index] = el)}
                onMouseMove={(e) => tilt(e, index)}
                onMouseEnter={() => {
                  setHoveredIndex(index);
                  const el = domRefs.current[index];
                  if (el) gsap.set(el, { rotateX: 0, rotateY: 0, transformPerspective: 600 });
                }}
                onMouseLeave={(e) => {
                  setHoveredIndex(null)
                  resetTilt(e, index)
                }}
                style={{
                  transformStyle: "preserve-3d",
                }}
                className="pointer-events-auto text-center text-white group relative overflow-hidden backface-hidden w-[420px] h-[600px]  md:w-[500px] md:h-[600px] flex items-center flex-col p-4 border border-cyan-400/30 bg-slate-800 rounded-3xl shadow-xl shadow-cyan-500/10"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-700/80 via-slate-800/60 to-cyan-700/50 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
                <h1 className="relative z-10 text-4xl font-bold pointer-events-none bg-gradient-to-r from-indigo-300 via-violet-300 to-cyan-300 bg-clip-text text-transparent leading-tight ">{p.title}</h1>
                <div className='py-5 px-2 w-full max-h-[150px] overflow-clip pointer-events-none'>
                  <p className={`relative z-10 text-lg line-clamp-3 leading-normal transition-colors duration-700 ${hoveredIndex === index ? "text-white" : "text-slate-300"}`}>
                    {p.description}
                  </p>
                </div>
                <h3 className='relative z-10 text-xl font-semibold pointer-events-none w-full text-left text-indigo-300'>Features:</h3>
                <ul className="flex py-2 px-2 flex-wrap gap-3 relative z-20">
                  {p.features.map((feature, i) => (
                    <li key={i} className={`relative z-10 rounded-full px-3 py-1 text-base transition-all duration-700 ease-out border ${hoveredIndex === index ? "border-cyan-400/60 bg-cyan-500/20 text-white" : "border-slate-600 text-slate-300"}`}>
                      {feature}
                    </li>
                  ))}
                </ul>
                <h3 className='relative z-10 text-xl font-semibold pointer-events-none w-full text-left pt-5 text-cyan-300'>Tech Stack:</h3>
                <ul className="flex flex-wrap gap-x-8 pt-3 pl-8 list-disc relative z-20 PB-3">
                  {p.techstack.map((tech, i) => (
                    <li key={i} className={`relative z-10 text-base transition-all duration-700 ${hoveredIndex === index ? "text-cyan-300" : "text-slate-300"}`}>
                      {tech}
                    </li>
                  ))}
                </ul>
                <div className="flex justify-between w-full px-12 py-2 z-20 absolute bottom-8 ">
                  <button className="cursor-pointer relative z-10 border border-white/10 bg-white/10 hover:bg-white/20 text-white rounded-3xl px-6 py-2 text-base font-medium transition-all duration-300 backdrop-blur-sm"><a href={p.github} >Github</a></button>
                  <button className="cursor-pointer relative z-10 border border-indigo-400/50 bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 text-white rounded-3xl px-6 py-2 text-base font-medium transition-all duration-300 shadow-lg shadow-indigo-500/30"><a href={p.live} >Live</a></button>
                </div>
              </div>
            </Html>
          </group>
        ))}
      </group>
    </>
  );
};

export default Projects;
