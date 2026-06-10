// Simple inline SVG illustration used on auth pages
const TaskIllustration = ({ className = '' }) => (
  <svg
    viewBox="0 0 380 320"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full max-w-sm ${className}`}
    aria-hidden="true"
  >
    {/* Board */}
    <rect x="60" y="40" width="260" height="200" rx="18" fill="white" fillOpacity="0.15" stroke="white" strokeOpacity="0.3" strokeWidth="1.5" />
    {/* Header bar */}
    <rect x="60" y="40" width="260" height="44" rx="18" fill="white" fillOpacity="0.2" />
    <rect x="60" y="66" width="260" height="18" fill="white" fillOpacity="0.1" />
    {/* Dots */}
    <circle cx="86" cy="62" r="6" fill="#ff6b6b" fillOpacity="0.8" />
    <circle cx="106" cy="62" r="6" fill="#ffd93d" fillOpacity="0.8" />
    <circle cx="126" cy="62" r="6" fill="#6bcb77" fillOpacity="0.8" />
    {/* Task rows */}
    {[0, 1, 2, 3].map((i) => (
      <g key={i} transform={`translate(0, ${i * 36})`}>
        <rect x="84" y="104" width="212" height="24" rx="8" fill="white" fillOpacity="0.1" />
        {/* checkbox */}
        <rect x="90" y="110" width="12" height="12" rx="3" fill={i < 2 ? '#6bcb77' : 'white'} fillOpacity={i < 2 ? 0.9 : 0.2} />
        {i < 2 && (
          <polyline points="92,116 95,119 100,113" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        )}
        {/* line */}
        <rect x="110" y="114" width={[100, 80, 120, 60][i]} height="4" rx="2" fill="white" fillOpacity={i < 2 ? 0.3 : 0.5} />
      </g>
    ))}
    {/* Floating badge */}
    <rect x="230" y="20" width="90" height="32" rx="16" fill="#13856f" fillOpacity="0.9" />
    <text x="275" y="41" textAnchor="middle" fill="white" fontSize="11" fontWeight="600">4 Done ✓</text>
    {/* Person silhouette */}
    <circle cx="310" cy="245" r="20" fill="white" fillOpacity="0.2" />
    <circle cx="310" cy="235" r="10" fill="white" fillOpacity="0.5" />
    <path d="M290 270 Q310 255 330 270" stroke="white" strokeOpacity="0.5" strokeWidth="2" fill="none" />
    {/* Sparkles */}
    <circle cx="68" cy="180" r="3" fill="white" fillOpacity="0.5" />
    <circle cx="330" cy="140" r="2" fill="white" fillOpacity="0.4" />
    <circle cx="100" cy="280" r="4" fill="white" fillOpacity="0.3" />
  </svg>
);

export default TaskIllustration;
