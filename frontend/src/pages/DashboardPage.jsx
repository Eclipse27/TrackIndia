import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import 'leaflet/dist/leaflet.css'
import { staggerContainer, staggerItem, fadeInUp, pageTransition } from '../animations/variants'
import { MAP_CONFIG, COLORS } from '../utils/constants'
import { createAircraftIcon, createTrainIcon, DARK_TILE_LAYER } from '../maps/mapUtils'
import { useSocketStore } from '../store/socketStore'
import { MOCK_FLIGHTS } from '../services/mockFlights'
import { MOCK_TRAINS } from '../services/mockTrains'

// ─── Radar Sweep Overlay ──────────────────────────────────────────────────────
function RadarSweepOverlay() {
  return (
    <div className="absolute top-4 right-4 z-[1000] pointer-events-none" aria-hidden="true">
      <svg width="80" height="80" viewBox="0 0 80 80">
        <circle cx="40" cy="40" r="38" fill="none" stroke="rgba(0,229,255,0.08)" strokeWidth="1" />
        <circle cx="40" cy="40" r="28" fill="none" stroke="rgba(0,229,255,0.06)" strokeWidth="1" />
        <circle cx="40" cy="40" r="18" fill="none" stroke="rgba(0,229,255,0.08)" strokeWidth="1" />
        <circle cx="40" cy="40" r="2" fill="#00e5ff" opacity="0.8" />
        <g style={{ transformOrigin: '40px 40px' }}>
          <line x1="40" y1="40" x2="40" y2="2" stroke="rgba(0,229,255,0.6)" strokeWidth="1.5"
            style={{ animation: 'radarSweep 4s linear infinite' }} />
          <path d="M40 40 L40 2 A38 38 0 0 1 75 55 Z" fill="rgba(0,229,255,0.04)"
            style={{ animation: 'radarSweep 4s linear infinite' }} />
        </g>
      </svg>
    </div>
  )
}

// ─── Dashboard Map ────────────────────────────────────────────────────────────
function DashboardMap({ flights, trains }) {
  return (
    <div className="relative rounded-xl overflow-hidden" style={{ height: '400px', border: '1px solid rgba(0,229,255,0.1)' }}>
      <MapContainer
        center={MAP_CONFIG.DEFAULT_CENTER}
        zoom={MAP_CONFIG.DEFAULT_ZOOM}
        style={{ width: '100%', height: '100%' }}
        zoomControl={false}
      >
        <TileLayer {...DARK_TILE_LAYER} />

        {/* Flight markers */}
        {flights.map((flight) => (
          <Marker
            key={flight.id}
            position={[flight.telemetry.lat, flight.telemetry.lng]}
            icon={createAircraftIcon(flight.telemetry.heading || 0, false)}
          >
            <Popup>
              <div className="p-1 text-xs">
                <div className="font-bold text-cyan-400">{flight.flightNumber}</div>
                <div>{flight.airline}</div>
                <div>{flight.origin.code} → {flight.destination.code}</div>
                <div style={{ color: '#94a3b8' }}>{flight.telemetry.altitude.toLocaleString()} ft · {flight.telemetry.speed} km/h</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Train markers */}
        {trains.map((train) => (
          <Marker
            key={train.id}
            position={[train.position.lat, train.position.lng]}
            icon={createTrainIcon(false)}
          >
            <Popup>
              <div className="p-1 text-xs">
                <div className="font-bold" style={{ color: '#a78bfa' }}>{train.name}</div>
                <div>#{train.number}</div>
                <div>{train.origin.code} → {train.destination.code}</div>
                <div style={{ color: '#94a3b8' }}>{train.speed} km/h</div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <RadarSweepOverlay />
    </div>
  )
}

// ─── Metric Card ──────────────────────────────────────────────────────────────
function MetricCard({ label, value, icon, sub, color = 'cyan' }) {
  const isViolet = color === 'violet'
  return (
    <motion.div
      variants={staggerItem}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      className="glass-card p-6"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="text-2xl">{icon}</div>
        <div className="live-dot" />
      </div>
      <div
        className="text-4xl font-display font-black mb-1"
        style={{
          background: isViolet
            ? 'linear-gradient(135deg, #a78bfa, #00e5ff)'
            : 'linear-gradient(135deg, #00e5ff, #a78bfa)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}
      >
        {value}
      </div>
      <div className="text-xs uppercase tracking-widest text-slate-400 font-medium">{label}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </motion.div>
  )
}

// ─── Activity Feed ────────────────────────────────────────────────────────────
const INITIAL_EVENTS = [
  { id: 1, type: 'flight', event: 'AI 101 departed New Delhi', time: '2 min ago', severity: 'info' },
  { id: 2, type: 'train', event: 'Shatabdi Express delayed by 12 min', time: '4 min ago', severity: 'warning' },
  { id: 3, type: 'flight', event: 'SG 102 en route to Kolkata', time: '6 min ago', severity: 'info' },
  { id: 4, type: 'train', event: 'Vande Bharat arrived at Agra Cantt', time: '8 min ago', severity: 'success' },
  { id: 5, type: 'flight', event: 'G8 201 delayed by 45 min at Pune', time: '12 min ago', severity: 'warning' },
  { id: 6, type: 'train', event: 'Rajdhani Express on schedule', time: '15 min ago', severity: 'success' },
  { id: 7, type: 'flight', event: 'IX 441 approaching Hyderabad', time: '18 min ago', severity: 'info' },
  { id: 8, type: 'train', event: 'Gatimaan Express departed Nizamuddin', time: '20 min ago', severity: 'info' },
  { id: 9, type: 'flight', event: 'UK 971 boarding at Terminal 3', time: '22 min ago', severity: 'info' },
  { id: 10, type: 'train', event: 'Duronto Express cleared Bhubaneswar', time: '25 min ago', severity: 'success' },
]

function ActivityFeed({ events }) {
  const severityColors = {
    info: '#3b82f6',
    warning: '#f59e0b',
    success: '#10b981',
    danger: '#ef4444',
  }

  return (
    <div className="glass-card p-5 flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-display font-semibold text-slate-200">Live Activity</h3>
        <div className="flex items-center gap-1.5 text-xs text-emerald-400">
          <div className="live-dot" />
          Real-time
        </div>
      </div>
      <div className="flex-1 overflow-y-auto space-y-0 -mx-1 px-1">
        <AnimatePresence initial={false}>
          {events.slice(0, 10).map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="flex items-start gap-3 py-2.5 border-b"
              style={{ borderColor: 'rgba(255,255,255,0.04)' }}
            >
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5"
                style={{ background: `${severityColors[event.severity]}18`, color: severityColors[event.severity] }}
              >
                {event.type === 'flight' ? '✈' : '🚄'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-300 leading-snug">{event.event}</p>
                <p className="text-xs text-slate-600 mt-0.5">{event.time}</p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}

// ─── Custom Recharts Tooltip ──────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <div className="font-bold text-slate-200 mb-1">{label}</div>
      <div style={{ color: payload[0]?.fill }}>{payload[0]?.value} {payload[0]?.name}</div>
    </div>
  )
}

// ─── Main Dashboard Page ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const socketFlightUpdates = useSocketStore((s) => s.flightUpdates)
  const socketTrainUpdates = useSocketStore((s) => s.trainUpdates)
  const socketEvents = useSocketStore((s) => s.activityEvents)
  const isConnected = useSocketStore((s) => s.isConnected)

  // Merge socket updates with mock data
  const flights = MOCK_FLIGHTS.map((f) => {
    const update = socketFlightUpdates[f.id]
    return update ? { ...f, telemetry: { ...f.telemetry, ...update.telemetry } } : f
  })

  const trains = MOCK_TRAINS.map((t) => {
    const update = socketTrainUpdates[t.id]
    return update ? { ...t, position: update.position || t.position, speed: update.speed || t.speed } : t
  })

  const activeFlights = flights.filter((f) => f.status === 'EN_ROUTE' || f.status === 'BOARDING').length
  const activeTrains = trains.filter((t) => t.status === 'RUNNING' || t.status === 'ON_TIME').length
  const delayedRoutes = [...flights, ...trains].filter((v) => v.delay > 0).length

  const activityEvents = socketEvents.length > 0 ? socketEvents : INITIAL_EVENTS

  const airportData = [
    { name: 'DEL', flights: 312 },
    { name: 'BOM', flights: 298 },
    { name: 'BLR', flights: 241 },
    { name: 'MAA', flights: 198 },
    { name: 'HYD', flights: 187 },
    { name: 'CCU', flights: 165 },
  ]

  const stationData = [
    { name: 'NDLS', trains: 420 },
    { name: 'BCT', trains: 387 },
    { name: 'MAS', trains: 312 },
    { name: 'HWH', trains: 298 },
    { name: 'BLR', trains: 254 },
    { name: 'ADI', trains: 221 },
  ]

  return (
    <motion.div
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="min-h-screen"
    >
      <div className="px-4 py-8 max-w-7xl mx-auto">
        {/* Header */}
        <motion.div variants={fadeInUp} className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📡</span>
            <h1 className="text-3xl font-display font-bold text-slate-100">Mission Control</h1>
            <span
              className="text-xs px-2.5 py-1 rounded-full font-medium ml-2"
              style={
                isConnected
                  ? { background: 'rgba(16,185,129,0.1)', color: '#10b981', border: '1px solid rgba(16,185,129,0.2)' }
                  : { background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.2)' }
              }
            >
              <div className={`inline-block w-1.5 h-1.5 rounded-full mr-1.5 ${isConnected ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`} />
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
          <p className="text-slate-400">Real-time overview of all active Indian flights and trains</p>
        </motion.div>

        {/* Metric Cards */}
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        >
          <MetricCard label="Active Flights" value={activeFlights} icon="✈️" color="cyan" sub={`${flights.length} total tracked`} />
          <MetricCard label="Active Trains" value={activeTrains} icon="🚄" color="violet" sub={`${trains.length} total tracked`} />
          <MetricCard label="Delayed Routes" value={delayedRoutes} icon="⚠️" color="cyan" sub="Flights + trains" />
          <MetricCard label="Avg Speed" value="135" icon="⚡" color="violet" sub="km/h across all trains" />
        </motion.div>

        {/* Map + Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="lg:col-span-2">
            <DashboardMap flights={flights} trains={trains} />
          </div>
          <div style={{ height: '400px' }}>
            <ActivityFeed events={activityEvents} />
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Busiest Airports */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-display font-semibold text-slate-200 mb-1">Busiest Airports</h3>
            <p className="text-xs text-slate-500 mb-5">Daily flight movements</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={airportData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,229,255,0.05)' }} />
                <Bar dataKey="flights" name="flights" radius={[4, 4, 0, 0]}>
                  {airportData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#00e5ff' : `rgba(0,229,255,${0.7 - i * 0.1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Busiest Stations */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="glass-card p-6"
          >
            <h3 className="text-sm font-display font-semibold text-slate-200 mb-1">Busiest Stations</h3>
            <p className="text-xs text-slate-500 mb-5">Daily train movements</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={stationData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
                <XAxis dataKey="name" tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: '#64748b', fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(139,92,246,0.05)' }} />
                <Bar dataKey="trains" name="trains" radius={[4, 4, 0, 0]}>
                  {stationData.map((_, i) => (
                    <Cell key={i} fill={i === 0 ? '#a78bfa' : `rgba(139,92,246,${0.8 - i * 0.1})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
