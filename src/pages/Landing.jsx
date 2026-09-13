import { Link } from "react-router-dom";
import Header from "../components/Header.jsx";

export default function Landing() {
  return (
    <div className="shell">
      <Header />
      <div className="card">
        <p className="muted" style={{ marginBottom: 20 }}>
          Two rounds. Solve, submit, move forward. Round 1 unlocks Round 2 —
          there is no going back.
        </p>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/signup">
            <button className="primary">Sign Up</button>
          </Link>
          <Link to="/login">
            <button className="secondary">Login</button>
          </Link>
        </div>
      </div>
    </div>
  );
}
