import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function LoadingScreen({ onFinish }) {
  const characterRef = useRef();
  const textRef = useRef();
  const containerRef = useRef();
  const videoRef = useRef();

  const typingRef = useRef(null);
  const hasRun = useRef(false);

  const messages = [
    "Thinking about starting coding...",
    "Maybe this will change my life.",
    "Opening VS Code for the first time...",
    "Initializing Developer Journey..."
  ];

  const typeText = (text) => {
    return new Promise((resolve) => {
      let i = 0;
      textRef.current.innerHTML = "";

      if (typingRef.current) {
        clearInterval(typingRef.current);
      }

      typingRef.current = setInterval(() => {
        textRef.current.innerHTML += text[i];
        i++;

        if (i === text.length) {
          clearInterval(typingRef.current);
          setTimeout(resolve, 800);
        }
      }, 35);
    });
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const runAnimation = async () => {
      gsap.fromTo(containerRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1 }
      );

      gsap.fromTo(
        characterRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      );

      await new Promise((res) => setTimeout(res, 1500));

      for (let msg of messages) {
        await typeText(msg);
      }

      gsap.to([characterRef.current, textRef.current], {
        opacity: 0,
        duration: 0.5
      });

      gsap.to(videoRef.current, {
        opacity: 1,
        duration: 1,
        onStart: () => videoRef.current.play(),
      });

      await new Promise((res) => setTimeout(res, 3000));

      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 1,
        onComplete: onFinish,
      });
    };

    runAnimation();

    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, [onFinish]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black flex items-center justify-center z-[9999] overflow-hidden"
    >
      {/* Character Section */}
      <div className="absolute flex flex-col items-center text-center px-4 sm:px-6 md:px-0 max-w-[90%] sm:max-w-[80%] md:max-w-none">
        
        <img
          ref={characterRef}
          src="/character.svg"
          alt="thinking developer"
          className="w-28 sm:w-36 md:w-48 lg:w-64 max-w-full h-auto"
        />

        <h1
          ref={textRef}
          className="text-green-400 font-mono mt-4 sm:mt-5 md:mt-6 
                     text-sm sm:text-lg md:text-2xl lg:text-3xl 
                     leading-relaxed break-words"
        >
          <span className="animate-pulse ml-1">|</span>
        </h1>
      </div>

      {/* Video */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover opacity-0"
        muted
        playsInline
      >
        <source src="/laptop-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50"></div>
    </div>
  );
}