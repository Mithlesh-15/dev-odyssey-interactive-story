import { useState, useEffect, useRef } from "react";
import gsap from "gsap";

/* ─── path config ──────────────────────────────────────────── */
const PATHS = [
  {
    id: "web",
    emoji: "🌐",
    label: "Web Developer",
    tag: "HTML · CSS · JS",
    accent: "#00ff88",
    glow: "rgba(0,255,136,0.18)",
    border: "rgba(0,255,136,0.55)",
    bg: "rgba(0,255,136,0.06)",
    tw: {
      accent: "text-emerald-400",
      border: "border-emerald-500/50",
      bg: "bg-emerald-500/[0.06]",
      dot: "bg-emerald-400 shadow-[0_0_12px_#00ff88]",
      tag: "text-emerald-400/80",
      bar: "from-emerald-400",
      stepBorder: "border-emerald-500/40",
      stepBg: "bg-emerald-500/[0.07]",
      numBg: "bg-emerald-400 text-black",
      start: "text-emerald-400",
      cardGlow:
        "shadow-[0_0_40px_rgba(0,255,136,0.18),0_20px_60px_rgba(0,0,0,0.4)]",
    },
    journey: [
      {
        icon: "📄",
        step: "HTML Foundations",
        desc: "Structure the web, one tag at a time.",
      },
      {
        icon: "🎨",
        step: "CSS Mastery",
        desc: "Make it beautiful, make it responsive.",
      },
      {
        icon: "⚡",
        step: "JavaScript",
        desc: "Bring pages to life with interactivity.",
      },
      {
        icon: "⚛️",
        step: "React / Vue",
        desc: "Build modern, component-driven UIs.",
      },
      {
        icon: "🚀",
        step: "Ship to Production",
        desc: "Deploy, optimize, and iterate.",
      },
    ],
  },
  {
    id: "mobile",
    emoji: "📱",
    label: "Mobile Developer",
    tag: "iOS · Android · Cross-Platform",
    accent: "#38bdf8",
    glow: "rgba(56,189,248,0.18)",
    border: "rgba(56,189,248,0.55)",
    bg: "rgba(56,189,248,0.06)",
    tw: {
      accent: "text-sky-400",
      border: "border-sky-400/50",
      bg: "bg-sky-400/[0.06]",
      dot: "bg-sky-400 shadow-[0_0_12px_#38bdf8]",
      tag: "text-sky-400/80",
      bar: "from-sky-400",
      stepBorder: "border-sky-400/40",
      stepBg: "bg-sky-400/[0.07]",
      numBg: "bg-sky-400 text-black",
      start: "text-sky-400",
      cardGlow:
        "shadow-[0_0_40px_rgba(56,189,248,0.18),0_20px_60px_rgba(0,0,0,0.4)]",
    },
    journey: [
      {
        icon: "📐",
        step: "UI/UX for Mobile",
        desc: "Thumb-friendly, gesture-driven design.",
      },
      {
        icon: "⚛️",
        step: "React Native",
        desc: "One codebase, two platforms.",
      },
      { icon: "🍎", step: "Swift / SwiftUI", desc: "Native iOS elegance." },
      { icon: "🤖", step: "Kotlin / Jetpack", desc: "Native Android power." },
      {
        icon: "📦",
        step: "App Store Launch",
        desc: "Ship to millions of pockets.",
      },
    ],
  },
  {
    id: "ai",
    emoji: "🤖",
    label: "AI Developer",
    tag: "ML · LLMs · Neural Nets",
    accent: "#a78bfa",
    glow: "rgba(167,139,250,0.18)",
    border: "rgba(167,139,250,0.55)",
    bg: "rgba(167,139,250,0.06)",
    tw: {
      accent: "text-violet-400",
      border: "border-violet-400/50",
      bg: "bg-violet-400/[0.06]",
      dot: "bg-violet-400 shadow-[0_0_12px_#a78bfa]",
      tag: "text-violet-400/80",
      bar: "from-violet-400",
      stepBorder: "border-violet-400/40",
      stepBg: "bg-violet-400/[0.07]",
      numBg: "bg-violet-400 text-black",
      start: "text-violet-400",
      cardGlow:
        "shadow-[0_0_40px_rgba(167,139,250,0.18),0_20px_60px_rgba(0,0,0,0.4)]",
    },
    journey: [
      {
        icon: "🧮",
        step: "Python & Math",
        desc: "Numpy, Pandas, Linear Algebra.",
      },
      {
        icon: "🧠",
        step: "Machine Learning",
        desc: "Supervised, unsupervised, reinforced.",
      },
      {
        icon: "🔥",
        step: "Deep Learning",
        desc: "PyTorch, TensorFlow, neural nets.",
      },
      {
        icon: "💬",
        step: "LLMs & Prompt Eng.",
        desc: "Build with GPT, Claude, Gemini.",
      },
      {
        icon: "🌍",
        step: "Deploy AI Products",
        desc: "APIs, agents, real-world impact.",
      },
    ],
  },
];

/* ─── Particle ─────────────────────────────────────────────── */
function Particle({ accent }) {
  const big = Math.random() > 0.6;
  const left = `${Math.random() * 100}%`;
  const top = `${Math.random() * 100}%`;
  const op = Math.random() * 0.5 + 0.1;
  const dur = `${10 + Math.random() * 20}s`;
  const delay = `${Math.random() * 10}s`;

  return (
    <div
      className={`absolute rounded-full ${big ? "w-0.75 h-0.75" : "w-0.5 h-0.5"}`}
      style={{
        background: accent || "#ffffff",
        left,
        top,
        opacity: op,
        animation: `particleDrift ${dur} ${delay} ease-in-out infinite alternate`,
      }}
    />
  );
}

/* ─── PathCard ─────────────────────────────────────────────── */
function PathCard({ path, selected, anySelected, onClick }) {
  const cardRef = useRef();
  const glowRef = useRef();

  const isSelected = selected === path.id;
  const isFaded = anySelected && !isSelected;
  const { tw } = path;

  const handleMouseMove = (e) => {
    if (anySelected) return;
    const rect = cardRef.current.getBoundingClientRect();
    glowRef.current.style.background = `radial-gradient(200px circle at ${e.clientX - rect.left}px ${e.clientY - rect.top}px, ${path.glow}, transparent 70%)`;
  };

  const handleMouseLeave = () => {
    glowRef.current.style.background = "transparent";
  };

  return (
    <div
      ref={cardRef}
      onClick={() => onClick(path.id)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={[
        // base layout
        "relative cursor-pointer rounded-[20px] overflow-hidden",
        "flex-1 min-w-55 max-w-[320px]",
        // border + transition
        "border transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]",
        // selected state
        isSelected
          ? `${tw.border} ${tw.bg} scale-105 ${tw.cardGlow}`
          : "border-white/8 bg-white/2 hover:border-white/18 hover:scale-[1.02] hover:-translate-y-1",
        // faded state
        isFaded ? "opacity-25 blur-[1px] pointer-events-none" : "opacity-100",
      ].join(" ")}
      style={{ padding: "clamp(24px,4vw,36px) clamp(20px,3vw,28px)" }}
    >
      {/* mouse-follow glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 rounded-[20px] pointer-events-none transition-[background] duration-150"
      />

      {/* selected pulse dot */}
      {isSelected && (
        <div
          className={`absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full animate-pulse ${tw.dot}`}
        />
      )}

      <div className="relative z-10">
        {/* emoji */}
        <div
          className={`inline-block mb-4 select-none transition-all duration-400
            ${isSelected ? "scale-110" : "scale-100"}`}
          style={{
            fontSize: "clamp(40px,6vw,52px)",
            filter: isSelected
              ? `drop-shadow(0 0 16px ${path.accent})`
              : "none",
          }}
        >
          {path.emoji}
        </div>

        {/* label */}
        <h3
          className={`font-extrabold tracking-tight mb-2 transition-colors duration-400
            ${isSelected ? tw.accent : "text-[#e8e8f0]"}`}
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(18px,2.5vw,22px)",
          }}
        >
          {path.label}
        </h3>

        {/* tag */}
        <p
          className={`font-mono tracking-[0.08em] transition-colors duration-400
            ${isSelected ? tw.tag : "text-white/30"}`}
          style={{ fontSize: "clamp(10px,1.2vw,12px)" }}
        >
          {path.tag}
        </p>

        {/* bottom bar */}
        <div
          className={`mt-5 h-px rounded-full bg-linear-to-r to-transparent transition-all duration-500
            ${isSelected ? `${tw.bar} w-full` : "from-white/6 w-[40%]"}`}
        />
      </div>
    </div>
  );
}

/* ─── JourneySection ───────────────────────────────────────── */
function JourneySection({ path,onStart }) {
  const wrapRef = useRef();
  const itemRefs = useRef([]);

  useEffect(() => {
    if (!path || !wrapRef.current) return;
    itemRefs.current = itemRefs.current.slice(0, path.journey.length);
    gsap.fromTo(
      wrapRef.current,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
    );
    gsap.fromTo(
      itemRefs.current.filter(Boolean),
      { opacity: 0, x: -20 },
      {
        opacity: 1,
        x: 0,
        duration: 0.5,
        stagger: 0.1,
        delay: 0.3,
        ease: "power2.out",
      },
    );
  }, [path?.id]);

  if (!path) return null;
  const { tw } = path;

  return (
    <div ref={wrapRef} className="opacity-0">
      {/* header */}
      <div className="text-center mb-[clamp(28px,4vw,40px)]">
        <p
          className={`font-mono tracking-[0.3em] uppercase mb-3 ${tw.accent}`}
          style={{ fontSize: "clamp(10px,1.2vw,12px)" }}
        >
          Your Roadmap
        </p>
        <h2
          className="font-extrabold text-white tracking-tight"
          style={{
            fontFamily: "'Syne', sans-serif",
            fontSize: "clamp(26px,4vw,42px)",
          }}
        >
          The <span className={tw.accent}>{path.label}</span> Journey
        </h2>
      </div>

      {/* steps */}
      <div className="flex flex-col gap-3 max-w-160 mx-auto">
        {path.journey.map((item, i) => (
          <div
            key={i}
            ref={(el) => (itemRefs.current[i] = el)}
            className={[
              "flex items-center gap-4 rounded-2xl px-5 py-4",
              "border transition-all duration-300 cursor-default opacity-0",
              i === 0
                ? `${tw.stepBg} ${tw.stepBorder}`
                : "bg-white/3 border-white/6",
            ].join(" ")}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = path.border;
              e.currentTarget.style.background = path.bg;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor =
                i === 0 ? path.border : "rgba(255,255,255,0.06)";
              e.currentTarget.style.background =
                i === 0 ? path.bg : "rgba(255,255,255,0.03)";
            }}
          >
            {/* step number */}
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center
                shrink-0 font-mono text-[11px] font-bold
                ${i === 0 ? tw.numBg : "bg-white/6 text-white/30"}`}
            >
              {String(i + 1).padStart(2, "0")}
            </div>

            {/* icon */}
            <span className="text-xl shrink-0">{item.icon}</span>

            {/* text */}
            <div className="flex-1 min-w-0">
              <p
                className="font-bold text-[#e8e8f0] mb-0.5 truncate"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(13px,1.6vw,15px)",
                }}
              >
                {item.step}
              </p>
              <p
                className="font-mono text-white/35 truncate"
                style={{ fontSize: "clamp(10px,1.2vw,12px)" }}
              >
                {item.desc}
              </p>
            </div>

            {/* start badge */}
            {i === 0 && (
              <span
                className={`ml-auto font-mono text-[10px] tracking-[0.15em] shrink-0 ${tw.start}`}
              >
                START →
              </span>
            )}
          </div>
        ))}
        {/* Start button */}
        <div className="flex justify-center mt-10">
          <button
            onClick={()=>{onStart()
              
            }}
            className={`group relative px-10 py-4 rounded-full font-mono text-[13px]
            font-bold tracking-[0.15em] uppercase text-black cursor-pointer
            transition-all duration-300 ease-out
            hover:scale-105 hover:-translate-y-1 active:scale-95
            ${tw.dot.split(" ")[0]}`}
            style={{
              boxShadow: `0 0 30px ${path.accent}44, 0 10px 40px rgba(0,0,0,0.5)`,
            }}
          >
            <span className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
              <span className="absolute top-0 left-[-75%] w-1/2 h-full bg-white/30 skew-x-[-20deg] group-hover:left-[150%] transition-all duration-700 ease-in-out" />
            </span>
            <span className="relative z-10">Begin {path.label} Journey →</span>
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── HeroSection (main) ───────────────────────────────────── */
export default function HeroSection({onStart}) {
  const [selected, setSelected] = useState(null);
  const [showJourney, setShowJourney] = useState(false);
  const [bgAccent, setBgAccent] = useState(null);

  const headingRef = useRef();
  const subRef = useRef();
  const cardsRef = useRef();
  const confirmRef = useRef();
  const journeyRef = useRef();
  const bgRef = useRef();

  const selectedPath = PATHS.find((p) => p.id === selected);

  /* entrance */
  useEffect(() => {
    gsap
      .timeline({ delay: 0.2 })
      .fromTo(
        headingRef.current,
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
      )
      .fromTo(
        subRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" },
        "-=0.5",
      )
      .fromTo(
        [...cardsRef.current.children],
        { opacity: 0, y: 30, scale: 0.96 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.12,
          ease: "back.out(1.3)",
        },
        "-=0.3",
      );
  }, []);

  /* select handler */
  const handleSelect = (id) => {
    if (selected === id) {
      setSelected(null);
      setShowJourney(false);
      setBgAccent(null);
      gsap.to(confirmRef.current, { opacity: 0, y: -10, duration: 0.3 });
      return;
    }

    setSelected(id);
    const selectedPath = PATHS.find((p) => p.id === id);
    setBgAccent(selectedPath.accent);

    // confirm animation
    gsap.fromTo(
      confirmRef.current,
      { opacity: 0, y: 10, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        delay: 0.3,
        ease: "back.out(1.4)",
      },
    );

    // background glow
    gsap.fromTo(
      bgRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.8, ease: "power2.out" },
    );

    // 🔥 sirf ye rakho
    setTimeout(() => {
      setShowJourney(true);
    }, 600);
  };

  useEffect(() => {
    if (showJourney && journeyRef.current) {
      setTimeout(() => {
        journeyRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100); // thoda delay = smoother feel
    }
  }, [showJourney]);
  return (
    <>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=JetBrains+Mono:wght@300;400;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes particleDrift {
          from { transform: translate(0, 0); }
          to   { transform: translate(20px, -25px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1);   opacity: 1; }
          50%       { transform: scale(1.4); opacity: 0.7; }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(100vh); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* ── HERO ── */}
      <section
        className="relative min-h-screen bg-[#07070d] flex flex-col items-center
          justify-center overflow-hidden
          px-4 sm:px-8 md:px-[clamp(16px,5vw,60px)]
          py-[clamp(60px,10vh,100px)]"
      >
        {/* accent bg blob */}
        <div
          ref={bgRef}
          className="absolute inset-0 pointer-events-none z-0 transition-[background] duration-1000 ease-out"
          style={{
            background: bgAccent
              ? `radial-gradient(ellipse 70% 50% at 50% 50%, ${bgAccent}08, transparent 70%)`
              : "transparent",
          }}
        />

        {/* grid */}
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)",
            backgroundSize: "55px 55px",
          }}
        />

        {/* scanline */}
        <div
          className="absolute top-0 left-0 right-0 h-0.5 pointer-events-none z-1"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)",
            animation: "scanline 8s linear infinite",
          }}
        />

        {/* vignette */}
        <div
          className="absolute inset-0 pointer-events-none z-1"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.75) 100%)",
          }}
        />

        {/* particles */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {Array.from({ length: 40 }).map((_, i) => (
            <Particle key={i} accent={selectedPath?.accent} />
          ))}
        </div>

        {/* badge */}
        <p
          className="font-mono tracking-[0.3em] text-white/30 uppercase
            mb-[clamp(16px,2.5vw,24px)] relative z-10"
          style={{
            fontSize: "clamp(9px,1.2vw,11px)",
            animation: "fadeSlideUp 0.8s 0.1s both",
          }}
        >
          ⚡ Choose Your Path · Dev Odyssey
        </p>

        {/* heading */}
        <div ref={headingRef} className="opacity-0 relative z-10 text-center">
          <h1
            className="font-extrabold leading-[0.92] tracking-[-0.04em] text-white
              mb-[clamp(12px,2vw,20px)]"
            style={{
              fontFamily: "'Syne', sans-serif",
              fontSize: "clamp(38px,8vw,96px)",
            }}
          >
            Choose Your
            <br />
            <span
              style={{
                WebkitTextStroke: "1px rgba(255,255,255,0.25)",
                color: "transparent",
              }}
            >
              Developer
            </span>{" "}
            <span
              className="transition-colors duration-500"
              style={{ color: selectedPath?.accent || "#fff" }}
            >
              Path
            </span>
          </h1>
        </div>

        {/* subheading */}
        <p
          ref={subRef}
          className="opacity-0 font-mono text-white/35 text-center
            mb-[clamp(36px,5vw,56px)] max-w-120 leading-[1.8] relative z-10"
          style={{ fontSize: "clamp(12px,1.5vw,15px)" }}
        >
          Your journey starts here. Pick a path — and the story unfolds.
        </p>

        {/* cards */}
        <div
          ref={cardsRef}
          className="flex flex-wrap gap-[clamp(12px,2vw,20px)] justify-center
            w-full max-w-240 relative z-10"
        >
          {PATHS.map((path) => (
            <PathCard
              key={path.id}
              path={path}
              selected={selected}
              anySelected={!!selected}
              onClick={handleSelect}
            />
          ))}
        </div>

        {/* confirm */}
        <div
          ref={confirmRef}
          className="opacity-0 mt-[clamp(24px,4vw,40px)] text-center relative z-10 min-h-18"
        >
          {selectedPath && (
            <>
              <p
                className={`font-mono tracking-[0.2em] uppercase mb-2 ${selectedPath.tw.accent}`}
                style={{ fontSize: "clamp(10px,1.3vw,13px)" }}
              >
                ✓ Path Selected
              </p>
              <p
                className="font-extrabold text-white tracking-tight"
                style={{
                  fontFamily: "'Syne', sans-serif",
                  fontSize: "clamp(20px,3vw,30px)",
                }}
              >
                You chose{" "}
                <span className={selectedPath.tw.accent}>
                  {selectedPath.label}
                </span>
              </p>
              <p className="mt-4 font-mono text-[11px] text-white/25">
                ↓ Scroll to see your roadmap
              </p>
            </>
          )}
        </div>

        {/* idle hint */}
        {!selected && (
          <p
            className="absolute bottom-7 left-1/2 -translate-x-1/2 font-mono
            text-[10px] tracking-[0.25em] uppercase text-white/18 z-10"
          >
            click a path to begin
          </p>
        )}
      </section>

      {/* ── JOURNEY ── */}
      <div
        ref={journeyRef}
        className="bg-[#07070d] overflow-hidden transition-[padding] duration-500 ease-out"
        style={{
          borderTop: selectedPath
            ? `1px solid ${selectedPath.accent}22`
            : "none",
          padding: showJourney
            ? "clamp(48px,8vw,100px) clamp(16px,5vw,60px)"
            : "0",
          minHeight: showJourney ? "auto" : 0,
        }}
      >
        {showJourney && <JourneySection path={selectedPath} onStart={onStart} />}
      </div>
    </>
  );
}
