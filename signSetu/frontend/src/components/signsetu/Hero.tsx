import { Link } from "react-router-dom";

const Hero = () => (
  <section className="hero" id="hero">
    <div className="hero-badge fade-up">
      <span className="badge-year">2026</span>
      The Future of Inclusive Healthcare
    </div>
    <h1 className="fade-up" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <span style={{ marginBottom: 4 }}>Bridging the</span>
      <span className="animated-hero-words">
        <span className="anim-word">18-Million</span>
        <span className="anim-word">deaf</span>
        <span className="anim-word">Unheard</span>
        <span className="anim-word">voiceless</span>
      </span>
      <span style={{ marginTop: 4 }}>Person Silence.</span>
    </h1>
    <p className="hero-sub fade-up">
      Enabling seamless communication between doctors and deaf.<br />
      Faster diagnosis. Better care. Inclusive healthcare.
    </p>
    <Link to="/clinic" className="btn-liquid fade-up">
      <div className="liquid-bg"></div>
      <div className="liquid-glass"></div>
      <span className="liquid-text">Launch Clinic Interface</span>
    </Link>
    <div style={{ margin: "16px 0", color: "rgba(255,255,255,0.2)" }}>—————————————</div>
    <button className="btn btn-secondary fade-up">Watch Our Mission</button>
    <div className="hero-glow"></div>
  </section>
);

export default Hero;
