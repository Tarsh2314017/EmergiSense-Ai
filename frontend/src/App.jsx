import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [status, setStatus] = useState("System Ready");
  const [result, setResult] = useState(null);

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [countdown, setCountdown] = useState(30);

  const [loading, setLoading] = useState(false);

  // --------------------------------------------------
  // Simulate accident
  // --------------------------------------------------

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
        throw new Error("Detection request failed");
      }

      const data = await response.json();

      setResult(data);

      if (data.status === "possible_accident") {
        setStatus("⚠️ Possible Accident Detected");
        setShowConfirmation(true);
        setCountdown(30);
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

  // --------------------------------------------------
  // Countdown
  // --------------------------------------------------

  useEffect(() => {
    if (!showConfirmation) {
      return;
    }

    if (countdown <= 0) {
      confirmEmergency();
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((previous) => previous - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [showConfirmation, countdown]);

  // --------------------------------------------------
  // User confirms emergency
  // --------------------------------------------------

  const confirmEmergency = async () => {
    setShowConfirmation(false);
    setStatus("🚨 Emergency Confirmed");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/emergency/confirm?user_id=101",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setResult((previous) => ({
        ...previous,
        ...data,
      }));
    } catch (error) {
      console.error(error);
      setStatus("❌ Unable to confirm emergency");
    }
  };

  // --------------------------------------------------
  // User says they are safe
  // --------------------------------------------------

  const cancelEmergency = async () => {
    setShowConfirmation(false);
    setStatus("✅ Emergency Cancelled");

    try {
      const response = await fetch(
        "http://127.0.0.1:8000/api/emergency/cancel?user_id=101",
        {
          method: "POST",
        }
      );

      const data = await response.json();

      setResult((previous) => ({
        ...previous,
        ...data,
      }));
    } catch (error) {
      console.error(error);
      setStatus("❌ Unable to cancel emergency");
    }
  };

  return (
    <div className="app">

      {/* Header */}
      <header className="header">
        <div>
          <h1>EmergeSense AI</h1>

          <p>
            Autonomous Emergency Response System
          </p>
        </div>

        <div className="system-status">
          🟢 System Online
        </div>
      </header>

      {/* Dashboard */}
      <main className="dashboard">

        {/* Detection Card */}
        <section className="card">

          <h2>Emergency Detection</h2>

          <p className="description">
            Simulate vehicle sensor data to test accident
            detection.
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
            disabled={loading || showConfirmation}
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
                {result.speed_drop ?? "-"} km/h
              </p>

              {result.location && (
                <p>
                  <strong>Location:</strong>{" "}
                  {result.location.latitude},{" "}
                  {result.location.longitude}
                </p>
              )}

            </div>
          )}

        </section>

      </main>

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="modal-overlay">

          <div className="confirmation-modal">

            <div className="warning-icon">
              🚨
            </div>

            <h2>
              Possible Accident Detected
            </h2>

            <p>
              We detected an abnormal change in
              vehicle movement.
            </p>

            <h3>
              Are you safe?
            </h3>

            <div className="countdown">
              {countdown}
            </div>

            <p className="countdown-text">
              Emergency response will start
              automatically if there is no response.
            </p>

            <div className="confirmation-buttons">

              <button
                className="safe-button"
                onClick={cancelEmergency}
              >
                ✅ I'm Safe
              </button>

              <button
                className="help-button"
                onClick={confirmEmergency}
              >
                🚑 Send Help
              </button>

            </div>

          </div>

        </div>
      )}

    </div>
  );
}

export default App;