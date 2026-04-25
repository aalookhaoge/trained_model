const FeaturesCards = () => (
  <section className="features-section">
    <div className="features-grid">
      {/* Card 1 */}
      <div className="feature-card fade-up">
        <div className="f-icon">
          <svg fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
          </svg>
        </div>
        <h3>Sentence<br />Synthesis</h3>
        <p>Using Chain Buffering, we move beyond word-level detection to construct grammatically natural sentences.</p>
        <div className="feature-visual">
          <div className="api-visual">
            <div className="api-brands">
              <div className="api-brand">🍎</div>
              <div className="api-brand">↗</div>
              <div className="api-brand">🛒</div>
              <div className="api-brand">⌘</div>
              <div className="api-brand">✦</div>
              <div className="api-brand">⚡</div>
            </div>
            <svg className="api-tree-svg" id="apiTree" viewBox="0 0 260 80" fill="none">
              <line x1="22" y1="0" x2="130" y2="75" />
              <line x1="70" y1="0" x2="130" y2="75" />
              <line x1="118" y1="0" x2="130" y2="75" />
              <line x1="166" y1="0" x2="130" y2="75" />
              <line x1="214" y1="0" x2="130" y2="75" />
              <line x1="238" y1="0" x2="130" y2="75" />
            </svg>
            <div className="api-bottom-icon">
              <svg fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2 */}
      <div className="feature-card fade-up">
        <div className="f-icon">
          <svg fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
          </svg>
        </div>
        <h3>Expression<br />Mapping</h3>
        <p>Our system analyzes facial blendshapes. A raised eyebrow converts a statement into a question, respecting true ISL grammar.</p>
        <div className="feature-visual">
          <div className="auth-panel">
            <div className="auth-row">
              {["Intelligent","Cognitive","Data Analysis","Infrastructure","Intelligent","Cognitive","Data Analysis","Infrastructure"].map((t,i)=>(
                <span className="auth-tag" key={i}>{t}</span>
              ))}
            </div>
            <div className="auth-row reverse">
              {["Infrastructure","Capabilities","Intelligent","Chatbots","Infrastructure","Capabilities","Intelligent","Chatbots"].map((t,i)=>(
                <span className="auth-tag" key={i}>{t}</span>
              ))}
            </div>
            <div className="auth-row">
              {["Data Analysis","Cognitive","Infrastructure","Intelligent","Data Analysis","Cognitive","Infrastructure","Intelligent"].map((t,i)=>(
                <span className="auth-tag" key={i}>{t}</span>
              ))}
            </div>
            <div className="auth-center">
              <svg fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Card 3 */}
      <div className="feature-card fade-up">
        <div className="f-icon">
          <svg fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
            <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
            <path d="M19 10v2a7 7 0 01-14 0v-2" />
            <line x1="12" y1="19" x2="12" y2="23" />
            <line x1="8" y1="23" x2="16" y2="23" />
          </svg>
        </div>
        <h3>Zero-Server<br />Privacy</h3>
        <p>We use landmark geometry, not heavy ML. It runs 100% offline in-browser on any low-end laptop in rural clinics.</p>
        <div className="feature-visual" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div className="speech-visual">
            <span className="speech-label">Speech Recognition</span>
            <div className="speech-bar">
              <div className="mic">
                <svg fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z" />
                  <path d="M19 10v2a7 7 0 01-14 0v-2" />
                  <line x1="12" y1="19" x2="12" y2="23" />
                </svg>
              </div>
              <div className="waveform" id="waveform"></div>
              <div className="cursor-icon">
                <svg fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div className="features-small-grid">
      <div className="feat-small fade-up"><div className="feat-small-icon">⏱</div><h4>Symptom Memory</h4><p>Auto-logs symptoms like "Stomach Pain" into a running record.</p></div>
      <div className="feat-small fade-up"><div className="feat-small-icon">👁</div><h4>Bidirectional Loop</h4><p>Doctors speak, and text appears for patients instantly.</p></div>
      <div className="feat-small fade-up"><div className="feat-small-icon">✦</div><h4>Minimalist UI</h4><p>No avatars needed. Clean split-screen designed for high stress.</p></div>
      <div className="feat-small fade-up"><div className="feat-small-icon">📈</div><h4>Stability Filter</h4><p>Prevents false positives from transitional hand shapes.</p></div>
    </div>
  </section>
);

export default FeaturesCards;
