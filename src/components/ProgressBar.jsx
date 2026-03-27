export default function ProgressBar({ progress }) {
  return (
    <div
      className="fixed top-0 left-0 w-full z-9999 pointer-events-none"
      style={{ height: "3px", background: "rgba(255,255,255,0.04)" }}
    >
      {/* glow layer */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, #00ff88, #38bdf8, #a78bfa, #ff6b35, #f7df1e)",
          filter: "blur(5px)",
          opacity: 0.5,
          transition: "width 0.25s ease",
        }}
      />

      <div
        style={{
          height: "3px",
          width: `${progress}%`,
          background:
            "linear-gradient(90deg, #00ff88 0%, #38bdf8 28%, #a78bfa 54%, #ff6b35 76%, #f7df1e 100%)",
          boxShadow:
            "0 0 8px rgba(0,255,136,0.65), 0 0 3px rgba(56,189,248,0.4)",
          transition: "width 0.25s ease",
          position: "relative",
        }}
      />
    </div>
  );
}