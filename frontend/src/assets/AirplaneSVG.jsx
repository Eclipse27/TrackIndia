/**
 * Animated airplane SVG that flies across the viewport.
 * Uses a single <motion.div> driven by a keyframe animation via CSS.
 */
export default function AirplaneSVG({ className = '', size = 48 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Fuselage */}
      <path
        d="M8 32L32 8L56 32L40 32L38 48L32 44L26 48L24 32L8 32Z"
        fill="url(#planeGrad)"
        opacity="0.9"
      />
      {/* Wing detail */}
      <path d="M32 8L56 32L44 30L32 12L20 30L8 32L32 8Z" fill="url(#planeGrad2)" opacity="0.5" />
      {/* Engine glow */}
      <circle cx="22" cy="32" r="3" fill="#00e5ff" opacity="0.8" />
      <circle cx="42" cy="32" r="3" fill="#00e5ff" opacity="0.8" />
      {/* Exhaust trail */}
      <path d="M22 35 Q16 40 8 38" stroke="#00e5ff" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />
      <path d="M42 35 Q48 40 56 38" stroke="#00e5ff" strokeWidth="1.5" opacity="0.4" strokeLinecap="round" />

      <defs>
        <linearGradient id="planeGrad" x1="8" y1="8" x2="56" y2="48" gradientUnits="userSpaceOnUse">
          <stop stopColor="#00e5ff" />
          <stop offset="1" stopColor="#7c3aed" />
        </linearGradient>
        <linearGradient id="planeGrad2" x1="8" y1="30" x2="56" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#22d3ee" stopOpacity="0.8" />
          <stop offset="1" stopColor="#a78bfa" stopOpacity="0.4" />
        </linearGradient>
      </defs>
    </svg>
  )
}
