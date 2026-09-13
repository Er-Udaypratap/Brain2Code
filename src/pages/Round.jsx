import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Header from "../components/Header.jsx";
import Timer from "../components/Timer.jsx";
import { questions, ROUND_CONFIG } from "../data/questions.js";
import { runAgainstTestcases } from "../utils/judge0.js";
import { enableExamSecurity } from "../utils/security.js";
import { supabase } from "../supabaseClient.js";

function getStudent() {
  return JSON.parse(localStorage.getItem("b2c_student"));
}

export default function Round() {
  const { roundId } = useParams();
  const round = Number(roundId);
  const navigate = useNavigate();
  const student = getStudent();
  const config = ROUND_CONFIG[round];

  const roundQuestions = useMemo(
    () => questions.filter((q) => q.round === round),
    [round]
  );

  const [activeId, setActiveId] = useState(roundQuestions[0]?.id);
  const [codeByQuestion, setCodeByQuestion] = useState(() => {
    const init = {};
    roundQuestions.forEach((q) => {
      init[q.id] = q.starter[student?.language] || "";
    });
    return init;
  });
  const [solved, setSolved] = useState(new Set());
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState(null);
  const [expired, setExpired] = useState(false);
  const [violations, setViolations] = useState(0);
  const cleanupRef = useRef(null);

  const activeQuestion = roundQuestions.find((q) => q.id === activeId);

  // Guard: round 2 requires round 1 cleared
  useEffect(() => {
    if (round === 2 && !student?.round1_cleared) {
      navigate("/dashboard");
    }
  }, [round, student, navigate]);

  // Security: copy/paste block + tab-switch detection
  useEffect(() => {
    cleanupRef.current = enableExamSecurity({
      onViolation: () => setViolations((v) => v + 1),
    });
    return () => cleanupRef.current?.();
  }, []);

  const handleExpire = () => setExpired(true);

  const markSolved = async (questionId) => {
    const updated = new Set(solved);
    updated.add(questionId);
    setSolved(updated);

    if (updated.size >= config.requiredSolves) {
      const field = round === 1 ? "round1_cleared" : "round2_cleared";
      await supabase
        .from("students")
        .update({ [field]: true })
        .eq("id", student.id);

      const newStudent = { ...student, [field]: true };
      localStorage.setItem("b2c_student", JSON.stringify(newStudent));
    }
  };

  const handleRun = async () => {
    if (expired || !activeQuestion) return;
    setRunning(true);
    setResult(null);

    try {
      const { allPassed, results } = await runAgainstTestcases(
        codeByQuestion[activeId],
        student.language,
        activeQuestion.testcases
      );

      setResult({ allPassed, results });

      // Log submission (fire and forget)
      supabase.from("submissions").insert([
        {
          student_id: student.id,
          question_id: activeId,
          round,
          code: codeByQuestion[activeId],
          language: student.language,
          passed: allPassed,
        },
      ]);

      if (allPassed) {
        markSolved(activeId);
      }
    } catch (err) {
      setResult({ allPassed: false, error: err.message });
    } finally {
      setRunning(false);
    }
  };

  const cleared = solved.size >= config.requiredSolves;

  return (
    <div className="shell">
      <Header />

      <div className="card">
        <div className="question-header">
          <span className="muted">
            ROUND {round} · SOLVE ANY {config.requiredSolves} OF{" "}
            {roundQuestions.length}
          </span>
          {!expired && !cleared && (
            <Timer durationMinutes={config.durationMinutes} onExpire={handleExpire} />
          )}
        </div>

        <div className="question-list">
          {roundQuestions.map((q) => (
            <span
              key={q.id}
              className={`question-pill ${solved.has(q.id) ? "solved" : ""} ${
                activeId === q.id ? "active" : ""
              }`}
              onClick={() => {
                setActiveId(q.id);
                setResult(null);
              }}
            >
              {q.title} {solved.has(q.id) && "✓"}
            </span>
          ))}
        </div>

        {expired && !cleared && (
          <p className="error-text">
            Time is up. You solved {solved.size} of {config.requiredSolves} required
            question(s).
          </p>
        )}

        {cleared && (
          <div style={{ marginBottom: 16 }}>
            <p style={{ color: "var(--green)", fontFamily: "var(--mono)" }}>
              Round {round} cleared ✓
            </p>
            <Link to="/dashboard">
              <button className="primary">Back to Dashboard</button>
            </Link>
          </div>
        )}

        {activeQuestion && !cleared && (
          <>
            <h3>{activeQuestion.title}</h3>
            <p className="muted">{activeQuestion.description}</p>
            <p className="muted">
              Sample input: {activeQuestion.sample_input} → Sample output:{" "}
              {activeQuestion.sample_output}
            </p>

            <textarea
              className="code-editor"
              value={codeByQuestion[activeId]}
              onChange={(e) =>
                setCodeByQuestion((c) => ({ ...c, [activeId]: e.target.value }))
              }
              spellCheck={false}
              disabled={expired}
            />

            <button
              className="primary"
              style={{ marginTop: 12 }}
              onClick={handleRun}
              disabled={running || expired}
            >
              {running ? "Running..." : "Submit"}
            </button>

            {result && (
              <div className={`result-block ${result.allPassed ? "pass" : "fail"}`}>
                {result.error && `Error: ${result.error}\n`}
                {result.results?.map((r, i) => (
                  <div key={i}>
                    Test {i + 1}: {r.passed ? "PASS" : "FAIL"}
                    {!r.passed &&
                      ` (expected "${r.expected}", got "${r.actual}"${
                        r.compile_output ? ", compile error" : ""
                      })`}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {violations > 0 && (
          <p className="error-text" style={{ marginTop: 16 }}>
            ⚠ {violations} suspicious action(s) detected (copy/paste or tab
            switch). This is being logged.
          </p>
        )}
      </div>
    </div>
  );
}
