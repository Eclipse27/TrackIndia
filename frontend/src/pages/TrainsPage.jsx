import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { staggerContainer, staggerItem, fadeInUp, pageTransition } from '../animations/variants'
import { MOCK_TRAINS, searchTrains, TRAIN_TYPE_LABELS, TRAIN_TYPE_COLORS, getTrainTypeCounts, getTrainStatusCounts } from '../services/mockTrains'
import TrainMap from '../maps/TrainMap'

// ─── Train Type Badge ─────────────────────────────────────────────────────────
function TrainTypeBadge({ type }) {
  const label = TRAIN_TYPE_LABELS[type] || type
  const colors = TRAIN_TYPE_COLORS[type] || TRAIN_TYPE_COLORS.SHATABDI
  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
      style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}
    >
      {label}
    </span>
  )
}

// ─── Status Badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status, delay }) {
  if (status === 'DELAYED') {
    return <span className="status-delayed">⚠ +{delay} min</span>
  }
  if (status === 'RUNNING' || status === 'ON_TIME') {
    return <span className="status-on-time">▶ Running</span>
  }
  return <span className="status-badge" style={{ background: 'rgba(148,163,184,0.1)', color: '#94a3b8', border: '1px solid rgba(148,163,184,0.2)' }}>— {status}</span>
}

// ─── Train List Card ──────────────────────────────────────────────────────────
function TrainCard({ train, isSelected, onSelect }) {
  const colors = TRAIN_TYPE_COLORS[train.type] || TRAIN_TYPE_COLORS.SHATABDI
  return (
    <motion.button
      variants={staggerItem}
      onClick={() => onSelect(train)}
      whileHover={{ x: 2 }}
      id={`train-card-${train.id}`}
      className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${
        isSelected
          ? 'bg-navy-700/60'
          : 'border-white/5 hover:border-white/10 bg-navy-800/40 hover:bg-navy-800/60'
      }`}
      style={isSelected ? { borderColor: colors.border } : {}}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <div className="font-display font-bold text-slate-100 text-sm leading-tight">{train.name}</div>
          <div className="text-xs text-slate-500 mt-0.5">#{train.number}</div>
        </div>
        <TrainTypeBadge type={train.type} />
      </div>
      <div className="flex items-center gap-2 text-sm mb-2">
        <div className="text-center">
          <div className="font-bold text-violet-400 text-xs">{train.origin.code}</div>
        </div>
        <div className="flex-1 h-px bg-slate-700" />
        <div className="text-center">
          <div className="font-bold text-slate-300 text-xs">{train.destination.code}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <StatusBadge status={train.status} delay={train.delay} />
        <span className="text-xs text-slate-500">{train.speed} km/h · {train.occupancy}% full</span>
      </div>
    </motion.button>
  )
}

// ─── Station Timeline ─────────────────────────────────────────────────────────
function StationTimeline({ train }) {
  return (
    <div className="glass-card p-5">
      <h3 className="text-xs font-medium uppercase tracking-widest text-slate-400 mb-4">Station Timeline</h3>
      <div className="relative">
        {/* Vertical track */}
        <div className="absolute left-3.5 top-0 bottom-0 w-px bg-gradient-to-b from-violet-500/50 via-violet-500/20 to-transparent" />

        <div className="space-y-0">
          {train.route.map((station, idx) => {
            const isCurrent = idx === train.currentStationIndex
            const isPast = idx < train.currentStationIndex
            const isFuture = idx > train.currentStationIndex
            const colors = TRAIN_TYPE_COLORS[train.type]

            return (
              <div key={station.code} className="relative flex gap-4 pb-5">
                {/* Dot */}
                <div className="relative z-10 flex-shrink-0">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                      isCurrent
                        ? 'ring-2 ring-offset-2 ring-offset-navy-800'
                        : ''
                    }`}
                    style={{
                      background: isCurrent
                        ? colors.bg
                        : isPast
                        ? 'rgba(139,92,246,0.15)'
                        : 'rgba(30,30,40,0.8)',
                      border: isCurrent
                        ? `2px solid ${colors.text}`
                        : isPast
                        ? '1px solid rgba(139,92,246,0.3)'
                        : '1px solid rgba(255,255,255,0.08)',
                      color: isCurrent ? colors.text : isPast ? '#8b5cf6' : '#475569',
                    }}
                  >
                    {isPast ? '✓' : idx + 1}
                  </div>
                </div>

                {/* Station Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <span
                        className={`font-semibold text-sm ${
                          isCurrent
                            ? ''
                            : isPast
                            ? 'text-slate-400'
                            : 'text-slate-500'
                        }`}
                        style={isCurrent ? { color: colors.text } : {}}
                      >
                        {station.name}
                      </span>
                      {isCurrent && (
                        <span className="ml-2 inline-flex items-center gap-1 text-xs px-1.5 py-0.5 rounded"
                          style={{ background: colors.bg, color: colors.text }}>
                          <div className="live-dot w-1.5 h-1.5" />
                          Here
                        </span>
                      )}
                    </div>
                    <div className="text-right shrink-0">
                      {station.scheduledArr && (
                        <div className={`text-xs font-mono ${isCurrent ? 'text-slate-300' : isPast ? 'text-slate-500' : 'text-slate-600'}`}>
                          {station.scheduledArr}
                        </div>
                      )}
                      {station.scheduledDep && (
                        <div className="text-xs text-slate-600 font-mono">
                          {station.scheduledDep}
                        </div>
                      )}
                    </div>
                  </div>
                  {station.platform && (
                    <div className="text-xs text-slate-500 mt-0.5">Platform {station.platform}</div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Journey Progress ─────────────────────────────────────────────────────────
function JourneyProgress({ train }) {
  return (
    <div className="glass-card p-5">
      <div className="flex justify-between text-xs text-slate-500 mb-3">
        <div>
          <div className="font-bold text-violet-400 text-base">{train.origin.code}</div>
          <div>{train.route[0]?.scheduledDep}</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-medium text-slate-300">
            {Math.round(train.journeyProgress)}% complete
          </div>
          <div className="text-xs">{train.coaches} coaches · {train.classes.join(', ')}</div>
        </div>
        <div className="text-right">
          <div className="font-bold text-slate-300 text-base">{train.destination.code}</div>
          <div className="text-slate-400">ETA {train.eta}</div>
        </div>
      </div>
      <div className="relative h-2 bg-navy-700 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${train.journeyProgress}%` }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          className="absolute inset-y-0 left-0 rounded-full"
          style={{ background: 'linear-gradient(90deg, #8b5cf6, #a78bfa)' }}
        />
      </div>
      <div className="flex justify-between mt-1 text-xs text-slate-600">
        <span>Departed</span>
        <span>Arriving at {train.destination.name}</span>
      </div>
    </div>
  )
}

// ─── Info Cards ───────────────────────────────────────────────────────────────
function InfoCards({ train }) {
  const currentStation = train.route[train.currentStationIndex]
  const nextStation = train.route[train.currentStationIndex + 1]
  const colors = TRAIN_TYPE_COLORS[train.type]

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {/* Speed */}
      <div className="glass-card p-4">
        <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Speed</div>
        <div className="text-2xl font-display font-bold" style={{ color: colors.text }}>
          {train.speed}
        </div>
        <div className="text-xs text-slate-500">km/h</div>
      </div>

      {/* ETA */}
      <div className="glass-card p-4">
        <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">ETA</div>
        <div className="text-2xl font-display font-bold text-slate-200">{train.eta}</div>
        {train.delay > 0 && (
          <div className="text-xs text-amber-400">+{train.delay} min late</div>
        )}
      </div>

      {/* Platform */}
      <div className="glass-card p-4">
        <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Platform</div>
        <div className="text-2xl font-display font-bold text-slate-200">
          {currentStation?.platform || nextStation?.platform || '—'}
        </div>
        <div className="text-xs text-slate-500">{currentStation?.name}</div>
      </div>

      {/* Occupancy */}
      <div className="glass-card p-4">
        <div className="text-xs text-slate-500 uppercase tracking-widest mb-1">Occupancy</div>
        <div className="text-2xl font-display font-bold" style={{ color: train.occupancy > 90 ? '#ef4444' : train.occupancy > 70 ? '#f59e0b' : '#10b981' }}>
          {train.occupancy}%
        </div>
        <div className="text-xs text-slate-500">{train.coaches} coaches</div>
      </div>
    </div>
  )
}

// ─── Train Filter Chips ───────────────────────────────────────────────────────
const TYPE_FILTERS = ['ALL', 'VANDE_BHARAT', 'RAJDHANI', 'SHATABDI', 'SUPERFAST', 'MAIL_EXPRESS', 'TEJAS', 'DURONTO', 'HUMSAFAR', 'JAN_SHATABDI', 'GATIMAAN', 'INTERCITY']
const STATUS_FILTERS = ['ALL', 'RUNNING', 'ON_TIME', 'DELAYED', 'SCHEDULED', 'CANCELLED']

// ─── Main Trains Page ─────────────────────────────────────────────────────────
export default function TrainsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTrain, setSelectedTrain] = useState(MOCK_TRAINS[0])
  const [activeType, setActiveType] = useState('ALL')
  const [activeStatus, setActiveStatus] = useState('ALL')

  const typeCounts = useMemo(() => getTrainTypeCounts(), [])
  const statusCounts = useMemo(() => getTrainStatusCounts(), [])

  const filteredTrains = useMemo(
    () => searchTrains(searchQuery, { type: activeType, status: activeStatus }),
    [searchQuery, activeType, activeStatus]
  )

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
        <motion.div variants={fadeInUp} className="mb-6">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🚄</span>
            <h1 className="text-3xl font-display font-bold text-slate-100">Train Tracker</h1>
            <span className="status-badge ml-2" style={{ background: 'rgba(139,92,246,0.1)', color: '#a78bfa', border: '1px solid rgba(139,92,246,0.2)' }}>
              <div className="live-dot w-1.5 h-1.5 inline-block mr-1.5" />
              {MOCK_TRAINS.length} Trains
            </span>
          </div>
          <p className="text-slate-400">Real-time Indian railway tracking — all zones, all express types</p>
        </motion.div>

        {/* Search */}
        <motion.div variants={fadeInUp} className="mb-4">
          <input
            id="train-search"
            className="search-input max-w-md"
            placeholder="Search by name, number, station, zone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Search trains"
          />
        </motion.div>

        {/* Type filter chips */}
        <motion.div variants={fadeInUp} className="mb-3 flex flex-wrap gap-2">
          {TYPE_FILTERS.map((type) => {
            const count = type === 'ALL' ? typeCounts.ALL : (typeCounts[type] || 0)
            if (type !== 'ALL' && !count) return null
            const isActive = activeType === type
            const colors = type !== 'ALL' ? TRAIN_TYPE_COLORS[type] : null
            return (
              <button
                key={type}
                id={`type-filter-${type.toLowerCase()}`}
                onClick={() => setActiveType(type)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border`}
                style={isActive && colors
                  ? { background: colors.bg, color: colors.text, borderColor: colors.border }
                  : isActive
                  ? { background: 'rgba(139,92,246,0.15)', color: '#a78bfa', borderColor: 'rgba(139,92,246,0.3)' }
                  : { background: 'rgba(255,255,255,0.03)', color: '#64748b', borderColor: 'rgba(255,255,255,0.08)' }
                }
              >
                {type === 'ALL' ? 'All Types' : (TRAIN_TYPE_LABELS[type] || type)}
                <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(0,0,0,0.2)' }}>{count}</span>
              </button>
            )
          })}
        </motion.div>

        {/* Status filter chips */}
        <motion.div variants={fadeInUp} className="mb-5 flex flex-wrap gap-2">
          {STATUS_FILTERS.map((status) => {
            const count = status === 'ALL' ? statusCounts.ALL : (statusCounts[status] || 0)
            if (status !== 'ALL' && !count) return null
            const isActive = activeStatus === status
            const statusColors = {
              RUNNING: '#10b981', ON_TIME: '#00e5ff', DELAYED: '#f59e0b',
              CANCELLED: '#ef4444', SCHEDULED: '#a78bfa',
            }
            const col = statusColors[status] || '#94a3b8'
            return (
              <button
                key={status}
                id={`status-filter-${status.toLowerCase()}`}
                onClick={() => setActiveStatus(status)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 border"
                style={isActive
                  ? { background: `${col}20`, color: col, borderColor: `${col}40` }
                  : { background: 'rgba(255,255,255,0.03)', color: '#64748b', borderColor: 'rgba(255,255,255,0.08)' }
                }
              >
                {status === 'ALL' ? 'All Statuses' : status.replace('_', ' ')}
                <span className="px-1.5 py-0.5 rounded-full text-xs font-bold" style={{ background: 'rgba(0,0,0,0.2)' }}>{count}</span>
              </button>
            )
          })}
          {(searchQuery || activeType !== 'ALL' || activeStatus !== 'ALL') && (
            <button
              onClick={() => { setSearchQuery(''); setActiveType('ALL'); setActiveStatus('ALL') }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/15 transition-all"
            >
              ✕ Clear Filters
            </button>
          )}
        </motion.div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Train List */}
          <motion.div
            variants={staggerContainer}
            initial="initial"
            animate="animate"
            className="lg:col-span-1 flex flex-col gap-2 max-h-[calc(100vh-260px)] overflow-y-auto pr-1"
          >
            {filteredTrains.length === 0 ? (
              <div className="glass-card p-8 text-center text-slate-500">
                No trains found for "{searchQuery}"
              </div>
            ) : (
              filteredTrains.map((train) => (
                <TrainCard
                  key={train.id}
                  train={train}
                  isSelected={selectedTrain?.id === train.id}
                  onSelect={setSelectedTrain}
                />
              ))
            )}
          </motion.div>

          {/* Right Panel */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            {/* Map */}
            <div className="rounded-xl overflow-hidden" style={{ height: '380px', border: '1px solid rgba(139,92,246,0.15)' }}>
              <TrainMap train={selectedTrain} />
            </div>

            {selectedTrain && (
              <>
                <JourneyProgress train={selectedTrain} />
                <InfoCards train={selectedTrain} />
                <StationTimeline train={selectedTrain} />
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
