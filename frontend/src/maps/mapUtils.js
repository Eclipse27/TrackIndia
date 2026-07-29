import L from 'leaflet'
import { MAP_CONFIG, COLORS } from '../utils/constants'

/**
 * Create a custom Leaflet DivIcon for an aircraft marker.
 * The icon rotates to match the flight heading.
 */
export function createAircraftIcon(heading = 0, isSelected = false) {
  const size = isSelected ? 36 : 28
  const color = isSelected ? COLORS.cyan.glow : '#22d3ee'
  const glow = isSelected ? '0 0 16px rgba(0,229,255,0.7)' : '0 0 8px rgba(0,229,255,0.4)'

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"
      style="transform: rotate(${heading}deg); filter: drop-shadow(${glow});">
      <path d="M16 2L26 22L16 18L6 22L16 2Z" fill="${color}" opacity="0.95"/>
      <path d="M16 18L26 22L16 20L6 22L16 18Z" fill="${color}" opacity="0.4"/>
      <circle cx="16" cy="16" r="3" fill="${color}" opacity="0.7"/>
    </svg>
  `

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

/**
 * Create a custom Leaflet DivIcon for a train marker.
 */
export function createTrainIcon(isSelected = false) {
  const size = isSelected ? 36 : 28
  const color = isSelected ? COLORS.violet.glow : '#8b5cf6'
  const glow = isSelected ? '0 0 16px rgba(124,58,237,0.7)' : '0 0 8px rgba(124,58,237,0.4)'

  const svg = `
    <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg"
      style="filter: drop-shadow(${glow});">
      <rect x="6" y="4" width="20" height="20" rx="4" fill="${color}" opacity="0.9"/>
      <rect x="9" y="8" width="5" height="4" rx="1" fill="rgba(0,229,255,0.4)"/>
      <rect x="18" y="8" width="5" height="4" rx="1" fill="rgba(0,229,255,0.4)"/>
      <rect x="6" y="20" width="20" height="3" fill="${color}" opacity="0.5"/>
      <circle cx="10" cy="27" r="3" fill="${color}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
      <circle cx="22" cy="27" r="3" fill="${color}" stroke="rgba(255,255,255,0.2)" stroke-width="1"/>
    </svg>
  `

  return L.divIcon({
    html: svg,
    className: '',
    iconSize: [size, size + 8],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2],
  })
}

/**
 * Linear interpolation between two numbers.
 */
export function lerp(a, b, t) {
  return a + (b - a) * t
}

/**
 * Interpolate between two lat/lng positions.
 */
export function lerpLatLng(from, to, t) {
  return {
    lat: lerp(from.lat, to.lat, t),
    lng: lerp(from.lng, to.lng, t),
  }
}

/**
 * Calculate bearing between two coordinates (in degrees).
 */
export function calculateBearing(from, to) {
  const toRad = (deg) => (deg * Math.PI) / 180
  const toDeg = (rad) => (rad * 180) / Math.PI

  const dLng = toRad(to.lng - from.lng)
  const lat1 = toRad(from.lat)
  const lat2 = toRad(to.lat)

  const y = Math.sin(dLng) * Math.cos(lat2)
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng)

  return (toDeg(Math.atan2(y, x)) + 360) % 360
}

/**
 * Build a curved great-circle-like polyline between two points.
 * Returns an array of [lat, lng] tuples.
 */
export function buildCurvedRoute(from, to, points = 40) {
  const coords = []
  for (let i = 0; i <= points; i++) {
    const t = i / points
    const lat = lerp(from.lat, to.lat, t)
    const lng = lerp(from.lng, to.lng, t)
    // Add slight arc by pushing the midpoint outward
    const arc = Math.sin(Math.PI * t) * (Math.abs(to.lat - from.lat) * 0.15)
    coords.push([lat + arc, lng])
  }
  return coords
}

/**
 * Default dark map tile layer config.
 */
export const DARK_TILE_LAYER = {
  url: MAP_CONFIG.TILE_URL,
  attribution: MAP_CONFIG.TILE_ATTRIBUTION,
  maxZoom: 18,
}
