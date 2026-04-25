const FeaturesOrbit = () => (
  <section className="features" id="features">
    <div className="orbit-scene" id="orbitScene">
      <div className="orbit-3d-wrap" id="orbit3d"></div>
      <div className="orbit-center-content">
        <div className="section-badge fade-up">
          <span className="dot">
            <svg fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
            </svg>
          </span>
          System Architecture
        </div>
        <h2 className="fade-up">Language, Not Gestures.</h2>
        <p className="features-sub fade-up">
          SignSetu is a parsing engine. It reads a sequence of inputs and constructs meaning the same way the brain processes thoughts.
        </p>
      </div>
    </div>
  </section>
);

export default FeaturesOrbit;
