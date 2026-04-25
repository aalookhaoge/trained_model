import type { ReactNode, CSSProperties } from "react";

type Service = {
  icon: ReactNode;
  title: string;
  sub: string;
  desc: string;
  bg: string;
  emoji: string;
};

const services: Service[] = [
  {
    icon: <svg fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    title: "Emergency Triage", sub: "Immediate Context",
    desc: "Allows triage nurses to understand the location and severity of pain immediately.",
    bg: "linear-gradient(135deg,#1a1a2e,#2d1b4e,#1a3a2e)", emoji: "🏛",
  },
  {
    icon: <svg fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    title: "Routine Checkups", sub: "Clear Flow",
    desc: "Facilitates standard symptom tracking without relying on a literate family member.",
    bg: "linear-gradient(135deg,#2a1a0e,#4a2a1e)", emoji: "🚗",
  },
  {
    icon: <svg fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    title: "Rural Diagnostics", sub: "Offline Ready",
    desc: "Works flawlessly in 1.5 lakh health centers where internet is unstable.",
    bg: "linear-gradient(135deg,#0a1a2e,#1a2a3e)", emoji: "🌊",
  },
  {
    icon: <svg fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    title: "Prescription Explanation", sub: "Doctor to Patient",
    desc: "Allows doctors to dictate dosage instructions that appear clearly for the patient.",
    bg: "linear-gradient(135deg,#1a1a1a,#2a1a2e)", emoji: "🕶",
  },
  {
    icon: <svg fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/></svg>,
    title: "Consent Forms", sub: "Accessibility First",
    desc: "Guides patients through consent processes visually and interactively.",
    bg: "linear-gradient(135deg,#1a1a1a,#2a2a2a)", emoji: "🏗",
  },
  {
    icon: <svg fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/></svg>,
    title: "Follow-up Care", sub: "Continuity",
    desc: "Enables post-discharge communication without interpreter dependency.",
    bg: "linear-gradient(135deg,#0a1a2e,#1a1a1a)", emoji: "🚙",
  },
  {
    icon: <svg fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/></svg>,
    title: "Emergency Triage", sub: "Immediate Context",
    desc: "Allows triage nurses to understand the location and severity of pain immediately.",
    bg: "linear-gradient(135deg,#1a1a2e,#2d1b4e,#1a3a2e)", emoji: "🏛",
  },
  {
    icon: <svg fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/></svg>,
    title: "Routine Checkups", sub: "Clear Flow",
    desc: "Facilitates standard symptom tracking without relying on a literate family member.",
    bg: "linear-gradient(135deg,#2a1a0e,#4a2a1e)", emoji: "🚗",
  },
  {
    icon: <svg fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>,
    title: "Rural Diagnostics", sub: "Offline Ready",
    desc: "Works flawlessly in 1.5 lakh health centers where internet is unstable.",
    bg: "linear-gradient(135deg,#0a1a2e,#1a2a3e)", emoji: "🌊",
  },
  {
    icon: <svg fill="none" stroke="#fff" strokeWidth="2" viewBox="0 0 24 24"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
    title: "Prescription Explanation", sub: "Doctor to Patient",
    desc: "Allows doctors to dictate dosage instructions that appear clearly for the patient.",
    bg: "linear-gradient(135deg,#1a1a1a,#2a1a2e)", emoji: "🕶",
  },
];

const Services = () => (
  <section className="services" id="services">
    <div className="services-rays"></div>
    <div className="services-header">
      <div className="section-badge fade-up">
        <span className="dot">
          <svg fill="none" stroke="#fff" strokeWidth="2.5" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="3" />
            <path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83" />
          </svg>
        </span>
        Clinical Impact
      </div>
      <h2 className="fade-up">Bridging Information Gaps in<br /><span className="grey">Life-Critical Situations</span></h2>
      <p className="services-sub fade-up">Solving the communication infrastructure failure at the most critical possible moment.</p>
    </div>
    <div className="services-cards">
      {services.map((s, i) => (
        <div className="service-card fade-up" key={i}>
          <div className="service-card-head">
            <div className="service-icon">{s.icon}</div>
            <span className="service-arrow">↗</span>
          </div>
          <h3>{s.title}</h3>
          <div className="service-sub">{s.sub}</div>
          <p>{s.desc}</p>
          <div className="service-img" style={{ background: s.bg } as CSSProperties}>{s.emoji}</div>
        </div>
      ))}
    </div>
  </section>
);

export default Services;
