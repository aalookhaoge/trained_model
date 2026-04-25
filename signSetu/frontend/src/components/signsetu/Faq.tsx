import { useState } from "react";

const items = [
  { q: "Does it require a special camera?", a: "No. It runs on any standard 720p webcam using MediaPipe landmarking." },
  { q: "How do you handle different regional dialects?", a: "Our Template Matcher separates the logic from the output, allowing us to swap language files without changing the core code." },
  { q: "Is patient data stored or sent to a server?", a: "No. Everything is processed locally on the device to ensure medical privacy. No data leaves the device." },
  { q: "How does SignSetu work?", a: "It uses a camera and machine learning models to detect hand gestures and convert them into meaningful output." },
  { q: "Where can SignSetu be used?", a: "It is especially useful in hospitals, public services, and everyday conversations." },
  { q: "Does SignSetu require internet connectivity?", a: "It can work both online and offline depending on the model deployment." },
];

const Faq = () => {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="faq" id="faq">
      <div className="section-badge fade-up">
        <span className="dot">
          <svg fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" />
            <path d="M9.09 9a3 3 0 015.83 1c0 2-3 3-3 3" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </span>
        FAQ
      </div>
      <h2 className="fade-up">Frequently Asked Questions</h2>
      <p className="features-sub fade-up">Everything you need to know about SignSetu.</p>
      <div className="faq-list fade-up">
        {items.map((it, i) => (
          <div className={`faq-item${open === i ? " open" : ""}`} key={i}>
            <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
              {it.q}
              <span className="icon">+</span>
            </button>
            <div className="faq-a"><p>{it.a}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Faq;
