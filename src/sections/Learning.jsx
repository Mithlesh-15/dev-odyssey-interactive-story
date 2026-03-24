import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─── code lines config ────────────────────────────────────── */
const CODE_LINES = [
  { tokens: [{ t: "comment", v: "// My first line of code 🚀" }] },
  { tokens: [] },
  {
    tokens: [
      { t: "keyword", v: "function" },
      { t: "plain",   v: " " },
      { t: "fn",      v: "greetWorld" },
      { t: "plain",   v: "() {" },
    ],
  },
  {
    tokens: [
      { t: "plain",   v: "  " },
      { t: "keyword", v: "const" },
      { t: "plain",   v: " " },
      { t: "var",     v: "message" },
      { t: "plain",   v: " = " },
      { t: "string",  v: '"Hello, World!"', tooltip: true },
    ],
  },
  {
    tokens: [
      { t: "plain",   v: "  " },
      { t: "fn",      v: "console" },
      { t: "plain",   v: "." },
      { t: "fn",      v: "log" },
      { t: "plain",   v: "(" },
      { t: "var",     v: "message" },
      { t: "plain",   v: ");" },
    ],
  },
  { tokens: [{ t: "plain", v: "}" }] },
  { tokens: [] },
  {
    tokens: [
      { t: "comment", v: "// Call the function" },
    ],
  },
  {
    tokens: [
      { t: "fn",    v: "greetWorld" },
      { t: "plain", v: "();" },
    ],
  },
  { tokens: [] },
  {
    tokens: [
      { t: "comment", v: "// Output: Hello, World! ✨" },
    ],
  },
];

/* token → tailwind color */
const TOKEN_CLASS = {
  keyword: "text-violet-400 font-bold",
  fn:      "text-sky-300",
  var:     "text-emerald-300",
  string:  "text-amber-300",
  comment: "text-white/30 italic",
  plain:   "text-white/80",
};

/* ─── FloatingSymbol ───────────────────────────────────────── */
function FloatingSymbol({ symbol, style }) {
  return (
    <span
      className="absolute font-mono text-emerald-400/[0.07] select-none pointer-events-none"
      style={style}
    >
      {symbol}
    </span>
  );
}

/* ─── CodeLine ─────────────────────────────────────────────── */
function CodeLine({ line, lineNum, visible, onTooltip }) {
  return (
    <div className="flex gap-0 group">
      {/* line number */}
      <span className="select-none w-10 shrink-0 text-right pr-4 font-mono text-[13px] text-white/15 leading-7">
        {lineNum}
      </span>

      {/* tokens */}
      <span className="font-mono text-[13px] sm:text-[14px] leading-7 flex flex-wrap">
        {line.tokens.map((tok, ti) =>
          tok.tooltip ? (
            <span
              key={ti}
              className={`relative cursor-pointer ${TOKEN_CLASS[tok.t]} hover:brightness-150 transition-all duration-200`}
              onMouseEnter={() => onTooltip(true, tok.v)}
              onMouseLeave={() => onTooltip(false, "")}
            >
              {tok.v}
              {/* underline hint */}
              <span className="absolute bottom-0 left-0 right-0 h-px bg-amber-300/40" />
            </span>
          ) : (
            <span key={ti} className={TOKEN_CLASS[tok.t]}>
              {tok.v}
            </span>
          )
        )}

        {/* blinking cursor on last visible line */}
        {visible === "typing" && (
          <span className="inline-block w-[2px] h-[1.1em] bg-emerald-400 ml-0.5 align-middle animate-[blink_1s_infinite]" />
        )}
      </span>
    </div>
  );
}

/* ─── LearningSection ──────────────────────────────────────── */
export default function LearningSection() {
  const sectionRef   = useRef();
  const editorRef    = useRef();
  const headerRef    = useRef();
  const outputRef    = useRef();
  const flashRef     = useRef();
  const particlesRef = useRef();

  const [visibleLines,  setVisibleLines]  = useState(0);
  const [tooltip,       setTooltip]       = useState({ show: false, text: "" });
  const [outputVisible, setOutputVisible] = useState(false);
  const [flashActive,   setFlashActive]   = useState(false);
  const [executed,      setExecuted]      = useState(false);
  const [achievement,   setAchievement]   = useState(false);

  const symbols = ["{}", "=>", "//", "();", "const", "let", "fn", "</>", "&&", "||", "===", "++"];

  /* ── entrance + scroll trigger ── */
  useEffect(() => {
    const ctx = gsap.context(() => {

      // Header fade-in
      gsap.fromTo(headerRef.current,
        { opacity: 0, y: 40 },
        {
          opacity: 1, y: 0, duration: 0.9, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
          },
        }
      );

      // Editor slide-in
      gsap.fromTo(editorRef.current,
        { opacity: 0, y: 60, scale: 0.97 },
        {
          opacity: 1, y: 0, scale: 1, duration: 1, ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 65%",
          },
        }
      );

      // Scroll-triggered line reveal
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 40%",
        end: "bottom 60%",
        scrub: false,
        onEnter: () => revealLines(),
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  /* ── sequential line reveal ── */
  const revealLines = () => {
    CODE_LINES.forEach((_, i) => {
      setTimeout(() => {
        setVisibleLines(i + 1);
        // show output after last line
        if (i === CODE_LINES.length - 1) {
          setTimeout(() => {
            setOutputVisible(true);
            setAchievement(true);
            setTimeout(() => setAchievement(false), 3500);
          }, 600);
        }
      }, i * 320);
    });
  };

  /* ── click flash ── */
  const handleEditorClick = () => {
    if (flashActive) return;
    setFlashActive(true);
    setExecuted(true);
    setTimeout(() => setFlashActive(false), 500);
    setTimeout(() => setExecuted(false), 2000);

    // GSAP ripple on editor
    gsap.fromTo(editorRef.current,
      { boxShadow: "0 0 0px rgba(0,255,136,0)" },
      { boxShadow: "0 0 60px rgba(0,255,136,0.3), 0 0 120px rgba(0,255,136,0.1)", duration: 0.2,
        yoyo: true, repeat: 1 }
    );
  };

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
        @keyframes floatUp {
          from { transform: translateY(0px) rotate(0deg); opacity: 0.07; }
          to   { transform: translateY(-120px) rotate(15deg); opacity: 0; }
        }
        @keyframes popIn {
          0%   { transform: scale(0.5) translateY(8px); opacity: 0; }
          70%  { transform: scale(1.08) translateY(-2px); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes achievePop {
          0%   { transform: translateY(20px) scale(0.8); opacity: 0; }
          60%  { transform: translateY(-4px) scale(1.05); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes achieveOut {
          to { transform: translateY(-10px); opacity: 0; }
        }
        .glow-line {
          text-shadow: 0 0 12px rgba(0,255,136,0.4);
        }
        .editor-scanline {
          background: repeating-linear-gradient(
            0deg, transparent, transparent 28px,
            rgba(255,255,255,0.012) 28px, rgba(255,255,255,0.012) 29px
          );
        }
      `}</style>

      <section
        ref={sectionRef}
        id="next-section"
        className="relative min-h-screen bg-[#070b0f] flex flex-col items-center
          justify-center overflow-hidden px-4 sm:px-8 py-20 md:py-28"
        onClick={handleEditorClick}
      >

        {/* ── background grid ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(0,255,136,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,136,0.025) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* ── vignette ── */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.85) 100%)" }}
        />

        {/* ── floating code symbols ── */}
        <div ref={particlesRef} className="absolute inset-0 pointer-events-none overflow-hidden">
          {symbols.map((s, i) => (
            <FloatingSymbol
              key={i}
              symbol={s}
              style={{
                left: `${5 + (i * 8.3) % 90}%`,
                top:  `${10 + (i * 11) % 80}%`,
                fontSize: `${12 + (i % 3) * 6}px`,
                animation: `floatUp ${8 + i * 1.5}s ${i * 0.8}s ease-in-out infinite alternate`,
              }}
            />
          ))}
        </div>

        {/* ── click flash overlay ── */}
        <div
          ref={flashRef}
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: "radial-gradient(ellipse at center, rgba(0,255,136,0.08), transparent 70%)",
            opacity: flashActive ? 1 : 0,
          }}
        />

        {/* ── achievement toast ── */}
        {achievement && (
          <div
            className="fixed top-6 right-6 z-50 flex items-center gap-3
              bg-[#0d1f14] border border-emerald-500/40 rounded-2xl px-5 py-3.5
              shadow-[0_0_30px_rgba(0,255,136,0.15)]"
            style={{ animation: "achievePop 0.5s ease forwards" }}
          >
            <span className="text-2xl">🏆</span>
            <div>
              <p className="font-mono text-[11px] tracking-widest text-emerald-400/60 uppercase">Achievement Unlocked</p>
              <p className="font-bold text-white text-sm" style={{ fontFamily: "'Syne', sans-serif" }}>
                Hello, World! Written ✨
              </p>
            </div>
          </div>
        )}

        {/* ── header ── */}
        <div ref={headerRef} className="opacity-0 text-center mb-10 md:mb-14 relative z-10">
          <p className="font-mono text-[10px] tracking-[0.35em] text-emerald-400/50 uppercase mb-3">
            Chapter One · The Beginning
          </p>
          <h2
            className="font-extrabold text-white leading-tight tracking-tight"
            style={{ fontFamily: "'Syne', sans-serif", fontSize: "clamp(32px,6vw,64px)" }}
          >
            Your First{" "}
            <span
              className="text-transparent"
              style={{
                background: "linear-gradient(90deg, #00ff88, #38bdf8, #00ff88)",
                backgroundSize: "200% auto",
                WebkitBackgroundClip: "text",
                animation: "shimmer 3s linear infinite",
              }}
            >
              Lines of Code
            </span>
          </h2>
          <p className="font-mono text-white/30 mt-4 max-w-md mx-auto leading-relaxed" style={{ fontSize: "clamp(12px,1.4vw,14px)" }}>
            Every legend started here. With a blank screen, a blinking cursor,<br className="hidden md:block" />
            and one question: <em className="text-emerald-400/70 not-italic">"What does this do?"</em>
          </p>
        </div>

        {/* ── editor wrapper ── */}
        <div
          ref={editorRef}
          className="opacity-0 relative z-10 w-full"
          style={{ maxWidth: "min(760px, 96vw)" }}
        >
          {/* executed badge */}
          {executed && (
            <div
              className="absolute -top-10 left-1/2 -translate-x-1/2 font-mono text-[11px]
                tracking-widest text-emerald-400 uppercase whitespace-nowrap
                bg-emerald-400/10 border border-emerald-400/30 rounded-full px-4 py-1.5"
              style={{ animation: "slideDown 0.3s ease forwards" }}
            >
              ⚡ Code Executed Successfully
            </div>
          )}

          {/* editor chrome */}
          <div
            className="rounded-2xl overflow-hidden border border-white/[0.07]"
            style={{ boxShadow: "0 40px 80px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.04)" }}
          >
            {/* title bar */}
            <div className="flex items-center justify-between bg-[#0f1318] px-4 py-3 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ff5f57] hover:brightness-125 transition-all" />
                <div className="w-3 h-3 rounded-full bg-[#febc2e] hover:brightness-125 transition-all" />
                <div className="w-3 h-3 rounded-full bg-[#28c840] hover:brightness-125 transition-all" />
              </div>

              {/* tabs */}
              <div className="flex items-center gap-1">
                <div className="flex items-center gap-2 bg-[#1a1f28] border border-white/[0.08] rounded-md px-3 py-1">
                  <span className="text-amber-300 text-[11px]">●</span>
                  <span className="font-mono text-[11px] text-white/60">index.js</span>
                </div>
              </div>

              <div className="font-mono text-[10px] text-white/20 tracking-widest">
                DEV ODYSSEY
              </div>
            </div>

            {/* editor body */}
            <div
              className="relative bg-[#0d1117] editor-scanline"
              style={{ minHeight: 340 }}
            >
              {/* inner glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "radial-gradient(ellipse 60% 40% at 50% 0%, rgba(0,255,136,0.04), transparent 70%)" }}
              />

              {/* tooltip */}
              {tooltip.show && (
                <div
                  className="absolute top-3 right-3 z-20 bg-[#1a2a1f] border border-emerald-500/40
                    rounded-xl px-4 py-2.5 font-mono text-[12px] text-emerald-300
                    shadow-[0_8px_32px_rgba(0,255,136,0.15)]"
                  style={{ animation: "popIn 0.3s ease forwards" }}
                >
                  <span className="text-white/40 block text-[10px] mb-0.5 tracking-widest uppercase">First Achievement 🎯</span>
                  My first <span className="text-amber-300">"Hello, World!"</span> 😄
                </div>
              )}

              {/* code lines */}
              <div className="px-4 py-5 select-none">
                {CODE_LINES.map((line, i) => (
                  <div
                    key={i}
                    className="transition-all duration-300"
                    style={{
                      opacity:   i < visibleLines ? 1 : 0,
                      transform: i < visibleLines ? "translateX(0)" : "translateX(-8px)",
                    }}
                  >
                    <CodeLine
                      line={line}
                      lineNum={i + 1}
                      visible={i === visibleLines - 1 && i < CODE_LINES.length - 1 ? "typing" : "done"}
                      onTooltip={(show, text) => setTooltip({ show, text })}
                    />
                  </div>
                ))}

                {/* final cursor when all lines done */}
                {visibleLines >= CODE_LINES.length && (
                  <div className="flex gap-0">
                    <span className="select-none w-10 shrink-0 text-right pr-4 font-mono text-[13px] text-white/15 leading-7">
                      {CODE_LINES.length + 1}
                    </span>
                    <span className="inline-block w-[2px] h-[1.1em] bg-emerald-400 align-middle mt-1 animate-[blink_1s_infinite]" />
                  </div>
                )}
              </div>

              {/* status bar */}
              <div className="flex items-center justify-between px-4 py-1.5 bg-[#0a0f13] border-t border-white/[0.04]">
                <div className="flex items-center gap-3">
                  <span
                    className="font-mono text-[10px] flex items-center gap-1.5"
                    style={{ color: visibleLines >= CODE_LINES.length ? "#00ff88" : "rgba(255,255,255,0.25)" }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-full"
                      style={{ background: visibleLines >= CODE_LINES.length ? "#00ff88" : "rgba(255,255,255,0.2)" }}
                    />
                    {visibleLines >= CODE_LINES.length ? "No errors" : "Typing..."}
                  </span>
                  <span className="font-mono text-[10px] text-white/20">JavaScript</span>
                </div>
                <span className="font-mono text-[10px] text-white/20">
                  Ln {Math.max(visibleLines, 1)}, Col 1
                </span>
              </div>
            </div>
          </div>

          {/* click hint */}
          {visibleLines >= CODE_LINES.length && !executed && (
            <p
              className="text-center font-mono text-[11px] text-white/20 mt-4 tracking-widest"
              style={{ animation: "slideDown 0.5s 0.3s ease both" }}
            >
              click anywhere to execute ▶
            </p>
          )}
        </div>

        {/* ── output panel ── */}
        {outputVisible && (
          <div
            className="relative z-10 w-full mt-5"
            style={{
              maxWidth: "min(760px, 96vw)",
              animation: "achievePop 0.6s ease forwards",
            }}
          >
            <div
              className="rounded-2xl border border-emerald-500/20 bg-[#0a1a10] overflow-hidden"
              style={{ boxShadow: "0 0 40px rgba(0,255,136,0.07)" }}
            >
              {/* output bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-emerald-500/10 bg-[#081410]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-[11px] tracking-widest text-emerald-400/60 uppercase">Terminal Output</span>
              </div>

              <div className="px-5 py-4 flex items-center gap-3">
                <span className="font-mono text-emerald-400/50 text-sm">❯</span>
                <span
                  className="font-mono text-emerald-300 glow-line"
                  style={{ fontSize: "clamp(14px,2vw,18px)" }}
                >
                  Hello, World! ✨
                </span>
                <span
                  className="ml-auto font-mono text-[10px] tracking-widest uppercase
                    text-emerald-400 bg-emerald-400/10 border border-emerald-400/20
                    rounded-full px-3 py-1"
                >
                  ✓ Success
                </span>
              </div>
            </div>

            {/* emotion line */}
            <p
              className="text-center font-mono text-white/25 text-[12px] mt-4 leading-relaxed"
              style={{ animation: "slideDown 0.6s 0.4s ease both", opacity: 0 }}
            >
              You just wrote your first working program. <span className="text-emerald-400/60">This is only the beginning.</span>
            </p>
          </div>
        )}

        {/* ── scroll indicator ── */}
        {visibleLines === 0 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
            <span className="font-mono text-[9px] tracking-[0.3em] text-white/15 uppercase">scroll to start</span>
            <div className="w-px h-10 bg-gradient-to-b from-emerald-400/30 to-transparent animate-pulse" />
          </div>
        )}
      </section>
    </>
  );
}