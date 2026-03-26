import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger);

/* ── soft floating orb ─────────────────────────── */
function Orb({ style }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        background:
          "radial-gradient(circle, rgba(0,255,136,0.08) 0%, transparent 70%)",
        ...style,
      }}
    />
  );
}

/* ── floating dot ──────────────────────────────── */
function Dot({ style }) {
  return (
    <div
      className="absolute rounded-full pointer-events-none"
      style={{
        background: "rgba(0,255,136,0.25)",
        ...style,
      }}
    />
  );
}

/* ── stat card ─────────────────────────────────── */
function StatCard({ value, label, delay }) {
  const ref = useRef();

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        delay,
        ease: "power2.out",
        scrollTrigger: { trigger: ref.current, start: "top 88%" },
      },
    );
  }, [delay]);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center gap-2 opacity-0"
      style={{
        padding: "clamp(18px,3vw,28px) clamp(20px,4vw,36px)",
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(0,255,136,0.1)",
        borderRadius: 20,
        backdropFilter: "blur(6px)",
        minWidth: "clamp(100px,20vw,140px)",
      }}
    >
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontWeight: 700,
          fontSize: "clamp(22px,4vw,36px)",
          color: "#00ff88",
          textShadow: "0 0 20px rgba(0,255,136,0.4)",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: "clamp(9px,1vw,11px)",
          color: "rgba(255,255,255,0.3)",
          letterSpacing: "0.22em",
          textTransform: "uppercase",
          textAlign: "center",
        }}
      >
        {label}
      </span>
    </div>
  );
}

/* ── achievement badge ─────────────────────────── */
function Badge({ emoji, text, delay }) {
  const ref = useRef();

  useEffect(() => {
    gsap.fromTo(
      ref.current,
      { opacity: 0, scale: 0.85, y: 10 },
      {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.55,
        delay,
        ease: "back.out(1.6)",
        scrollTrigger: { trigger: ref.current, start: "top 90%" },
      },
    );
  }, [delay]);

  return (
    <div
      ref={ref}
      className="opacity-0 flex items-center gap-2"
      style={{
        fontFamily: "'JetBrains Mono', monospace",
        fontSize: "clamp(10px,1.2vw,12px)",
        color: "rgba(0,255,136,0.8)",
        background: "rgba(0,255,136,0.07)",
        border: "1px solid rgba(0,255,136,0.18)",
        borderRadius: 100,
        padding: "7px 16px",
      }}
    >
      <span style={{ fontSize: "clamp(12px,1.5vw,15px)" }}>{emoji}</span>
      <span>{text}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN SECTION
══════════════════════════════════════════════ */
export default function ConclusionSection() {
  const sectionRef = useRef();
  const checkRef = useRef();
  const headingRef = useRef();
  const subRef = useRef();
  const quoteRef = useRef();
  const statsRef = useRef();
  const badgesRef = useRef();
  const btnRef = useRef();
  const orbRef = useRef();
  const dividerRef = useRef();

  const [dots] = useState(() =>
    Array.from({ length: 28 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      size: Math.random() > 0.65 ? 3 : 2,
      dur: `${12 + Math.random() * 20}s`,
      del: `${Math.random() * 12}s`,
      op: Math.random() * 0.25 + 0.06,
    })),
  );

  useEffect(() => {
    const ctx = gsap.context(() => {
      /* ── orb pulse ── */
      gsap.to(orbRef.current, {
        scale: 1.15,
        opacity: 0.7,
        duration: 4,
        yoyo: true,
        repeat: -1,
        ease: "sine.inOut",
      });

      /* ── main sequence ── */
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 60%",
        },
        defaults: { ease: "power3.out" },
      });

      tl.fromTo(
        checkRef.current,
        { opacity: 0, scale: 0.5, rotation: -15 },
        {
          opacity: 1,
          scale: 1,
          rotation: 0,
          duration: 0.9,
          ease: "back.out(1.8)",
        },
      )
        .fromTo(
          dividerRef.current,
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 1, duration: 0.7, ease: "power2.out" },
          "-=0.3",
        )
        .fromTo(
          headingRef.current,
          { opacity: 0, y: 44, filter: "blur(6px)" },
          { opacity: 1, y: 0, filter: "blur(0px)", duration: 1 },
          "-=0.2",
        )
        .fromTo(
          subRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.5",
        )
        .fromTo(
          quoteRef.current,
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.8 },
          "-=0.4",
        )
        .fromTo(
          statsRef.current,
          { opacity: 0, y: 24 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.3",
        )
        .fromTo(
          badgesRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.2",
        )
        .fromTo(
          btnRef.current,
          { opacity: 0, y: 16, scale: 0.94 },
          { opacity: 1, y: 0, scale: 1, duration: 0.65, ease: "back.out(1.5)" },
          "-=0.2",
        );
    }, sectionRef);

    return () => ctx.revert();
  }, []);
  gsap.registerPlugin(ScrollToPlugin);
  const handleRestart = () => {
    gsap.to(window, {
      scrollTo: { y: 0 },
      duration: 1.4,
      ease: "power3.inOut",
    });
  };

  const STATS = [
    { value: "∞", label: "Lines Written" },
    { value: "47", label: "Bugs Fixed" },
    { value: "5☕", label: "Coffees" },
    { value: "1", label: "You" },
  ];

  const BADGES = [
    { emoji: "🏆", text: "Journey Complete" },
    { emoji: "🧠", text: "Always Learning" },
    { emoji: "🚀", text: "Built Something Real" },
    { emoji: "💡", text: "Next Chapter Awaits" },
  ];

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800;900&family=JetBrains+Mono:wght@400;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes floatDot {
          0%   { transform: translateY(0px); }
          100% { transform: translateY(var(--dy, -18px)); }
        }
        @keyframes orbDrift {
          0%,100% { transform: translate(0,0) scale(1); }
          33%      { transform: translate(20px,-15px) scale(1.05); }
          66%      { transform: translate(-15px,10px) scale(0.97); }
        }
        @keyframes shimmerText {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes glowPulse {
          0%,100% { box-shadow: 0 0 20px rgba(0,255,136,0.15), 0 8px 32px rgba(0,0,0,0.4); }
          50%      { box-shadow: 0 0 40px rgba(0,255,136,0.35), 0 8px 32px rgba(0,0,0,0.4); }
        }
        @keyframes checkPop {
          0%   { transform: scale(0) rotate(-20deg); opacity: 0; }
          60%  { transform: scale(1.15) rotate(4deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes borderFlow {
          0%,100% { border-color: rgba(0,255,136,0.18); }
          50%      { border-color: rgba(0,255,136,0.45); }
        }
        .btn-restart {
          transition: transform 0.3s cubic-bezier(0.23,1,0.32,1),
                      box-shadow 0.3s ease,
                      background 0.3s ease;
        }
        .btn-restart:hover {
          transform: translateY(-3px) scale(1.03);
          box-shadow: 0 0 50px rgba(0,255,136,0.45), 0 16px 48px rgba(0,0,0,0.5);
        }
        .btn-restart:active {
          transform: scale(0.97);
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: "#070d0a",
          padding: "clamp(64px,12vh,100px) clamp(16px,5vw,60px)",
        }}
      >
        {/* ── background orbs ── */}
        <div
          ref={orbRef}
          className="absolute pointer-events-none"
          style={{
            width: "clamp(400px,70vw,800px)",
            height: "clamp(400px,70vw,800px)",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(0,255,136,0.055) 0%, rgba(0,255,136,0.01) 50%, transparent 70%)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%,-50%)",
            animation: "orbDrift 18s ease-in-out infinite",
          }}
        />

        <Orb
          style={{
            width: "clamp(200px,40vw,440px)",
            height: "clamp(200px,40vw,440px)",
            top: "-8%",
            right: "-10%",
            opacity: 0.5,
            animation: "orbDrift 22s 3s ease-in-out infinite reverse",
          }}
        />
        <Orb
          style={{
            width: "clamp(160px,30vw,320px)",
            height: "clamp(160px,30vw,320px)",
            bottom: "-6%",
            left: "-8%",
            opacity: 0.4,
            animation: "orbDrift 26s 6s ease-in-out infinite",
          }}
        />

        {/* ── grid ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,255,136,0.018) 1px,transparent 1px),linear-gradient(90deg,rgba(0,255,136,0.018) 1px,transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* ── vignette ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center, transparent 25%, rgba(7,13,10,0.88) 100%)",
          }}
        />

        {/* ── floating dots ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {dots.map((d) => (
            <Dot
              key={d.id}
              style={{
                width: d.size,
                height: d.size,
                left: d.left,
                top: d.top,
                opacity: d.op,
                "--dy": `${-(10 + Math.random() * 22)}px`,
                animation: `floatDot ${d.dur} ${d.del} ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* ══ CONTENT ══ */}
        <div
          className="relative z-10 flex flex-col items-center text-center w-full"
          style={{
            maxWidth: "min(680px, 97vw)",
            gap: "clamp(20px,3.5vw,32px)",
            display: "flex",
          }}
        >
          {/* ── checkmark ── */}
          <div
            ref={checkRef}
            className="opacity-0 flex items-center justify-center"
            style={{
              width: "clamp(56px,10vw,80px)",
              height: "clamp(56px,10vw,80px)",
              borderRadius: "50%",
              background: "rgba(0,255,136,0.08)",
              border: "2px solid rgba(0,255,136,0.3)",
              boxShadow:
                "0 0 30px rgba(0,255,136,0.18), 0 0 60px rgba(0,255,136,0.08)",
              animation: "borderFlow 3s ease-in-out infinite",
            }}
          >
            <svg
              width="clamp(24px,4vw,36px)"
              height="clamp(24px,4vw,36px)"
              viewBox="0 0 36 36"
              fill="none"
            >
              <path
                d="M7 18L14.5 25.5L29 10"
                stroke="#00ff88"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ filter: "drop-shadow(0 0 8px rgba(0,255,136,0.8))" }}
              />
            </svg>
          </div>

          {/* ── divider ── */}
          <div
            ref={dividerRef}
            className="opacity-0"
            style={{
              width: "clamp(40px,8vw,64px)",
              height: 1,
              background:
                "linear-gradient(90deg,transparent,rgba(0,255,136,0.4),transparent)",
              transformOrigin: "center",
            }}
          />

          {/* ── main heading ── */}
          <div ref={headingRef} className="opacity-0">
            <h2
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 900,
                fontSize: "clamp(52px,12vw,110px)",
                lineHeight: 0.92,
                letterSpacing: "-0.05em",
                color: "#ffffff",
                marginBottom: "clamp(12px,2vw,20px)",
              }}
            >
              You Did It.
            </h2>

            <p
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: "clamp(18px,3.5vw,34px)",
                letterSpacing: "-0.02em",
                background: "linear-gradient(90deg,#00ff88,#38bdf8,#00ff88)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                color: "transparent",
                animation: "shimmerText 4s linear infinite",
                lineHeight: 1.2,
              }}
            >
              But this is just the beginning.
            </p>
          </div>

          {/* ── sub text ── */}
          <p
            ref={subRef}
            className="opacity-0"
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: "clamp(12px,1.5vw,15px)",
              color: "rgba(255,255,255,0.38)",
              lineHeight: 1.9,
              maxWidth: 520,
            }}
          >
            Every bug you fixed, every line you wrote, every deadline you
            survived —{" "}
            <span style={{ color: "rgba(0,255,136,0.7)" }}>
              made you better.
            </span>
          </p>

          {/* ── quote ── */}
          <div
            ref={quoteRef}
            className="opacity-0 w-full"
            style={{
              background: "rgba(0,255,136,0.04)",
              border: "1px solid rgba(0,255,136,0.12)",
              borderRadius: 16,
              padding: "clamp(16px,3vw,28px) clamp(20px,4vw,36px)",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* quote accent */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: 3,
                height: "100%",
                background: "linear-gradient(to bottom,#00ff88,#38bdf8)",
                borderRadius: "16px 0 0 16px",
              }}
            />

            <p
              style={{
                fontFamily: "'Syne',sans-serif",
                fontWeight: 700,
                fontSize: "clamp(14px,2vw,20px)",
                color: "rgba(255,255,255,0.75)",
                lineHeight: 1.6,
                letterSpacing: "-0.01em",
                paddingLeft: "clamp(8px,1.5vw,16px)",
              }}
            >
              "The journey of a developer never truly ends. Every project is a
              new lesson, every bug is a new teacher."
            </p>

            <p
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: "clamp(9px,1.1vw,11px)",
                color: "rgba(0,255,136,0.45)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
                marginTop: 14,
                paddingLeft: "clamp(8px,1.5vw,16px)",
              }}
            >
              — Every Developer, Ever
            </p>
          </div>

          {/* ── stats ── */}
          <div ref={statsRef} className="opacity-0 w-full">
            <p
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: "clamp(9px,1.1vw,11px)",
                color: "rgba(255,255,255,0.18)",
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                marginBottom: "clamp(12px,2vw,18px)",
              }}
            >
              Your Journey in Numbers
            </p>
            <div
              style={{
                display: "flex",
                gap: "clamp(8px,1.5vw,14px)",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {STATS.map((s, i) => (
                <StatCard
                  key={i}
                  value={s.value}
                  label={s.label}
                  delay={0.1 * i}
                />
              ))}
            </div>
          </div>

          {/* ── badges ── */}
          <div
            ref={badgesRef}
            className="opacity-0"
            style={{
              display: "flex",
              gap: "clamp(6px,1.2vw,10px)",
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            {BADGES.map((b, i) => (
              <Badge key={i} emoji={b.emoji} text={b.text} delay={0.08 * i} />
            ))}
          </div>

          {/* ── divider line ── */}
          <div
            style={{
              width: "100%",
              height: 1,
              background:
                "linear-gradient(90deg,transparent,rgba(0,255,136,0.15),transparent)",
            }}
          />

          {/* ── CTA button ── */}
          <div
            ref={btnRef}
            className="opacity-0 flex flex-col items-center gap-4"
          >
            <button
              onClick={handleRestart}
              className="btn-restart"
              style={{
                background: "transparent",
                border: "1.5px solid rgba(0,255,136,0.45)",
                borderRadius: 100,
                padding: "clamp(12px,1.8vw,16px) clamp(28px,5vw,52px)",
                cursor: "pointer",
                color: "#00ff88",
                fontFamily: "'JetBrains Mono',monospace",
                fontWeight: 700,
                fontSize: "clamp(12px,1.4vw,14px)",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                boxShadow:
                  "0 0 20px rgba(0,255,136,0.15), 0 8px 32px rgba(0,0,0,0.4)",
                animation: "glowPulse 3s ease-in-out infinite",
              }}
            >
              ↑ Restart the Journey
            </button>

            <p
              style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: "clamp(9px,1.1vw,11px)",
                color: "rgba(255,255,255,0.18)",
                letterSpacing: "0.22em",
                textTransform: "uppercase",
              }}
            >
              or keep building something new
            </p>
          </div>

          {/* ── final footer line ── */}
          <p
            style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: "clamp(9px,1vw,11px)",
              color: "rgba(255,255,255,0.1)",
              letterSpacing: "0.25em",
              marginTop: "clamp(8px,1.5vw,12px)",
            }}
          >
            made with ❤️ &amp; ☕ — Dev Odyssey
          </p>
        </div>
      </section>
    </>
  );
}
