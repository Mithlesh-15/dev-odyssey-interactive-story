import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* ══════════════════════════════════════════
   SOFT PARTICLES
══════════════════════════════════════════ */
function Particles({ count = 38 }) {
  const [pts] = useState(() =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: 1 + Math.random() * 2.5,
      dur: 6 + Math.random() * 14,
      delay: Math.random() * 12,
      tx: (Math.random() - 0.5) * 60,
      ty: -(20 + Math.random() * 80),
      opacity: 0.06 + Math.random() * 0.18,
    }))
  );
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {pts.map((p) => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.r * 2,
            height: p.r * 2,
            borderRadius: "50%",
            background: "radial-gradient(circle, #7dd3fc, #38bdf8)",
            opacity: p.opacity,
            animation: `floatUp ${p.dur}s ${p.delay}s ease-in-out infinite alternate`,
            "--tx": `${p.tx}px`,
            "--ty": `${p.ty}px`,
          }}
        />
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════
   ORBITING GLOW RINGS
══════════════════════════════════════════ */
function GlowRings() {
  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
      {[340, 520, 720].map((size, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            width: size,
            height: size,
            borderRadius: "50%",
            border: `1px solid rgba(56,189,248,${0.07 - i * 0.018})`,
            animation: `ringPulse ${5 + i * 2}s ${i * 1.2}s ease-in-out infinite`,
          }}
        />
      ))}
      {/* Central bloom */}
      <div
        style={{
          position: "absolute",
          width: 280,
          height: 280,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(56,189,248,0.07) 0%, rgba(14,165,233,0.03) 50%, transparent 70%)",
          animation: "bloomPulse 4s ease-in-out infinite",
        }}
      />
    </div>
  );
}

/* ══════════════════════════════════════════
   CHECKMARK SVG
══════════════════════════════════════════ */
function CheckMark({ visible }) {
  const circleRef = useRef();
  const checkRef = useRef();

  useEffect(() => {
    if (!visible) return;
    const circle = circleRef.current;
    const check = checkRef.current;
    const circleLen = circle.getTotalLength();
    const checkLen = check.getTotalLength();

    gsap.set(circle, {
      strokeDasharray: circleLen,
      strokeDashoffset: circleLen,
      opacity: 1,
    });
    gsap.set(check, {
      strokeDasharray: checkLen,
      strokeDashoffset: checkLen,
      opacity: 0,
    });

    const tl = gsap.timeline({ delay: 0.3 });
    tl.to(circle, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: "power2.inOut",
    }).to(
      check,
      { strokeDashoffset: 0, opacity: 1, duration: 0.7, ease: "power2.out" },
      "-=0.2"
    );
  }, [visible]);

  return (
    <svg
      width="72"
      height="72"
      viewBox="0 0 72 72"
      fill="none"
      style={{ filter: "drop-shadow(0 0 12px rgba(56,189,248,0.35))" }}
    >
      <circle
        ref={circleRef}
        cx="36"
        cy="36"
        r="30"
        stroke="rgba(56,189,248,0.6)"
        strokeWidth="1.5"
        opacity="0"
      />
      <path
        ref={checkRef}
        d="M22 36 L32 46 L50 26"
        stroke="#38bdf8"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0"
      />
    </svg>
  );
}

/* ══════════════════════════════════════════
   STAT COUNTER
══════════════════════════════════════════ */
function StatItem({ label, value, delay }) {
  const numRef = useRef();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShow(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  useEffect(() => {
    if (!show) return;
    gsap.from(numRef.current, {
      textContent: 0,
      duration: 1.6,
      ease: "power2.out",
      snap: { textContent: 1 },
      onUpdate() {
        numRef.current.textContent = Math.round(
          gsap.getProperty(numRef.current, "textContent")
        );
      },
    });
  }, [show]);

  return (
    <div
      style={{
        textAlign: "center",
        opacity: show ? 1 : 0,
        transform: show ? "translateY(0)" : "translateY(12px)",
        transition: "opacity 0.6s ease, transform 0.6s ease",
      }}
    >
      <div
        ref={numRef}
        style={{
          fontFamily: "'Bebas Neue', cursive",
          fontSize: "clamp(28px, 5vw, 48px)",
          color: "#38bdf8",
          lineHeight: 1,
          letterSpacing: "0.05em",
        }}
      >
        0
      </div>
      <div
        style={{
          fontFamily: "'DM Mono', monospace",
          fontSize: "10px",
          color: "rgba(148,163,184,0.6)",
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          marginTop: 6,
        }}
      >
        {label}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN COMPONENT
══════════════════════════════════════════ */
export default function ConclusionSection() {
  const sectionRef = useRef();
  const checkWrapRef = useRef();
  const headingRef = useRef();
  const sub1Ref = useRef();
  const quoteRef = useRef();
  const statsRef = useRef();
  const btnRef = useRef();
  const lineRef = useRef();
  const [checkVisible, setCheckVisible] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    // Inject fonts + keyframes
    const style = document.createElement("style");
    style.textContent = `
      @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=DM+Mono:wght@300;400&family=Bebas+Neue&display=swap');

      @keyframes floatUp {
        0%   { transform: translate(0, 0); }
        100% { transform: translate(var(--tx, 0px), var(--ty, -30px)); }
      }
      @keyframes ringPulse {
        0%, 100% { transform: scale(1); opacity: 0.6; }
        50%       { transform: scale(1.06); opacity: 1; }
      }
      @keyframes bloomPulse {
        0%, 100% { transform: scale(1); opacity: 0.7; }
        50%       { transform: scale(1.15); opacity: 1; }
      }
      @keyframes shimmer {
        0%   { background-position: -200% center; }
        100% { background-position: 200% center; }
      }
      @keyframes subtleBgShift {
        0%   { background-position: 0% 50%; }
        50%  { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
      }
      @keyframes btnGlow {
        0%, 100% { box-shadow: 0 0 0 0 rgba(56,189,248,0); }
        50%       { box-shadow: 0 0 24px 4px rgba(56,189,248,0.18); }
      }
      @keyframes lineGrow {
        from { width: 0; }
        to   { width: 80px; }
      }
      .btn-restart:hover {
        background: rgba(56,189,248,0.1) !important;
        border-color: rgba(56,189,248,0.6) !important;
        color: #7dd3fc !important;
        transform: translateY(-2px) !important;
      }
      .btn-restart:active {
        transform: translateY(0px) scale(0.97) !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !entered) {
          setEntered(true);
          runAnimation();
        }
      },
      { threshold: 0.25 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, [entered]);

  function runAnimation() {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Initial states
    gsap.set(
      [
        checkWrapRef.current,
        headingRef.current,
        sub1Ref.current,
        quoteRef.current,
        statsRef.current,
        btnRef.current,
      ],
      { opacity: 0, y: 30 }
    );
    gsap.set(lineRef.current, { opacity: 0, scaleX: 0, transformOrigin: "left" });

    tl.to(checkWrapRef.current, { opacity: 1, y: 0, duration: 0.9 })
      .call(() => setCheckVisible(true))
      .to(headingRef.current, { opacity: 1, y: 0, duration: 1 }, "-=0.3")
      .to(lineRef.current, { opacity: 1, scaleX: 1, duration: 0.6 }, "-=0.4")
      .to(sub1Ref.current, { opacity: 1, y: 0, duration: 0.8 }, "-=0.3")
      .to(quoteRef.current, { opacity: 1, y: 0, duration: 0.9 }, "-=0.2")
      .to(statsRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.1")
      .to(btnRef.current, { opacity: 1, y: 0, duration: 0.7 }, "-=0.2");
  }

  return (
    <section
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
        background: "#060a10",
        padding: "clamp(60px, 10vh, 100px) clamp(16px, 5vw, 60px)",
      }}
    >
      {/* Animated gradient bg */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(135deg, #060a10 0%, #071018 40%, #08121e 70%, #060a10 100%)",
          backgroundSize: "300% 300%",
          animation: "subtleBgShift 18s ease infinite",
          pointerEvents: "none",
        }}
      />

      {/* Grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(56,189,248,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.025) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      {/* Vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, transparent 20%, rgba(6,10,16,0.85) 100%)",
          pointerEvents: "none",
        }}
      />

      <GlowRings />
      <Particles count={36} />

      {/* ── CONTENT ── */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "clamp(18px, 3vw, 28px)",
          maxWidth: "min(720px, 96vw)",
          width: "100%",
          textAlign: "center",
        }}
      >
        {/* Checkmark */}
        <div ref={checkWrapRef} style={{ opacity: 0 }}>
          <CheckMark visible={checkVisible} />
        </div>

        {/* Main Heading */}
        <div ref={headingRef} style={{ opacity: 0 }}>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(52px, 11vw, 110px)",
              fontWeight: 900,
              lineHeight: 0.95,
              letterSpacing: "-0.03em",
              background:
                "linear-gradient(135deg, #f1f5f9 0%, #7dd3fc 45%, #38bdf8 65%, #e2e8f0 100%)",
              backgroundSize: "200% auto",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              animation: "shimmer 6s linear infinite",
              marginBottom: 4,
            }}
          >
            You Did It.
          </h1>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "clamp(13px, 2vw, 17px)",
              fontWeight: 300,
              letterSpacing: "0.18em",
              color: "rgba(148,163,184,0.75)",
              textTransform: "uppercase",
              marginTop: 10,
            }}
          >
            But this is just the beginning.
          </p>
        </div>

        {/* Decorative line */}
        <div
          ref={lineRef}
          style={{
            height: 1,
            width: 80,
            background:
              "linear-gradient(90deg, transparent, #38bdf8, transparent)",
            opacity: 0,
          }}
        />

        {/* Sub message */}
        <p
          ref={sub1Ref}
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(15px, 2.2vw, 20px)",
            fontWeight: 400,
            fontStyle: "italic",
            color: "rgba(203,213,225,0.65)",
            lineHeight: 1.75,
            maxWidth: 560,
            opacity: 0,
          }}
        >
          Every bug you fixed, every line you wrote —<br />
          made you better.
        </p>

        {/* Quote card */}
        <div
          ref={quoteRef}
          style={{
            position: "relative",
            background: "rgba(14,30,50,0.5)",
            border: "1px solid rgba(56,189,248,0.12)",
            borderRadius: 16,
            padding: "clamp(20px, 4vw, 32px) clamp(20px, 5vw, 40px)",
            backdropFilter: "blur(8px)",
            width: "100%",
            opacity: 0,
          }}
        >
          {/* Quote mark */}
          <span
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 80,
              lineHeight: 0.6,
              color: "rgba(56,189,248,0.12)",
              position: "absolute",
              top: 16,
              left: 20,
              userSelect: "none",
            }}
          >
            "
          </span>
          <p
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "clamp(14px, 2vw, 17px)",
              fontStyle: "italic",
              color: "rgba(203,213,225,0.7)",
              lineHeight: 1.85,
              position: "relative",
              zIndex: 1,
              paddingLeft: 12,
            }}
          >
            The journey of a developer never truly ends. Each ending is a door
            to a harder problem, a deeper understanding, a better version of
            yourself.
          </p>
          <div
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 11,
              color: "rgba(56,189,248,0.4)",
              letterSpacing: "0.2em",
              marginTop: 14,
              paddingLeft: 12,
            }}
          >
            — EVERY SENIOR DEVELOPER, EVER
          </div>
        </div>

        {/* Stats */}
        <div
          ref={statsRef}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "clamp(16px, 4vw, 40px)",
            width: "100%",
            maxWidth: 480,
            opacity: 0,
          }}
        >
          <StatItem value={1247} label="Lines Written" delay={1800} />
          <StatItem value={83} label="Bugs Crushed" delay={2000} />
          <StatItem value={5} label="Coffees Down" delay={2200} />
        </div>

        {/* CTA Button */}
        <div ref={btnRef} style={{ opacity: 0, marginTop: 8 }}>
          <button
            className="btn-restart"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: "clamp(11px, 1.4vw, 13px)",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "rgba(148,163,184,0.75)",
              background: "transparent",
              border: "1px solid rgba(56,189,248,0.2)",
              borderRadius: 100,
              padding: "14px 36px",
              cursor: "pointer",
              transition:
                "background .3s, border-color .3s, color .3s, transform .2s",
              animation: "btnGlow 4s ease-in-out infinite",
              outline: "none",
            }}
          >
            ↑ Restart the Journey
          </button>
          <p
            style={{
              fontFamily: "'DM Mono', monospace",
              fontSize: 10,
              color: "rgba(71,85,105,0.6)",
              letterSpacing: "0.15em",
              marginTop: 12,
            }}
          >
            chapter one complete. more ahead.
          </p>
        </div>
      </div>

      {/* Footer credit */}
      <div
        style={{
          position: "absolute",
          bottom: 24,
          fontFamily: "'DM Mono', monospace",
          fontSize: 9,
          color: "rgba(71,85,105,0.4)",
          letterSpacing: "0.3em",
          textTransform: "uppercase",
        }}
      >
        The Developer's Journey · fin.
      </div>
    </section>
  );
}