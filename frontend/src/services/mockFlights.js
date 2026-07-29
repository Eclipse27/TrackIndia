/**
 * Comprehensive Indian domestic flight data — 50 flights.
 * All major airlines, all states, all statuses.
 * Real flight numbers, real routes, real aircraft types.
 */

// Helper to build a simple great-circle-ish waypoint route between two coordinates
function buildRoute(fromLat, fromLng, toLat, toLng, steps = 5) {
  const pts = []
  for (let i = 0; i <= steps; i++) {
    const t = i / steps
    // slight arc to mimic flight path curvature
    const midLat = (fromLat + toLat) / 2 + (toLng - fromLng) * 0.04
    const midLng = (fromLng + toLng) / 2 - (toLat - fromLat) * 0.04
    const lat = (1 - t) * (1 - t) * fromLat + 2 * (1 - t) * t * midLat + t * t * toLat
    const lng = (1 - t) * (1 - t) * fromLng + 2 * (1 - t) * t * midLng + t * t * toLng
    pts.push({ lat: +lat.toFixed(4), lng: +lng.toFixed(4) })
  }
  return pts
}

function lerp(a, b, t) { return a + (b - a) * t }
function midPos(o, d, progress) {
  const t = progress / 100
  return { lat: lerp(o.lat, d.lat, t), lng: lerp(o.lng, d.lng, t) }
}

// Airport shorthand objects
const AIRPORTS = {
  DEL: { code: 'DEL', name: 'Indira Gandhi Intl', city: 'New Delhi', lat: 28.5562, lng: 77.1000 },
  BOM: { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj Intl', city: 'Mumbai', lat: 19.0896, lng: 72.8656 },
  BLR: { code: 'BLR', name: 'Kempegowda Intl', city: 'Bengaluru', lat: 13.1986, lng: 77.7066 },
  MAA: { code: 'MAA', name: 'Chennai Intl', city: 'Chennai', lat: 12.9900, lng: 80.1693 },
  HYD: { code: 'HYD', name: 'Rajiv Gandhi Intl', city: 'Hyderabad', lat: 17.2403, lng: 78.4294 },
  CCU: { code: 'CCU', name: 'Netaji Subhas Chandra Bose Intl', city: 'Kolkata', lat: 22.6547, lng: 88.4467 },
  COK: { code: 'COK', name: 'Cochin Intl', city: 'Kochi', lat: 10.1520, lng: 76.4019 },
  AMD: { code: 'AMD', name: 'Sardar Vallabhbhai Patel Intl', city: 'Ahmedabad', lat: 23.0772, lng: 72.6347 },
  GOI: { code: 'GOI', name: 'Goa Intl (Dabolim)', city: 'Goa', lat: 15.3808, lng: 73.8314 },
  PNQ: { code: 'PNQ', name: 'Pune Airport', city: 'Pune', lat: 18.5822, lng: 73.9197 },
  JAI: { code: 'JAI', name: 'Jaipur Intl', city: 'Jaipur', lat: 26.8242, lng: 75.8122 },
  LKO: { code: 'LKO', name: 'Chaudhary Charan Singh Intl', city: 'Lucknow', lat: 26.7606, lng: 80.8893 },
  PAT: { code: 'PAT', name: 'Jay Prakash Narayan Intl', city: 'Patna', lat: 25.5913, lng: 85.0880 },
  BBI: { code: 'BBI', name: 'Biju Patnaik Intl', city: 'Bhubaneswar', lat: 20.2444, lng: 85.8178 },
  IXC: { code: 'IXC', name: 'Shaheed Bhagat Singh Intl', city: 'Chandigarh', lat: 30.6735, lng: 76.7885 },
  NAG: { code: 'NAG', name: 'Dr. Babasaheb Ambedkar Intl', city: 'Nagpur', lat: 21.0922, lng: 79.0472 },
  VTZ: { code: 'VTZ', name: 'Visakhapatnam Airport', city: 'Visakhapatnam', lat: 17.7212, lng: 83.2244 },
  TRV: { code: 'TRV', name: 'Trivandrum Intl', city: 'Thiruvananthapuram', lat: 8.4821, lng: 76.9201 },
  IXB: { code: 'IXB', name: 'Bagdogra Airport', city: 'Siliguri', lat: 26.6812, lng: 88.3286 },
  SXR: { code: 'SXR', name: 'Sheikh ul-Alam Intl', city: 'Srinagar', lat: 33.9870, lng: 74.7742 },
  ATQ: { code: 'ATQ', name: 'Sri Guru Ram Dass Jee Intl', city: 'Amritsar', lat: 31.7096, lng: 74.7973 },
  GAU: { code: 'GAU', name: 'Lokpriya Gopinath Bordoloi Intl', city: 'Guwahati', lat: 26.1061, lng: 91.5859 },
  IXR: { code: 'IXR', name: 'Birsa Munda Airport', city: 'Ranchi', lat: 23.3143, lng: 85.3217 },
  RPR: { code: 'RPR', name: 'Swami Vivekananda Airport', city: 'Raipur', lat: 21.1804, lng: 81.7388 },
  TRZ: { code: 'TRZ', name: 'Tiruchirappalli Intl', city: 'Trichy', lat: 10.7654, lng: 78.7097 },
  UDR: { code: 'UDR', name: 'Maharana Pratap Airport', city: 'Udaipur', lat: 24.6177, lng: 73.8961 },
  IMF: { code: 'IMF', name: 'Imphal Airport', city: 'Imphal', lat: 24.7600, lng: 93.8967 },
  IDR: { code: 'IDR', name: 'Devi Ahilyabai Holkar Airport', city: 'Indore', lat: 22.7218, lng: 75.8011 },
  IXZ: { code: 'IXZ', name: 'Veer Savarkar Intl', city: 'Port Blair', lat: 11.6412, lng: 92.7296 },
  CCJ: { code: 'CCJ', name: 'Calicut Intl', city: 'Kozhikode', lat: 11.1368, lng: 75.9553 },
  CJB: { code: 'CJB', name: 'Coimbatore Intl', city: 'Coimbatore', lat: 11.0300, lng: 77.0435 },
  MDU: { code: 'MDU', name: 'Madurai Airport', city: 'Madurai', lat: 9.8345, lng: 78.0934 },
  VNS: { code: 'VNS', name: 'Lal Bahadur Shastri Intl', city: 'Varanasi', lat: 25.4524, lng: 82.8593 },
  DHM: { code: 'DHM', name: 'Kangra Airport', city: 'Dharamsala', lat: 32.1651, lng: 76.2634 },
  HUB: { code: 'HUB', name: 'Hubli Airport', city: 'Hubballi', lat: 15.3617, lng: 75.0849 },
}

function makeFlight({ id, fn, airline, reg, aircraft, status, o, d, dep, arr, progress, heading, alt, speed, delay, gate, terminal }) {
  const pos = progress > 0 && progress < 100 ? midPos(o, d, progress) : { lat: o.lat, lng: o.lng }
  return {
    id,
    flightNumber: fn,
    airline,
    registration: reg,
    aircraftType: aircraft,
    status,
    origin: o,
    destination: d,
    departure: { scheduled: dep, actual: delay > 0 && status !== 'SCHEDULED' ? dep : dep },
    arrival: { scheduled: arr, estimated: arr },
    telemetry: {
      lat: pos.lat,
      lng: pos.lng,
      altitude: status === 'EN_ROUTE' ? alt : status === 'LANDED' ? 0 : status === 'BOARDING' ? 0 : 0,
      speed: status === 'EN_ROUTE' ? speed : 0,
      heading,
      progress,
    },
    route: buildRoute(o.lat, o.lng, d.lat, d.lng, 6),
    delay,
    gate,
    terminal: String(terminal),
  }
}

const today = '2026-05-30'

export const MOCK_FLIGHTS = [
  // ══ Air India (AI) ════════════════════════════════════════════════════════════
  makeFlight({ id: 'AI-101', fn: 'AI 101', airline: 'Air India', reg: 'VT-ANA', aircraft: 'Boeing 787-8',
    status: 'EN_ROUTE', o: AIRPORTS.DEL, d: AIRPORTS.BOM,
    dep: `${today}T08:00:00+05:30`, arr: `${today}T10:15:00+05:30`,
    progress: 55, heading: 215, alt: 35000, speed: 820, delay: 0, gate: 'D14', terminal: 2 }),

  makeFlight({ id: 'AI-302', fn: 'AI 302', airline: 'Air India', reg: 'VT-ANB', aircraft: 'Airbus A320',
    status: 'LANDED', o: AIRPORTS.BOM, d: AIRPORTS.DEL,
    dep: `${today}T06:00:00+05:30`, arr: `${today}T08:05:00+05:30`,
    progress: 100, heading: 35, alt: 0, speed: 0, delay: 0, gate: 'B3', terminal: 1 }),

  makeFlight({ id: 'AI-503', fn: 'AI 503', airline: 'Air India', reg: 'VT-ANC', aircraft: 'Boeing 787-8',
    status: 'EN_ROUTE', o: AIRPORTS.DEL, d: AIRPORTS.CCU,
    dep: `${today}T09:30:00+05:30`, arr: `${today}T12:00:00+05:30`,
    progress: 40, heading: 95, alt: 33000, speed: 810, delay: 0, gate: 'D22', terminal: 3 }),

  makeFlight({ id: 'AI-661', fn: 'AI 661', airline: 'Air India', reg: 'VT-AND', aircraft: 'Airbus A321',
    status: 'DELAYED', o: AIRPORTS.DEL, d: AIRPORTS.SXR,
    dep: `${today}T11:00:00+05:30`, arr: `${today}T12:15:00+05:30`,
    progress: 0, heading: 335, alt: 0, speed: 0, delay: 45, gate: 'A5', terminal: 1 }),

  makeFlight({ id: 'AI-441', fn: 'AI 441', airline: 'Air India', reg: 'VT-ANE', aircraft: 'Boeing 737-800',
    status: 'SCHEDULED', o: AIRPORTS.BLR, d: AIRPORTS.IXZ,
    dep: `${today}T14:30:00+05:30`, arr: `${today}T17:10:00+05:30`,
    progress: 0, heading: 105, alt: 0, speed: 0, delay: 0, gate: 'C12', terminal: 1 }),

  makeFlight({ id: 'AI-809', fn: 'AI 809', airline: 'Air India', reg: 'VT-ANF', aircraft: 'Airbus A320neo',
    status: 'EN_ROUTE', o: AIRPORTS.MAA, d: AIRPORTS.DEL,
    dep: `${today}T07:00:00+05:30`, arr: `${today}T09:45:00+05:30`,
    progress: 72, heading: 345, alt: 36000, speed: 840, delay: 0, gate: 'A8', terminal: 1 }),

  makeFlight({ id: 'AI-412', fn: 'AI 412', airline: 'Air India', reg: 'VT-ANG', aircraft: 'Boeing 787-8',
    status: 'BOARDING', o: AIRPORTS.DEL, d: AIRPORTS.ATQ,
    dep: `${today}T13:10:00+05:30`, arr: `${today}T14:25:00+05:30`,
    progress: 0, heading: 310, alt: 0, speed: 0, delay: 0, gate: 'D8', terminal: 2 }),

  // ══ IndiGo (6E) ═══════════════════════════════════════════════════════════════
  makeFlight({ id: '6E-441', fn: '6E 441', airline: 'IndiGo', reg: 'VT-ITZ', aircraft: 'Airbus A320neo',
    status: 'EN_ROUTE', o: AIRPORTS.BLR, d: AIRPORTS.HYD,
    dep: `${today}T09:30:00+05:30`, arr: `${today}T10:45:00+05:30`,
    progress: 60, heading: 25, alt: 28000, speed: 790, delay: 0, gate: 'C8', terminal: 1 }),

  makeFlight({ id: '6E-2096', fn: '6E 2096', airline: 'IndiGo', reg: 'VT-ITL', aircraft: 'Airbus A321neo',
    status: 'EN_ROUTE', o: AIRPORTS.DEL, d: AIRPORTS.BLR,
    dep: `${today}T10:00:00+05:30`, arr: `${today}T12:45:00+05:30`,
    progress: 48, heading: 195, alt: 35000, speed: 830, delay: 0, gate: 'A12', terminal: 1 }),

  makeFlight({ id: '6E-818', fn: '6E 818', airline: 'IndiGo', reg: 'VT-ITM', aircraft: 'Airbus A320neo',
    status: 'LANDED', o: AIRPORTS.BOM, d: AIRPORTS.HYD,
    dep: `${today}T06:30:00+05:30`, arr: `${today}T08:00:00+05:30`,
    progress: 100, heading: 120, alt: 0, speed: 0, delay: 0, gate: 'G4', terminal: 2 }),

  makeFlight({ id: '6E-1024', fn: '6E 1024', airline: 'IndiGo', reg: 'VT-ITN', aircraft: 'Airbus A320',
    status: 'DELAYED', o: AIRPORTS.CCU, d: AIRPORTS.DEL,
    dep: `${today}T08:00:00+05:30`, arr: `${today}T10:30:00+05:30`,
    progress: 0, heading: 285, alt: 0, speed: 0, delay: 30, gate: 'B6', terminal: 2 }),

  makeFlight({ id: '6E-563', fn: '6E 563', airline: 'IndiGo', reg: 'VT-ITO', aircraft: 'Airbus A320neo',
    status: 'EN_ROUTE', o: AIRPORTS.HYD, d: AIRPORTS.MAA,
    dep: `${today}T07:45:00+05:30`, arr: `${today}T09:00:00+05:30`,
    progress: 65, heading: 170, alt: 27000, speed: 770, delay: 0, gate: 'A3', terminal: 1 }),

  makeFlight({ id: '6E-333', fn: '6E 333', airline: 'IndiGo', reg: 'VT-ITP', aircraft: 'ATR 72-600',
    status: 'EN_ROUTE', o: AIRPORTS.GAU, d: AIRPORTS.IMF,
    dep: `${today}T10:15:00+05:30`, arr: `${today}T11:10:00+05:30`,
    progress: 50, heading: 95, alt: 18000, speed: 520, delay: 0, gate: 'T1', terminal: 1 }),

  makeFlight({ id: '6E-7777', fn: '6E 7777', airline: 'IndiGo', reg: 'VT-ITQ', aircraft: 'Airbus A321XLR',
    status: 'SCHEDULED', o: AIRPORTS.DEL, d: AIRPORTS.LKO,
    dep: `${today}T17:30:00+05:30`, arr: `${today}T18:45:00+05:30`,
    progress: 0, heading: 112, alt: 0, speed: 0, delay: 0, gate: 'D10', terminal: 1 }),

  makeFlight({ id: '6E-204', fn: '6E 204', airline: 'IndiGo', reg: 'VT-ITR', aircraft: 'Airbus A320neo',
    status: 'BOARDING', o: AIRPORTS.BOM, d: AIRPORTS.COK,
    dep: `${today}T12:00:00+05:30`, arr: `${today}T13:45:00+05:30`,
    progress: 0, heading: 185, alt: 0, speed: 0, delay: 0, gate: 'C5', terminal: 2 }),

  makeFlight({ id: '6E-512', fn: '6E 512', airline: 'IndiGo', reg: 'VT-ITS', aircraft: 'Airbus A320',
    status: 'CANCELLED', o: AIRPORTS.DEL, d: AIRPORTS.PAT,
    dep: `${today}T09:00:00+05:30`, arr: `${today}T10:15:00+05:30`,
    progress: 0, heading: 110, alt: 0, speed: 0, delay: 0, gate: '—', terminal: 1 }),

  // ══ SpiceJet (SG) ═════════════════════════════════════════════════════════════
  makeFlight({ id: 'SG-102', fn: 'SG 102', airline: 'SpiceJet', reg: 'VT-SZR', aircraft: 'Boeing 737 MAX 8',
    status: 'EN_ROUTE', o: AIRPORTS.MAA, d: AIRPORTS.CCU,
    dep: `${today}T07:15:00+05:30`, arr: `${today}T09:45:00+05:30`,
    progress: 65, heading: 42, alt: 33000, speed: 845, delay: 20, gate: 'A3', terminal: 1 }),

  makeFlight({ id: 'SG-211', fn: 'SG 211', airline: 'SpiceJet', reg: 'VT-SZS', aircraft: 'Boeing 737-800',
    status: 'EN_ROUTE', o: AIRPORTS.DEL, d: AIRPORTS.GOI,
    dep: `${today}T08:30:00+05:30`, arr: `${today}T11:00:00+05:30`,
    progress: 45, heading: 205, alt: 34000, speed: 820, delay: 0, gate: 'B7', terminal: 1 }),

  makeFlight({ id: 'SG-505', fn: 'SG 505', airline: 'SpiceJet', reg: 'VT-SZT', aircraft: 'Boeing 737 MAX 8',
    status: 'DELAYED', o: AIRPORTS.BOM, d: AIRPORTS.CCU,
    dep: `${today}T06:00:00+05:30`, arr: `${today}T08:30:00+05:30`,
    progress: 0, heading: 65, alt: 0, speed: 0, delay: 55, gate: 'G2', terminal: 2 }),

  makeFlight({ id: 'SG-711', fn: 'SG 711', airline: 'SpiceJet', reg: 'VT-SZU', aircraft: 'Bombardier Q400',
    status: 'EN_ROUTE', o: AIRPORTS.DEL, d: AIRPORTS.UDR,
    dep: `${today}T09:00:00+05:30`, arr: `${today}T10:30:00+05:30`,
    progress: 55, heading: 225, alt: 22000, speed: 540, delay: 0, gate: 'A1', terminal: 1 }),

  makeFlight({ id: 'SG-901', fn: 'SG 901', airline: 'SpiceJet', reg: 'VT-SZV', aircraft: 'Boeing 737-800',
    status: 'LANDED', o: AIRPORTS.BLR, d: AIRPORTS.MAA,
    dep: `${today}T06:45:00+05:30`, arr: `${today}T07:50:00+05:30`,
    progress: 100, heading: 105, alt: 0, speed: 0, delay: 0, gate: 'C2', terminal: 1 }),

  // ══ Vistara (UK) ══════════════════════════════════════════════════════════════
  makeFlight({ id: 'UK-971', fn: 'UK 971', airline: 'Vistara', reg: 'VT-TNB', aircraft: 'Airbus A321',
    status: 'BOARDING', o: AIRPORTS.DEL, d: AIRPORTS.COK,
    dep: `${today}T11:00:00+05:30`, arr: `${today}T13:30:00+05:30`,
    progress: 0, heading: 185, alt: 0, speed: 0, delay: 0, gate: 'B22', terminal: 3 }),

  makeFlight({ id: 'UK-202', fn: 'UK 202', airline: 'Vistara', reg: 'VT-TNC', aircraft: 'Boeing 787-9',
    status: 'EN_ROUTE', o: AIRPORTS.BOM, d: AIRPORTS.DEL,
    dep: `${today}T07:30:00+05:30`, arr: `${today}T09:45:00+05:30`,
    progress: 62, heading: 15, alt: 36000, speed: 855, delay: 0, gate: 'A9', terminal: 2 }),

  makeFlight({ id: 'UK-816', fn: 'UK 816', airline: 'Vistara', reg: 'VT-TND', aircraft: 'Airbus A320neo',
    status: 'SCHEDULED', o: AIRPORTS.DEL, d: AIRPORTS.IXC,
    dep: `${today}T16:00:00+05:30`, arr: `${today}T17:10:00+05:30`,
    progress: 0, heading: 320, alt: 0, speed: 0, delay: 0, gate: 'C14', terminal: 3 }),

  makeFlight({ id: 'UK-553', fn: 'UK 553', airline: 'Vistara', reg: 'VT-TNE', aircraft: 'Airbus A321',
    status: 'EN_ROUTE', o: AIRPORTS.HYD, d: AIRPORTS.BOM,
    dep: `${today}T08:45:00+05:30`, arr: `${today}T10:30:00+05:30`,
    progress: 58, heading: 285, alt: 32000, speed: 810, delay: 0, gate: 'A7', terminal: 1 }),

  // ══ Akasa Air (QP) ════════════════════════════════════════════════════════════
  makeFlight({ id: 'QP-1301', fn: 'QP 1301', airline: 'Akasa Air', reg: 'VT-YAA', aircraft: 'Boeing 737 MAX 8',
    status: 'EN_ROUTE', o: AIRPORTS.BOM, d: AIRPORTS.BLR,
    dep: `${today}T07:00:00+05:30`, arr: `${today}T08:45:00+05:30`,
    progress: 70, heading: 160, alt: 30000, speed: 800, delay: 0, gate: 'G6', terminal: 2 }),

  makeFlight({ id: 'QP-1401', fn: 'QP 1401', airline: 'Akasa Air', reg: 'VT-YAB', aircraft: 'Boeing 737 MAX 8',
    status: 'SCHEDULED', o: AIRPORTS.DEL, d: AIRPORTS.BOM,
    dep: `${today}T19:00:00+05:30`, arr: `${today}T21:10:00+05:30`,
    progress: 0, heading: 215, alt: 0, speed: 0, delay: 0, gate: 'A15', terminal: 1 }),

  makeFlight({ id: 'QP-1501', fn: 'QP 1501', airline: 'Akasa Air', reg: 'VT-YAC', aircraft: 'Boeing 737 MAX 8',
    status: 'LANDED', o: AIRPORTS.BLR, d: AIRPORTS.DEL,
    dep: `${today}T05:30:00+05:30`, arr: `${today}T08:15:00+05:30`,
    progress: 100, heading: 345, alt: 0, speed: 0, delay: 0, gate: 'D16', terminal: 1 }),

  makeFlight({ id: 'QP-1601', fn: 'QP 1601', airline: 'Akasa Air', reg: 'VT-YAD', aircraft: 'Boeing 737 MAX 8',
    status: 'EN_ROUTE', o: AIRPORTS.HYD, d: AIRPORTS.DEL,
    dep: `${today}T09:15:00+05:30`, arr: `${today}T12:00:00+05:30`,
    progress: 42, heading: 338, alt: 34000, speed: 820, delay: 0, gate: 'A2', terminal: 1 }),

  // ══ Air Asia India (I5) ════════════════════════════════════════════════════════
  makeFlight({ id: 'I5-701', fn: 'I5 701', airline: 'Air Asia India', reg: 'VT-JAH', aircraft: 'Airbus A320',
    status: 'EN_ROUTE', o: AIRPORTS.DEL, d: AIRPORTS.BLR,
    dep: `${today}T10:30:00+05:30`, arr: `${today}T13:05:00+05:30`,
    progress: 35, heading: 195, alt: 33000, speed: 815, delay: 10, gate: 'B8', terminal: 1 }),

  makeFlight({ id: 'I5-731', fn: 'I5 731', airline: 'Air Asia India', reg: 'VT-JAI', aircraft: 'Airbus A320neo',
    status: 'DELAYED', o: AIRPORTS.BOM, d: AIRPORTS.GOI,
    dep: `${today}T08:00:00+05:30`, arr: `${today}T09:00:00+05:30`,
    progress: 0, heading: 190, alt: 0, speed: 0, delay: 70, gate: 'G9', terminal: 2 }),

  makeFlight({ id: 'I5-811', fn: 'I5 811', airline: 'Air Asia India', reg: 'VT-JAJ', aircraft: 'Airbus A320',
    status: 'BOARDING', o: AIRPORTS.BLR, d: AIRPORTS.MAA,
    dep: `${today}T12:30:00+05:30`, arr: `${today}T13:35:00+05:30`,
    progress: 0, heading: 105, alt: 0, speed: 0, delay: 0, gate: 'C3', terminal: 1 }),

  // ══ Alliance Air (9I) ═════════════════════════════════════════════════════════
  makeFlight({ id: '9I-461', fn: '9I 461', airline: 'Alliance Air', reg: 'VT-AXJ', aircraft: 'ATR 72-600',
    status: 'EN_ROUTE', o: AIRPORTS.DEL, d: AIRPORTS.DHM,
    dep: `${today}T08:00:00+05:30`, arr: `${today}T09:20:00+05:30`,
    progress: 60, heading: 295, alt: 16000, speed: 510, delay: 0, gate: 'A4', terminal: 1 }),

  makeFlight({ id: '9I-563', fn: '9I 563', airline: 'Alliance Air', reg: 'VT-AXK', aircraft: 'ATR 72-600',
    status: 'LANDED', o: AIRPORTS.BLR, d: AIRPORTS.HUB,
    dep: `${today}T07:00:00+05:30`, arr: `${today}T08:05:00+05:30`,
    progress: 100, heading: 280, alt: 0, speed: 0, delay: 0, gate: 'T1', terminal: 1 }),

  // ══ Star Air (S5) ═════════════════════════════════════════════════════════════
  makeFlight({ id: 'S5-301', fn: 'S5 301', airline: 'Star Air', reg: 'VT-SSA', aircraft: 'Embraer ERJ-145',
    status: 'EN_ROUTE', o: AIRPORTS.BLR, d: AIRPORTS.BBI,
    dep: `${today}T09:30:00+05:30`, arr: `${today}T12:15:00+05:30`,
    progress: 44, heading: 50, alt: 30000, speed: 810, delay: 0, gate: 'D1', terminal: 1 }),

  makeFlight({ id: 'S5-401', fn: 'S5 401', airline: 'Star Air', reg: 'VT-SSB', aircraft: 'Embraer ERJ-145',
    status: 'SCHEDULED', o: AIRPORTS.HYD, d: AIRPORTS.IXR,
    dep: `${today}T15:00:00+05:30`, arr: `${today}T16:45:00+05:30`,
    progress: 0, heading: 38, alt: 0, speed: 0, delay: 0, gate: 'A6', terminal: 1 }),

  // ══ Additional Major Routes ════════════════════════════════════════════════════
  makeFlight({ id: 'AI-542', fn: 'AI 542', airline: 'Air India', reg: 'VT-ANH', aircraft: 'Airbus A320neo',
    status: 'EN_ROUTE', o: AIRPORTS.DEL, d: AIRPORTS.TRV,
    dep: `${today}T07:30:00+05:30`, arr: `${today}T10:20:00+05:30`,
    progress: 55, heading: 188, alt: 34000, speed: 825, delay: 0, gate: 'D6', terminal: 2 }),

  makeFlight({ id: '6E-891', fn: '6E 891', airline: 'IndiGo', reg: 'VT-ITT', aircraft: 'Airbus A320neo',
    status: 'EN_ROUTE', o: AIRPORTS.BOM, d: AIRPORTS.VTZ,
    dep: `${today}T08:15:00+05:30`, arr: `${today}T10:00:00+05:30`,
    progress: 68, heading: 110, alt: 32000, speed: 810, delay: 0, gate: 'G1', terminal: 2 }),

  makeFlight({ id: 'SG-301', fn: 'SG 301', airline: 'SpiceJet', reg: 'VT-SZW', aircraft: 'Boeing 737 MAX 8',
    status: 'SCHEDULED', o: AIRPORTS.DEL, d: AIRPORTS.RPR,
    dep: `${today}T18:00:00+05:30`, arr: `${today}T20:05:00+05:30`,
    progress: 0, heading: 155, alt: 0, speed: 0, delay: 0, gate: 'B3', terminal: 1 }),

  makeFlight({ id: '6E-2341', fn: '6E 2341', airline: 'IndiGo', reg: 'VT-ITU', aircraft: 'Airbus A321neo',
    status: 'EN_ROUTE', o: AIRPORTS.DEL, d: AIRPORTS.GAU,
    dep: `${today}T09:00:00+05:30`, arr: `${today}T11:30:00+05:30`,
    progress: 52, heading: 78, alt: 36000, speed: 840, delay: 0, gate: 'A19', terminal: 1 }),

  makeFlight({ id: 'AI-768', fn: 'AI 768', airline: 'Air India', reg: 'VT-ANI', aircraft: 'Boeing 787-8',
    status: 'EN_ROUTE', o: AIRPORTS.CCU, d: AIRPORTS.BLR,
    dep: `${today}T08:00:00+05:30`, arr: `${today}T10:30:00+05:30`,
    progress: 58, heading: 235, alt: 35000, speed: 830, delay: 0, gate: 'C7', terminal: 1 }),

  makeFlight({ id: 'UK-435', fn: 'UK 435', airline: 'Vistara', reg: 'VT-TNF', aircraft: 'Airbus A320neo',
    status: 'LANDED', o: AIRPORTS.DEL, d: AIRPORTS.JAI,
    dep: `${today}T07:00:00+05:30`, arr: `${today}T08:05:00+05:30`,
    progress: 100, heading: 232, alt: 0, speed: 0, delay: 0, gate: 'A2', terminal: 1 }),

  makeFlight({ id: '6E-995', fn: '6E 995', airline: 'IndiGo', reg: 'VT-ITV', aircraft: 'Airbus A320',
    status: 'EN_ROUTE', o: AIRPORTS.MAA, d: AIRPORTS.TRZ,
    dep: `${today}T10:00:00+05:30`, arr: `${today}T11:10:00+05:30`,
    progress: 45, heading: 265, alt: 22000, speed: 680, delay: 0, gate: 'B1', terminal: 1 }),

  makeFlight({ id: 'SG-408', fn: 'SG 408', airline: 'SpiceJet', reg: 'VT-SZX', aircraft: 'Bombardier Q400',
    status: 'BOARDING', o: AIRPORTS.DEL, d: AIRPORTS.VNS,
    dep: `${today}T13:45:00+05:30`, arr: `${today}T15:30:00+05:30`,
    progress: 0, heading: 118, alt: 0, speed: 0, delay: 0, gate: 'A10', terminal: 1 }),

  makeFlight({ id: 'QP-1701', fn: 'QP 1701', airline: 'Akasa Air', reg: 'VT-YAE', aircraft: 'Boeing 737 MAX 8',
    status: 'EN_ROUTE', o: AIRPORTS.DEL, d: AIRPORTS.IDR,
    dep: `${today}T10:00:00+05:30`, arr: `${today}T11:40:00+05:30`,
    progress: 48, heading: 210, alt: 31000, speed: 800, delay: 0, gate: 'D20', terminal: 1 }),

  makeFlight({ id: 'AI-265', fn: 'AI 265', airline: 'Air India', reg: 'VT-ANJ', aircraft: 'Airbus A320neo',
    status: 'EN_ROUTE', o: AIRPORTS.DEL, d: AIRPORTS.CCJ,
    dep: `${today}T08:30:00+05:30`, arr: `${today}T11:10:00+05:30`,
    progress: 40, heading: 198, alt: 34000, speed: 820, delay: 15, gate: 'D2', terminal: 2 }),

  makeFlight({ id: '6E-6082', fn: '6E 6082', airline: 'IndiGo', reg: 'VT-ITW', aircraft: 'Airbus A320neo',
    status: 'CANCELLED', o: AIRPORTS.BOM, d: AIRPORTS.AMD,
    dep: `${today}T07:30:00+05:30`, arr: `${today}T08:35:00+05:30`,
    progress: 0, heading: 335, alt: 0, speed: 0, delay: 0, gate: '—', terminal: 2 }),

  makeFlight({ id: 'AI-677', fn: 'AI 677', airline: 'Air India', reg: 'VT-ANK', aircraft: 'Boeing 737-800',
    status: 'SCHEDULED', o: AIRPORTS.DEL, d: AIRPORTS.IXB,
    dep: `${today}T20:30:00+05:30`, arr: `${today}T22:50:00+05:30`,
    progress: 0, heading: 70, alt: 0, speed: 0, delay: 0, gate: 'B15', terminal: 2 }),

  makeFlight({ id: '6E-5317', fn: '6E 5317', airline: 'IndiGo', reg: 'VT-ITX', aircraft: 'Airbus A320',
    status: 'EN_ROUTE', o: AIRPORTS.COK, d: AIRPORTS.BLR,
    dep: `${today}T11:00:00+05:30`, arr: `${today}T12:05:00+05:30`,
    progress: 55, heading: 65, alt: 25000, speed: 760, delay: 0, gate: 'C4', terminal: 1 }),

  makeFlight({ id: 'UK-765', fn: 'UK 765', airline: 'Vistara', reg: 'VT-TNG', aircraft: 'Airbus A321',
    status: 'EN_ROUTE', o: AIRPORTS.BOM, d: AIRPORTS.MAA,
    dep: `${today}T09:00:00+05:30`, arr: `${today}T10:40:00+05:30`,
    progress: 70, heading: 150, alt: 31000, speed: 810, delay: 0, gate: 'A14', terminal: 2 }),

  makeFlight({ id: 'SG-806', fn: 'SG 806', airline: 'SpiceJet', reg: 'VT-SZY', aircraft: 'Boeing 737-800',
    status: 'LANDED', o: AIRPORTS.DEL, d: AIRPORTS.NAG,
    dep: `${today}T06:15:00+05:30`, arr: `${today}T08:10:00+05:30`,
    progress: 100, heading: 155, alt: 0, speed: 0, delay: 0, gate: 'B4', terminal: 1 }),
]

// ─── Search & Filter Utilities ────────────────────────────────────────────────
export function getFlightById(id) {
  return MOCK_FLIGHTS.find((f) => f.id === id) || null
}

export function searchFlights(query, filters = {}) {
  let results = MOCK_FLIGHTS

  // Text search
  if (query) {
    const q = query.toLowerCase()
    results = results.filter(
      (f) =>
        f.flightNumber.toLowerCase().includes(q) ||
        f.airline.toLowerCase().includes(q) ||
        f.origin.city.toLowerCase().includes(q) ||
        f.destination.city.toLowerCase().includes(q) ||
        f.origin.code.toLowerCase().includes(q) ||
        f.destination.code.toLowerCase().includes(q)
    )
  }

  // Status filter
  if (filters.status && filters.status !== 'ALL') {
    results = results.filter((f) => f.status === filters.status)
  }

  // From airport filter
  if (filters.from) {
    const fromCode = filters.from.toUpperCase().split(' ')[0].replace('—', '').trim()
    if (fromCode.length === 3) {
      results = results.filter((f) => f.origin.code === fromCode)
    }
  }

  // To airport filter
  if (filters.to) {
    const toCode = filters.to.toUpperCase().split(' ')[0].replace('—', '').trim()
    if (toCode.length === 3) {
      results = results.filter((f) => f.destination.code === toCode)
    }
  }

  return results
}

export function getFlightStatusCounts() {
  const counts = { ALL: MOCK_FLIGHTS.length }
  MOCK_FLIGHTS.forEach((f) => {
    counts[f.status] = (counts[f.status] || 0) + 1
  })
  return counts
}
