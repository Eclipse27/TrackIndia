/**
 * Vande Bharat Express SVG — animated train crossing the viewport.
 */
export default function TrainSVG({ className = '', width = 120, height = 40 }) {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 120 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Rail track */}
      <rect x="0" y="34" width="120" height="3" fill="url(#trackGrad)" opacity="0.3" rx="1" />
      <rect x="0" y="36" width="120" height="2" fill="#1e1e28" />

      {/* Track ties */}
      {[8, 20, 32, 44, 56, 68, 80, 92, 104, 116].map((x) => (
        <rect key={x} x={x - 2} y="33" width="4" height="5" fill="rgba(148,163,184,0.15)" rx="0.5" />
      ))}

      {/* Locomotive body */}
      <rect x="4" y="8" width="52" height="24" fill="url(#trainGrad)" rx="4" />

      {/* Cab front (aerodynamic nose) */}
      <path d="M56 8 Q70 8 72 20 Q70 32 56 32 L56 8Z" fill="url(#noseGrad)" />

      {/* Windshield */}
      <path d="M57 12 Q64 12 66 20 Q64 28 57 28 L57 12Z" fill="rgba(0,229,255,0.15)" />

      {/* Windows (passenger cars implied) */}
      <rect x="8" y="13" width="10" height="7" rx="1.5" fill="rgba(0,229,255,0.2)" />
      <rect x="22" y="13" width="10" height="7" rx="1.5" fill="rgba(0,229,255,0.2)" />
      <rect x="36" y="13" width="10" height="7" rx="1.5" fill="rgba(0,229,255,0.15)" />

      {/* Vande Bharat stripe */}
      <rect x="4" y="27" width="72" height="3" fill="url(#stripeGrad)" opacity="0.8" />

      {/* Wheels */}
      <circle cx="16" cy="34" r="5" fill="#1e1e28" stroke="#00e5ff" strokeWidth="1.5" />
      <circle cx="16" cy="34" r="2" fill="#00e5ff" opacity="0.6" />
      <circle cx="40" cy="34" r="5" fill="#1e1e28" stroke="#00e5ff" strokeWidth="1.5" />
      <circle cx="40" cy="34" r="2" fill="#00e5ff" opacity="0.6" />
      <circle cx="62" cy="34" r="5" fill="#1e1e28" stroke="#7c3aed" strokeWidth="1.5" />
      <circle cx="62" cy="34" r="2" fill="#7c3aed" opacity="0.6" />

      {/* Speed lines */}
      <line x1="0" y1="15" x2="4" y2="15" stroke="rgba(0,229,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="0" y1="20" x2="3" y2="20" stroke="rgba(0,229,255,0.3)" strokeWidth="1" strokeLinecap="round" />
      <line x1="0" y1="25" x2="4" y2="25" stroke="rgba(0,229,255,0.4)" strokeWidth="1.5" strokeLinecap="round" />

      <defs>
        <linearGradient id="trainGrad" x1="4" y1="8" x2="60" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0d1f3c" />
          <stop offset="1" stopColor="#1e1e28" />
        </linearGradient>
        <linearGradient id="noseGrad" x1="56" y1="8" x2="72" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#112850" />
          <stop offset="1" stopColor="#0d1f3c" />
        </linearGradient>
        <linearGradient id="stripeGrad" x1="4" y1="0" x2="76" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00e5ff" />
          <stop offset="0.5" stopColor="#7c3aed" />
          <stop offset="1" stopColor="#00e5ff" />
        </linearGradient>
        <linearGradient id="trackGrad" x1="0" y1="0" x2="120" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="transparent" />
          <stop offset="0.2" stopColor="#00e5ff" />
          <stop offset="0.8" stopColor="#7c3aed" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  )
}
