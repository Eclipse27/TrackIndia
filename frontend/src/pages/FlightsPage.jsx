import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { staggerContainer, staggerItem, fadeInUp, pageTransition } from '../animations/variants'
import { MOCK_FLIGHTS, searchFlights, getFlightStatusCounts } from '../services/mockFlights'
import { INDIAN_AIRPORTS } from '../utils/constants'
import FlightMap from '../maps/FlightMap'

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }) {
  const cfg = {
    EN_ROUTE:  { label: '▶ En Route',   cls: 'status-on-time' },
    BOARDING:  { label: '⬆ Boarding',   cls: 'status-badge', style: { background: 'rgba(59,130,246,0.12)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.25)' } },
    DELAYED:   { label: '⚠ Delayed',    cls: 'status-delayed' },
    CANCELLED: { label: '✕ Cancelled',  cls: 'status-cancelled' },
    LANDED:    { label: '✓ Landed',     cls: 'status-badge', style: { background: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)' } },
    SCHEDULED: { label: '◷ Scheduled',  cls: 'status-badge', style: { background: 'rgba(167,139,250,0.1)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.2)' } },
  }
  const { label, cls, style } = cfg[status] || cfg.SCHEDULED
  return <span className={cls} style={style}>{label}</span>
}

// ─── Flight Card ──────────────────────────────────────────────────────────────
function FlightCard({ flight, isSelected, onSelect }) {
  return (
    <motion.button
      variants={staggerItem}
      onClick={() => onSelect(flight)}
      whileHover={{ x: 2 }}
      id={`flight-card-${flight.id}`}
      className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${
        isSelected
          ? 'border-cyan-400/40 bg-navy-700/60'
          : 'border-white/5 hover:border-white/10 bg-navy-800/40 hover:bg-navy-800/60'
      }`}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="font-display font-bold text-slate-100">{flight.flightNumber}</div>
          <div className="text-xs text-slate-500">{flight.airline} · {flight.aircraftType}</div>
        </div>
        <StatusBadge status={flight.status} />
      </div>
      <div className="flex items-center gap-2 text-sm">
        <div className="text-center">
          <div className="font-bold text-cyan-400">{flight.origin.code}</div>
          <div className="text-xs text-slate-500">{flight.origin.city}</div>
        </div>
        <div className="flex-1 flex items-center gap-1 justify-center text-slate-600">
          <div className="h-px flex-1 bg-slate-700" />
          <span className="text-xs">✈</span>
          <div className="h-px flex-1 bg-slate-700" />
        </div>
        <div className="text-center">
          <div className="font-bold text-slate-200">{flight.destination.code}</div>
          <div className="text-xs text-slate-500">{flight.destination.city}</div>
        </div>
      </div>
      {flight.delay > 0 && (
        <div className="mt-2 text-xs text-amber-400">+{flight.delay} min delay</div>
      )}
    </motion.button>
  )
}

// ─── Telemetry Card ───────────────────────────────────────────────────────────
function TelemetryCard({ label, value, unit, icon, color = 'cyan' }) {
  return (
    <div className="glass-card p-4 flex flex-col gap-1.5">
      <div className="flex items-center gap-2 text-xs text-slate-500 uppercase tracking-widest font-medium">
        <span>{icon}</span>{label}
      </div>
      <div className={`text-2xl font-display font-bold ${color === 'violet' ? 'text-gradient-violet' : 'text-gradient-cyan'}`}>
        {value}
        {unit && <span className="text-sm font-normal text-slate-500 ml-1">{unit}</span>}
      </div>
    </div>
  )
}

// ─── Journey Progress ─────────────────────────────────────────────────────────
function JourneyProgress({ flight }) {
  const depTime = new Date(flight.departure.actual || flight.departure.scheduled)
  const arrTime = new Date(flight.arrival.estimated || flight.arrival.scheduled)
  const progress = flight.telemetry.progress
  return (
    <div className="glass-card p-5">
      <div className="flex justify-between text-xs text-slate-500 mb-3">
        <div>
          <div className="font-bold text-cyan-400 text-base">{flight.origin.code}</div>
          <div>{depTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
        <div className="text-center text-slate-400 text-xs">
          <div className="text-sm font-medium text-slate-300">✈ {flight.flightNumber}</div>
          <div>{Math.round(progress)}% complete</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-slate-200 text-base">{flight.destination.code}</div>
          <div>{arrTime.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}</div>
        </div>
      </div>
      <div className="relative h-2 bg-navy-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: 'linear-gradient(90deg, #00e5ff, #7c3aed)' }}
        />
      </div>
    </div>
  )
}

// ─── Airport Autocomplete ─────────────────────────────────────────────────────
// BUGFIX: dropdown uses z-[9999] and sits in a relative container so it renders
//         above the Leaflet map which uses z-index ~400 internally.
function AirportAutocomplete({ placeholder, value, onChange, id }) {
  const [open, setOpen] = useState(false)
  const filtered = useMemo(() => {
    if (!value) return INDIAN_AIRPORTS.slice(0, 8)
    const q = value.toLowerCase()
    return INDIAN_AIRPORTS.filter(
      (a) =>
        a.code.toLowerCase().includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.name.toLowerCase().includes(q) ||
        (a.state && a.state.toLowerCase().includes(q))
    ).slice(0, 10)
  }, [value])

  return (
    <div className="relative" style={{ zIndex: open ? 9999 : 'auto' }}>
      <input
        id={id}
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        aria-label={placeholder}
        aria-autocomplete="list"
        aria-expanded={open}
      />
      <AnimatePresence>
        {open && filtered.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="absolute top-full left-0 right-0 mt-1 rounded-xl overflow-hidden border"
            style={{
              background: 'rgba(9,20,40,0.98)',
              borderColor: 'rgba(0,229,255,0.15)',
              backdropFilter: 'blur(20px)',
              zIndex: 9999,
              boxShadow: '0 20px 60px rgba(0,0,0,0.8)',
            }}
            role="listbox"
          >
            {filtered.map((airport) => (
              <button
                key={airport.code}
                role="option"
                className="w-full text-left px-4 py-2.5 flex items-center gap-3 hover:bg-cyan-400/5 transition-colors"
                onMouseDown={() => { onChange(`${airport.code} — ${airport.city}`); setOpen(false) }}
              >
                <span className="text-cyan-400 font-bold font-mono text-sm w-12 shrink-0">{airport.code}</span>
                <div>
                  <div className="text-slate-200 text-sm">{airport.city}</div>
                  <div className="text-slate-500 text-xs">{airport.name}{airport.state ? ` · ${airport.state}` : ''}</div>
                </div>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Status Filter Tabs ───────────────────────────────────────────────────────
const STATUS_TABS = [
  { key: 'ALL',       label: 'All',       icon: '✈' },
  { key: 'EN_ROUTE',  label: 'En Route',  icon: '▶' },
  { key: 'SCHEDULED', label: 'Scheduled', icon: '◷' },
  { key: 'BOARDING',  label: 'Boarding',  icon: '⬆' },
  { key: 'LANDED',    label: 'Landed',    icon: '✓' },
  { key: 'DELAYED',   label: 'Delayed',   icon: '⚠' },
  { key: 'CANCELLED', label: 'Cancelled', icon: '✕' },
]

// ─── Main Flights Page ────────────────────────────────────────────────────────
export default function FlightsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFlight, setSelectedFlight] = useState(MOCK_FLIGHTS.find(f => f.status === 'EN_ROUTE') || MOCK_FLIGHTS[0])
  const [fromAirport, setFromAirport] = useState('')
  const [toAirport, setToAirport] = useState('')
  const [activeStatus, setActiveStatus] = useState('ALL')

  const statusCounts = useMemo(() => getFlightStatusCounts(), [])

  const filteredFlights = useMemo(() =>
    searchFlights(searchQuery, {
      status: activeStatus,
      from: fromAirport,
      to: toAirport,
    }),
    [searchQuery, activeStatus, fromAirport, toAirport]
  )

  const tf = selectedFlight?.telemetry

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen"
    >
      <div className="px-4 py-8 max-w-7xl mx-auto">

        {/* ─── Header ──────────────────────────────────────────────────── */}
        <motion.div variants={fadeInUp} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">✈️</span>
            <h1 className="text-3xl font-display font-bold text-slate-100">Flight Tracker</h1>
            <span className="status-on-time text-xs ml-2">
              <div className="live-dot w-1.5 h-1.5 inline-block mr-1.5" />
              {MOCK_FLIGHTS.length} Flights
            </span>
          </div>
          <p className="text-slate-400">Live domestic flight tracking across all Indian states</p>
        </motion.div>

        {/* ─── Search Row — z-index wrapper ensures dropdown > map ──── */}
        <div style={{ position: 'relative', zIndex: 1000 }} className="mb-4">
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-3 gap-3"
          >
            <motion.div variants={staggerItem}>
              <input
                id="flight-search"
                className="search-input"
                placeholder="Search flight number, airline, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search flights"
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <AirportAutocomplete
                id="from-airport"
                placeholder="From airport or city..."
                value={fromAirport}
                onChange={setFromAirport}
              />
            </motion.div>
            <motion.div variants={staggerItem}>
              <AirportAutocomplete
                id="to-airport"
                placeholder="To airport or city..."
                value={toAirport}
                onChange={setToAirport}
              />
            </motion.div>
          </motion.div>
        </div>

        {/* ─── Status Filter Tabs ─────────────────────────────────────── */}
        <motion.div variants={fadeInUp} className="mb-5 flex flex-wrap gap-2">
          {STATUS_TABS.map((tab) => {
            const count = statusCounts[tab.key] || 0
            const isActive = activeStatus === tab.key
            return (
              <button
                key={tab.key}
                id={`filter-${tab.key.toLowerCase()}`}
                onClick={() => setActiveStatus(tab.key)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border ${
                  isActive
                    ? 'bg-cyan-400/15 text-cyan-400 border-cyan-400/30'
                    : 'bg-white/3 text-slate-400 border-white/8 hover:border-white/15 hover:text-slate-300'
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
                <span className={`px-1.5 py-0.5 rounded-full text-xs font-bold ${isActive ? 'bg-cyan-400/20 text-cyan-300' : 'bg-white/8 text-slate-500'}`}>
                  {tab.key === 'ALL' ? statusCounts.ALL : count}
                </span>
              </button>
            )
          })}
          {(fromAirport || toAirport || searchQuery) && (
            <button
              onClick={() => { setFromAirport(''); setToAirport(''); setSearchQuery('') }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 transition-all"
            >
              ✕ Clear Filters
            </button>
          )}
        </motion.div>

        {/* ─── Main Grid ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Flight List */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="lg:col-span-1 flex flex-col gap-2 max-h-[calc(100vh-280px)] overflow-y-auto pr-1"
          >
            {filteredFlights.length === 0 ? (
              <div className="glass-card p-8 text-center text-slate-500">
                <div className="text-2xl mb-2">🔍</div>
                <div>No flights found</div>
                <div className="text-xs mt-1">Try adjusting your search or filters</div>
              </div>
            ) : (
              filteredFlights.map((flight) => (
                <FlightCard
                  key={flight.id}
                  flight={flight}
                  isSelected={selectedFlight?.id === flight.id}
                  onSelect={setSelectedFlight}
                />
              ))
            )}
          </motion.div>

          {/* Right Panel — map has z-index:1 via CSS, so stays behind dropdown */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <div className="rounded-xl overflow-hidden" style={{ height: '420px', border: '1px solid rgba(0,229,255,0.12)' }}>
              <FlightMap flight={selectedFlight} />
            </div>

            {selectedFlight && (
              <>
                <JourneyProgress flight={selectedFlight} />

                <motion.div
                  variants={staggerContainer}
                  initial="initial"
                  animate="animate"
                  className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3"
                >
                  {[
                    { label: 'Altitude', value: tf.altitude > 0 ? tf.altitude.toLocaleString() : '0', unit: 'ft', icon: '⬆', color: 'cyan' },
                    { label: 'Speed', value: tf.speed, unit: 'km/h', icon: '💨', color: 'cyan' },
                    { label: 'Heading', value: `${Math.round(tf.heading)}°`, unit: '', icon: '🧭', color: 'violet' },
                    { label: 'Delay', value: selectedFlight.delay > 0 ? `+${selectedFlight.delay}` : 'On Time', unit: selectedFlight.delay > 0 ? 'min' : '', icon: '⏱', color: selectedFlight.delay > 0 ? 'violet' : 'cyan' },
                    { label: 'Aircraft', value: selectedFlight.aircraftType.split(' ').slice(-1)[0], unit: '', icon: '✈', color: 'cyan' },
                  ].map(({ label, value, unit, icon, color }) => (
                    <motion.div key={label} variants={staggerItem}>
                      <TelemetryCard label={label} value={value} unit={unit} icon={icon} color={color} />
                    </motion.div>
                  ))}
                </motion.div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {[
                    { label: 'Airline', value: selectedFlight.airline },
                    { label: 'Registration', value: selectedFlight.registration },
                    { label: 'Gate', value: selectedFlight.gate, extra: `Terminal ${selectedFlight.terminal}` },
                    { label: 'Status', value: <StatusBadge status={selectedFlight.status} /> },
                  ].map(({ label, value, extra }) => (
                    <div key={label} className="glass-card p-4">
                      <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">{label}</div>
                      <div className="font-semibold text-slate-200 text-sm">{value}</div>
                      {extra && <div className="text-xs text-slate-500 mt-0.5">{extra}</div>}
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
