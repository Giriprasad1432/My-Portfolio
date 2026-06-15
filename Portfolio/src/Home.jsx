import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import { useRef } from "react";

const Home = () => {
    const text = "GIRI PRASAD ALLU";
    const textRef = useRef(null);
    useGSAP(() => {
        gsap.to('#heading', {
            opacity: 1,
            duration: 2,
            y: -40,
            ease: "power2.out",
            stagger: 0.2
        })
    }, [])
    return (
        <div >
            <div className="flex items-center justify-center h-screen">
                <div ref={textRef} className=" font-bold text-9xl opacity-0" id="heading">GIRI PRASAD ALLU</div>
            </div>
        </div>
    )
}

export default Home;