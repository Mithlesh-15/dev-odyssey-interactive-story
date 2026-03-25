import { useState, useEffect } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Hero from "./sections/Hero";
import LearningSection from "./sections/Learning";
import DebuggingSection from "./sections/Debugging";
import DeadlineSection from "./sections/Deadline";
import ConclusionSection from "./sections/Conclusion";

function App() {
  const [loading, setLoading] = useState(true);
  const [showLearning, setShowLearning] = useState(false);

  // ✅ scroll AFTER render
  useEffect(() => {
    if (showLearning) {
      setTimeout(() => {
        document.getElementById("learning-section")?.scrollIntoView({
          behavior: "smooth",
        });
      }, 100); // small delay for DOM render
    }
  }, [showLearning]);

  return (
    <>
      {loading ? (
        <LoadingScreen onFinish={() => setLoading(false)} />
      ) : (
        <>
          <Hero onStart={() => setShowLearning(true)} />

          {showLearning && <><LearningSection />
          <DebuggingSection />
          <DeadlineSection />
          <ConclusionSection />
          </>}
        </>
      )}
    </>
  );
}

export default App;