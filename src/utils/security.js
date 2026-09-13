// Judge0 CE language IDs
export const LANGUAGE_IDS = {
  c: 50, // C (GCC 9.2.0)
  java: 62, // Java (OpenJDK 13.0.1)
  python: 71, // Python (3.8.1)
};

const JUDGE0_URL = import.meta.env.VITE_JUDGE0_URL;
const JUDGE0_KEY = import.meta.env.VITE_JUDGE0_KEY;
const JUDGE0_HOST = import.meta.env.VITE_JUDGE0_HOST;

async function submitOne(sourceCode, languageId, stdin) {
  const res = await fetch(
    `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-RapidAPI-Key": JUDGE0_KEY,
        "X-RapidAPI-Host": JUDGE0_HOST,
      },
      body: JSON.stringify({
        source_code: sourceCode,
        language_id: languageId,
        stdin: stdin,
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Judge0 request failed: ${res.status}`);
  }

  return res.json();
}

// Runs code against every testcase for a question and returns a verdict.
export async function runAgainstTestcases(sourceCode, language, testcases) {
  const languageId = LANGUAGE_IDS[language];
  const results = [];

  for (const tc of testcases) {
    const result = await submitOne(sourceCode, languageId, tc.input);
    const actual = (result.stdout || "").trim();
    const expected = tc.output.trim();
    const passed = actual === expected && !result.stderr && !result.compile_output;

    results.push({
      input: tc.input,
      expected,
      actual,
      passed,
      stderr: result.stderr,
      compile_output: result.compile_output,
      status: result.status?.description,
    });

    // Stop early on compile error — same for every testcase
    if (result.compile_output) break;
  }

  const allPassed = results.length === testcases.length && results.every((r) => r.passed);
  return { allPassed, results };
}
