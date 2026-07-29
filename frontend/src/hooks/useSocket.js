import { useEffect, useRef } from 'react'
import { io } from 'socket.io-client'
import { SOCKET_EVENTS } from '../utils/constants'
import { useSocketStore } from '../store/socketStore'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'

let socket = null

/**
 * Singleton socket hook.
 * Initialises the Socket.io connection once and subscribes to events.
 * Returns the socket instance and connection state.
 */
export function useSocket() {
  const { setConnected, updateTrain, updateFlight, addActivityEvent } = useSocketStore()
  const isConnected = useSocketStore((s) => s.isConnected)
  const reconnectRef = useRef(null)

  useEffect(() => {
    if (socket) return // Already connected

    socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    })

    socket.on(SOCKET_EVENTS.CONNECT, () => {
      setConnected(true, socket.id)
    })

    socket.on(SOCKET_EVENTS.DISCONNECT, () => {
      setConnected(false, null)
    })

    socket.on(SOCKET_EVENTS.CONNECT_ERROR, () => {
      setConnected(false, null)
    })

    socket.on(SOCKET_EVENTS.TRAIN_UPDATE, (data) => {
      updateTrain(data)
    })

    socket.on(SOCKET_EVENTS.FLIGHT_UPDATE, (data) => {
      updateFlight(data)
    })

    socket.on(SOCKET_EVENTS.ACTIVITY_EVENT, (event) => {
      addActivityEvent(event)
    })

    return () => {
      // Don't disconnect on unmount — keep singleton alive
    }
  }, [])

  return { socket, isConnected }
}

/**
 * Subscribe to a specific train's updates.
 */
export function subscribeToTrain(trainId) {
  if (socket) socket.emit(SOCKET_EVENTS.SUBSCRIBE_TRAIN, trainId)
}

/**
 * Subscribe to a specific flight's updates.
 */
export function subscribeToFlight(flightId) {
  if (socket) socket.emit(SOCKET_EVENTS.SUBSCRIBE_FLIGHT, flightId)
}

/**
 * Unsubscribe from a train.
 */
export function unsubscribeFromTrain(trainId) {
  if (socket) socket.emit(SOCKET_EVENTS.UNSUBSCRIBE_TRAIN, trainId)
}
