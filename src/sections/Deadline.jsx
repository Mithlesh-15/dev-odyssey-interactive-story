import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ═══════════════════════════════════════════
   CONSTANTS
═══════════════════════════════════════════ */
const ERRORS = [
  "TypeError: Cannot read property of undefined",
  "SyntaxError: Unexpected token '}'",
  "404: API endpoint not found",
  "ReferenceError: deadline is not defined",
  "FATAL: git merge conflict detected",
  "Warning: Maximum update depth exceeded",
];

const NOTIFICATIONS = [
  { icon: "📧", text: "Client: Where is the project??" },
  { icon: "📱", text: "Boss calling... (declining)" },
  { icon: "⏰", text: "Reminder: Submission in 1 hour" },
  { icon: "😤", text: "Teammate: pushed 247 changes" },
];

const CODE_LINES = [
  "  if (deadline.isTomorrow()) panic();",
  "  const coffee = await getCoffee(++count);",
  "  bugs.forEach(b => b.fix());  // lol",
  "  git commit -m 'final FINAL v3'",
  "  deploy({ pray: true, sleep: false });",
  "  console.log('Almost there...');",
];

const PHASES = [
  { id: "calm",       label: "Deadline Approaching",  color: "#ff6b35" },
  { id: "pressure",   label: "Not Enough Time...",     color: "#ff4444" },
  { id: "chaos",      label: "EVERYTHING IS ON FIRE",  color: "#ff0000" },
  { id: "coffee",     label: "One More Coffee...",      color: "#c0392b" },
  { id: "push",       label: "Almost Done...",          color: "#ff8c00" },
  { id: "complete",   label: "Project Completed!",      color: "#00ff88" },
];

/* ═══════════════════════════════════════════
   DIGITAL CLOCK
═══════════════════════════════════════════ */
function DigitalClock({ timeLeft, phase }) {
  const mins = String(Math.floor(timeLeft / 60)).padStart(2, "0");
  const secs = String(timeLeft % 60).padStart(2, "0");
  const isCritical = timeLeft < 60;
  const isDone = phase === "complete";

  return (
    <div className="flex flex-col items-center gap-2">
      <p className="font-mono text-[10px] tracking-[0.3em] uppercase"
        style={{ color: "rgba(255,255,255,0.3)" }}>
        TIME REMAINING
      </p>
      <div className="relative flex items-center gap-1">
        {/* digits */}
        {[mins[0], mins[1], ":", secs[0], secs[1]].map((ch, i) => (
          <div key={i} className={ch === ":" ? "pb-1" : ""}
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: "clamp(32px,7vw,72px)",
              fontWeight: 700,
              color: isDone ? "#00ff88"
                : isCritical ? "#ff4444"
                : phase === "chaos" ? "#ff6b35"
                : "rgba(255,255,255,0.85)",
              textShadow: isDone ? "0 0 30px rgba(0,255,136,0.7)"
                : isCritical ? "0 0 20px rgba(255,68,68,0.6)"
                : "none",
              transition: "color 0.5s, text-shadow 0.5s",
              lineHeight: ch === ":" ? "1.1" : "1",
              animation: isCritical && !isDone ? "clockPulse 0.5s infinite" : "none",
            }}>
            {ch}
          </div>
        ))}
      </div>

      {/* progress bar under clock */}
      <div className="w-48 h-0.5 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
        <div style={{
          height: "100%",
          width: `${isDone ? 0 : (timeLeft / 300) * 100}%`,
          background: isCritical ? "#ff4444" : "#ff6b35",
          boxShadow: `0 0 8px ${isCritical ? "#ff4444" : "#ff6b35"}`,
          transition: "width 1s linear, background 0.5s",
        }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   COFFEE CUP
═══════════════════════════════════════════ */
function CoffeeCup({ index, onClick }) {
  return (
    <div
      className="flex flex-col items-center gap-1 cursor-pointer select-none"
      style={{ animation: `coffeePop 0.4s ${index * 0.2}s cubic-bezier(0.34,1.56,0.64,1) both` }}
      onClick={onClick}
    >
      <div className="relative" style={{ fontSize: "clamp(28px,4vw,40px)" }}>
        <span style={{ filter: "drop-shadow(0 0 10px rgba(200,100,0,0.6))" }}>☕</span>
        {/* steam */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 flex gap-0.5"
          style={{ top: "-10px" }}>
          {[0, 1].map(i => (
            <div key={i} style={{
              width: 2, height: 8,
              background: "rgba(255,255,255,0.3)",
              borderRadius: 1,
              animation: `steam 1.2s ${i * 0.3}s ease-out infinite`,
            }} />
          ))}
        </div>
      </div>
      <span style={{
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 9, color: "rgba(255,255,255,0.3)",
        letterSpacing: "0.1em",
      }}>#{index + 1}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   ERROR TOAST
═══════════════════════════════════════════ */
function ErrorToast({ msg, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 1800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      fontFamily: "'JetBrains Mono',monospace",
      fontSize: "clamp(10px,1.2vw,12px)",
      color: "#ff8080",
      background: "rgba(255,50,50,0.1)",
      border: "1px solid rgba(255,50,50,0.3)",
      borderRadius: 8, padding: "6px 14px",
      animation: "errorPop 0.25s ease",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      maxWidth: "min(420px, 90vw)",
    }}>
      ⛔ {msg}
    </div>
  );
}

/* ═══════════════════════════════════════════
   NOTIFICATION
═══════════════════════════════════════════ */
function Notif({ notif, onDone }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div style={{
      position: "fixed", top: 18, right: 18, zIndex: 200,
      display: "flex", alignItems: "center", gap: 10,
      background: "#1a1a1a",
      border: "1px solid rgba(255,255,255,0.12)",
      borderRadius: 14, padding: "10px 16px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
      animation: "notifSlide 0.35s cubic-bezier(0.34,1.56,0.64,1)",
      fontFamily: "'JetBrains Mono',monospace",
      maxWidth: "min(320px,90vw)",
    }}>
      <span style={{ fontSize: 20 }}>{notif.icon}</span>
      <span style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>{notif.text}</span>
    </div>
  );
}

/* ═══════════════════════════════════════════
   MAIN SECTION
═══════════════════════════════════════════ */
export default function DeadlineSection({ onComplete }) {
  const sectionRef   = useRef();
  const wrapRef      = useRef();
  const shakeRef     = useRef();
  const bgRef        = useRef();

  const [phase,        setPhase]        = useState("idle");
  const [timeLeft,     setTimeLeft]     = useState(300);
  const [coffeeCount,  setCoffeeCount]  = useState(0);
  const [errors,       setErrors]       = useState([]);
  const [notif,        setNotif]        = useState(null);
  const [codeIdx,      setCodeIdx]      = useState(0);
  const [shaking,      setShaking]      = useState(false);
  const [bgIntensity,  setBgIntensity]  = useState(0);
  const [mainText,     setMainText]     = useState("The deadline is approaching...");
  const [subText,      setSubText]      = useState("Stay calm. You've got this.");
  const [particles,    setParticles]    = useState([]);

  const timerRef    = useRef(null);
  const phaseRef    = useRef("idle");
  const speedRef    = useRef(1);
  const startedRef  = useRef(false);

  const updatePhase = (p) => { phaseRef.current = p; setPhase(p); };

  /* ── spawn particles ── */
  useEffect(() => {
    setParticles(Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: `${Math.random() * 100}%`,
      top:  `${Math.random() * 100}%`,
      size: Math.random() > 0.6 ? 3 : 2,
      dur:  `${8 + Math.random() * 16}s`,
      delay:`${Math.random() * 10}s`,
    })));
  }, []);

  /* ── countdown ── */
  const startTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        const next = prev - speedRef.current;
        if (next <= 0) { clearInterval(timerRef.current); return 0; }
        return Math.max(0, prev - speedRef.current);
      });
    }, 1000);
  };

  /* ── shake screen ── */
  const shake = (intensity = 1) => {
    setShaking(true);
    gsap.to(shakeRef.current, {
      x: `${6 * intensity}px`, y: `${3 * intensity}px`, duration: 0.06,
      yoyo: true, repeat: 7,
      onComplete: () => {
        gsap.set(shakeRef.current, { x: 0, y: 0 });
        setShaking(false);
      },
    });
  };

  /* ── show error ── */
  const spawnError = () => {
    const msg = ERRORS[Math.floor(Math.random() * ERRORS.length)];
    setErrors(prev => [...prev.slice(-3), { id: Date.now(), msg }]);
    shake(0.7);
  };

  /* ── show notif ── */
  const spawnNotif = (idx) => {
    setNotif(NOTIFICATIONS[idx % NOTIFICATIONS.length]);
    setTimeout(() => setNotif(null), 2400);
  };

  /* ── click coffee boost ── */
  const boostCoffee = () => {
    if (phaseRef.current !== "coffee" && phaseRef.current !== "push") return;
    speedRef.current = Math.min(speedRef.current + 2, 8);
    shake(0.5);
    gsap.to(bgRef.current, {
      opacity: 0.18, duration: 0.15, yoyo: true, repeat: 1,
    });
  };

  /* ══ MAIN SEQUENCE ══ */
  const runSequence = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    const tl = gsap.timeline({
  onComplete: () => {
    setTimeout(() => {
      if (onComplete) onComplete();
    }, 2000);
  },
});

    // ── STEP 1: Calm ──
    tl.call(() => {
      updatePhase("calm");
      setMainText("Deadline is approaching...");
      setSubText("You still have some time. Maybe.");
      setBgIntensity(0.06);
    });

    tl.to(wrapRef.current, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" });

    // ── STEP 2: Pressure ──
    tl.call(() => {
      updatePhase("pressure");
      setMainText("Not enough time…");
      setSubText("Why did you watch Netflix last night?");
      startTimer();
      setBgIntensity(0.14);
    }, [], "+=1.5");

    tl.to(bgRef.current, { opacity: 0.14, duration: 1 });

    // ── STEP 3: Chaos ──
    tl.call(() => {
      updatePhase("chaos");
      setMainText("EVERYTHING IS ON FIRE 🔥");
      setSubText("git push --force (it's fine)");
      speedRef.current = 3;
      setBgIntensity(0.25);
      shake(1.5);
    }, [], "+=2");

    // spawn errors + notifs repeatedly during chaos
    tl.call(() => spawnError(), [], "+=0.3");
    tl.call(() => spawnNotif(0), [], "+=0.5");
    tl.call(() => spawnError(), [], "+=0.8");
    tl.call(() => spawnNotif(1), [], "+=1.1");
    tl.call(() => spawnError(), [], "+=1.4");
    tl.call(() => shake(1.2), [], "+=1.8");
    tl.call(() => spawnNotif(2), [], "+=2");
    tl.call(() => spawnError(), [], "+=2.3");

    // advance code lines
    for (let i = 0; i < CODE_LINES.length; i++) {
      tl.call(() => setCodeIdx(i + 1), [], `+=0.35`);
    }

    // ── STEP 4: Coffee ──
    tl.call(() => {
      updatePhase("coffee");
      setMainText("One more coffee...");
      setSubText("Just one more. Then I'll focus.");
      speedRef.current = 2;
      setBgIntensity(0.18);
    }, [], "+=0.5");

    for (let i = 0; i < 5; i++) {
      tl.call(() => setCoffeeCount(c => c + 1), [], `+=0.55`);
    }

    tl.call(() => {
      setMainText("Just one more... ☕");
      setSubText("(This is the 5th one)");
    }, [], "+=0.5");

    // ── STEP 5: Final Push ──
    tl.call(() => {
      updatePhase("push");
      setMainText("Almost done…");
      setSubText("Focus. You can do this. Almost there.");
      speedRef.current = 4;
      setBgIntensity(0.1);
    }, [], "+=1.5");

    tl.call(() => spawnNotif(3), [], "+=0.5");
    tl.call(() => spawnError(), [], "+=1");

    // ── STEP 6: Completion ──
    tl.call(() => {
      updatePhase("complete");
      clearInterval(timerRef.current);
      setTimeLeft(0);
      setMainText("Project Completed! 🚀");
      setSubText("You did it. Against all odds.");
      setBgIntensity(0);
      speedRef.current = 0;
      // big success flash
      gsap.fromTo(bgRef.current,
        { opacity: 0.4, background: "radial-gradient(ellipse at center,rgba(0,255,136,0.3),transparent 70%)" },
        { opacity: 0, duration: 1.5, ease: "power2.out" }
      );
    }, [], "+=2");
  };

  /* ── ScrollTrigger ── */
  useEffect(() => {
    gsap.set(wrapRef.current, { opacity: 0, y: 40 });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 42%",
        onEnter: () => runSequence(),
      });
    }, sectionRef);

    return () => {
      ctx.revert();
      clearInterval(timerRef.current);
    };
  }, []);

  const phaseConfig = PHASES.find(p => p.id === phase) || PHASES[0];
  const isDone      = phase === "complete";

  return (
    <>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=JetBrains+Mono:wght@300;400;700&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes clockPulse  { 0%,100%{transform:scale(1)} 50%{transform:scale(1.04)} }
        @keyframes steam       { 0%{transform:translateY(0) scaleX(1);opacity:0.5} 100%{transform:translateY(-12px) scaleX(1.6);opacity:0} }
        @keyframes coffeePop   { 0%{transform:scale(0) rotate(-15deg);opacity:0} 100%{transform:scale(1) rotate(0deg);opacity:1} }
        @keyframes errorPop    { 0%{transform:translateX(-12px);opacity:0} 100%{transform:translateX(0);opacity:1} }
        @keyframes notifSlide  { 0%{transform:translateX(30px);opacity:0} 100%{transform:translateX(0);opacity:1} }
        @keyframes bgPulse     { 0%,100%{opacity:var(--bg-intensity,0.12)} 50%{opacity:calc(var(--bg-intensity,0.12)*1.8)} }
        @keyframes codeFlash   { 0%{background:rgba(255,107,53,0.12)} 100%{background:transparent} }
        @keyframes floatP      { 0%{transform:translate(0,0)} 100%{transform:translate(var(--px,10px),var(--py,-20px))} }
        @keyframes successGlow { 0%{text-shadow:0 0 10px rgba(0,255,136,0.5)} 50%{text-shadow:0 0 40px rgba(0,255,136,0.9),0 0 80px rgba(0,255,136,0.4)} 100%{text-shadow:0 0 10px rgba(0,255,136,0.5)} }
        @keyframes shimmer     { 0%{background-position:-200% center} 100%{background-position:200% center} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(16px)} to{opacity:1;transform:translateY(0)} }
        @keyframes tickTock    { 0%,100%{transform:rotate(-8deg)} 50%{transform:rotate(8deg)} }
      `}</style>

      <section
        ref={sectionRef}
        id="deadline-section"
        className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden"
        style={{
          background: isDone
            ? "#07100a"
            : phase === "chaos" ? "#100a07" : "#0a0709",
          transition: "background 1.5s ease",
          padding: "clamp(60px,10vh,90px) clamp(12px,4vw,48px)",
        }}
      >
        {/* ambient bg glow */}
        <div ref={bgRef} className="absolute inset-0 pointer-events-none"
          style={{
            background: isDone
              ? "radial-gradient(ellipse at center,rgba(0,255,136,0.08),transparent 65%)"
              : `radial-gradient(ellipse at center,${phaseConfig.color}18,transparent 65%)`,
            opacity: bgIntensity,
            transition: "background 1s ease, opacity 1s ease",
            animation: phase !== "idle" && phase !== "complete" && phase !== "calm"
              ? `bgPulse ${phase === "chaos" ? "0.6" : "1.2"}s ease-in-out infinite`
              : "none",
          }}
        />

        {/* grid */}
        <div className="absolute inset-0 pointer-events-none" style={{
          backgroundImage: "linear-gradient(rgba(255,255,255,0.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.015) 1px,transparent 1px)",
          backgroundSize: "52px 52px",
        }} />

        {/* vignette */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(ellipse at center,transparent 25%,rgba(0,0,0,0.9) 100%)"
        }} />

        {/* particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {particles.map(p => (
            <div key={p.id} style={{
              position: "absolute",
              width: p.size, height: p.size,
              borderRadius: "50%",
              left: p.left, top: p.top,
              background: isDone ? "#00ff88"
                : phase === "chaos" ? "#ff6b35"
                : "rgba(255,255,255,0.35)",
              opacity: 0.15,
              transition: "background 1s",
              animation: `floatP ${p.dur} ${p.delay} ease-in-out infinite alternate`,
            }} />
          ))}
        </div>

        {/* notification */}
        {notif && <Notif notif={notif} onDone={() => setNotif(null)} />}

        {/* ── SHAKE WRAPPER ── */}
        <div ref={shakeRef} className="relative z-10 w-full flex flex-col items-center gap-6 md:gap-8"
          style={{ maxWidth: "min(780px,97vw)" }}>

          {/* ── PHASE LABEL ── */}
          {phase !== "idle" && (
            <div style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: "clamp(9px,1.1vw,11px)",
              letterSpacing: "0.3em",
              color: isDone ? "rgba(0,255,136,0.6)" : `${phaseConfig.color}90`,
              textTransform: "uppercase",
              animation: "fadeSlideUp 0.4s ease",
            }}>
              ⚡ {phase.toUpperCase()} PHASE
            </div>
          )}

          {/* ── MAIN TEXT ── */}
          <div className="text-center">
            <h2 key={mainText} style={{
              fontFamily: "'Syne',sans-serif",
              fontSize: "clamp(26px,5.5vw,56px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              lineHeight: 1.08,
              color: isDone ? "#00ff88" : "#fff",
              animation: isDone
                ? "successGlow 2s ease-in-out infinite, fadeSlideUp 0.5s ease"
                : "fadeSlideUp 0.5s ease",
              textShadow: isDone ? "0 0 40px rgba(0,255,136,0.5)" : "none",
              transition: "color 0.5s",
            }}>{mainText}</h2>

            <p key={subText} style={{
              fontFamily: "'JetBrains Mono',monospace",
              fontSize: "clamp(11px,1.3vw,14px)",
              color: isDone ? "rgba(0,255,136,0.6)" : "rgba(255,255,255,0.35)",
              marginTop: 10, lineHeight: 1.7,
              animation: "fadeSlideUp 0.5s 0.1s ease both",
            }}>{subText}</p>
          </div>

          {/* ── CLOCK ── */}
          {(phase !== "idle") && (
            <div style={{ animation: "fadeSlideUp 0.5s ease" }}>
              <DigitalClock timeLeft={timeLeft} phase={phase} />
            </div>
          )}

          {/* ── CODE TERMINAL (chaos / push phases) ── */}
          {(phase === "chaos" || phase === "push" || phase === "coffee") && (
            <div style={{
              width: "100%",
              background: "#0d1117",
              borderRadius: 14,
              border: `1px solid ${phase === "chaos" ? "rgba(255,107,53,0.3)" : "rgba(255,255,255,0.07)"}`,
              overflow: "hidden",
              boxShadow: phase === "chaos" ? "0 0 30px rgba(255,107,53,0.12)" : "none",
              animation: "fadeSlideUp 0.4s ease",
              transition: "border-color 0.5s, box-shadow 0.5s",
            }}>
              {/* terminal bar */}
              <div style={{
                display: "flex", alignItems: "center", gap: 7,
                background: "#0f1318", padding: "8px 14px",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}>
                {["#ff5f57","#febc2e","#28c840"].map((c,i) => (
                  <div key={i} style={{ width: 10, height: 10, borderRadius: "50%", background: c }} />
                ))}
                <span style={{
                  fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
                  color: "rgba(255,255,255,0.35)", marginLeft: 6,
                }}>deadline_rush.js</span>
                {phase === "chaos" && (
                  <span style={{
                    marginLeft: "auto",
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 9,
                    color: "#ff6b35", letterSpacing: "0.2em",
                    animation: "clockPulse 0.8s infinite",
                  }}>● LIVE</span>
                )}
              </div>
              {/* code lines */}
              <div style={{ padding: "12px 14px" }}>
                {CODE_LINES.slice(0, codeIdx).map((line, i) => (
                  <div key={i} style={{
                    fontFamily: "'JetBrains Mono',monospace",
                    fontSize: "clamp(10px,1.2vw,13px)", lineHeight: "26px",
                    display: "flex", gap: 12,
                    animation: i === codeIdx - 1 ? "codeFlash 0.4s ease" : "none",
                    borderRadius: 4,
                  }}>
                    <span style={{ color: "rgba(255,255,255,0.15)", width: 20, textAlign: "right", flexShrink: 0 }}>
                      {i + 1}
                    </span>
                    <span style={{
                      color: i === codeIdx - 1 ? "#ffd700" : "rgba(255,255,255,0.6)",
                      transition: "color 0.3s",
                    }}>{line}</span>
                  </div>
                ))}
                {codeIdx > 0 && codeIdx < CODE_LINES.length && (
                  <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 2 }}>
                    <span style={{ color: "rgba(255,255,255,0.15)", width: 20, textAlign: "right" }}>{codeIdx + 1}</span>
                    <span style={{
                      display: "inline-block", width: 2, height: "1em",
                      background: "#ff6b35", animation: "clockPulse 0.8s infinite",
                    }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* ── ERRORS ── */}
          {errors.length > 0 && (
            <div className="w-full flex flex-col gap-2" style={{ animation: "fadeSlideUp 0.3s ease" }}>
              {errors.map(e => (
                <ErrorToast key={e.id} msg={e.msg}
                  onDone={() => setErrors(prev => prev.filter(x => x.id !== e.id))} />
              ))}
            </div>
          )}

          {/* ── COFFEE CUPS ── */}
          {coffeeCount > 0 && (
            <div style={{ animation: "fadeSlideUp 0.4s ease" }}>
              <p style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 10,
                color: "rgba(255,255,255,0.25)", letterSpacing: "0.25em",
                textTransform: "uppercase", textAlign: "center", marginBottom: 14,
              }}>
                Coffees consumed
              </p>
              <div className="flex gap-4 md:gap-6 justify-center flex-wrap">
                {Array.from({ length: coffeeCount }).map((_, i) => (
                  <CoffeeCup key={i} index={i} onClick={boostCoffee} />
                ))}
              </div>
              <p style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 10,
                color: "rgba(255,255,255,0.2)", textAlign: "center",
                marginTop: 10, letterSpacing: "0.15em",
              }}>
                click ☕ to boost speed
              </p>
            </div>
          )}

          {/* ── COMPLETION DETAILS ── */}
          {isDone && (
            <div style={{
              width: "100%", background: "rgba(0,255,136,0.04)",
              border: "1px solid rgba(0,255,136,0.2)",
              borderRadius: 16, padding: "clamp(16px,3vw,28px)",
              textAlign: "center",
              animation: "fadeSlideUp 0.7s 0.2s ease both",
              boxShadow: "0 0 40px rgba(0,255,136,0.08)",
            }}>
              <div style={{ fontSize: "clamp(36px,6vw,56px)", marginBottom: 12 }}>🚀</div>
              <p style={{
                fontFamily: "'Syne',sans-serif", fontWeight: 800,
                fontSize: "clamp(18px,3vw,28px)", color: "#00ff88",
                marginBottom: 8, animation: "successGlow 2s ease-in-out infinite",
              }}>
                Deployed to Production
              </p>
              <p style={{
                fontFamily: "'JetBrains Mono',monospace",
                fontSize: "clamp(11px,1.3vw,13px)",
                color: "rgba(255,255,255,0.35)", lineHeight: 1.8,
              }}>
                5 coffees · 47 commits · 0 sleep hours<br />
                <span style={{ color: "rgba(0,255,136,0.6)" }}>
                  100% worth it. You are a developer. 🎉
                </span>
              </p>

              {/* achievement badges */}
              <div style={{
                display: "flex", gap: 10, justifyContent: "center",
                flexWrap: "wrap", marginTop: 20,
              }}>
                {[
                  "🏆 Deadline Survivor",
                  "☕ Coffee Addict",
                  "🔥 Crisis Manager",
                  "🚀 Shipped It",
                ].map((badge, i) => (
                  <span key={i} style={{
                    fontFamily: "'JetBrains Mono',monospace", fontSize: 11,
                    color: "rgba(0,255,136,0.8)",
                    background: "rgba(0,255,136,0.08)",
                    border: "1px solid rgba(0,255,136,0.2)",
                    borderRadius: 100, padding: "5px 14px",
                    animation: `fadeSlideUp 0.5s ${0.3 + i * 0.1}s ease both`,
                  }}>{badge}</span>
                ))}
              </div>
            </div>
          )}

          {/* ── SCROLL HINT ── */}
          {phase === "idle" && (
            <div className="flex flex-col items-center gap-2 mt-4">
              <span style={{
                fontFamily: "'JetBrains Mono',monospace", fontSize: 9,
                letterSpacing: "0.28em", color: "rgba(255,255,255,0.15)",
                textTransform: "uppercase",
              }}>scroll to feel the pressure</span>
              <div style={{
                width: 1, height: 36,
                background: "linear-gradient(to bottom,rgba(255,107,53,0.3),transparent)",
              }} />
            </div>
          )}
        </div>
      </section>
    </>
  );
}
