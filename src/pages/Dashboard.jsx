import { useNavigate } from "react-router-dom";
import Header from "../components/Header.jsx";
import { ROUND_CONFIG } from "../data/questions.js";

function getStudent() {
  return JSON.parse(localStorage.getItem("b2c_student"));
}

export default function Dashboard() {
  const navigate = useNavigate();
  const student = getStudent();

  const round1Cleared = !!student?.round1_cleared;
  const round2Cleared = !!student?.round2_cleared;

  const handleLogout = () => {
    localStorage.removeItem("b2c_student");
    navigate("/");
  };

  return (
    <div className="shell">
      <Header />
      <div className="card" style={{ marginBottom: 20 }}>
        <p className="muted">
          {student?.name} · {student?.branch} · Language:{" "}
          {student?.language?.toUpperCase()}
        </p>
        <button className="secondary" onClick={handleLogout} style={{ marginTop: 10 }}>
          Logout
        </button>
      </div>

      <div className="round-grid">
        <div className="round-tile" onClick={() => navigate("/round/1")}>
          <h3>Round 1 {round1Cleared && "✓"}</h3>
          <p>
            3 questions · solve any {ROUND_CONFIG[1].requiredSolves} ·{" "}
            {ROUND_CONFIG[1].durationMinutes} min
          </p>
        </div>

        <div
          className={`round-tile ${!round1Cleared ? "locked" : ""}`}
          onClick={() => round1Cleared && navigate("/round/2")}
        >
          <h3>Round 2 {round2Cleared && "✓"}</h3>
          <p>
            2 questions · solve any {ROUND_CONFIG[2].requiredSolves} ·{" "}
            {ROUND_CONFIG[2].durationMinutes} min
          </p>
          {!round1Cleared && (
            <p style={{ color: "var(--red)" }}>
              Clear Round 1 first to unlock
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
