import { useState, useEffect, useCallback } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Hero from "./sections/Hero";
import LearningSection from "./sections/Learning";
import DebuggingSection from "./sections/Debugging";
import DeadlineSection from "./sections/Deadline";
import ConclusionSection from "./sections/Conclusion";

function App() {
  const [loading, setLoading] = useState(true);
  const [startJourney, setStartJourney] = useState(false);

  const [learningDone, setLearningDone] = useState(false);
  const [debuggingDone, setDebuggingDone] = useState(false);
  const [deadlineDone, setDeadlineDone] = useState(false);

  const scrollToId = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  const rafScroll = useCallback(
    (id) => {
      requestAnimationFrame(() => requestAnimationFrame(() => scrollToId(id)));
    },
    [scrollToId],
  );

  // scroll to learning
  useEffect(() => {
    if (startJourney) rafScroll("learning-section");
  }, [startJourney, rafScroll]);

  useEffect(() => {
    if (learningDone) rafScroll("debugging-section");
  }, [learningDone, rafScroll]);

  useEffect(() => {
    if (debuggingDone) rafScroll("deadline-section");
  }, [debuggingDone, rafScroll]);

  useEffect(() => {
    if (deadlineDone) rafScroll("conclusion-section");
  }, [deadlineDone, rafScroll]);

  return (
    <>
      {loading ? (
        <LoadingScreen onFinish={() => setLoading(false)} />
      ) : (
        <>
          <Hero onStart={() => setStartJourney(true)} />

          {startJourney && (
            <>
              <LearningSection onComplete={() => setLearningDone(true)} />

              {learningDone && (
                <DebuggingSection onComplete={() => setDebuggingDone(true)} />
              )}

              {debuggingDone && (
                <DeadlineSection onComplete={() => setDeadlineDone(true)} />
              )}

              {deadlineDone && (
                <ConclusionSection onComplete={() => {}} />
              )}
            </>
          )}
        </>
      )}
    </>
  );
}

export default App;
