/**
 * Comprehensive Indian airport data — 60 airports across all states and UTs.
 * Used for autocomplete dropdowns in FlightTracker.
 */

// ─── Routes ───────────────────────────────────────────────────────────────────
export const ROUTES = {
  HOME: '/',
  FLIGHTS: '/flights',
  TRAINS: '/trains',
  DASHBOARD: '/dashboard',
}

// ─── Socket Event Names (namespaced) ──────────────────────────────────────────
export const SOCKET_EVENTS = {
  TRAIN_UPDATE: 'train:update',
  FLIGHT_UPDATE: 'flight:update',
  DASHBOARD_UPDATE: 'dashboard:update',
  ACTIVITY_EVENT: 'activity:event',
  SUBSCRIBE_TRAIN: 'subscribe:train',
  SUBSCRIBE_FLIGHT: 'subscribe:flight',
  UNSUBSCRIBE_TRAIN: 'unsubscribe:train',
  UNSUBSCRIBE_FLIGHT: 'unsubscribe:flight',
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  CONNECT_ERROR: 'connect_error',
}

// ─── Design System Colors ──────────────────────────────────────────────────────
export const COLORS = {
  navy: { 950: '#020817', 900: '#050d1f', 800: '#091428', 700: '#0d1f3c' },
  charcoal: { 900: '#0f0f13', 800: '#16161d', 700: '#1e1e28' },
  cyan: { 400: '#22d3ee', 500: '#06b6d4', glow: '#00e5ff' },
  violet: { 400: '#a78bfa', 500: '#8b5cf6', glow: '#7c3aed' },
  success: '#10b981',
  warning: '#f59e0b',
  danger: '#ef4444',
  info: '#3b82f6',
}

// ─── Map Configuration ─────────────────────────────────────────────────────────
export const MAP_CONFIG = {
  DEFAULT_CENTER: [20.5937, 78.9629],
  DEFAULT_ZOOM: 5,
  TILE_URL: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
  TILE_ATTRIBUTION: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors © <a href="https://carto.com/attributions">CARTO</a>',
  FLIGHT_ZOOM: 7,
  TRAIN_ZOOM: 7,
}

// ─── API Endpoints ──────────────────────────────────────────────────────────────
export const API_BASE = import.meta?.env?.VITE_API_URL || '/api'
export const API_ENDPOINTS = {
  FLIGHTS: `${API_BASE}/flights`,
  FLIGHT_BY_ID: (id) => `${API_BASE}/flights/${id}`,
  TRAINS: `${API_BASE}/trains`,
  TRAIN_BY_ID: (id) => `${API_BASE}/trains/${id}`,
  DASHBOARD: `${API_BASE}/dashboard/summary`,
}

// ─── Indian Airports — 60 airports across all states ──────────────────────────
export const INDIAN_AIRPORTS = [
  // ── North India ──
  { code: 'DEL', name: 'Indira Gandhi International', city: 'New Delhi', state: 'Delhi', lat: 28.5562, lng: 77.1000 },
  { code: 'IXC', name: 'Shaheed Bhagat Singh International', city: 'Chandigarh', state: 'Punjab', lat: 30.6735, lng: 76.7885 },
  { code: 'ATQ', name: 'Sri Guru Ram Dass Jee International', city: 'Amritsar', state: 'Punjab', lat: 31.7096, lng: 74.7973 },
  { code: 'LUH', name: 'Sahnewal Airport', city: 'Ludhiana', state: 'Punjab', lat: 30.8547, lng: 75.9526 },
  { code: 'SXR', name: 'Sheikh ul-Alam International', city: 'Srinagar', state: 'J&K', lat: 33.9870, lng: 74.7742 },
  { code: 'IXI', name: 'Lilabari Airport', city: 'Lakhimpur', state: 'Assam', lat: 27.2955, lng: 94.0976 },
  { code: 'DHM', name: 'Kangra Airport', city: 'Dharamsala', state: 'Himachal Pradesh', lat: 32.1651, lng: 76.2634 },
  { code: 'KUU', name: 'Kullu Manali Airport', city: 'Bhuntar', state: 'Himachal Pradesh', lat: 31.8767, lng: 77.1544 },
  { code: 'IXD', name: 'Allahabad Airport', city: 'Prayagraj', state: 'Uttar Pradesh', lat: 25.4401, lng: 81.7339 },
  { code: 'LKO', name: 'Chaudhary Charan Singh International', city: 'Lucknow', state: 'Uttar Pradesh', lat: 26.7606, lng: 80.8893 },
  { code: 'VNS', name: 'Lal Bahadur Shastri International', city: 'Varanasi', state: 'Uttar Pradesh', lat: 25.4524, lng: 82.8593 },
  { code: 'AGR', name: 'Agra Airport', city: 'Agra', state: 'Uttar Pradesh', lat: 27.1558, lng: 77.9609 },
  { code: 'JAI', name: 'Jaipur International', city: 'Jaipur', state: 'Rajasthan', lat: 26.8242, lng: 75.8122 },
  { code: 'UDR', name: 'Maharana Pratap Airport', city: 'Udaipur', state: 'Rajasthan', lat: 24.6177, lng: 73.8961 },
  { code: 'JDH', name: 'Jodhpur Airport', city: 'Jodhpur', state: 'Rajasthan', lat: 26.2511, lng: 73.0489 },

  // ── West India ──
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International', city: 'Mumbai', state: 'Maharashtra', lat: 19.0896, lng: 72.8656 },
  { code: 'PNQ', name: 'Pune Airport', city: 'Pune', state: 'Maharashtra', lat: 18.5822, lng: 73.9197 },
  { code: 'NAG', name: 'Dr. Babasaheb Ambedkar International', city: 'Nagpur', state: 'Maharashtra', lat: 21.0922, lng: 79.0472 },
  { code: 'ISK', name: 'Gandhinagar Airport', city: 'Nashik', state: 'Maharashtra', lat: 20.1191, lng: 73.9130 },
  { code: 'AMD', name: 'Sardar Vallabhbhai Patel International', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0772, lng: 72.6347 },
  { code: 'BDQ', name: 'Vadodara Airport', city: 'Vadodara', state: 'Gujarat', lat: 22.3362, lng: 73.2268 },
  { code: 'STV', name: 'Surat Airport', city: 'Surat', state: 'Gujarat', lat: 21.1141, lng: 72.7418 },
  { code: 'RAJ', name: 'Rajkot Airport', city: 'Rajkot', state: 'Gujarat', lat: 22.3092, lng: 70.7795 },
  { code: 'DIU', name: 'Diu Airport', city: 'Diu', state: 'Daman & Diu', lat: 20.7131, lng: 70.9211 },
  { code: 'GOI', name: 'Goa International (Dabolim)', city: 'Goa', state: 'Goa', lat: 15.3808, lng: 73.8314 },
  { code: 'GOX', name: 'Manohar International Airport', city: 'Mopa', state: 'Goa', lat: 15.7122, lng: 73.8705 },

  // ── Central India ──
  { code: 'BHO', name: 'Raja Bhoj Airport', city: 'Bhopal', state: 'Madhya Pradesh', lat: 23.2875, lng: 77.3374 },
  { code: 'IDR', name: 'Devi Ahilyabai Holkar Airport', city: 'Indore', state: 'Madhya Pradesh', lat: 22.7218, lng: 75.8011 },
  { code: 'GWL', name: 'Gwalior Airport', city: 'Gwalior', state: 'Madhya Pradesh', lat: 26.2933, lng: 78.2278 },
  { code: 'JLR', name: 'Jabalpur Airport', city: 'Jabalpur', state: 'Madhya Pradesh', lat: 23.1778, lng: 80.0520 },
  { code: 'RPR', name: 'Swami Vivekananda Airport', city: 'Raipur', state: 'Chhattisgarh', lat: 21.1804, lng: 81.7388 },

  // ── South India ──
  { code: 'BLR', name: 'Kempegowda International', city: 'Bengaluru', state: 'Karnataka', lat: 13.1986, lng: 77.7066 },
  { code: 'MYQ', name: 'Mysore Airport', city: 'Mysuru', state: 'Karnataka', lat: 12.2308, lng: 76.6496 },
  { code: 'HUB', name: 'Hubli Airport', city: 'Hubballi', state: 'Karnataka', lat: 15.3617, lng: 75.0849 },
  { code: 'MAA', name: 'Chennai International', city: 'Chennai', state: 'Tamil Nadu', lat: 12.9900, lng: 80.1693 },
  { code: 'TRZ', name: 'Tiruchirappalli International', city: 'Trichy', state: 'Tamil Nadu', lat: 10.7654, lng: 78.7097 },
  { code: 'TRV', name: 'Trivandrum International', city: 'Thiruvananthapuram', state: 'Kerala', lat: 8.4821, lng: 76.9201 },
  { code: 'COK', name: 'Cochin International', city: 'Kochi', state: 'Kerala', lat: 10.1520, lng: 76.4019 },
  { code: 'CCJ', name: 'Calicut International', city: 'Kozhikode', state: 'Kerala', lat: 11.1368, lng: 75.9553 },
  { code: 'HYD', name: 'Rajiv Gandhi International', city: 'Hyderabad', state: 'Telangana', lat: 17.2403, lng: 78.4294 },
  { code: 'VGA', name: 'Vijayawada Airport', city: 'Vijayawada', state: 'Andhra Pradesh', lat: 16.5304, lng: 80.7968 },
  { code: 'VTZ', name: 'Visakhapatnam Airport', city: 'Visakhapatnam', state: 'Andhra Pradesh', lat: 17.7212, lng: 83.2244 },
  { code: 'TIR', name: 'Tirupati Airport', city: 'Tirupati', state: 'Andhra Pradesh', lat: 13.6325, lng: 79.5433 },
  { code: 'MDU', name: 'Madurai Airport', city: 'Madurai', state: 'Tamil Nadu', lat: 9.8345, lng: 78.0934 },
  { code: 'CJB', name: 'Coimbatore International', city: 'Coimbatore', state: 'Tamil Nadu', lat: 11.0300, lng: 77.0435 },

  // ── East India ──
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose International', city: 'Kolkata', state: 'West Bengal', lat: 22.6547, lng: 88.4467 },
  { code: 'BBI', name: 'Biju Patnaik International', city: 'Bhubaneswar', state: 'Odisha', lat: 20.2444, lng: 85.8178 },
  { code: 'PAT', name: 'Jay Prakash Narayan International', city: 'Patna', state: 'Bihar', lat: 25.5913, lng: 85.0880 },
  { code: 'GAY', name: 'Gaya Airport', city: 'Gaya', state: 'Bihar', lat: 24.7443, lng: 84.9512 },
  { code: 'IXR', name: 'Birsa Munda Airport', city: 'Ranchi', state: 'Jharkhand', lat: 23.3143, lng: 85.3217 },

  // ── Northeast India ──
  { code: 'GAU', name: 'Lokpriya Gopinath Bordoloi International', city: 'Guwahati', state: 'Assam', lat: 26.1061, lng: 91.5859 },
  { code: 'IMF', name: 'Imphal Airport', city: 'Imphal', state: 'Manipur', lat: 24.7600, lng: 93.8967 },
  { code: 'SHL', name: 'Shillong Airport', city: 'Shillong', state: 'Meghalaya', lat: 25.7036, lng: 91.9787 },
  { code: 'AJL', name: 'Lengpui Airport', city: 'Aizawl', state: 'Mizoram', lat: 23.8406, lng: 92.6197 },
  { code: 'DIB', name: 'Dibrugarh Airport', city: 'Dibrugarh', state: 'Assam', lat: 27.4839, lng: 95.0169 },
  { code: 'IXB', name: 'Bagdogra Airport', city: 'Siliguri', state: 'West Bengal', lat: 26.6812, lng: 88.3286 },
  { code: 'DMU', name: 'Dimapur Airport', city: 'Dimapur', state: 'Nagaland', lat: 25.8839, lng: 93.7712 },
  { code: 'RGH', name: 'Balurghat Airport', city: 'Balurghat', state: 'West Bengal', lat: 25.2567, lng: 88.7956 },

  // ── Island Territories ──
  { code: 'IXZ', name: 'Veer Savarkar International', city: 'Port Blair', state: 'Andaman & Nicobar', lat: 11.6412, lng: 92.7296 },
  { code: 'AGX', name: 'Agatti Aerodrome', city: 'Agatti', state: 'Lakshadweep', lat: 10.8237, lng: 72.1760 },
]

// ─── Train Status Types ─────────────────────────────────────────────────────────
export const TRAIN_STATUS = {
  ON_TIME: 'ON_TIME',
  DELAYED: 'DELAYED',
  EARLY: 'EARLY',
  CANCELLED: 'CANCELLED',
  RUNNING: 'RUNNING',
  SCHEDULED: 'SCHEDULED',
  ARRIVED: 'ARRIVED',
}

// ─── Flight Status Types ────────────────────────────────────────────────────────
export const FLIGHT_STATUS = {
  SCHEDULED: 'SCHEDULED',
  BOARDING: 'BOARDING',
  DEPARTED: 'DEPARTED',
  EN_ROUTE: 'EN_ROUTE',
  LANDED: 'LANDED',
  DELAYED: 'DELAYED',
  CANCELLED: 'CANCELLED',
}

// ─── Simulation Config ──────────────────────────────────────────────────────────
export const SIM_CONFIG = {
  TRAIN_UPDATE_INTERVAL_MS: 3000,
  FLIGHT_UPDATE_INTERVAL_MS: 5000,
  MAX_TRAIN_DELAY_MIN: 15,
  LERP_STEPS: 30,
}
