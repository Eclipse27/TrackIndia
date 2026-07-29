import { Link, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ROUTES } from '../utils/constants'

const NAV_LINKS = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD },
  { label: 'Flights', path: ROUTES.FLIGHTS },
  { label: 'Trains', path: ROUTES.TRAINS },
]

export default function Navbar({ isSocketConnected = false }) {
  const location = useLocation()

  return (
    <nav className="navbar-glass fixed top-0 left-0 right-0 z-50 h-16">
      <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to={ROUTES.HOME} className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, rgba(0,229,255,0.2), rgba(124,58,237,0.2))', border: '1px solid rgba(0,229,255,0.3)' }}>
            <span className="text-sm">🛰️</span>
          </div>
          <span className="font-display font-bold text-lg text-gradient-cyan tracking-tight">
            TrackIndia
          </span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = location.pathname === link.path
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'text-cyan-400'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="navbar-active"
                    className="absolute inset-0 rounded-lg"
                    style={{ background: 'rgba(0,229,255,0.08)', border: '1px solid rgba(0,229,255,0.15)' }}
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </Link>
            )
          })}
        </div>

        {/* CTA + Live Indicator */}
        <div className="flex items-center gap-3">
          {/* Live socket indicator */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500">
            <div className={isSocketConnected ? 'live-dot' : 'w-2 h-2 rounded-full bg-slate-600'} />
            <span>{isSocketConnected ? 'LIVE' : 'OFFLINE'}</span>
          </div>

          <Link to={ROUTES.FLIGHTS} className="btn-glow-cyan text-xs px-4 py-2 hidden sm:flex">
            Track Flights
          </Link>
          <Link to={ROUTES.TRAINS} className="btn-glow-violet text-xs px-4 py-2 hidden sm:flex">
            Track Trains
          </Link>
        </div>
      </div>
    </nav>
  )
}
