import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Hero from "./sections/Hero";
import LearningSection from "./sections/Learning";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <LoadingScreen onFinish={() => setLoading(false)} />
      ) : (<>
        <Hero />
        <LearningSection />
        </>
      )}
    </>
  );
}

export default App;