import { useState } from "react";
import LoadingScreen from "./components/LoadingScreen";

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading ? (
        <LoadingScreen onFinish={() => setLoading(false)} />
      ) : (
        <div className="bg-black text-white min-h-screen flex items-center justify-center">
          <h1 className="text-4xl font-bold">
            Welcome to Developer Journey 🚀
          </h1>
        </div>
      )}
    </>
  );
}

export default App;