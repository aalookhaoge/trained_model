const data = [
  { stars: "★★★★★", quote: "SignSetu made communication with patients much easier during my hospital internship.", name: "Neha Patel", role: "CTO, DataFlow Inc" },
  { stars: "★★★★",  quote: "I really liked how fast and accurate the sign detection is, it feels very helpful.", name: "Saurabh Mishra", role: "VP Ops, Nexus" },
  { stars: "★★★★★", quote: "This is a great initiative, especially for improving accessibility in healthcare.", name: "Priya Singh", role: "CEO, FinScale" },
  { stars: "★★★★",  quote: "The interface is simple and easy to use, even for someone using it for the first time.", name: "Anjali Verma", role: "Founder, CloudMesh" },
  { stars: "★★★",   quote: "It can truly make a difference in emergency situations where communication is critical.", name: "Abhineet Sharma", role: "COO, LogiTech Pro" },
  { stars: "★★★★★", quote: "With some more improvements, this can become a must-have tool in public places.", name: "Mohit Tyagi", role: "Director, Innovate Labs" },
];

const Testimonials = () => (
  <section className="testimonials" id="testimonials">
    <div className="section-badge fade-up">
      <span className="dot">
        <svg fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
        </svg>
      </span>
      Testimonials
    </div>
    <h2 className="fade-up" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 20 }}>
      What Our Clients Say
    </h2>
    <p className="features-sub fade-up">Trusted by industry leaders worldwide.</p>
    <div className="test-grid">
      {data.map((t, i) => (
        <div className="test-card fade-up" key={i}>
          <div className="test-stars">{t.stars}</div>
          <blockquote>"{t.quote}"</blockquote>
          <div className="test-author">
            <div className="test-avatar"></div>
            <div>
              <h4>{t.name}</h4>
              <span>{t.role}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Testimonials;
