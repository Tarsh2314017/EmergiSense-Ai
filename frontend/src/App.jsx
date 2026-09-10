import { useEffect, useState } from "react";

function App() {
  const [backendStatus, setBackendStatus] = useState("Connecting...");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/health")
      .then((response) => {
        if (!response.ok) {
          throw new Error("Backend request failed");
        }

        return response.json();
      })
      .then((data) => {
        setBackendStatus(data.status);
      })
      .catch((error) => {
        console.error(error);
        setError("Unable to connect to FastAPI backend");
      });
  }, []);

  return (
    <div>
      <h1>EmergeSense AI</h1>

      <h2>System Status</h2>

      {error ? (
        <p>{error}</p>
      ) : (
        <p>Backend status: {backendStatus}</p>
      )}
    </div>
  );
}

export default App;