/**
 * Train Simulation Engine — Phase 6
 *
 * For each train:
 *  - Stores station list with GPS coordinates and scheduled times
 *  - Interpolates lat/lng between stations based on elapsed time
 *  - Randomises minor delays (0–15 min)
 *  - Emits `train:update` socket event every 3 seconds
 *
 * Payload shape:
 * {
 *   trainId, position: {lat, lng}, currentStation, nextStation,
 *   speed, delay, eta, journeyProgress, status
 * }
 */

const { SOCKET_EVENTS, SIM_CONFIG } = require('../utils/constants')
const { MOCK_TRAINS } = require('../services/trainService')

// ─── Internal simulation state per train ─────────────────────────────────────
const trainStates = {}

function initTrainStates() {
  MOCK_TRAINS.forEach((train) => {
    const routeLen = train.route.length

    trainStates[train.id] = {
      ...train,
      // progress: 0.0 to 1.0 across entire route
      progress: train.journeyProgress / 100,
      delay: train.delay,
      // Start time offset based on initial progress
      startedAt: Date.now() - (train.journeyProgress / 100) * estimateJourneyMs(train),
    }
  })
}

/**
 * Estimate total journey duration in ms based on distance and avg speed.
 */
function estimateJourneyMs(train) {
  let totalDist = 0
  const route = train.route
  for (let i = 0; i < route.length - 1; i++) {
    totalDist += haversineKm(route[i], route[i + 1])
  }
  // average speed ~130 km/h for estimation
  return (totalDist / 130) * 3600 * 1000
}

/**
 * Haversine distance in km between two {lat, lng} points.
 */
function haversineKm(a, b) {
  const R = 6371
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const sinLat = Math.sin(dLat / 2)
  const sinLng = Math.sin(dLng / 2)
  const chord = sinLat * sinLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinLng * sinLng
  return R * 2 * Math.atan2(Math.sqrt(chord), Math.sqrt(1 - chord))
}

function toRad(deg) {
  return (deg * Math.PI) / 180
}

/**
 * Interpolate position along route based on progress [0, 1].
 */
function interpolatePosition(route, progress) {
  if (progress <= 0) return { lat: route[0].lat, lng: route[0].lng }
  if (progress >= 1) {
    const last = route[route.length - 1]
    return { lat: last.lat, lng: last.lng }
  }

  const routeLen = route.length - 1
  const segT = progress * routeLen
  const segIdx = Math.min(Math.floor(segT), routeLen - 1)
  const localT = segT - segIdx

  const from = route[segIdx]
  const to = route[Math.min(segIdx + 1, routeLen)]

  return {
    lat: from.lat + (to.lat - from.lat) * localT,
    lng: from.lng + (to.lng - from.lng) * localT,
  }
}

/**
 * Determine current station index from progress.
 */
function getCurrentStationIndex(route, progress) {
  const segT = progress * (route.length - 1)
  return Math.min(Math.floor(segT), route.length - 2)
}

/**
 * Estimate ETA string for destination based on remaining progress.
 */
function estimateETA(state) {
  const remaining = 1 - state.progress
  const journeyMs = estimateJourneyMs(state)
  const remainingMs = remaining * journeyMs + state.delay * 60 * 1000
  const etaDate = new Date(Date.now() + remainingMs)
  return etaDate.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false })
}

/**
 * Apply a random delay fluctuation ±2 min, clamped to [0, MAX_DELAY].
 */
function fluctuateDelay(currentDelay) {
  const delta = (Math.random() - 0.4) * 2 // slightly biased toward delay accumulation
  const newDelay = Math.round(currentDelay + delta)
  return Math.max(0, Math.min(newDelay, SIM_CONFIG.MAX_TRAIN_DELAY_MIN))
}

/**
 * Advance simulation tick for one train.
 * Progress is incremented based on real elapsed time.
 */
function tickTrain(trainId) {
  const state = trainStates[trainId]
  if (!state) return null

  const elapsed = Date.now() - state.startedAt
  const journeyMs = estimateJourneyMs(state)

  // Advance progress — loop when complete for demo purposes
  state.progress = (elapsed / journeyMs) % 1

  // Occasionally fluctuate delay (every ~10 ticks ≈ 30 sec)
  if (Math.random() < 0.1) {
    state.delay = fluctuateDelay(state.delay)
  }

  const position = interpolatePosition(state.route, state.progress)
  const currentStationIndex = getCurrentStationIndex(state.route, state.progress)
  const currentStation = state.route[currentStationIndex]
  const nextStation = state.route[Math.min(currentStationIndex + 1, state.route.length - 1)]

  return {
    trainId: state.id,
    trainName: state.name,
    trainNumber: state.number,
    type: state.type,
    position,
    currentStation: {
      code: currentStation.code,
      name: currentStation.name,
      platform: currentStation.platform,
    },
    nextStation: {
      code: nextStation.code,
      name: nextStation.name,
      scheduledArr: nextStation.scheduledArr,
    },
    speed: state.speed + Math.round((Math.random() - 0.5) * 20), // ±10 km/h jitter
    delay: state.delay,
    eta: estimateETA(state),
    journeyProgress: Math.round(state.progress * 100),
    status: state.delay > 5 ? 'DELAYED' : 'RUNNING',
  }
}

let simInterval = null

/**
 * Start the train simulation engine.
 * Emits `train:update` events to all connected Socket.io clients.
 *
 * @param {import('socket.io').Server} io
 */
function startTrainEngine(io) {
  if (simInterval) {
    clearInterval(simInterval)
  }

  initTrainStates()

  simInterval = setInterval(() => {
    MOCK_TRAINS.forEach((train) => {
      const update = tickTrain(train.id)
      if (update) {
        io.emit(SOCKET_EVENTS.TRAIN_UPDATE, update)
        // Also emit to room subscribers
        io.to(`train:${train.id}`).emit(SOCKET_EVENTS.TRAIN_UPDATE, update)
      }
    })
  }, SIM_CONFIG.TRAIN_UPDATE_INTERVAL_MS)

  console.log(`[TrainEngine] 🚄 Simulation started — ${MOCK_TRAINS.length} trains active, updating every ${SIM_CONFIG.TRAIN_UPDATE_INTERVAL_MS}ms`)
}

/**
 * Stop the simulation engine.
 */
function stopTrainEngine() {
  if (simInterval) {
    clearInterval(simInterval)
    simInterval = null
    console.log('[TrainEngine] 🛑 Simulation stopped')
  }
}

module.exports = { startTrainEngine, stopTrainEngine }
