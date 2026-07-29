import { create } from 'zustand'

/**
 * Global Zustand store for socket connection state and live data.
 */
export const useSocketStore = create((set, get) => ({
  // Connection state
  isConnected: false,
  socketId: null,

  // Live train updates keyed by trainId
  trainUpdates: {},

  // Live flight updates keyed by flightId
  flightUpdates: {},

  // Last 20 activity events
  activityEvents: [],

  // Actions
  setConnected: (connected, socketId = null) =>
    set({ isConnected: connected, socketId }),

  updateTrain: (update) =>
    set((state) => ({
      trainUpdates: {
        ...state.trainUpdates,
        [update.trainId]: { ...state.trainUpdates[update.trainId], ...update },
      },
    })),

  updateFlight: (update) =>
    set((state) => ({
      flightUpdates: {
        ...state.flightUpdates,
        [update.flightId]: { ...state.flightUpdates[update.flightId], ...update },
      },
    })),

  addActivityEvent: (event) =>
    set((state) => ({
      activityEvents: [event, ...state.activityEvents].slice(0, 20),
    })),

  reset: () =>
    set({
      isConnected: false,
      socketId: null,
      trainUpdates: {},
      flightUpdates: {},
      activityEvents: [],
    }),
}))
