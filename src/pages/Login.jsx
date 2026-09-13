import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { supabase } from "../supabaseClient.js";

export default function Login() {
  const navigate = useNavigate();
  const [fatherName, setFatherName] = useState("");
  const [mobileNo, setMobileNo] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { data, error: queryError } = await supabase
      .from("students")
      .select("*")
      .eq("mobile_no", mobileNo)
      .ilike("father_name", fatherName.trim())
      .maybeSingle();

    setLoading(false);

    if (queryError || !data) {
      setError("No account found with this father's name and mobile number.");
      return;
    }

    localStorage.setItem("b2c_student", JSON.stringify(data));
    navigate("/dashboard");
  };

  return (
    <div className="shell">
      <Header />
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Father's Name</label>
            <input
              required
              value={fatherName}
              onChange={(e) => setFatherName(e.target.value)}
            />
          </div>
          <div className="field">
            <label>Mobile Number</label>
            <input
              required
              inputMode="numeric"
              maxLength={10}
              value={mobileNo}
              onChange={(e) => setMobileNo(e.target.value)}
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="primary" disabled={loading} type="submit">
            {loading ? "Checking..." : "Login"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 16 }}>
          New here? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}
