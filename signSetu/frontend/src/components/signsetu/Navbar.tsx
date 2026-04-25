const Navbar = () => (
  <nav className="navbar" id="navbar">
    <div className="nav-logo">
      <div className="nav-logo-icon">✦</div>
      SignSetu
    </div>
    <ul className="nav-links">
      <li><a href="#hero">Home</a></li>
      <li><a href="#about">About</a></li>
      <li><a href="#features">Features</a></li>
      <li><a href="#services">Services</a></li>
      <li><a href="#contact">Contact</a></li>
      <li><a href="#faq">FAQ</a></li>
    </ul>
    <button className="nav-cta" id="nav-cta">Launch Interface</button>
  </nav>
);

export default Navbar;
