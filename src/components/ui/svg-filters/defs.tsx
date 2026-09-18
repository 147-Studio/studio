export default function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: "absolute" }}>
      <defs>
        <linearGradient id="goldGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F3D200" />
          <stop offset="100%" stopColor="#EAAC11" />
        </linearGradient>

        <linearGradient id="pinkGradient" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FE6EB6" />
          <stop offset="100%" stopColor="#FF328B" />
        </linearGradient>
      </defs>
    </svg>
  );
}
