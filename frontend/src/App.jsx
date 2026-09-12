import { useState } from "react";
import "./App.css";

function App() {
  const [status, setStatus] = useState("System Ready");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const simulateAccident = async () => {
    setLoading(true);
    setStatus("Analyzing sensor data...");
    setResult(null);

    const emergencyData = {
      user_id: 101,
      speed_before: 65,
      speed_after: 3,
      acceleration: 8.2,
      latitude: 26.5123,
      longitude: 80.2329,
    };

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/emergency/detect",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(emergencyData),
        }
      );

      if (!response.ok) {
        throw new Error("Backend request failed");
      }

      const data = await response.json();

      setResult(data);

      if (data.status === "possible_accident") {
        setStatus("⚠️ Possible Accident Detected");
      } else {
        setStatus("✅ No Emergency Detected");
      }
    } catch (error) {
      console.error(error);
      setStatus("❌ Backend connection failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div>
          <h1>EmergeSense AI</h1>
          <p>Autonomous Emergency Response System</p>
        </div>

        <div className="system-status">
          🟢 System Online
        </div>
      </header>

      {/* Main Dashboard */}
      <main className="dashboard">

        {/* Emergency Detection Card */}
        <section className="card">

          <h2>Emergency Detection</h2>

          <p className="description">
            Simulate vehicle sensor data to test the accident
            detection system.
          </p>

          <div className="sensor-grid">

            <div className="sensor">
              <span>Speed Before</span>
              <strong>65 km/h</strong>
            </div>

            <div className="sensor">
              <span>Speed After</span>
              <strong>3 km/h</strong>
            </div>

            <div className="sensor">
              <span>Acceleration</span>
              <strong>8.2 m/s²</strong>
            </div>

            <div className="sensor">
              <span>Location</span>
              <strong>26.5123, 80.2329</strong>
            </div>

          </div>

          <button
            className="emergency-button"
            onClick={simulateAccident}
            disabled={loading}
          >
            {loading
              ? "Analyzing..."
              : "🚨 Simulate Accident"}
          </button>

        </section>

        {/* Status Card */}
        <section className="card">

          <h2>Detection Status</h2>

          <div className="status-box">
            {status}
          </div>

          {result && (
            <div className="result">

              <p>
                <strong>Status:</strong>{" "}
                {result.status}
              </p>

              <p>
                <strong>Message:</strong>{" "}
                {result.message}
              </p>

              <p>
                <strong>Speed Drop:</strong>{" "}
                {result.speed_drop} km/h
              </p>

              <p>
                <strong>Location:</strong>{" "}
                {result.location.latitude},{" "}
                {result.location.longitude}
              </p>

            </div>
          )}

        </section>

      </main>

    </div>
  );
}

export default App;