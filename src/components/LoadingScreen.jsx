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

  // ✅ Typing function (fixed)
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
          setTimeout(resolve, 800); // pause after typing
        }
      }, 35);
    });
  };

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const runAnimation = async () => {
      // Fade in
      gsap.fromTo(containerRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1 }
      );

      // Character appears
      gsap.fromTo(
        characterRef.current,
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1 }
      );

      // Wait for intro
      await new Promise((res) => setTimeout(res, 1500));

      // ✅ Show messages one by one
      for (let msg of messages) {
        await typeText(msg);
      }

      // Fade out character + text
      gsap.to([characterRef.current, textRef.current], {
        opacity: 0,
        duration: 0.5
      });

      // Show video
      gsap.to(videoRef.current, {
        opacity: 1,
        duration: 1,
        onStart: () => videoRef.current.play(),
      });

      // Video duration
      await new Promise((res) => setTimeout(res, 3000));

      // Fade out everything
      gsap.to(containerRef.current, {
        opacity: 0,
        duration: 1,
        onComplete: onFinish,
      });
    };

    runAnimation();

    // cleanup
    return () => {
      if (typingRef.current) clearInterval(typingRef.current);
    };
  }, [onFinish]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black flex items-center justify-center z-[9999]"
    >
      {/* Character */}
      <div className="absolute flex flex-col items-center text-center">
        <img
          ref={characterRef}
          src="/character.svg"
          alt="thinking developer"
          className="w-40 md:w-64"
        />

        <h1
          ref={textRef}
          className="text-green-400 text-xl md:text-3xl font-mono mt-6"
        >
          <span className="animate-pulse ml-1">|</span>
        </h1>
      </div>

      {/* Video */}
      <video
        ref={videoRef}
        className="absolute w-full h-full object-cover opacity-0"
        muted
        playsInline
      >
        <source src="/laptop-video.mp4" type="video/mp4" />
      </video>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40"></div>
    </div>
  );
}