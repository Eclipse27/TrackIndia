import { useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Polyline, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { MAP_CONFIG } from '../utils/constants'
import { createTrainIcon, DARK_TILE_LAYER } from './mapUtils'

function MapRecenter({ center, zoom }) {
  const map = useMap()
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom || MAP_CONFIG.TRAIN_ZOOM, { duration: 1.5, easeLinearity: 0.3 })
    }
  }, [center, zoom, map])
  return null
}

function AnimatedTrainMarker({ train }) {
  const markerRef = useRef(null)
  const animFrameRef = useRef(null)
  const progressRef = useRef(train.journeyProgress / 100)

  const route = train.route

  useEffect(() => {
    const animate = () => {
      if (!markerRef.current || route.length < 2) return

      progressRef.current = Math.min(progressRef.current + 0.0015, 1)
      const t = progressRef.current
      const routeLen = route.length - 1
      const segT = t * routeLen
      const segIdx = Math.min(Math.floor(segT), routeLen - 1)
      const localT = segT - segIdx
      const from = route[segIdx]
      const to = route[Math.min(segIdx + 1, routeLen)]

      const lat = from.lat + (to.lat - from.lat) * localT
      const lng = from.lng + (to.lng - from.lng) * localT

      markerRef.current.setLatLng([lat, lng])
      animFrameRef.current = requestAnimationFrame(animate)
    }

    animFrameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animFrameRef.current)
  }, [train, route])

  return (
    <Marker
      ref={markerRef}
      position={[train.position.lat, train.position.lng]}
      icon={createTrainIcon(true)}
    >
      <Popup>
        <div className="p-1">
          <div className="font-bold" style={{ color: '#a78bfa' }}>
            #{train.number} {train.name}
          </div>
          <div className="text-xs mt-1">
            {train.origin.code} → {train.destination.code}
          </div>
          <div className="text-xs mt-1" style={{ color: '#94a3b8' }}>
            {train.speed} km/h · {train.occupancy}% occupied
          </div>
        </div>
      </Popup>
    </Marker>
  )
}

export default function TrainMap({ train }) {
  if (!train) return (
    <div className="w-full h-full flex items-center justify-center rounded-xl text-slate-500"
      style={{ background: '#050d1f' }}>
      Select a train to view on map
    </div>
  )

  const routeCoords = train.route.map((s) => [s.lat, s.lng])
  const completedIdx = Math.floor(routeCoords.length * (train.journeyProgress / 100))
  const completedCoords = routeCoords.slice(0, completedIdx + 1)

  const center = routeCoords[Math.floor(routeCoords.length / 2)]

  return (
    <MapContainer
      center={center}
      zoom={MAP_CONFIG.TRAIN_ZOOM}
      style={{ width: '100%', height: '100%', borderRadius: '12px' }}
      zoomControl={true}
    >
      <TileLayer {...DARK_TILE_LAYER} />

      {/* Full route — dim */}
      <Polyline
        positions={routeCoords}
        pathOptions={{ color: 'rgba(139,92,246,0.2)', weight: 8, lineCap: 'round' }}
      />

      {/* Railway dashed line */}
      <Polyline
        positions={routeCoords}
        pathOptions={{ color: 'rgba(139,92,246,0.5)', weight: 2, dashArray: '6 4', lineCap: 'round' }}
      />

      {/* Completed segment */}
      {completedCoords.length > 1 && (
        <Polyline
          positions={completedCoords}
          pathOptions={{ color: '#8b5cf6', weight: 3, lineCap: 'round' }}
        />
      )}

      {/* Station markers */}
      {train.route.map((station, idx) => (
        <Marker
          key={station.code}
          position={[station.lat, station.lng]}
          icon={createTrainIcon(idx === train.currentStationIndex)}
        >
          <Popup>
            <div className="p-1 text-xs">
              <div className="font-bold" style={{ color: '#a78bfa' }}>{station.code}</div>
              <div>{station.name}</div>
              {station.scheduledArr && <div style={{ color: '#94a3b8' }}>Arr: {station.scheduledArr}</div>}
              {station.platform && <div style={{ color: '#94a3b8' }}>Platform: {station.platform}</div>}
            </div>
          </Popup>
        </Marker>
      ))}

      <AnimatedTrainMarker train={train} />
      <MapRecenter center={center} zoom={MAP_CONFIG.TRAIN_ZOOM} />
    </MapContainer>
  )
}
