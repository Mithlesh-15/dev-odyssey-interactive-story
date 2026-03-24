import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function LoadingScreen({ onFinish }) {
  const containerRef = useRef();
  const charRef = useRef();
  const typingRef = useRef();
  const fillRef = useRef();
  const pctRef = useRef();
  const statusRef = useRef();
  const videoRef = useRef();
  const intervalRef = useRef();
  const hasRun = useRef(false);
  const [dots, setDots] = useState([false, false, false, false]);

  const messages = [
    { text: "Thinking about starting coding...",    emoji: "🤔", pct: 20  },
    { text: "Maybe this will change my life.",       emoji: "💭", pct: 45  },
    { text: "Opening VS Code for the first time...", emoji: "💻", pct: 70  },
    { text: "Initializing Developer Journey...",     emoji: "🚀", pct: 100 },
  ];

  /* ── helpers ───────────────────────────────────────── */

  const typeText = (text) =>
    new Promise((resolve) => {
      typingRef.current.innerHTML = "";
      let i = 0;
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        typingRef.current.innerHTML += text[i];
        i++;
        if (i === text.length) {
          clearInterval(intervalRef.current);
          setTimeout(resolve, 750);
        }
      }, 36);
    });

  const animateProgress = (target, duration = 700) => {
    if (!fillRef.current || !pctRef.current) return;
    fillRef.current.style.transition = `width ${duration}ms cubic-bezier(0.23,1,0.32,1)`;
    fillRef.current.style.width = `${target}%`;
    let current = parseFloat(fillRef.current.dataset.pct || "0");
    fillRef.current.dataset.pct = target;
    const step = (target - current) / (duration / 16);
    const iv = setInterval(() => {
      current = Math.min(current + step, target);
      if (pctRef.current) pctRef.current.textContent = `${Math.round(current)}%`;
      if (current >= target) clearInterval(iv);
    }, 16);
  };

  const glitch = () => {
    if (!charRef.current) return;
    gsap.to(charRef.current, {
      x: -3, skewX: 5, duration: 0.05,
      yoyo: true, repeat: 3,
      onComplete: () => gsap.set(charRef.current, { x: 0, skewX: 0 }),
    });
  };

  /* ── main animation ────────────────────────────────── */

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const tl = gsap.timeline();

    // 1. Fade in container
    tl.fromTo(containerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" }
    );

    // 2. Slide up character
    tl.fromTo(charRef.current,
      { y: 50, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.9, ease: "back.out(1.5)" },
      "-=0.3"
    );

    // 3. Fade in progress bar area
    tl.fromTo(".ls-progress-area",
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" },
      "-=0.4"
    );

    tl.add(async () => {
      await new Promise(r => setTimeout(r, 400));

      for (let i = 0; i < messages.length; i++) {
        const msg = messages[i];

        // Swap emoji with glitch
        charRef.current.textContent = msg.emoji;
        glitch();
        if (statusRef.current) statusRef.current.textContent = `step ${i + 1} / ${messages.length}`;

        // Activate dot
        setDots(prev => prev.map((d, idx) => idx === i ? "active" : idx < i ? "done" : false));

        animateProgress(msg.pct);
        await typeText(msg.text);

        // Mark dot done
        setDots(prev => prev.map((d, idx) => idx <= i ? "done" : false));
      }

      // Finish state
      if (statusRef.current) statusRef.current.textContent = "ready.";
      charRef.current.textContent = "✨";
      glitch();

      await new Promise(r => setTimeout(r, 600));

      // Fade out typing + char, reveal video
      gsap.to([charRef.current, ".ls-text-area", ".ls-progress-area"], {
        opacity: 0, y: -12, duration: 0.5, stagger: 0.05,
      });

      if (videoRef.current) {
        gsap.to(videoRef.current, {
          opacity: 1, duration: 1.2, delay: 0.3,
          onStart: () => videoRef.current.play().catch(() => {}),
        });
      }

      await new Promise(r => setTimeout(r, 3200));

      gsap.to(containerRef.current, {
        opacity: 0, duration: 0.9,
        onComplete: onFinish,
      });
    });

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [onFinish]);

  /* ── render ────────────────────────────────────────── */

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-9999 bg-black flex items-center justify-center overflow-hidden"
      style={{ opacity: 0 }}
    >
      {/* Scanlines */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,100,0.012) 2px, rgba(0,255,100,0.012) 4px)",
          zIndex: 10,
        }}
      />

      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(0,255,100,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,100,0.04) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
          zIndex: 1,
        }}
      />

      {/* Vignette */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.9) 100%)",
          zIndex: 2,
        }}
      />

      {/* Floating code particles */}
      {["console.log('hello')", "npm install", "git init", "import React", "def main():", "SELECT *"].map((s, i) => (
        <div
          key={i}
          className="absolute font-mono pointer-events-none select-none"
          style={{
            left: `${5 + i * 16}%`,
            fontSize: "10px",
            color: "rgba(0,255,100,0.055)",
            whiteSpace: "nowrap",
            animation: `floatUp ${13 + i * 2}s ${i * 1.2}s linear infinite`,
            zIndex: 3,
          }}
        >
          {s}
        </div>
      ))}

      {/* Center content */}
      <div className="relative flex flex-col items-center text-center px-6 z-20">

        {/* Character with orbit ring */}
        <div className="relative w-28 h-28 flex items-center justify-center mb-7">
          {/* Spinning ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{
              border: "1px solid rgba(0,255,100,0.15)",
              width: "120%", height: "120%",
              top: "-10%", left: "-10%",
              animation: "spin 8s linear infinite",
            }}
          >
            <div
              className="absolute rounded-full"
              style={{
                width: 7, height: 7,
                background: "#00ff64",
                top: -3, left: "50%",
                transform: "translateX(-50%)",
                boxShadow: "0 0 8px #00ff64",
              }}
            />
          </div>

          {/* Inner ring */}
          <div
            className="absolute inset-0 rounded-full"
            style={{ border: "1.5px solid rgba(0,255,100,0.2)" }}
          />

          {/* Emoji character */}
          <span ref={charRef} className="text-5xl leading-none select-none">
            🤔
          </span>
        </div>

        {/* Typing area */}
        <div className="ls-text-area min-h-13 flex flex-col items-center gap-1">
          <h1
            ref={typingRef}
            className="font-mono text-green-400 text-sm sm:text-base md:text-xl leading-relaxed max-w-xs sm:max-w-sm"
            style={{ minHeight: "1.6em" }}
          >
            <span className="inline-block w-0.5 h-4 bg-green-400 align-middle animate-pulse ml-0.5" />
          </h1>
        </div>

        {/* Progress area */}
        <div className="ls-progress-area mt-8 w-56 sm:w-64">
          {/* Label row */}
          <div className="flex justify-between mb-2">
            <span className="font-mono text-[10px] tracking-widest uppercase" style={{ color: "rgba(0,255,100,0.35)" }}>
              Loading
            </span>
            <span ref={pctRef} className="font-mono text-[10px]" style={{ color: "rgba(0,255,100,0.45)" }}>
              0%
            </span>
          </div>

          {/* Track */}
          <div className="relative h-px w-full" style={{ background: "rgba(0,255,100,0.12)" }}>
            <div
              ref={fillRef}
              className="absolute top-0 left-0 h-full"
              style={{
                width: "0%",
                background: "linear-gradient(90deg, rgba(0,255,100,0.5), #00ff64)",
                transition: "width 0.7s cubic-bezier(0.23,1,0.32,1)",
              }}
            >
              {/* Glow dot */}
              <div
                className="absolute right-0 top-1/2 -translate-y-1/2 rounded-full"
                style={{ width: 7, height: 7, background: "#00ff64", boxShadow: "0 0 8px #00ff64", right: -3.5 }}
              />
            </div>
          </div>

          {/* Step dots */}
          <div className="flex justify-center gap-2 mt-3">
            {dots.map((state, i) => (
              <div
                key={i}
                className="rounded-full transition-all duration-400"
                style={{
                  width: state === "active" ? 8 : 5,
                  height: state === "active" ? 8 : 5,
                  background:
                    state === "active" ? "#00ff64"
                    : state === "done"  ? "rgba(0,255,100,0.45)"
                    :                     "rgba(0,255,100,0.12)",
                  boxShadow: state === "active" ? "0 0 8px #00ff64" : "none",
                }}
              />
            ))}
          </div>

          {/* Status text */}
          <p
            ref={statusRef}
            className="font-mono text-center mt-3 tracking-widest"
            style={{ fontSize: 10, color: "rgba(0,255,100,0.3)" }}
          >
            initializing...
          </p>
        </div>
      </div>

      {/* Video (fades in at end) */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0, zIndex: 5 }}
        muted
        playsInline
      >
        <source src="/laptop-video.mp4" type="video/mp4" />
      </video>

      {/* Video overlay */}
      <div className="absolute inset-0 bg-black/45" style={{ zIndex: 6 }} />

      {/* CSS keyframes injected inline */}
      <style>{`
        @keyframes floatUp {
          from { transform: translateY(110vh); opacity: 0; }
          5%   { opacity: 1; }
          95%  { opacity: 1; }
          to   { transform: translateY(-80px); opacity: 0; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}