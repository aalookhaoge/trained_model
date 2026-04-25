const About = () => (
  <section className="about" id="about">
    <div className="section-badge fade-up">
      <span className="dot">
        <svg fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M12 10a2 2 0 100-4 2 2 0 000 4z" />
          <path d="M19.07 4.93a10 10 0 010 14.14M4.93 19.07a10 10 0 010-14.14" />
        </svg>
      </span>
      The Communication Asymmetry
    </div>
    <p
      className="about-text"
      id="about-text"
      data-text="India has 18 million hearing impaired individuals but only 250 certified interpreters. In a hospital, the patient knows their symptoms and the doctor knows the cure, but the information cannot flow. We built the technological infrastructure to close that gap."
    ></p>
    <button className="btn-purple fade-up">View Architecture</button>
  </section>
);

export default About;
