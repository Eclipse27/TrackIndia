// ─── Shared Backend Constants ────────────────────────────────────────────────
// Mirror of frontend/src/utils/constants.js for socket events (keep in sync)

const SOCKET_EVENTS = {
  TRAIN_UPDATE: 'train:update',
  FLIGHT_UPDATE: 'flight:update',
  DASHBOARD_UPDATE: 'dashboard:update',
  ACTIVITY_EVENT: 'activity:event',
  SUBSCRIBE_TRAIN: 'subscribe:train',
  SUBSCRIBE_FLIGHT: 'subscribe:flight',
  UNSUBSCRIBE_TRAIN: 'unsubscribe:train',
  UNSUBSCRIBE_FLIGHT: 'unsubscribe:flight',
}

const SIM_CONFIG = {
  TRAIN_UPDATE_INTERVAL_MS: 3000,
  FLIGHT_UPDATE_INTERVAL_MS: 5000,
  MAX_TRAIN_DELAY_MIN: 15,
}

const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
}

module.exports = { SOCKET_EVENTS, SIM_CONFIG, HTTP_STATUS }
