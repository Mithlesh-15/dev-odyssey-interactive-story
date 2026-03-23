import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";
import Hero from "./sections/Hero";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <LoadingScreen onFinish={() => setLoading(false)} />
      ) : (
        <Hero />
      )}
    </>
  );
}

export default App;