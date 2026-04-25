const items = [
  "CLINICAL PARSING", "INTENT-AWARE", "ZERO SERVER",
  "EDGE GEOMETRY", "ISL GRAMMAR", "BIDIRECTIONAL",
  "CLINICAL PARSING", "INTENT-AWARE", "ZERO SERVER",
  "EDGE GEOMETRY", "ISL GRAMMAR", "BIDIRECTIONAL",
];

const Ticker = () => (
  <div className="ticker-wrap">
    <div className="ticker">
      {items.map((label, i) => (
        <span className="ticker-item" key={i}>
          <span className="ticker-dot"></span>{label}
        </span>
      ))}
    </div>
  </div>
);

export default Ticker;
