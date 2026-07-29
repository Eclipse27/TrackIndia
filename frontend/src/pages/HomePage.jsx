import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useScroll, useTransform } from 'framer-motion'
import { staggerContainer, staggerItem, fadeInUp, floatAnimation } from '../animations/variants'
import { ROUTES } from '../utils/constants'
import AirplaneSVG from '../assets/AirplaneSVG'
import TrainSVG from '../assets/TrainSVG'

// ─── Stat Cards Data ─────────────────────────────────────────────────────────
const STATS = [
  { label: 'Active Flights', value: '1,200+', icon: '✈️', color: 'cyan' },
  { label: 'Trains Tracked', value: '400+', icon: '🚄', color: 'violet' },
  { label: 'Airports Covered', value: '120', icon: '🛫', color: 'cyan' },
  { label: 'Live Updates/sec', value: '5K+', icon: '⚡', color: 'violet' },
]

// ─── Features Data ────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: '🛰️',
    title: 'Real-Time Telemetry',
    desc: 'Live speed, altitude, position and ETA data streamed via WebSockets — updated every 3 seconds.',
    color: 'cyan',
  },
  {
    icon: '🗺️',
    title: 'Animated Maps',
    desc: 'Leaflet.js powered maps with smooth marker interpolation, curved routes and radar overlays.',
    color: 'violet',
  },
  {
    icon: '🚆',
    title: 'Train Intelligence',
    desc: 'Platform, coach occupancy, delay alerts and station timelines for 400+ Indian rail routes.',
    color: 'cyan',
  },
  {
    icon: '✈️',
    title: 'Flight Tracking',
    desc: 'FlightAware-powered data with automatic mock fallback. Track any domestic Indian flight.',
    color: 'violet',
  },
  {
    icon: '📡',
    title: 'Mission Control',
    desc: 'Dashboard with all active vehicles, busiest hubs chart, and live activity feed.',
    color: 'cyan',
  },
  {
    icon: '📱',
    title: 'Mobile First',
    desc: 'Fully responsive across 375px to 4K. Optimised for on-the-go travel monitoring.',
    color: 'violet',
  },
]

// ─── Cloud Layer ──────────────────────────────────────────────────────────────
function CloudLayer({ scrollY }) {
  const y1 = useTransform(scrollY, [0, 600], [0, -80])
  const y2 = useTransform(scrollY, [0, 600], [0, -40])
  const opacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <motion.div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ opacity }}>
      {/* Cloud blobs */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-20 left-[10%] w-64 h-20 rounded-full opacity-5"
        animate={{ x: [0, 30, 0], transition: { duration: 20, repeat: Infinity, ease: 'easeInOut' } }}
        style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.3) 0%, transparent 70%)', y: y1 }}
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute top-40 right-[15%] w-48 h-16 rounded-full"
        animate={{ x: [0, -20, 0], transition: { duration: 25, repeat: Infinity, ease: 'easeInOut' } }}
        style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.2) 0%, transparent 70%)', y: y2 }}
      />
      <motion.div
        style={{ y: y1 }}
        className="absolute top-60 left-[40%] w-80 h-24 rounded-full"
        animate={{ x: [0, 15, 0], transition: { duration: 18, repeat: Infinity, ease: 'easeInOut' } }}
        style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.1) 0%, transparent 70%)', y: y1 }}
      />
    </motion.div>
  )
}

// ─── Animated Airplane Crossing ───────────────────────────────────────────────
function FlyingAirplane() {
  return (
    <motion.div
      className="absolute top-24 pointer-events-none z-10"
      initial={{ x: '-15vw', y: 40, opacity: 0 }}
      animate={{
        x: '115vw',
        y: -20,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 14,
        repeat: Infinity,
        repeatDelay: 8,
        ease: 'linear',
        opacity: { times: [0, 0.05, 0.92, 1] },
      }}
    >
      <div className="relative">
        <AirplaneSVG size={52} />
        {/* Condensation trail */}
        <div
          className="absolute top-1/2 right-full w-40 h-px"
          style={{ background: 'linear-gradient(to left, rgba(0,229,255,0.4), transparent)', transform: 'translateY(-50%)' }}
        />
      </div>
    </motion.div>
  )
}

// ─── Animated Train Crossing ──────────────────────────────────────────────────
function RunningTrain() {
  return (
    <motion.div
      className="absolute bottom-[30%] pointer-events-none z-10 md:bottom-[28%]"
      initial={{ x: '115vw', opacity: 0 }}
      animate={{
        x: '-25vw',
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 12,
        repeat: Infinity,
        repeatDelay: 10,
        delay: 5,
        ease: 'linear',
        opacity: { times: [0, 0.08, 0.9, 1] },
      }}
    >
      <TrainSVG width={140} height={48} />
    </motion.div>
  )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
function StatCard({ stat, index }) {
  const isViolet = stat.color === 'violet'
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className={`glass-card p-6 flex flex-col items-center text-center gap-3 cursor-default ${
        isViolet ? 'neon-border-violet' : 'neon-border-cyan'
      }`}
    >
      <span className="text-3xl">{stat.icon}</span>
      <div
        className="text-4xl font-display font-bold tracking-tight"
        style={{
          background: isViolet
            ? 'linear-gradient(135deg, #a78bfa, #00e5ff)'
            : 'linear-gradient(135deg, #00e5ff, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {stat.value}
      </div>
      <div className="text-xs font-medium uppercase tracking-widest text-slate-400">{stat.label}</div>
    </motion.div>
  )
}

// ─── Feature Card ─────────────────────────────────────────────────────────────
function FeatureCard({ feature }) {
  const isViolet = feature.color === 'violet'
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="glass-card p-6 flex flex-col gap-4 group cursor-default"
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-transform duration-300 group-hover:scale-110"
        style={{
          background: isViolet
            ? 'rgba(124,58,237,0.15)'
            : 'rgba(0,229,255,0.1)',
          border: `1px solid ${isViolet ? 'rgba(124,58,237,0.25)' : 'rgba(0,229,255,0.2)'}`,
        }}
      >
        {feature.icon}
      </div>
      <div>
        <h3 className="font-display font-semibold text-slate-100 mb-2">{feature.title}</h3>
        <p className="text-sm text-slate-400 leading-relaxed">{feature.desc}</p>
      </div>
    </motion.div>
  )
}

// ─── Grid Background ──────────────────────────────────────────────────────────
function GridBackground() {
  return (
    <div
      className="absolute inset-0 pointer-events-none"
      style={{
        backgroundImage: `
          linear-gradient(rgba(0,229,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,229,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
      }}
    />
  )
}

// ─── Main Landing Page ────────────────────────────────────────────────────────
export default function HomePage() {
  const heroRef = useRef(null)
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 600], [0, -100])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  return (
    <div className="relative overflow-x-hidden">
      {/* ─── Hero Section ─────────────────────────────────────────────────── */}
      <section
        id="hero"
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-4 overflow-hidden"
      >
        <GridBackground />
        <CloudLayer scrollY={scrollY} />
        <FlyingAirplane />
        <RunningTrain />

        {/* Radial glow orbs */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(0,229,255,0.06) 0%, transparent 65%)' }} />
        <div className="absolute bottom-1/3 left-1/4 w-[400px] h-[400px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 65%)' }} />

        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className="relative z-20 max-w-4xl mx-auto text-center"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium mb-8"
            style={{
              background: 'rgba(0,229,255,0.08)',
              border: '1px solid rgba(0,229,255,0.2)',
              color: '#00e5ff',
            }}
          >
            <div className="live-dot" />
            Real-Time Intelligence Platform
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7, ease: 'easeOut' }}
            className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight mb-6 leading-[0.95]"
          >
            <span
              style={{
                background: 'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 40%, #00e5ff 70%, #7c3aed 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Track
            </span>
            <br />
            <span
              style={{
                background: 'linear-gradient(135deg, #00e5ff, #22d3ee, #a78bfa, #7c3aed)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              India
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Live flight & train telemetry across India. Real-time WebSocket data,
            animated Leaflet maps, and a mission control dashboard — all in one platform.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to={ROUTES.FLIGHTS} id="cta-track-flights" className="btn-glow-cyan text-sm px-8 py-3.5 flex items-center gap-2 w-full sm:w-auto justify-center">
              <span>✈️</span> Track Flights
            </Link>
            <Link to={ROUTES.TRAINS} id="cta-track-trains" className="btn-glow-violet text-sm px-8 py-3.5 flex items-center gap-2 w-full sm:w-auto justify-center">
              <span>🚄</span> Track Trains
            </Link>
            <Link
              to={ROUTES.DASHBOARD}
              id="cta-dashboard"
              className="px-8 py-3.5 rounded-lg text-sm font-semibold text-slate-400 transition-all duration-300 hover:text-slate-200 flex items-center gap-2 w-full sm:w-auto justify-center"
              style={{ border: '1px solid rgba(255,255,255,0.06)' }}
            >
              <span>📡</span> Mission Control
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs"
        >
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="w-5 h-8 rounded-full border border-slate-600 flex items-start justify-center pt-1.5"
          >
            <div className="w-1 h-1.5 rounded-full bg-cyan-400" />
          </motion.div>
          <span>Scroll to explore</span>
        </motion.div>
      </section>

      {/* ─── Stats Section ─────────────────────────────────────────────────── */}
      <section id="stats" className="relative py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem} className="text-center mb-12">
              <p className="text-xs font-medium uppercase tracking-widest text-cyan-400 mb-3">By the Numbers</p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-100">
                India's travel, at scale
              </h2>
              <div className="section-divider" />
            </motion.div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STATS.map((stat, i) => (
                <StatCard key={stat.label} stat={stat} index={i} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── Features Section ──────────────────────────────────────────────── */}
      <section id="features" className="relative py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.div variants={staggerItem} className="text-center mb-12">
              <p className="text-xs font-medium uppercase tracking-widest text-violet-400 mb-3">Platform Features</p>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-100">
                Engineering grade, not college grade
              </h2>
              <div className="section-divider" />
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {FEATURES.map((feature) => (
                <FeatureCard key={feature.title} feature={feature} />
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── CTA Section ───────────────────────────────────────────────────── */}
      <section id="cta" className="relative py-24 px-4 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(0,229,255,0.05) 0%, transparent 65%)',
          }}
        />

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-60px' }}
          variants={staggerContainer}
          className="max-w-2xl mx-auto text-center"
        >
          <motion.div variants={staggerItem}>
            <motion.div {...floatAnimation} className="text-6xl mb-6 inline-block">🛰️</motion.div>
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-slate-100 mb-4">
              Ready to go live?
            </h2>
            <p className="text-slate-400 mb-8">
              Open Mission Control to see all active flights and trains across India simultaneously.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to={ROUTES.DASHBOARD} id="cta-bottom-dashboard" className="btn-glow-cyan px-10 py-4 text-sm flex items-center gap-2 w-full sm:w-auto justify-center">
                <span>📡</span> Open Mission Control
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* ─── Footer ────────────────────────────────────────────────────────── */}
      <footer className="py-8 px-4 border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-lg">🛰️</span>
            <span className="font-display font-semibold text-slate-400">TrackIndia</span>
          </div>
          <p>Built with React · Vite · Leaflet · Socket.io · Node.js</p>
          <p>Real-Time Indian Travel Intelligence</p>
        </div>
      </footer>
    </div>
  )
}
