import gsap from "gsap";
import { useGSAP } from '@gsap/react';
import { useRef } from "react";
import { SplitText } from "gsap/all";

const Home = () => {
    const textRef = useRef(null);
    useGSAP(() => {
        let text = new SplitText(textRef.current, {
            type: "words chars"
        })
        textRef.current=text.chars;
        gsap.set(text.chars, {
            opacity: 0,
            rotateX: 120,
        })
        gsap.to(text.chars, {
            opacity: 1,
            duration: 0.8,
            rotateX:0,
            ease: "power2.out",
            stagger: 0.05
        })
    }, [])

    return (
        <div className="" >
            <div className="flex items-center justify-center h-[100vh] bg-black ">
                <div ref={textRef} className="transform-gpu text-white font-bold text-9xl" id="heading">GIRI PRASAD ALLU</div>
            </div>
        </div>
    )
}

export default Home;