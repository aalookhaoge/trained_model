import "@/styles/signsetu.css";
import { useSignSetuEffects } from "./useSignSetuEffects";
import Navbar from "./Navbar";
import Hero from "./Hero";
import Ticker from "./Ticker";
import ScrollShowcase from "./ScrollShowcase";
import About from "./About";
import FeaturesOrbit from "./FeaturesOrbit";
import FeaturesCards from "./FeaturesCards";
import Services from "./Services";
import Team from "./Team";
import Testimonials from "./Testimonials";
import Faq from "./Faq";
import CtaBanner from "./CtaBanner";
import Footer from "./Footer";

const SignSetu = () => {
  useSignSetuEffects();

  return (
    <div className="signsetu-root">
      {/* SVG filter defs for liquid glass button */}
      <svg style={{ display: "none" }}>
        <defs>
          <filter id="container-glass" x="0%" y="0%" width="100%" height="100%" colorInterpolationFilters="sRGB">
            <feTurbulence type="fractalNoise" baseFrequency="0.05 0.05" numOctaves={1} seed={1} result="turbulence" />
            <feGaussianBlur in="turbulence" stdDeviation={2} result="blurredNoise" />
            <feDisplacementMap in="SourceGraphic" in2="blurredNoise" scale={70} xChannelSelector="R" yChannelSelector="B" result="displaced" />
            <feGaussianBlur in="displaced" stdDeviation={4} result="finalBlur" />
            <feComposite in="finalBlur" in2="finalBlur" operator="over" />
          </filter>
        </defs>
      </svg>

      <canvas
        id="squares-bg"
        style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: -1, pointerEvents: "none" }}
      />

      <div className="edge-glow" id="edgeGlow"></div>
      <div id="cursor-dot"></div>
      <div id="cursor-ring"></div>

      <Navbar />
      <Hero />
      <Ticker />
      <ScrollShowcase />
      <About />
      <FeaturesOrbit />
      <FeaturesCards />
      <Services />
      <Team />
      <Testimonials />
      <Faq />
      <CtaBanner />
      <Footer />
    </div>
  );
};

export default SignSetu;
