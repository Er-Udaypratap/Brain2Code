import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import { supabase } from "../supabaseClient.js";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    father_name: "",
    branch: "",
    mobile_no: "",
    language: "python",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const update = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!/^\d{10}$/.test(form.mobile_no)) {
      setError("Mobile number must be exactly 10 digits.");
      return;
    }

    setLoading(true);

    // Prevent duplicate signup on the same mobile number
    const { data: existing } = await supabase
      .from("students")
      .select("id")
      .eq("mobile_no", form.mobile_no)
      .maybeSingle();

    if (existing) {
      setError("This mobile number is already registered. Please login instead.");
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from("students").insert([
      {
        name: form.name,
        father_name: form.father_name,
        branch: form.branch,
        mobile_no: form.mobile_no,
        language: form.language,
      },
    ]);

    setLoading(false);

    if (insertError) {
      setError(insertError.message);
      return;
    }

    navigate("/login");
  };

  return (
    <div className="shell">
      <Header />
      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="field">
            <label>Full Name</label>
            <input required value={form.name} onChange={update("name")} />
          </div>
          <div className="field">
            <label>Father's Name</label>
            <input
              required
              value={form.father_name}
              onChange={update("father_name")}
            />
          </div>
          <div className="field">
            <label>Branch</label>
            <input required value={form.branch} onChange={update("branch")} />
          </div>
          <div className="field">
            <label>Mobile Number</label>
            <input
              required
              inputMode="numeric"
              maxLength={10}
              value={form.mobile_no}
              onChange={update("mobile_no")}
            />
          </div>
          <div className="field">
            <label>Preferred Language (fixed for both rounds)</label>
            <select value={form.language} onChange={update("language")}>
              <option value="c">C</option>
              <option value="java">Java</option>
              <option value="python">Python</option>
            </select>
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="primary" disabled={loading} type="submit">
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>
        <p className="muted" style={{ marginTop: 16 }}>
          Already registered? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
}
