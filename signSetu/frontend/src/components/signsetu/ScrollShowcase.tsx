const ScrollShowcase = () => (
  <section className="container-scroll-animation" id="scroll-animation">
    <div className="scroll-container-inner" id="scroll-container">
      <div className="scroll-header">
        <h2 style={{ fontSize: "clamp(32px, 4vw, 48px)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 20, color: "#fff" }}>
          Unleash the power of <br />
          <span style={{ color: "#7c3aed", fontSize: "clamp(48px, 6vw, 80px)" }}>Visual Diagnostics</span>
        </h2>
      </div>
      <div className="scroll-card" id="scroll-card">
        <div className="scroll-card-content">
          <img
            src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1400&q=80"
            alt="Clinical Interface"
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    </div>
  </section>
);

export default ScrollShowcase;
