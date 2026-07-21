const R = 22;
const CIRC = 2 * Math.PI * R;

export default function ProgressRing({ progress = 1, color = "#FF6200", size = 52, trackColor = "#1C1C23" }) {
  const offset = CIRC * (1 - Math.max(0, Math.min(1, progress)));
  const cx = size / 2;
  const cy = size / 2;

  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={cx} cy={cy} r={R} fill="none" stroke={trackColor} strokeWidth={2.5}/>
      <circle
        cx={cx} cy={cy} r={R}
        fill="none"
        stroke={color}
        strokeWidth={2.5}
        strokeDasharray={CIRC}
        strokeDashoffset={offset}
        strokeLinecap="round"
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
      />
    </svg>
  );
}
