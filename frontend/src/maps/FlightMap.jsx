import { useEffect, useRef, useCallback } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import { motion } from 'framer-motion'
import 'leaflet/dist/leaflet.css'
import { MAP_CONFIG, COLORS } from '../utils/constants'
import {
  createAircraftIcon,
  buildCurvedRoute,
  calculateBearing,
  DARK_TILE_LAYER,
} from './mapUtils'

// ─── Map Recenter Helper ──────────────────────────────────────────────────────
function MapRecenter({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || MAP_CONFIG.FLIGHT_ZOOM, { duration: 1.5, easeLinearity: 0.3 })
    }
  }, [center, zoom, map])
  return null
}

// ─── Animated Aircraft Marker ─────────────────────────────────────────────────
function AnimatedAircraftMarker({ flight }) {
  const markerRef = useRef(null)
  const animFrameRef = useRef(null)
  const prevPosRef = useRef({ lat: flight.telemetry.lat, lng: flight.telemetry.lng })
  const targetPosRef = useRef({ lat: flight.telemetry.lat, lng: flight.telemetry.lng })
  const progressRef = useRef(0)

  const bearing = calculateBearing(
    { lat: flight.origin.lat, lng: flight.origin.lng },
    { lat: flight.destination.lat, lng: flight.destination.lng }
  )

  useEffect(() => {
    // Simulate gradual marker movement along route
    const animate = () => {
      if (!markerRef.current) return
      progressRef.current = Math.min(progressRef.current + 0.004, 1)
      const t = progressRef.current
      const routeLen = flight.route.length - 1
      const segT = t * routeLen
      const segIdx = Math.min(Math.floor(segT), routeLen - 1)
      const localT = segT - segIdx
      const from = flight.route[segIdx]
      const to = flight.route[Math.min(segIdx + 1, routeLen)]

      const lat = from.lat + (to.lat - from.lat) * localT
      const lng = from.lng + (to.lng - from.lng) * localT

      markerRef.current.setLatLng([lat, lng])
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [flight])

  const icon = createAircraftIcon(bearing, true)

  return (
    <Marker
      ref={markerRef}
      position={[flight.telemetry.lat, flight.telemetry.lng]}
      icon={icon}
    >
      <Popup>
        <div className="p-1">
          <div className="font-bold text-cyan-400">{flight.flightNumber}</div>
          <div className="text-xs text-slate-300">{flight.airline}</div>
          <div className="text-xs mt-1">
            {flight.origin.code} → {flight.destination.code}
          </div>
          <div className="text-xs text-slate-400 mt-1">
            {flight.telemetry.altitude.toLocaleString()} ft · {flight.telemetry.speed} km/h
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

// ─── Main Flight Map ──────────────────────────────────────────────────────────
export default function FlightMap({ flight }) {
  if (!flight) return (
    <div className="w-full h-full flex items-center justify-center bg-navy-900 rounded-xl text-slate-500">
      Select a flight to view on map
    </div>
  )

  const curvedRoute = buildCurvedRoute(
    { lat: flight.origin.lat, lng: flight.origin.lng },
    { lat: flight.destination.lat, lng: flight.destination.lng }
  )

  const midpoint = curvedRoute[Math.floor(curvedRoute.length / 2)]

  return (
    <MapContainer
      center={midpoint}
      zoom={MAP_CONFIG.FLIGHT_ZOOM}
      style={{ width: '100%', height: '100%', borderRadius: '12px' }}
      zoomControl={true}
    >
      <TileLayer {...DARK_TILE_LAYER} />

      {/* Glow route (wider, blurred) */}
      <Polyline
        positions={curvedRoute}
        pathOptions={{
          color: 'rgba(0,229,255,0.15)',
          weight: 10,
          lineCap: 'round',
          lineJoin: 'round',
        }}
      />

      {/* Main route line */}
      <Polyline
        positions={curvedRoute}
        pathOptions={{
          color: '#00e5ff',
          weight: 2,
          dashArray: '8 6',
          lineCap: 'round',
        }}
      />

      {/* Completed route segment */}
      <Polyline
        positions={curvedRoute.slice(0, Math.floor(curvedRoute.length * (flight.telemetry.progress / 100)))}
        pathOptions={{
          color: '#22d3ee',
          weight: 3,
          lineCap: 'round',
        }}
      />

      {/* Origin airport marker */}
      <Marker
        position={[flight.origin.lat, flight.origin.lng]}
        icon={createAircraftIcon(0, false)}
      >
        <Popup>
          <div className="p-1 text-xs">
            <div className="font-bold text-cyan-400">{flight.origin.code}</div>
            <div>{flight.origin.name}</div>
          </div>
        </Popup>
      </Marker>

      {/* Destination airport marker */}
      <Marker
        position={[flight.destination.lat, flight.destination.lng]}
        icon={createAircraftIcon(0, false)}
      >
        <Popup>
          <div className="p-1 text-xs">
            <div className="font-bold text-cyan-400">{flight.destination.code}</div>
            <div>{flight.destination.name}</div>
          </div>
        </Popup>
      </Marker>

      {/* Animated aircraft marker */}
      <AnimatedAircraftMarker flight={flight} />

      <MapRecenter center={midpoint} zoom={MAP_CONFIG.FLIGHT_ZOOM} />
    </MapContainer>
  )
}
