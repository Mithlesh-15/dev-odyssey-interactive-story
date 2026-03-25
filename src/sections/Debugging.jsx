import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════════════
   CODE LINES CONFIG
══════════════════════════════════════════════════════ */
const CODE_LINES = [
  { id: 1,  tokens: [{ t: "keyword", v: "function" }, { t: "fn", v: " fetchUserData" }, { t: "plain", v: "(userId) {" }], status: "normal" },
  { id: 2,  tokens: [{ t: "keyword", v: "  const" }, { t: "plain", v: " response = " }, { t: "keyword", v: "await" }, { t: "fn", v: " fetch" }, { t: "plain", v: "(" }], status: "normal" },
  { id: 3,  tokens: [{ t: "string", v: '    `/api/users/${userId}`' }], status: "normal" },
  { id: 4,  tokens: [{ t: "plain", v: "  );" }], status: "normal" },
  { id: 5,  tokens: [{ t: "keyword", v: "  const" }, { t: "plain", v: " data = " }, { t: "keyword", v: "await" }, { t: "plain", v: " response." }, { t: "fn", v: "json" }, { t: "plain", v: "();" }], status: "normal" },
  { id: 6,  tokens: [{ t: "keyword", v: "  return" }, { t: "plain", v: " data." }, { t: "var", v: "user" }, { t: "plain", v: "." }, { t: "var", v: "profiel" }], status: "error", errorMsg: "Spent 3 hours here 😭" },
  { id: 7,  tokens: [{ t: "plain", v: "}" }], status: "normal" },
  { id: 8,  tokens: [], status: "empty" },
  { id: 9,  tokens: [{ t: "comment", v: "// Call the function" }], status: "normal" },
  { id: 10, tokens: [{ t: "fn", v: "fetchUserData" }, { t: "plain", v: "(" }, { t: "number", v: "42" }, { t: "plain", v: ");" }], status: "normal" },
];

const FIXED_LINE = { id: 6, tokens: [{ t: "keyword", v: "  return" }, { t: "plain", v: " data." }, { t: "var", v: "user" }, { t: "plain", v: "." }, { t: "var", v: "profile" }], status: "fixed" };

const TOKEN_COLORS = {
  keyword: "#c586c0", fn: "#dcdcaa", string: "#ce9178",
  var: "#9cdcfe", comment: "rgba(255,255,255,0.28)",
  number: "#b5cea8", plain: "rgba(255,255,255,0.8)",
};

const CONFUSION_MSGS = [
  { emoji: "😕", text: "Why is this not working?", delay: 0 },
  { emoji: "🤦", text: "It worked yesterday…", delay: 0.55 },
  { emoji: "🙏", text: "StackOverflow, save me…", delay: 1.1 },
  { emoji: "☕", text: "I need more coffee…", delay: 1.65 },
];

/* ══════════════════════════════════════════════════════
   PARTICLES BACKGROUND
══════════════════════════════════════════════════════ */
function Particles() {
  const canvasRef = useRef();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let raf;
    const W = canvas.width = canvas.offsetWidth;
    const H = canvas.height = canvas.offsetHeight;

    const dots = Array.from({ length: 55 }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.4 + 0.3,
      vx: (Math.random() - 0.5) * 0.22,
      vy: (Math.random() - 0.5) * 0.22,
      alpha: Math.random() * 0.25 + 0.05,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      dots.forEach(d => {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
        if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(220,40,40,${d.alpha})`;
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />
  );
}

/* ══════════════════════════════════════════════════════
   ERROR TOOLTIP
══════════════════════════════════════════════════════ */
function ErrorTooltip({ visible }) {
  return (
    <div className={`absolute left-full top-1/2 -translate-y-1/2 ml-3 z-30
      transition-all duration-300 pointer-events-none whitespace-nowrap
      ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`}>
      <div className="bg-[#1a0a0a] border border-red-500/40 rounded-xl px-3 py-2
        shadow-[0_0_20px_rgba(220,38,38,0.25)]">
        <p className="font-mono text-[11px] text-red-300 leading-none">Spent 3 hours here 😭</p>
        <div className="absolute right-full top-1/2 -translate-y-1/2 mr-0
          border-8 border-transparent border-r-red-500/40" style={{ borderRightColor: "rgba(153,27,27,0.4)" }} />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   CODE LINE
══════════════════════════════════════════════════════ */
function CodeLine({ line, visible, isError, isFixed, glitching }) {
  const [hovered, setHovered] = useState(false);

  const getBg = () => {
    if (isFixed) return "bg-emerald-950/50 border-l-2 border-emerald-500";
    if (isError) return "bg-red-950/60 border-l-2 border-red-500";
    return "border-l-2 border-transparent";
  };

  return (
    <div
      className={`relative flex items-center group transition-all duration-300 rounded-r-sm
        ${getBg()}
        ${visible ? "opacity-100" : "opacity-0"}
        ${glitching && isError ? "animate-[glitchLine_0.15s_ease_infinite]" : ""}`}
      onMouseEnter={() => isError && setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Line number */}
      <span className={`font-mono text-[11px] w-10 text-right pr-4 shrink-0 select-none
        transition-colors duration-300
        ${isError ? "text-red-500/70" : isFixed ? "text-emerald-500/70" : "text-white/15"}`}>
        {line.id}
      </span>

      {/* Tokens */}
      <span className={`font-mono leading-7 flex flex-wrap items-center text-[12.5px] sm:text-[13px] flex-1 min-w-0`}
        style={{ filter: glitching && isError ? "blur(0.5px)" : "none" }}>
        {line.tokens.map((tok, i) => (
          <span
            key={i}
            style={{ color: TOKEN_COLORS[tok.t] }}
            className={`${tok.t === "comment" ? "italic" : ""} ${tok.t === "keyword" ? "font-semibold" : ""}`}
          >
            {tok.v}
          </span>
        ))}

        {/* Typo underline on error line */}
        {isError && (
          <span className="ml-1 relative">
            <span className="font-mono text-red-400/90 underline decoration-wavy decoration-red-400">
              {/* profiel already in token */}
            </span>
          </span>
        )}

        {/* Error squiggle indicator */}
        {isError && (
          <span className="ml-2 font-mono text-[10px] text-red-400/80 animate-[pulse_1.5s_infinite]">
            ← TypeError
          </span>
        )}

        {/* Fixed badge */}
        {isFixed && (
          <span className="ml-3 font-mono text-[10px] text-emerald-400 animate-[fadeIn_0.4s_ease]">
            ✓ fixed
          </span>
        )}
      </span>

      {/* Hover tooltip */}
      {isError && <ErrorTooltip visible={hovered} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   CONFUSION MESSAGE
══════════════════════════════════════════════════════ */
function ConfusionMsg({ emoji, text, visible, idx }) {
  return (
    <div className={`flex items-center gap-3 transition-all duration-500
      ${visible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"}`}
      style={{ transitionDelay: visible ? `${idx * 80}ms` : "0ms" }}>
      <span className="text-xl shrink-0">{emoji}</span>
      <p className="font-mono text-[12px] sm:text-[13px] text-red-200/75 leading-snug">{text}</p>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   TERMINAL / CONSOLE PANEL
══════════════════════════════════════════════════════ */
function ConsolePanel({ visible, errorVisible, fixedVisible }) {
  return (
    <div className={`rounded-xl overflow-hidden border border-white/5 transition-all duration-500
      ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3"}`}>
      <div className="flex items-center gap-2 bg-[#0f1318] px-3 py-2 border-b border-white/5">
        <div className="w-2.5 h-2.5 rounded-full bg-[#ff5f57]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#febc2e]" />
        <div className="w-2.5 h-2.5 rounded-full bg-[#28c840]" />
        <span className="font-mono text-[10px] text-white/20 ml-2 tracking-wider uppercase">Console</span>
      </div>
      <div className="bg-[#080d10] p-3 space-y-1.5 min-h-[90px]">
        {errorVisible && !fixedVisible && (
          <>
            <p className="font-mono text-[11px] text-red-400 animate-[slideDown_0.3s_ease]">
              ✕ TypeError: Cannot read properties of undefined (reading 'profiel')
            </p>
            <p className="font-mono text-[10px] text-red-400/50">
              &nbsp;&nbsp;&nbsp;&nbsp;at fetchUserData (app.js:6)
            </p>
            <p className="font-mono text-[10px] text-red-400/40">
              &nbsp;&nbsp;&nbsp;&nbsp;at &lt;anonymous&gt;:1:1
            </p>
          </>
        )}
        {fixedVisible && (
          <>
            <p className="font-mono text-[11px] text-emerald-400 animate-[slideDown_0.3s_ease]">
              ✓ Fetching user 42...
            </p>
            <p className="font-mono text-[11px] text-emerald-400/70 animate-[slideDown_0.3s_ease_0.15s_both]">
              ✓ Response: 200 OK
            </p>
            <p className="font-mono text-[11px] text-emerald-400 animate-[slideDown_0.3s_ease_0.3s_both]">
              ✓ profile: &#123; name: "Dev", role: "Engineer" &#125;
            </p>
          </>
        )}
        {!errorVisible && !fixedVisible && (
          <p className="font-mono text-[11px] text-white/15 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20 animate-[pulse_2s_infinite]" />
            Waiting for execution...
          </p>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════════════ */
export default function DebuggingSection() {
  const sectionRef   = useRef();
  const headerRef    = useRef();
  const editorRef    = useRef();
  const consoleRef   = useRef();
  const sideRef      = useRef();
  const bgFlashRef   = useRef();
  const titleRef     = useRef();
  const tlRef        = useRef();

  const [visibleLines,    setVisibleLines]    = useState(0);
  const [errorActive,     setErrorActive]     = useState(false);
  const [glitching,       setGlitching]       = useState(false);
  const [confusionVisible,setConfusionVisible]= useState(false);
  const [visibleMsgs,     setVisibleMsgs]     = useState(0);
  const [consoleVisible,  setConsoleVisible]  = useState(false);
  const [errorFixed,      setErrorFixed]      = useState(false);
  const [successVisible,  setSuccessVisible]  = useState(false);
  const [started,         setStarted]         = useState(false);
  const [phase,           setPhase]           = useState("idle");
  // Use a ref as guard so ScrollTrigger closure always sees the latest value
  const hasStartedRef = useRef(false);

  const runSequence = () => {
    if (hasStartedRef.current) return;
    hasStartedRef.current = true;
    setStarted(true);

    const tl = gsap.timeline();
    tlRef.current = tl;

    // Step 1 — Type code lines one by one
    tl.call(() => { setPhase("typing"); setConsoleVisible(true); }, [], 0.2);

    for (let i = 1; i <= CODE_LINES.length; i++) {
      tl.call(() => setVisibleLines(i), [], (i - 1) * 0.13 + 0.3);
    }

    const afterType = CODE_LINES.length * 0.13 + 0.3;

    // Step 2 — Error appears
    tl.call(() => {
      setErrorActive(true);
      setPhase("error");
    }, [], afterType + 0.4);

    // Step 3 — Glitch state on
    tl.call(() => {
      setGlitching(true);
      setPhase("glitch");
    }, [], afterType + 0.7);

    // Step 3 — Shake editor via staggered tweens (avoid gsap.utils.wrap misuse)
    const shakeStart = afterType + 0.7;
    [-4, 4, -3, 3, -2, 2, -1, 1, 0].forEach((xVal, i) => {
      tl.to(editorRef.current, { x: xVal, duration: 0.055, ease: "none" }, shakeStart + i * 0.055);
    });

    tl.call(() => setGlitching(false), [], shakeStart + 9 * 0.055 + 0.1);

    // Step 4 — Background red flash
    tl.to(bgFlashRef.current, { opacity: 0.18, duration: 0.12, ease: "power2.in" }, afterType + 0.75);
    tl.to(bgFlashRef.current, { opacity: 0,    duration: 0.6,  ease: "power2.out" }, afterType + 0.9);

    // Title red pulse
    tl.to(titleRef.current,   { color: "#ef4444", duration: 0.15 }, afterType + 0.75);
    tl.to(titleRef.current,   { color: "#ffffff", duration: 0.6  }, afterType + 0.95);

    // Step 5 — Confusion messages
    tl.call(() => { setConfusionVisible(true); setPhase("confusion"); }, [], afterType + 1.8);
    for (let m = 1; m <= CONFUSION_MSGS.length; m++) {
      tl.call(() => setVisibleMsgs(m), [], afterType + 1.8 + CONFUSION_MSGS[m - 1].delay);
    }

    // Step 7 — Auto fix
    tl.call(() => setPhase("fix"), [], afterType + 4.7);
    tl.call(() => { setErrorFixed(true); setErrorActive(false); }, [], afterType + 4.95);

    // Step 8 — Success
    tl.call(() => { setSuccessVisible(true); setPhase("success"); }, [], afterType + 5.7);

    // Celebration y-bounce
    const bounceStart = afterType + 5.7;
    [-3, 3, -2, 2, 0].forEach((yVal, i) => {
      tl.to(editorRef.current, { y: yVal, duration: 0.07, ease: "none" }, bounceStart + i * 0.07);
    });
  };

  useEffect(() => {
    // Set initial hidden state for entrance animations
    gsap.set(headerRef.current, { opacity: 0, y: 36 });
    gsap.set(editorRef.current, { opacity: 0, y: 50, scale: 0.97 });
    gsap.set(sideRef.current,   { opacity: 0, x: 24 });

    // Header entrance
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 75%",
      onEnter: () => gsap.to(headerRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }),
    });
    // Editor entrance
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 60%",
      onEnter: () => gsap.to(editorRef.current, { opacity: 1, y: 0, scale: 1, duration: 1.0, ease: "power3.out" }),
    });
    // Side panel entrance
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 58%",
      onEnter: () => gsap.to(sideRef.current, { opacity: 1, x: 0, duration: 0.9, ease: "power3.out" }),
    });
    // Main sequence trigger
    ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top 36%",
      onEnter: () => runSequence(),
    });

    return () => ScrollTrigger.getAll().forEach(t => t.kill());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Replay handler
  const handleReplay = () => {
    if (tlRef.current) tlRef.current.kill();
    gsap.set(editorRef.current, { x: 0, y: 0 });
    hasStartedRef.current = false;
    setVisibleLines(0); setErrorActive(false); setGlitching(false);
    setConfusionVisible(false); setVisibleMsgs(0); setConsoleVisible(false);
    setErrorFixed(false); setSuccessVisible(false); setStarted(false); setPhase("idle");
    setTimeout(() => runSequence(), 120);
  };

  const phaseLabel = {
    idle:      { text: "Ready",       color: "text-white/25" },
    typing:    { text: "Typing...",   color: "text-emerald-400" },
    error:     { text: "Error 🔴",    color: "text-red-400" },
    glitch:    { text: "Glitching",   color: "text-orange-400" },
    confusion: { text: "Frustrated",  color: "text-orange-300" },
    fix:       { text: "Fixing...",   color: "text-yellow-400" },
    success:   { text: "Fixed! 🎉",   color: "text-emerald-400" },
  }[phase] ?? { text: "Ready", color: "text-white/25" };

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@300;400;600;700&display=swap" rel="stylesheet" />
      <style>{`
        @keyframes blink     { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse     { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes fadeIn    { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideDown { from{opacity:0;transform:translateY(-6px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanline  { 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        @keyframes glitchLine { 0%{transform:translateX(0) skewX(0)} 25%{transform:translateX(-2px) skewX(-0.5deg)} 50%{transform:translateX(2px) skewX(0.5deg)} 75%{transform:translateX(-1px)} 100%{transform:translateX(0)} }
        @keyframes errorPulse { 0%,100%{box-shadow:0 0 0 rgba(220,38,38,0)} 50%{box-shadow:0 0 22px rgba(220,38,38,0.3)} }
        @keyframes successGlow { 0%{box-shadow:0 0 0 rgba(16,185,129,0)} 50%{box-shadow:0 0 28px rgba(16,185,129,0.25)} 100%{box-shadow:0 0 0 rgba(16,185,129,0)} }
        @keyframes shimmer   { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes confetti  { 0%{transform:translateY(0) rotate(0deg) scale(1);opacity:1} 100%{transform:translateY(-60px) rotate(360deg) scale(0.5);opacity:0} }
        @keyframes float     { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-6px)} }
        .editor-error-pulse { animation: errorPulse 1.8s ease-in-out infinite; }
        .editor-success-glow { animation: successGlow 2s ease-in-out 3; }
      `}</style>

      <section
        ref={sectionRef}
        className="relative min-h-screen bg-[#06080b] flex flex-col items-center
          justify-center overflow-hidden px-4 sm:px-6 md:px-10 py-16 sm:py-20"
      >
        {/* Particles */}
        <Particles />

        {/* Grid */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(220,38,38,0.025) 1px,transparent 1px),linear-gradient(90deg,rgba(220,38,38,0.025) 1px,transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />

        {/* Vignette */}
        <div className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center,transparent 30%,rgba(0,0,0,0.85) 100%)" }}
        />

        {/* Scanline effect */}
        {glitching && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
            <div className="w-full h-[2px] bg-red-500/20"
              style={{ animation: "scanline 0.5s linear infinite" }} />
          </div>
        )}

        {/* Red bg flash overlay */}
        <div ref={bgFlashRef} className="absolute inset-0 bg-red-600 pointer-events-none opacity-0 z-10" />

        {/* ── HEADER ── */}
        <div ref={headerRef} className="opacity-0 text-center mb-8 sm:mb-10 relative z-10 w-full max-w-3xl px-2">
          <p className="font-mono text-[10px] tracking-[0.35em] text-red-500/50 uppercase mb-3">
            Chapter Two · The Descent
          </p>
          <h2
            ref={titleRef}
            className="font-extrabold leading-tight tracking-tight text-white mb-3 transition-colors duration-300"
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: "clamp(26px,5vw,58px)",
            }}
          >
            When Everything{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg,#ef4444,#dc2626,#f97316,#ef4444)",
                backgroundSize: "300% auto",
                animation: "shimmer 3s linear infinite",
              }}
            >
              Breaks
            </span>
          </h2>
          <p className="font-mono text-white/28 leading-relaxed max-w-md mx-auto"
            style={{ fontSize: "clamp(11px,1.3vw,13px)" }}>
            One typo. That's all it takes.<br />
            <span className="text-white/45">The bug was there all along, waiting.</span>
          </p>

          {/* Phase indicator badges */}
          <div className="flex items-center justify-center gap-3 mt-5 flex-wrap">
            {[
              { label: "Typing", done: ["typing","error","glitch","confusion","fix","success"].includes(phase) },
              { label: "Error",  done: ["error","glitch","confusion","fix","success"].includes(phase), danger: true },
              { label: "Debug",  done: ["confusion","fix","success"].includes(phase) },
              { label: "Fixed!", done: ["success"].includes(phase), success: true },
            ].map((b, i) => (
              <div key={i} className={`flex items-center gap-1.5 px-3 py-1 rounded-full border font-mono text-[10px]
                tracking-wider uppercase transition-all duration-500
                ${b.done
                  ? b.danger ? "border-red-500/50 text-red-400 bg-red-950/40"
                  : b.success ? "border-emerald-500/50 text-emerald-400 bg-emerald-950/40"
                  : "border-white/25 text-white/60 bg-white/5"
                  : "border-white/8 text-white/20"}`}>
                {b.done && <span className="w-1.5 h-1.5 rounded-full bg-current animate-[pulse_1.5s_infinite]" />}
                {b.label}
              </div>
            ))}
          </div>
        </div>

        {/* ── MAIN LAYOUT ── */}
        <div className="relative z-10 w-full max-w-[1100px] flex flex-col lg:flex-row gap-4 sm:gap-5">

          {/* ── LEFT: VS CODE EDITOR ── */}
          <div ref={editorRef} className="opacity-0 flex-1 min-w-0">
            <div
              className={`rounded-2xl overflow-hidden border border-white/6
                shadow-[0_30px_80px_rgba(0,0,0,0.65)]
                transition-all duration-700
                ${errorActive && !errorFixed ? "editor-error-pulse" : ""}
                ${successVisible ? "editor-success-glow" : ""}`}
            >
              {/* Title bar */}
              <div className="flex items-center justify-between bg-[#0e1216] px-4 py-2.5 border-b border-white/5 flex-wrap gap-2">
                <div className="flex gap-1.5">
                  {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
                    <div key={i} className="w-3 h-3 rounded-full" style={{ background: c }} />
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px]">🟡</span>
                  <span className="font-mono text-[11px] text-white/45">app.js</span>
                  {errorActive && !errorFixed && (
                    <span className="w-2 h-2 rounded-full bg-red-500 animate-[pulse_1s_infinite]" />
                  )}
                  {errorFixed && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className={`font-mono text-[9px] tracking-widest uppercase transition-colors duration-500 ${phaseLabel.color}`}>
                    {phaseLabel.text}
                  </span>
                  <span className="font-mono text-[9px] text-white/15 tracking-widest">DEV ODYSSEY</span>
                </div>
              </div>

              {/* Code body */}
              <div className="bg-[#0b0f13] p-3 sm:p-4">
                <div className="space-y-0.5">
                  {CODE_LINES.map((line, idx) => {
                    const isVisible = idx < visibleLines;
                    const isErr = line.status === "error" && errorActive && !errorFixed;
                    const isFix = line.status === "error" && errorFixed;

                    return (
                      <CodeLine
                        key={line.id}
                        line={isFix ? FIXED_LINE : line}
                        visible={isVisible}
                        isError={isErr}
                        isFixed={isFix}
                        glitching={glitching}
                      />
                    );
                  })}

                  {/* Blinking cursor */}
                  {visibleLines > 0 && visibleLines < CODE_LINES.length && (
                    <div className="flex items-center">
                      <span className="font-mono text-[11px] text-white/10 w-10 text-right pr-4">
                        {visibleLines + 1}
                      </span>
                      <span className="inline-block w-[2px] h-[14px] bg-yellow-300/80 animate-[blink_0.9s_infinite]" />
                    </div>
                  )}
                </div>
              </div>

              {/* Status bar */}
              <div className={`flex items-center justify-between px-4 py-1.5 border-t border-white/5
                transition-colors duration-700
                ${errorActive && !errorFixed ? "bg-red-950/40" : successVisible ? "bg-emerald-950/30" : "bg-[#07090d]"}`}>
                <span className={`font-mono text-[9px] flex items-center gap-1.5 transition-colors duration-500
                  ${errorActive && !errorFixed ? "text-red-400" : successVisible ? "text-emerald-400" : "text-white/20"}`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"
                    style={{ animation: phase !== "idle" ? "pulse 1.5s infinite" : "none" }} />
                  {errorActive && !errorFixed ? "1 error, 0 warnings"
                    : successVisible ? "All good ✓"
                    : phase === "typing" ? "Compiling..."
                    : "Ready"}
                </span>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[9px] text-white/15">Ln 6, Col 24</span>
                  <span className="font-mono text-[9px] text-white/15">JavaScript</span>
                </div>
              </div>
            </div>

            {/* Console */}
            <div ref={consoleRef} className="mt-3">
              <ConsolePanel
                visible={consoleVisible}
                errorVisible={errorActive && !errorFixed}
                fixedVisible={successVisible}
              />
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div ref={sideRef} className="opacity-0 flex flex-col gap-4 lg:w-72 xl:w-80">

            {/* Confusion panel */}
            <div className={`rounded-2xl border transition-all duration-700 overflow-hidden
              ${confusionVisible
                ? "border-red-900/50 bg-[#0e0808]"
                : "border-white/5 bg-[#0a0d10]"}`}
              style={{ boxShadow: confusionVisible ? "0 0 40px rgba(127,0,0,0.18)" : "none" }}
            >
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/5">
                <span className="text-[13px]">
                  {successVisible ? "😌" : confusionVisible ? "😤" : "🧑‍💻"}
                </span>
                <span className="font-mono text-[10px] tracking-widest uppercase text-white/30">
                  {successVisible ? "Relief Mode" : confusionVisible ? "Frustration Log" : "Developer Status"}
                </span>
              </div>
              <div className="p-4 space-y-3 min-h-[120px]">
                {!confusionVisible && !successVisible && (
                  <p className="font-mono text-[11px] text-white/18 animate-[pulse_2s_infinite]">
                    Coding with confidence...
                  </p>
                )}
                {confusionVisible && !successVisible && CONFUSION_MSGS.map((m, i) => (
                  <ConfusionMsg key={i} {...m} visible={i < visibleMsgs} idx={i} />
                ))}
                {successVisible && (
                  <div className="space-y-2.5 animate-[fadeIn_0.5s_ease]">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">🎉</span>
                      <p className="font-mono text-[13px] text-emerald-400 font-semibold">Finally it works!</p>
                    </div>
                    <p className="font-mono text-[11px] text-white/35 leading-relaxed">
                      The bug: a typo.<br />
                      <span className="text-red-400/70">profiel</span>{" → "}
                      <span className="text-emerald-400/70">profile</span>
                    </p>
                    <p className="font-mono text-[10px] text-white/20 italic">
                      "It was a typo all along." 😅
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Click-to-fix hint */}
            {errorActive && !errorFixed && !successVisible && (
              <div
                className="rounded-2xl border border-red-900/40 bg-[#0e0808] p-4
                  animate-[fadeIn_0.5s_ease] cursor-pointer hover:border-red-600/60 transition-all duration-300
                  group"
                onClick={() => {
                  setErrorFixed(true);
                  setErrorActive(false);
                  setTimeout(() => {
                    setSuccessVisible(true);
                    setPhase("success");
                  }, 700);
                }}
              >
                <p className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-2">
                  Quick Fix Available
                </p>
                <p className="font-mono text-[12px] text-red-300/80 mb-1">
                  Line 6: Typo detected
                </p>
                <p className="font-mono text-[11px] text-white/40 leading-snug mb-3">
                  <span className="text-red-400">profiel</span> → <span className="text-emerald-400">profile</span>
                </p>
                <div className="flex items-center justify-center gap-2 bg-red-950/60 hover:bg-red-900/40
                  border border-red-800/40 rounded-xl py-2 transition-all duration-300
                  group-hover:border-red-500/50">
                  <span className="font-mono text-[11px] text-red-300">Click to Fix</span>
                  <span className="text-[14px]">🔧</span>
                </div>
              </div>
            )}

            {/* Error stats card */}
            <div className="rounded-2xl border border-white/5 bg-[#0a0d10] p-4 space-y-3">
              <p className="font-mono text-[9px] text-white/20 tracking-widest uppercase">Debug Stats</p>
              <div className="grid grid-cols-2 gap-2.5">
                {[
                  { label: "Errors",    value: errorFixed ? "0" : errorActive ? "1" : "0",   color: errorActive && !errorFixed ? "text-red-400" : "text-white/35" },
                  { label: "Fixes",     value: errorFixed ? "1" : "0",                         color: errorFixed ? "text-emerald-400" : "text-white/35" },
                  { label: "Lines",     value: `${visibleLines}/${CODE_LINES.length}`,         color: "text-white/40" },
                  { label: "Coffees ☕", value: confusionVisible ? "∞" : "0",                  color: confusionVisible ? "text-orange-400" : "text-white/35" },
                ].map((s, i) => (
                  <div key={i} className="bg-[#0d1117] rounded-xl px-3 py-2.5 border border-white/5">
                    <p className="font-mono text-[9px] text-white/20 uppercase tracking-wider mb-1">{s.label}</p>
                    <p className={`font-mono text-[16px] font-semibold transition-all duration-500 ${s.color}`}>{s.value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Replay button */}
            {successVisible && (
              <button
                onClick={handleReplay}
                className="rounded-2xl border border-emerald-800/40 bg-emerald-950/30 px-4 py-3
                  font-mono text-[12px] text-emerald-400 tracking-wider uppercase
                  hover:bg-emerald-900/30 hover:border-emerald-600/50
                  transition-all duration-300 animate-[fadeIn_0.6s_ease]
                  active:scale-95 cursor-pointer"
              >
                ↺ Relive the Chaos
              </button>
            )}
          </div>
        </div>

        {/* ── SUCCESS BANNER ── */}
        {successVisible && (
          <div className="relative z-10 w-full max-w-[1100px] mt-5 animate-[fadeIn_0.7s_ease]">
            <div className="rounded-2xl border border-emerald-700/30 bg-emerald-950/25 px-5 py-4
              flex flex-wrap items-center justify-between gap-4
              shadow-[0_0_50px_rgba(16,185,129,0.08)]">
              <div>
                <p className="font-mono text-[9px] text-emerald-500/50 tracking-widest uppercase mb-1">
                  Resolution
                </p>
                <p className="font-bold text-white leading-snug"
                  style={{ fontFamily: "'Syne',sans-serif", fontSize: "clamp(16px,2.5vw,22px)" }}>
                  The bug was a typo.{" "}
                  <span className="text-emerald-400">It always is.</span>
                </p>
                <p className="font-mono text-[11px] text-white/30 mt-1">
                  Total debugging time: 3 hours 22 minutes. One character off.
                </p>
              </div>
              <div className="flex items-center gap-2">
                {["🎉", "🚀", "✨"].map((e, i) => (
                  <span
                    key={i}
                    className="text-2xl"
                    style={{
                      animation: `float 2s ease-in-out ${i * 0.3}s infinite`,
                    }}
                  >
                    {e}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Scroll hint */}
        {!started && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
            <span className="font-mono text-[9px] tracking-[0.28em] text-red-500/25 uppercase">
              scroll to debug
            </span>
            <div className="w-px h-8 bg-gradient-to-b from-red-500/20 to-transparent" />
          </div>
        )}
      </section>
    </>
  );
}