const members = ["Annu Upadhyay", "Rishav Sharma", "Abhinav Singh", "Aditya Kumar"];

const Team = () => (
  <section className="team" id="team">
    <div className="section-badge fade-up">
      <span className="dot">
        <svg fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
        </svg>
      </span>
      Our Team
    </div>
    <h2 className="fade-up" style={{ fontSize: "clamp(32px,4vw,48px)", fontWeight: 800, letterSpacing: "-1.5px", marginBottom: 20 }}>
      Meet the Minds Behind SignSetu
    </h2>
    <p className="features-sub fade-up">A world-class team of engineers, designers, and AI researchers.</p>
    <div className="team-grid">
      <div></div>
      {members.map((name) => (
        <div className="team-card fade-up" key={name}>
          <div className="team-avatar">👤</div>
          <h4>{name}</h4>
          <span></span>
        </div>
      ))}
      <div></div>
    </div>
  </section>
);

export default Team;
