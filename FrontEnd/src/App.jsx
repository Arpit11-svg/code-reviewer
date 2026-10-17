const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { useState, useRef } from "react";
import axios from "axios";
import Markdown from "react-markdown";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-python";
import "prismjs/components/prism-java";
import "prismjs/components/prism-c";
import "prismjs/components/prism-cpp";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-json";
import "prismjs/themes/prism-tomorrow.css";
import "./App.css";

import * as EditorModule from "react-simple-code-editor";
const Editor =
  EditorModule.default?.default ?? EditorModule.default ?? EditorModule;

const LANGUAGES = [
  { id: "javascript", label: "JavaScript" },
  { id: "typescript", label: "TypeScript" },
  { id: "python", label: "Python" },
  { id: "java", label: "Java" },
  { id: "c", label: "C" },
  { id: "cpp", label: "C++" },
];

const EXAMPLE = `function average(nums) {
  let sum = 0;
  for (let i = 0; i <= nums.length; i++) {
    sum += nums[i];
  }
  return sum / nums.length;
}`;

function highlight(text, lang) {
  const grammar = Prism.languages[lang];
  return grammar ? Prism.highlight(text, grammar, lang) : text;
}

// Renders fenced code in the review with syntax colours.
// Inline `code` and fences without a language fall through to a plain <code>.
function ReviewCode({ className, children }) {
  const match = /language-(\w+)/.exec(className || "");
  const text = String(children).replace(/\n$/, "");
  if (!match || !Prism.languages[match[1]]) return <code>{text}</code>;
  return (
    <code
      className={`language-${match[1]}`}
      dangerouslySetInnerHTML={{ __html: highlight(text, match[1]) }}
    />
  );
}

function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [review, setReview] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const reviewRef = useRef(null);

  const lineCount = code ? code.split("\n").length : 0;

  async function reviewCode() {
    if (!code.trim() || loading) return;
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(`${BACKEND_URL}/ai/get-review`, {
        code,
      });
      setReview(response.data);
      reviewRef.current?.scrollTo({ top: 0 });
    } catch (err) {
      setReview("");
      setError(
        err.response?.data?.message ||
          "Couldn't reach the review server, try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function copyReview() {
    try {
      await navigator.clipboard.writeText(review);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable, ignore */
    }
  }

  function handleKeyDown(e) {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      reviewCode();
    }
  }

  return (
    <div className="app">
      <header className="topbar">
        <h1>Code Review</h1>
        <p>Paste your code and get a short, prioritized review.</p>
      </header>

      <main>
        {/* Left: editor */}
        <section className="pane editor-pane" aria-label="Code editor">
          <div className="pane-bar">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              aria-label="Language"
            >
              {LANGUAGES.map((l) => (
                <option key={l.id} value={l.id}>
                  {l.label}
                </option>
              ))}
            </select>
            <div className="bar-actions">
              <button
                className="ghost"
                onClick={() => setCode(EXAMPLE)}
                disabled={loading}
              >
                Load example
              </button>
              <button
                className="ghost"
                onClick={() => {
                  setCode("");
                  setReview("");
                  setError("");
                }}
                disabled={loading || (!code && !review && !error)}
              >
                Clear
              </button>
            </div>
          </div>

          <div className="editor-scroll" onKeyDown={handleKeyDown}>
            <Editor
              value={code}
              onValueChange={setCode}
              highlight={(c) => highlight(c, language)}
              padding={16}
              placeholder="Paste or type your code here…"
              textareaId="code-input"
              className="editor"
              style={{
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontSize: 14,
                lineHeight: 1.6,
                minHeight: "100%",
              }}
            />
          </div>

          <div className="pane-footer">
            <span className="hint">
              {lineCount > 0
                ? `${lineCount} ${lineCount === 1 ? "line" : "lines"}`
                : "Ctrl + Enter to review"}
            </span>
            <button
              className="primary"
              onClick={reviewCode}
              disabled={!code.trim() || loading}
            >
              {loading ? "Reviewing…" : "Review code"}
            </button>
          </div>
        </section>

        {/* Right: review */}
        <section
          className="pane review-pane"
          aria-label="Review"
          aria-busy={loading}
        >
          <div className="pane-bar">
            <h2>Review</h2>
            {review && !loading && (
              <button className="ghost" onClick={copyReview}>
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>

          <div className="review-scroll" ref={reviewRef}>
            {loading ? (
              <div className="skeleton" role="status" aria-label="Reviewing">
                <span style={{ width: "40%" }} />
                <span style={{ width: "95%" }} />
                <span style={{ width: "88%" }} />
                <span style={{ width: "92%" }} />
                <span style={{ width: "60%" }} />
              </div>
            ) : error ? (
              <div className="notice error" role="alert">
                <strong>Review failed</strong>
                <p>{error}</p>
              </div>
            ) : review ? (
              <article className="markdown">
                <Markdown components={{ code: ReviewCode }}>{review}</Markdown>
              </article>
            ) : (
              <div className="empty">
                <h3>Your review will appear here</h3>
                <p>
                  Add code on the left, then select <b>Review code</b>. You’ll
                  get bugs, edge cases, and fixes, ordered by importance.
                </p>
              </div>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;
