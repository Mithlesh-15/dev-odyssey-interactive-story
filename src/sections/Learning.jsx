import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ══════════════════════════════════════════════
   PHASE CONFIG
══════════════════════════════════════════════ */
const PHASES = [
  {
    id: "html",
    label: "HTML",
    color: "#e34c26",
    glow: "rgba(227,76,38,0.22)",
    tailwindColor: "text-orange-500",
    tailwindBorder: "border-orange-500/40",
    tailwindBg: "bg-orange-500/10",
    tailwindGlow: "shadow-orange-500/20",
    emotion: "Curiosity",
    emotionEmoji: "🤔",
    desc: "Structure. The skeleton of the web.",
    filename: "index.html",
    fileIcon: "🟠",
    lines: [
      [{ t: "tag", v: "<!DOCTYPE html>" }],
      [{ t: "tag", v: "<html>" }],
      [{ t: "tag", v: "  <head>" }],
      [
        { t: "tag", v: "    <title>" },
        { t: "string", v: "My First Page", tooltip: true },
        { t: "tag", v: "</title>" },
      ],
      [{ t: "tag", v: "  </head>" }],
      [{ t: "tag", v: "  <body>" }],
      [
        { t: "tag", v: "    <h1>" },
        { t: "plain", v: "Hello, World!" },
        { t: "tag", v: "</h1>" },
      ],
      [
        { t: "tag", v: "    <p>" },
        { t: "plain", v: "I am learning to code." },
        { t: "tag", v: "</p>" },
      ],
      [
        { t: "tag", v: "    <button id=" },
        { t: "string", v: '"myBtn"' },
        { t: "tag", v: ">Click Me</button>" },
      ],
      [{ t: "tag", v: "  </body>" }],
      [{ t: "tag", v: "</html>" }],
    ],
  },
  {
    id: "css",
    label: "CSS",
    color: "#264de4",
    glow: "rgba(38,77,228,0.22)",
    tailwindColor: "text-blue-500",
    tailwindBorder: "border-blue-500/40",
    tailwindBg: "bg-blue-500/10",
    tailwindGlow: "shadow-blue-500/20",
    emotion: "Creativity",
    emotionEmoji: "🎨",
    desc: "Style. Now it starts to look alive.",
    filename: "styles.css",
    fileIcon: "🔵",
    lines: [
      [
        { t: "selector", v: "body" },
        { t: "plain", v: " {" },
      ],
      [
        { t: "prop", v: "  background" },
        { t: "plain", v: ": " },
        { t: "value", v: "#0d1117" },
        { t: "plain", v: ";" },
      ],
      [
        { t: "prop", v: "  font-family" },
        { t: "plain", v: ": " },
        { t: "value", v: "'Segoe UI', sans-serif" },
        { t: "plain", v: ";" },
      ],
      [{ t: "plain", v: "}" }],
      [{ t: "plain", v: "" }],
      [
        { t: "selector", v: "h1" },
        { t: "plain", v: " {" },
      ],
      [
        { t: "prop", v: "  color" },
        { t: "plain", v: ": " },
        { t: "value", v: "#00ff88" },
        { t: "plain", v: ";" },
      ],
      [
        { t: "prop", v: "  font-size" },
        { t: "plain", v: ": " },
        { t: "value", v: "3rem" },
        { t: "plain", v: ";" },
      ],
      [
        { t: "prop", v: "  text-shadow" },
        { t: "plain", v: ": " },
        { t: "value", v: "0 0 20px #00ff88" },
        { t: "plain", v: ";" },
      ],
      [{ t: "plain", v: "}" }],
      [{ t: "plain", v: "" }],
      [
        { t: "selector", v: "button" },
        { t: "plain", v: " {" },
      ],
      [
        { t: "prop", v: "  background" },
        { t: "plain", v: ": " },
        { t: "value", v: "#00ff88" },
        { t: "plain", v: ";" },
      ],
      [
        { t: "prop", v: "  border-radius" },
        { t: "plain", v: ": " },
        { t: "value", v: "8px" },
        { t: "plain", v: ";" },
      ],
      [{ t: "plain", v: "}" }],
    ],
  },
  {
    id: "js",
    label: "JavaScript",
    color: "#f7df1e",
    glow: "rgba(247,223,30,0.18)",
    tailwindColor: "text-yellow-400",
    tailwindBorder: "border-yellow-400/40",
    tailwindBg: "bg-yellow-400/10",
    tailwindGlow: "shadow-yellow-400/20",
    emotion: "Excitement",
    emotionEmoji: "⚡",
    desc: "Logic. Now things actually happen.",
    filename: "app.js",
    fileIcon: "🟡",
    lines: [
      [
        { t: "keyword", v: "const" },
        { t: "plain", v: " " },
        { t: "var", v: "btn" },
        { t: "plain", v: " = document." },
        { t: "fn", v: "getElementById" },
        { t: "plain", v: "(" },
        { t: "string", v: '"myBtn"' },
        { t: "plain", v: ");" },
      ],
      [
        { t: "keyword", v: "const" },
        { t: "plain", v: " " },
        { t: "var", v: "title" },
        { t: "plain", v: " = document." },
        { t: "fn", v: "querySelector" },
        { t: "plain", v: "(" },
        { t: "string", v: '"h1"' },
        { t: "plain", v: ");" },
      ],
      [{ t: "plain", v: "" }],
      [
        { t: "var", v: "btn" },
        { t: "plain", v: "." },
        { t: "fn", v: "addEventListener" },
        { t: "plain", v: "(" },
        { t: "string", v: '"click"' },
        { t: "plain", v: ", () => {" },
      ],
      [
        { t: "var", v: "  title" },
        { t: "plain", v: ".textContent = " },
        { t: "string", v: '"You are a developer! 🚀"' },
        { t: "plain", v: ";" },
      ],
      [
        { t: "fn", v: "  console" },
        { t: "plain", v: "." },
        { t: "fn", v: "log" },
        { t: "plain", v: "(" },
        { t: "string", v: '"It works! 🎉"' },
        { t: "plain", v: ");" },
      ],
      [{ t: "plain", v: "});" }],
      [{ t: "plain", v: "" }],
      [{ t: "comment", v: "// Magic happens here ✨" }],
    ],
  },
];

const TOKEN_COLORS = {
  tag: "#e34c26",
  selector: "#7dd3fc",
  prop: "#9cdcfe",
  value: "#ce9178",
  keyword: "#c586c0",
  fn: "#dcdcaa",
  var: "#9cdcfe",
  string: "#ce9178",
  comment: "rgba(255,255,255,0.3)",
  plain: "rgba(255,255,255,0.78)",
};

/* ──────────────────────────────── PreviewPanel */
function PreviewPanel({ cssActive, jsActive }) {
  const [clicked, setClicked] = useState(false);
  const h1Ref = useRef();

  const handleClick = () => {
    if (!jsActive) return;
    setClicked(true);
    if (h1Ref.current) {
      gsap.fromTo(
        h1Ref.current,
        { scale: 1.15, color: "#f7df1e" },
        {
          scale: 1,
          color: cssActive ? "#00ff88" : "#fff",
          duration: 0.7,
          ease: "elastic.out(1,0.5)",
        },
      );
    }
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl p-4 min-h-37.5 transition-all duration-700
      ${
        cssActive
          ? "bg-[#0d1117] border border-emerald-500/20"
          : "bg-[#1e1e1e] border border-white/5"
      }`}
      style={{ fontFamily: cssActive ? "'Segoe UI',sans-serif" : "serif" }}
    >
      <span className="absolute top-1.5 right-2 font-mono text-[9px] text-white/20 tracking-widest uppercase">
        PREVIEW
      </span>

      {cssActive && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 50% 0%,rgba(0,255,136,0.05),transparent)",
          }}
        />
      )}

      <h1
        ref={h1Ref}
        className="font-extrabold mb-2 transition-all duration-700 leading-tight"
        style={{
          color: cssActive ? "#00ff88" : "#ccc",
          fontSize: cssActive
            ? "clamp(16px,3vw,22px)"
            : "clamp(14px,2.5vw,18px)",
          textShadow: cssActive ? "0 0 18px rgba(0,255,136,0.5)" : "none",
        }}
      >
        {clicked ? "You are a developer! 🚀" : "Hello, World!"}
      </h1>

      <p
        className={`text-[13px] mb-3 transition-colors duration-700 ${cssActive ? "text-white/40" : "text-white/60"}`}
      >
        I am learning to code.
      </p>

      <button
        onClick={handleClick}
        className={`text-xs font-bold px-4 py-1.5 border-none transition-all duration-700
          ${
            cssActive
              ? "bg-[#00ff88] text-black rounded-lg cursor-pointer hover:scale-105"
              : "bg-[#555] text-white rounded-sm cursor-default"
          }
          ${jsActive ? "cursor-pointer" : "cursor-default"}`}
        style={{
          boxShadow: cssActive ? "0 0 14px rgba(0,255,136,0.35)" : "none",
        }}
      >
        {jsActive ? "Click Me ⚡" : "Click Me"}
      </button>

      {clicked && (
        <div className="mt-2.5 font-mono text-[10px] text-yellow-300 animate-[slideDown_0.35s_ease]">
          ▶ "It works! 🎉"
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────── CodePanel */
function CodePanel({ phaseIdx, visibleCount, isActive }) {
  const phase = PHASES[phaseIdx];
  const [tooltip, setTooltip] = useState(false);

  return (
    <div
      className={`bg-[#0d1117] rounded-xl overflow-hidden border transition-all duration-500
      ${
        isActive
          ? `border-[${phase.color}]/30 shadow-lg ${phase.tailwindGlow}`
          : "border-white/5 shadow-none"
      }`}
      style={{
        borderColor: isActive ? `${phase.color}45` : undefined,
        boxShadow: isActive
          ? `0 0 32px ${phase.glow}, 0 8px 32px rgba(0,0,0,0.4)`
          : undefined,
      }}
    >
      {/* Panel header */}
      <div
        className={`flex items-center justify-between bg-[#0f1318] px-3 py-1.5 border-b transition-colors duration-300
        ${isActive ? "" : "border-white/5"}`}
        style={{ borderBottomColor: isActive ? `${phase.color}28` : undefined }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-[11px]">{phase.fileIcon}</span>
          <span
            className={`font-mono text-[11px] transition-colors duration-300 ${isActive ? "text-white" : "text-white/35"}`}
          >
            {phase.filename}
          </span>
          {isActive && (
            <span
              className="w-1.5 h-1.5 rounded-full inline-block animate-[pulse_1.5s_infinite]"
              style={{ background: phase.color }}
            />
          )}
        </div>
        <span
          className="font-mono text-[9px] tracking-widest uppercase px-2 py-0.5 rounded-full border transition-all duration-300"
          style={{
            color: isActive ? phase.color : "rgba(255,255,255,0.2)",
            borderColor: isActive ? `${phase.color}40` : "transparent",
          }}
        >
          {phase.label}
        </span>
      </div>

      {/* Code area */}
      <div className="p-3 relative min-h-20">
        {/* Tooltip */}
        {tooltip && phaseIdx === 0 && (
          <div
            className="absolute top-1.5 right-1.5 z-20 bg-[#1a2a1f] border border-emerald-500/30
            rounded-xl px-3 py-2 font-mono text-[11px] text-emerald-300
            shadow-[0_6px_20px_rgba(0,255,136,0.12)] animate-[popIn_0.3s_ease]"
          >
            <span className="block text-[9px] text-white/30 tracking-widest mb-1">
              FIRST CODE 🎯
            </span>
            My first achievement! 😄
          </div>
        )}

        {phase.lines.map((tokens, li) => (
          <div
            key={li}
            className="flex items-center transition-all duration-200"
            style={{
              opacity: li < visibleCount ? 1 : 0,
              transform:
                li < visibleCount ? "translateX(0)" : "translateX(-8px)",
            }}
          >
            <span className="font-mono text-[10px] text-white/10 w-6 shrink-0 text-right pr-2.5 leading-6 select-none">
              {li + 1}
            </span>
            <span className="font-mono text-[11px] leading-6 flex flex-wrap items-center">
              {tokens.map((tok, ti) =>
                tok.tooltip ? (
                  <span
                    key={ti}
                    onMouseEnter={() => setTooltip(true)}
                    onMouseLeave={() => setTooltip(false)}
                    className="cursor-pointer underline decoration-dotted decoration-yellow-400/40"
                    style={{ color: TOKEN_COLORS[tok.t] }}
                  >
                    {tok.v}
                  </span>
                ) : (
                  <span
                    key={ti}
                    style={{ color: TOKEN_COLORS[tok.t] }}
                    className={`${tok.t === "comment" ? "italic" : ""} ${tok.t === "keyword" ? "font-bold" : ""}`}
                  >
                    {tok.v}
                  </span>
                ),
              )}
              {li === visibleCount - 1 && visibleCount < phase.lines.length && (
                <span
                  className="inline-block w-0.5 h-[1em] ml-0.5 align-middle animate-[blink_1s_infinite]"
                  style={{ background: phase.color }}
                />
              )}
            </span>
          </div>
        ))}

        {visibleCount >= phase.lines.length && phase.lines.length > 0 && (
          <div className="flex items-center">
            <span className="font-mono text-[10px] text-white/10 w-6 shrink-0 text-right pr-2.5 leading-6">
              {phase.lines.length + 1}
            </span>
            <span
              className="inline-block w-0.5 h-[0.9em] animate-[blink_1s_infinite]"
              style={{ background: phase.color }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────── EmotionBar */
function EmotionBar({ activePhase }) {
  return (
    <div className="flex gap-6 sm:gap-8 justify-center flex-wrap">
      {PHASES.map((p, i) => {
        const active = activePhase === i;
        const done = activePhase > i;
        return (
          <div
            key={i}
            className="flex flex-col items-center gap-1.5 transition-all duration-500"
            style={{
              opacity: active ? 1 : done ? 0.6 : 0.22,
              transform: active ? "scale(1.08)" : "scale(1)",
            }}
          >
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center text-[17px] transition-all duration-500"
              style={{
                background: active ? `${p.color}20` : "rgba(255,255,255,0.04)",
                border: `2px solid ${active ? p.color : done ? `${p.color}50` : "rgba(255,255,255,0.07)"}`,
                boxShadow: active ? `0 0 22px ${p.glow}` : "none",
              }}
            >
              {done ? "✓" : p.emotionEmoji}
            </div>
            <span
              className="font-mono text-[9px] tracking-widest uppercase transition-colors duration-500"
              style={{
                color: active
                  ? p.color
                  : done
                    ? `${p.color}90`
                    : "rgba(255,255,255,0.2)",
              }}
            >
              {p.emotion}
            </span>
            <span
              className={`font-mono text-[8px] tracking-wide ${active ? "text-white/45" : "text-white/15"}`}
            >
              {p.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════════ */
export default function LearningSection({ onComplete }) {
  const sectionRef = useRef();
  const headerRef = useRef();
  const editorRef = useRef();
  const tlRef = useRef();
  const startedRef = useRef(false);

  const [activePhase, setActivePhase] = useState(-1);
  const [lineCounts, setLineCounts] = useState([0, 0, 0]);
  const [started, setStarted] = useState(false);
  const [achievement, setAchievement] = useState(null);
  const [allDone, setAllDone] = useState(false);

  const symbols = [
    "{}",
    "=>",
    "</>",
    "div",
    "px",
    "fn()",
    "&&",
    "let",
    "var",
    "DOM",
    "API",
    "()=>",
  ];

  const TOASTS = [
    { title: "HTML Unlocked 🟠", sub: "You built your first structure!" },
    { title: "CSS Unlocked 🔵", sub: "Your page is alive with style!" },
    { title: "JavaScript Unlocked 🟡", sub: "Now it actually does things!" },
  ];

  const startSequence = () => {
    if (startedRef.current) return;
    startedRef.current = true;
    setStarted(true);
    setActivePhase(-1);
    setLineCounts([0, 0, 0]);
    setAchievement(null);
    setAllDone(false);

    const tl = gsap.timeline({
      onComplete: () => {
        setTimeout(() => {
          setActivePhase(-1);
          setAllDone(true);
          if (onComplete) onComplete();
        }, 1500);
      },
    });
    tlRef.current = tl;

    // Entrance
    tl.to(
      headerRef.current,
      { opacity: 1, y: 0, duration: 0.95, ease: "power3.out" },
      0,
    );
    tl.to(
      editorRef.current,
      { opacity: 1, y: 0, scale: 1, duration: 1.05, ease: "power3.out" },
      0.15,
    );

    const LINE_DELAY = 0.21;
    const LINE_START = 0.35;
    const PHASE_GAP = 0.5;
    const TOAST_DURATION = 2.6;

    let cursor = tl.duration() + 0.2;

    PHASES.forEach((phase, idx) => {
      const phaseStart = cursor;
      tl.call(
        () => {
          setActivePhase(idx);
          setAchievement(TOASTS[idx]);
        },
        [],
        phaseStart,
      );
      tl.call(() => setAchievement(null), [], phaseStart + TOAST_DURATION);

      for (let i = 1; i <= phase.lines.length; i++) {
        const t = phaseStart + LINE_START + i * LINE_DELAY;
        tl.call(
          () => {
            setLineCounts((prev) => {
              const n = [...prev];
              n[idx] = i;
              return n;
            });
          },
          [],
          t,
        );
      }

      cursor =
        phaseStart + LINE_START + phase.lines.length * LINE_DELAY + PHASE_GAP;
      tl.to({}, { duration: 0.01 }, cursor);
    });
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 44 },
        {
          opacity: 1,
          y: 0,
          duration: 0.95,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 76%" },
        },
      );
      gsap.fromTo(
        editorRef.current,
        { opacity: 0, y: 56, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1.05,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 62%" },
        },
      );
      ScrollTrigger.create({
        trigger: editorRef.current,
        start: "top 50%",
        onEnter: () => startSequence(),
        once: true,
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  const cssActive = lineCounts[1] > 0;
  const jsActive = lineCounts[2] > 0;

  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@300;400;700&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes blink      { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes pulse      { 0%,100%{opacity:1} 50%{opacity:0.35} }
        @keyframes slideDown  { from{opacity:0;transform:translateY(-8px)} to{opacity:1;transform:translateY(0)} }
        @keyframes popIn      { 0%{transform:scale(0.6);opacity:0} 70%{transform:scale(1.06)} 100%{transform:scale(1);opacity:1} }
        @keyframes achievePop { 0%{transform:translateY(18px) scale(0.85);opacity:0} 60%{transform:translateY(-3px) scale(1.04)} 100%{transform:translateY(0) scale(1);opacity:1} }
        @keyframes floatSym   { 0%{transform:translateY(0) rotate(0deg);opacity:0.055} 100%{transform:translateY(-90px) rotate(14deg);opacity:0} }
        @keyframes shimmer    { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes fadeIn     { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      <section
        ref={sectionRef}
        id="learning-section"
        className="relative min-h-screen bg-[#070b0f] flex flex-col items-center
          justify-center overflow-hidden px-4 sm:px-6 md:px-10 py-20"
      >
        {/* Grid background */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.017) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.017) 1px,transparent 1px)",
            backgroundSize: "50px 50px",
          }}
        />

        {/* Vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at center,transparent 28%,rgba(0,0,0,0.88) 100%)",
          }}
        />

        {/* Floating symbols */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {symbols.map((s, i) => (
            <span
              key={i}
              className="absolute font-mono select-none text-white/4.5"
              style={{
                left: `${4 + ((i * 8.2) % 90)}%`,
                top: `${8 + ((i * 12) % 82)}%`,
                fontSize: `${10 + (i % 3) * 5}px`,
                animation: `floatSym ${9 + i * 1.7}s ${i * 0.65}s ease-in-out infinite alternate`,
              }}
            >
              {s}
            </span>
          ))}
        </div>

        {/* ── HEADER ── */}
        <div
          ref={headerRef}
          className="opacity-0 text-center mb-10 relative z-10 px-2 w-full max-w-2xl"
        >
          <p className="font-mono text-[10px] tracking-[0.35em] text-white/20 uppercase mb-3.5">
            Chapter One · The Beginning
          </p>

          <h2
            className="font-extrabold leading-[1.07] tracking-tight text-white mb-4"
            style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: "clamp(28px,5.5vw,60px)",
            }}
          >
            From Zero to{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg,#e34c26,#264de4,#f7df1e,#e34c26)",
                backgroundSize: "300% auto",
                animation: "shimmer 4s linear infinite",
              }}
            >
              Developer
            </span>
          </h2>

          <p
            className="font-mono text-white/25 leading-[1.9] max-w-115 mx-auto"
            style={{ fontSize: "clamp(11px,1.3vw,13px)" }}
          >
            It starts with a single tag. Then styles. Then logic.
            <br />
            <span className="text-white/45">
              Three languages. One journey. Let's go.
            </span>
          </p>

          <div className="mt-7">
            <EmotionBar activePhase={activePhase} />
          </div>
        </div>

        {/* ── EDITOR ── */}
        <div
          ref={editorRef}
          className="opacity-0 relative z-10 w-full max-w-270"
        >
          {/* Achievement toast */}
          {achievement && (
            <div
              className="fixed top-4 right-4 z-100 flex items-center gap-3 bg-[#111318]
                rounded-2xl px-4 py-3 animate-[achievePop_0.5s_ease_forwards]"
              style={{
                border: `1px solid ${PHASES[Math.max(0, activePhase)]?.color ?? "#fff"}44`,
                boxShadow: `0 0 28px ${PHASES[Math.max(0, activePhase)]?.glow ?? "rgba(255,255,255,0.1)"}`,
              }}
            >
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-mono text-[9px] text-white/30 tracking-widest uppercase mb-0.5">
                  Achievement Unlocked
                </p>
                <p
                  className="font-bold text-white text-sm"
                  style={{ fontFamily: "'Syne',sans-serif" }}
                >
                  {achievement.title}
                </p>
                <p className="font-mono text-[11px] text-white/35">
                  {achievement.sub}
                </p>
              </div>
            </div>
          )}

          {/* VS Code shell */}
          <div
            className="rounded-2xl overflow-hidden border border-white/5
            shadow-[0_40px_100px_rgba(0,0,0,0.7),0_0_0_1px_rgba(255,255,255,0.03)]"
          >
            {/* Title bar */}
            <div
              className="flex items-center justify-between bg-[#0f1318] px-4 py-2.5
              border-b border-white/5 flex-wrap gap-2"
            >
              <div className="flex gap-1.5">
                {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                  <div
                    key={i}
                    className="w-3 h-3 rounded-full"
                    style={{ background: c }}
                  />
                ))}
              </div>

              {/* File tabs */}
              <div className="flex gap-1 flex-wrap">
                {PHASES.map((p, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 px-3 py-1 rounded-md transition-all duration-300"
                    style={{
                      background: activePhase === i ? "#1a1f28" : "transparent",
                      border: `1px solid ${activePhase === i ? `${p.color}38` : "transparent"}`,
                      opacity: lineCounts[i] > 0 ? 1 : 0.28,
                    }}
                  >
                    <span className="text-[10px]">{p.fileIcon}</span>
                    <span
                      className="font-mono text-[10px] transition-colors duration-300"
                      style={{
                        color:
                          activePhase === i ? "#fff" : "rgba(255,255,255,0.38)",
                      }}
                    >
                      {p.filename}
                    </span>
                  </div>
                ))}
              </div>

              <span className="font-mono text-[9px] text-white/15 tracking-widest">
                DEV ODYSSEY
              </span>
            </div>

            {/* Progress bar row */}
            {started && (
              <div className="flex items-center gap-3 bg-[#0a0f13] px-4 py-1.5 border-b border-white/5">
                {PHASES.map((p, i) => (
                  <div key={i} className="flex items-center gap-2 flex-1">
                    <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-200"
                        style={{
                          width: `${Math.min(100, (lineCounts[i] / p.lines.length) * 100)}%`,
                          background: p.color,
                          boxShadow: `0 0 5px ${p.color}`,
                        }}
                      />
                    </div>
                    <span
                      className="font-mono text-[9px] uppercase tracking-wide whitespace-nowrap"
                      style={{
                        color:
                          lineCounts[i] > 0
                            ? p.color
                            : "rgba(255,255,255,0.18)",
                      }}
                    >
                      {lineCounts[i] >= p.lines.length
                        ? `${p.label} ✓`
                        : p.label}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Main body */}
            <div className="flex bg-[#0d1117] flex-wrap">
              {/* LEFT — code panels */}
              <div
                className="flex-1 min-w-0 p-3.5 flex flex-col gap-2.5 border-r border-white/5"
                style={{ flexBasis: "380px" }}
              >
                {PHASES.map((_, i) => (
                  <div
                    key={i}
                    className="transition-all duration-500"
                    style={{
                      opacity: lineCounts[i] > 0 ? 1 : 0.16,
                      transform:
                        lineCounts[i] > 0 ? "translateY(0)" : "translateY(6px)",
                    }}
                  >
                    <CodePanel
                      phaseIdx={i}
                      visibleCount={lineCounts[i]}
                      isActive={activePhase === i}
                    />
                  </div>
                ))}
              </div>

              {/* RIGHT — preview + status */}
              <div
                className="flex flex-col bg-[#0a0f13]"
                style={{ flex: "0 1 300px", minWidth: 220 }}
              >
                {/* Emotion header */}
                <div className="flex items-center gap-2 px-3.5 py-2.5 border-b border-white/5">
                  <span className="text-[13px]">
                    {activePhase >= 0
                      ? PHASES[activePhase].emotionEmoji
                      : allDone
                        ? "🚀"
                        : "👁️"}
                  </span>
                  <span
                    className="font-mono text-[10px] tracking-widest uppercase transition-colors duration-500"
                    style={{
                      color:
                        activePhase >= 0
                          ? PHASES[activePhase].color
                          : "rgba(255,255,255,0.22)",
                    }}
                  >
                    {activePhase >= 0
                      ? PHASES[activePhase].desc
                      : allDone
                        ? "All systems go!"
                        : "Waiting..."}
                  </span>
                </div>

                {/* Live preview */}
                <div className="p-3.5 flex-1">
                  <p className="font-mono text-[9px] text-white/18 tracking-widest uppercase mb-2.5">
                    Live Preview
                  </p>
                  <PreviewPanel cssActive={cssActive} jsActive={jsActive} />
                </div>

                {/* Status bar */}
                <div className="flex items-center justify-between px-3.5 py-1.5 border-t border-white/5 bg-[#07090d]">
                  <span
                    className="font-mono text-[9px] flex items-center gap-1.5 transition-colors duration-500"
                    style={{
                      color:
                        activePhase >= 0
                          ? PHASES[activePhase].color
                          : allDone
                            ? "#00ff88"
                            : "rgba(255,255,255,0.2)",
                    }}
                  >
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block"
                      style={{
                        background: "currentColor",
                        animation:
                          activePhase >= 0 ? "pulse 1.5s infinite" : "none",
                      }}
                    />
                    {activePhase >= 0
                      ? "Compiling..."
                      : allDone
                        ? "Done ✓"
                        : "Ready"}
                  </span>
                  <span className="font-mono text-[9px] text-white/18">
                    {lineCounts.reduce((a, b) => a + b, 0)} lines
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom caption */}
          {allDone && (
            <div className="text-center mt-5 font-mono text-[12px] text-white/20 leading-loose animate-[fadeIn_0.7s_ease]">
              HTML gave you structure. CSS gave you style. JavaScript gave you
              power.
              <br />
              <span
                className="font-bold text-[14px] tracking-tight bg-clip-text text-transparent"
                style={{
                  backgroundImage:
                    "linear-gradient(90deg,#e34c26,#264de4,#f7df1e)",
                }}
              >
                You are no longer a beginner. 🚀
              </span>
            </div>
          )}
        </div>

        {/* Scroll hint */}
        {!started && (
          <div className="absolute bottom-7 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10">
            <span className="font-mono text-[9px] tracking-[0.28em] text-white/15 uppercase">
              scroll to start
            </span>
            <div
              className="w-px h-9"
              style={{
                background:
                  "linear-gradient(to bottom,rgba(255,255,255,0.2),transparent)",
              }}
            />
          </div>
        )}
      </section>
    </>
  );
}
