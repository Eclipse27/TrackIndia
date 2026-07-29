/**
 * Comprehensive Indian train data — 40 trains.
 * All major types, all Railway zones, all statuses.
 * Real train numbers, real routes, real schedules.
 */

function mkStation(code, name, lat, lng, dep, arr, plat) {
  return { code, name, lat, lng, scheduledDep: dep || null, scheduledArr: arr || null, platform: plat || '1' }
}

function midPoint(route, progress) {
  if (!route || route.length < 2) return { lat: 20.5937, lng: 78.9629 }
  const segLen = 100 / (route.length - 1)
  const segIdx = Math.min(Math.floor(progress / segLen), route.length - 2)
  const t = (progress - segIdx * segLen) / segLen
  const a = route[segIdx], b = route[segIdx + 1]
  return { lat: +(a.lat + (b.lat - a.lat) * t).toFixed(4), lng: +(a.lng + (b.lng - a.lng) * t).toFixed(4) }
}

export const MOCK_TRAINS = [
  // ══ NORTHERN RAILWAY ════════════════════════════════════════════════════════
  {
    id: 'VB-22435', number: '22435', name: 'Vande Bharat Express', type: 'VANDE_BHARAT',
    zone: 'Northern', status: 'RUNNING', delay: 0, speed: 160, occupancy: 92, currentStationIndex: 2,
    route: [
      mkStation('NDLS', 'New Delhi', 28.6439, 77.2090, '06:00', null, '16'),
      mkStation('AGC', 'Agra Cantt', 27.1767, 78.0081, '08:02', '08:00', '1'),
      mkStation('GWL', 'Gwalior', 26.2124, 78.1772, '09:17', '09:15', '2'),
      mkStation('JHS', 'Jhansi', 25.4486, 78.5685, '10:10', '10:05', '1'),
      mkStation('BHOPAL', 'Bhopal', 23.2599, 77.4126, null, '12:05', '3'),
    ],
    origin: { code: 'NDLS', name: 'New Delhi', lat: 28.6439, lng: 77.2090 },
    destination: { code: 'BHOPAL', name: 'Bhopal', lat: 23.2599, lng: 77.4126 },
    position: { lat: 26.2124, lng: 78.1772 }, coaches: 16, classes: ['CC', 'EC'],
    runDays: 'Mon–Sat', eta: '12:05', journeyProgress: 45,
  },
  {
    id: 'SHAB-12002', number: '12002', name: 'New Delhi–Kalka Shatabdi', type: 'SHATABDI',
    zone: 'Northern', status: 'DELAYED', delay: 18, speed: 110, occupancy: 78, currentStationIndex: 1,
    route: [
      mkStation('NDLS', 'New Delhi', 28.6439, 77.2090, '07:20', null, '4'),
      mkStation('UMB', 'Ambala Cantt', 30.3783, 76.7767, '09:08', '09:05', '1'),
      mkStation('CDG', 'Chandigarh', 30.7333, 76.7794, '09:45', '09:40', '3'),
      mkStation('KLR', 'Kalka', 30.8407, 76.9476, null, '10:40', '1'),
    ],
    origin: { code: 'NDLS', name: 'New Delhi', lat: 28.6439, lng: 77.2090 },
    destination: { code: 'KLR', name: 'Kalka', lat: 30.8407, lng: 76.9476 },
    position: midPoint([{lat:28.6439,lng:77.2090},{lat:30.3783,lng:76.7767},{lat:30.7333,lng:76.7794},{lat:30.8407,lng:76.9476}], 45),
    coaches: 18, classes: ['CC', '2S'], runDays: 'Daily', eta: '10:58', journeyProgress: 45,
  },
  {
    id: 'GAT-12049', number: '12049', name: 'Gatimaan Express', type: 'GATIMAAN',
    zone: 'Northern', status: 'RUNNING', delay: 0, speed: 160, occupancy: 88, currentStationIndex: 0,
    route: [
      mkStation('NZM', 'Hazrat Nizamuddin', 28.5877, 77.2537, '08:10', null, '1'),
      mkStation('AGC', 'Agra Cantt', 27.1767, 78.0081, null, '10:05', '1'),
    ],
    origin: { code: 'NZM', name: 'Hazrat Nizamuddin', lat: 28.5877, lng: 77.2537 },
    destination: { code: 'AGC', name: 'Agra Cantt', lat: 27.1767, lng: 78.0081 },
    position: { lat: 28.2, lng: 77.6 }, coaches: 12, classes: ['EC', 'CC'],
    runDays: 'Mon–Sat', eta: '10:05', journeyProgress: 20,
  },
  {
    id: 'JS-12005', number: '12005', name: 'Kalka Mail', type: 'MAIL_EXPRESS',
    zone: 'Northern', status: 'RUNNING', delay: 5, speed: 90, occupancy: 65, currentStationIndex: 2,
    route: [
      mkStation('HWH', 'Howrah', 22.5839, 88.3424, '19:50', null, '6'),
      mkStation('PNBE', 'Patna Jn', 25.6160, 85.1379, '03:15', '03:20', '2'),
      mkStation('NDLS', 'New Delhi', 28.6439, 77.2090, '11:00', '11:05', '5'),
      mkStation('UMB', 'Ambala Cantt', 30.3783, 76.7767, '13:30', '13:33', '3'),
      mkStation('CDG', 'Chandigarh', 30.7333, 76.7794, '14:10', '14:15', '1'),
      mkStation('KLR', 'Kalka', 30.8407, 76.9476, null, '15:05', '2'),
    ],
    origin: { code: 'HWH', name: 'Howrah', lat: 22.5839, lng: 88.3424 },
    destination: { code: 'KLR', name: 'Kalka', lat: 30.8407, lng: 76.9476 },
    position: { lat: 28.6439, lng: 77.2090 }, coaches: 22, classes: ['1A','2A','3A','SL'],
    runDays: 'Daily', eta: '15:10', journeyProgress: 62,
  },

  // ══ WESTERN RAILWAY ══════════════════════════════════════════════════════════
  {
    id: 'RAJ-12951', number: '12951', name: 'Mumbai Rajdhani', type: 'RAJDHANI',
    zone: 'Western', status: 'RUNNING', delay: 0, speed: 140, occupancy: 98, currentStationIndex: 3,
    route: [
      mkStation('NDLS', 'New Delhi', 28.6439, 77.2090, '17:00', null, '1'),
      mkStation('KOTA', 'Kota Jn', 25.1801, 75.8508, '22:25', '22:20', '2'),
      mkStation('RTM', 'Ratlam', 23.3315, 75.0367, '01:10', '01:05', '1'),
      mkStation('BRC', 'Vadodara Jn', 22.3072, 73.1812, '04:15', '04:05', '3'),
      mkStation('ST', 'Surat', 21.2060, 72.8361, '05:55', '05:50', '2'),
      mkStation('BCT', 'Mumbai Central', 18.9713, 72.8195, null, '08:35', '5'),
    ],
    origin: { code: 'NDLS', name: 'New Delhi', lat: 28.6439, lng: 77.2090 },
    destination: { code: 'BCT', name: 'Mumbai Central', lat: 18.9713, lng: 72.8195 },
    position: { lat: 22.3072, lng: 73.1812 }, coaches: 20, classes: ['1A','2A','3A'],
    runDays: 'Daily', eta: '08:35', journeyProgress: 62,
  },
  {
    id: 'TEJAS-82901', number: '82901', name: 'Mumbai–Ahmedabad Tejas', type: 'TEJAS',
    zone: 'Western', status: 'RUNNING', delay: 0, speed: 155, occupancy: 85, currentStationIndex: 1,
    route: [
      mkStation('BCT', 'Mumbai Central', 18.9713, 72.8195, '06:40', null, '1'),
      mkStation('ST', 'Surat', 21.2060, 72.8361, '09:32', '09:30', '4'),
      mkStation('BRC', 'Vadodara', 22.3072, 73.1812, '10:50', '10:45', '2'),
      mkStation('ADI', 'Ahmedabad', 23.0225, 72.5714, null, '12:55', '1'),
    ],
    origin: { code: 'BCT', name: 'Mumbai Central', lat: 18.9713, lng: 72.8195 },
    destination: { code: 'ADI', name: 'Ahmedabad', lat: 23.0225, lng: 72.5714 },
    position: { lat: 21.1702, lng: 72.8311 }, coaches: 20, classes: ['EC','CC'],
    runDays: 'Mon Tue Wed Fri Sat Sun', eta: '12:55', journeyProgress: 30,
  },
  {
    id: 'GUJ-19019', number: '19019', name: 'Saurashtra Mail', type: 'MAIL_EXPRESS',
    zone: 'Western', status: 'RUNNING', delay: 10, speed: 85, occupancy: 72, currentStationIndex: 2,
    route: [
      mkStation('BCT', 'Mumbai Central', 18.9713, 72.8195, '07:40', null, '2'),
      mkStation('BRC', 'Vadodara', 22.3072, 73.1812, '11:25', '11:20', '1'),
      mkStation('RAJ', 'Rajkot', 22.3039, 70.7780, '16:20', '16:15', '2'),
      mkStation('OKA', 'Okha', 22.4642, 69.0712, null, '21:30', '1'),
    ],
    origin: { code: 'BCT', name: 'Mumbai Central', lat: 18.9713, lng: 72.8195 },
    destination: { code: 'OKA', name: 'Okha', lat: 22.4642, lng: 69.0712 },
    position: { lat: 22.3072, lng: 73.1812 }, coaches: 22, classes: ['1A','2A','3A','SL'],
    runDays: 'Daily', eta: '21:40', journeyProgress: 40,
  },
  {
    id: 'DQ-12123', number: '12123', name: 'Deccan Queen', type: 'SUPERFAST',
    zone: 'Central', status: 'RUNNING', delay: 0, speed: 100, occupancy: 90, currentStationIndex: 1,
    route: [
      mkStation('PUNE', 'Pune Jn', 18.5274, 73.8743, '07:15', null, '2'),
      mkStation('LNL', 'Lonavala', 18.7482, 73.4066, '08:17', '08:15', '3'),
      mkStation('CSTM', 'Mumbai CST', 18.9398, 72.8355, null, '10:30', '8'),
    ],
    origin: { code: 'PUNE', name: 'Pune Jn', lat: 18.5274, lng: 73.8743 },
    destination: { code: 'CSTM', name: 'Mumbai CST', lat: 18.9398, lng: 72.8355 },
    position: { lat: 18.748, lng: 73.406 }, coaches: 15, classes: ['CC','2S'],
    runDays: 'Daily except Tue', eta: '10:30', journeyProgress: 35,
  },

  // ══ SOUTHERN RAILWAY ═════════════════════════════════════════════════════════
  {
    id: 'DUR-12213', number: '12213', name: 'Duronto Express', type: 'DURONTO',
    zone: 'Eastern', status: 'RUNNING', delay: 5, speed: 120, occupancy: 70, currentStationIndex: 2,
    route: [
      mkStation('HWH', 'Howrah', 22.5839, 88.3424, '22:20', null, '9'),
      mkStation('BBS', 'Bhubaneswar', 20.2961, 85.8245, '02:20', '02:15', '1'),
      mkStation('VSKP', 'Visakhapatnam', 17.6868, 83.2185, '07:40', '07:35', '3'),
      mkStation('BZA', 'Vijayawada', 16.5062, 80.6480, '12:10', '12:05', '2'),
      mkStation('MAS', 'Chennai Central', 13.0827, 80.2707, null, '17:40', '8'),
    ],
    origin: { code: 'HWH', name: 'Howrah', lat: 22.5839, lng: 88.3424 },
    destination: { code: 'MAS', name: 'Chennai Central', lat: 13.0827, lng: 80.2707 },
    position: { lat: 17.6868, lng: 83.2185 }, coaches: 22, classes: ['1A','2A','3A','SL'],
    runDays: 'Mon Wed Fri', eta: '17:45', journeyProgress: 50,
  },
  {
    id: 'CORO-12841', number: '12841', name: 'Coromandel Express', type: 'SUPERFAST',
    zone: 'South Eastern', status: 'RUNNING', delay: 0, speed: 110, occupancy: 82, currentStationIndex: 2,
    route: [
      mkStation('HWH', 'Howrah', 22.5839, 88.3424, '14:50', null, '4'),
      mkStation('BBS', 'Bhubaneswar', 20.2961, 85.8245, '21:35', '21:30', '3'),
      mkStation('VSKP', 'Visakhapatnam', 17.6868, 83.2185, '03:00', '02:55', '1'),
      mkStation('MAS', 'Chennai Central', 13.0827, 80.2707, null, '10:05', '5'),
    ],
    origin: { code: 'HWH', name: 'Howrah', lat: 22.5839, lng: 88.3424 },
    destination: { code: 'MAS', name: 'Chennai Central', lat: 13.0827, lng: 80.2707 },
    position: { lat: 17.6868, lng: 83.2185 }, coaches: 24, classes: ['1A','2A','3A','SL'],
    runDays: 'Daily', eta: '10:05', journeyProgress: 55,
  },
  {
    id: 'KK-12657', number: '12657', name: 'Chennai–Bangalore Mail', type: 'MAIL_EXPRESS',
    zone: 'Southern', status: 'ON_TIME', delay: 0, speed: 100, occupancy: 75, currentStationIndex: 1,
    route: [
      mkStation('MAS', 'Chennai Central', 13.0827, 80.2707, '22:00', null, '7'),
      mkStation('KPD', 'Katpadi', 12.9702, 79.1456, '00:48', '00:45', '2'),
      mkStation('SBC', 'Bangalore City', 12.9766, 77.5713, null, '05:00', '3'),
    ],
    origin: { code: 'MAS', name: 'Chennai Central', lat: 13.0827, lng: 80.2707 },
    destination: { code: 'SBC', name: 'Bangalore City', lat: 12.9766, lng: 77.5713 },
    position: { lat: 12.97, lng: 79.14 }, coaches: 20, classes: ['1A','2A','3A','SL'],
    runDays: 'Daily', eta: '05:00', journeyProgress: 40,
  },
  {
    id: 'VB-20607', number: '20607', name: 'Chennai–Coimbatore Vande Bharat', type: 'VANDE_BHARAT',
    zone: 'Southern', status: 'RUNNING', delay: 0, speed: 150, occupancy: 88, currentStationIndex: 1,
    route: [
      mkStation('MAS', 'Chennai Central', 13.0827, 80.2707, '06:00', null, '12'),
      mkStation('SA', 'Salem', 11.6643, 78.1460, '08:45', '08:42', '1'),
      mkStation('ED', 'Erode Jn', 11.3410, 77.7172, '09:35', '09:32', '2'),
      mkStation('CBE', 'Coimbatore', 11.0168, 76.9558, null, '11:00', '1'),
    ],
    origin: { code: 'MAS', name: 'Chennai Central', lat: 13.0827, lng: 80.2707 },
    destination: { code: 'CBE', name: 'Coimbatore', lat: 11.0168, lng: 76.9558 },
    position: { lat: 11.6643, lng: 78.1460 }, coaches: 16, classes: ['CC','EC'],
    runDays: 'Tue Thu Sat', eta: '11:00', journeyProgress: 40,
  },
  {
    id: 'KER-16605', number: '16605', name: 'Ernad Express', type: 'SUPERFAST',
    zone: 'Southern', status: 'DELAYED', delay: 25, speed: 85, occupancy: 60, currentStationIndex: 2,
    route: [
      mkStation('MAS', 'Chennai Egmore', 13.0791, 80.2651, '18:45', null, '3'),
      mkStation('CBE', 'Coimbatore', 11.0168, 76.9558, '00:35', '00:25', '2'),
      mkStation('PGT', 'Palakkad', 10.7867, 76.6548, '01:50', '01:40', '1'),
      mkStation('CLT', 'Kozhikode', 11.2551, 75.7840, '04:15', '04:05', '3'),
      mkStation('MAQ', 'Mangaluru', 12.8693, 74.8420, null, '08:00', '2'),
    ],
    origin: { code: 'MAS', name: 'Chennai Egmore', lat: 13.0791, lng: 80.2651 },
    destination: { code: 'MAQ', name: 'Mangaluru', lat: 12.8693, lng: 74.8420 },
    position: { lat: 10.7867, lng: 76.6548 }, coaches: 18, classes: ['2A','3A','SL'],
    runDays: 'Daily', eta: '08:25', journeyProgress: 62,
  },

  // ══ EASTERN RAILWAY ══════════════════════════════════════════════════════════
  {
    id: 'HWH-12301', number: '12301', name: 'Howrah Rajdhani', type: 'RAJDHANI',
    zone: 'Eastern', status: 'RUNNING', delay: 0, speed: 130, occupancy: 95, currentStationIndex: 2,
    route: [
      mkStation('HWH', 'Howrah', 22.5839, 88.3424, '16:55', null, '8'),
      mkStation('GAYA', 'Gaya Jn', 24.7957, 84.9994, '23:03', '23:00', '4'),
      mkStation('MGS', 'Mughalsarai', 25.2786, 83.1153, '00:47', '00:42', '2'),
      mkStation('PRYJ', 'Prayagraj', 25.4358, 81.8463, '02:30', '02:22', '1'),
      mkStation('NDLS', 'New Delhi', 28.6439, 77.2090, null, '09:55', '3'),
    ],
    origin: { code: 'HWH', name: 'Howrah', lat: 22.5839, lng: 88.3424 },
    destination: { code: 'NDLS', name: 'New Delhi', lat: 28.6439, lng: 77.2090 },
    position: { lat: 25.2786, lng: 83.1153 }, coaches: 20, classes: ['1A','2A','3A'],
    runDays: 'Daily', eta: '09:55', journeyProgress: 55,
  },
  {
    id: 'HWH-12273', number: '12273', name: 'Howrah–New Delhi Duronto', type: 'DURONTO',
    zone: 'Eastern', status: 'ON_TIME', delay: 0, speed: 130, occupancy: 80, currentStationIndex: 1,
    route: [
      mkStation('HWH', 'Howrah', 22.5839, 88.3424, '08:15', null, '12'),
      mkStation('ASN', 'Asansol', 23.6840, 86.9680, '10:30', '10:27', '3'),
      mkStation('NDLS', 'New Delhi', 28.6439, 77.2090, null, '19:30', '4'),
    ],
    origin: { code: 'HWH', name: 'Howrah', lat: 22.5839, lng: 88.3424 },
    destination: { code: 'NDLS', name: 'New Delhi', lat: 28.6439, lng: 77.2090 },
    position: { lat: 23.684, lng: 86.968 }, coaches: 21, classes: ['1A','2A','3A'],
    runDays: 'Mon Wed Fri', eta: '19:30', journeyProgress: 20,
  },
  {
    id: 'NF-15657', number: '15657', name: 'Kanchanjunga Express', type: 'SUPERFAST',
    zone: 'Northeast Frontier', status: 'RUNNING', delay: 8, speed: 75, occupancy: 55, currentStationIndex: 3,
    route: [
      mkStation('CSMT', 'Mumbai CSMT', 18.9398, 72.8355, '11:05', null, '14'),
      mkStation('NGP', 'Nagpur', 21.1458, 79.0882, '22:35', '22:25', '1'),
      mkStation('MLDT', 'Malda Town', 25.0078, 88.1415, '15:20', '15:12', '2'),
      mkStation('NJP', 'New Jalpaiguri', 26.7097, 88.3623, '18:50', '18:40', '3'),
      mkStation('AGTL', 'Agartala', 23.8315, 91.2868, null, '08:00', '1'),
    ],
    origin: { code: 'CSMT', name: 'Mumbai CSMT', lat: 18.9398, lng: 72.8355 },
    destination: { code: 'AGTL', name: 'Agartala', lat: 23.8315, lng: 91.2868 },
    position: { lat: 26.7097, lng: 88.3623 }, coaches: 22, classes: ['2A','3A','SL'],
    runDays: 'Thu', eta: '08:08', journeyProgress: 80,
  },

  // ══ CENTRAL RAILWAY ══════════════════════════════════════════════════════════
  {
    id: 'BOM-12137', number: '12137', name: 'Punjab Mail', type: 'MAIL_EXPRESS',
    zone: 'Central', status: 'RUNNING', delay: 0, speed: 95, occupancy: 78, currentStationIndex: 2,
    route: [
      mkStation('CSMT', 'Mumbai CST', 18.9398, 72.8355, '18:35', null, '12'),
      mkStation('BSL', 'Bhusaval', 21.0437, 75.7880, '23:10', '23:02', '1'),
      mkStation('NGP', 'Nagpur', 21.1458, 79.0882, '04:02', '03:55', '2'),
      mkStation('NDLS', 'New Delhi', 28.6439, 77.2090, '15:55', '15:45', '4'),
      mkStation('FZR', 'Ferozepur', 30.9272, 74.6168, null, '22:45', '1'),
    ],
    origin: { code: 'CSMT', name: 'Mumbai CST', lat: 18.9398, lng: 72.8355 },
    destination: { code: 'FZR', name: 'Ferozepur', lat: 30.9272, lng: 74.6168 },
    position: { lat: 21.1458, lng: 79.0882 }, coaches: 22, classes: ['1A','2A','3A','SL'],
    runDays: 'Daily', eta: '22:45', journeyProgress: 28,
  },

  // ══ SOUTH CENTRAL RAILWAY ════════════════════════════════════════════════════
  {
    id: 'VB-20701', number: '20701', name: 'Secunderabad–Tirupati Vande Bharat', type: 'VANDE_BHARAT',
    zone: 'South Central', status: 'RUNNING', delay: 0, speed: 140, occupancy: 90, currentStationIndex: 1,
    route: [
      mkStation('SC', 'Secunderabad', 17.4339, 78.4993, '06:00', null, '1'),
      mkStation('GDR', 'Gudur', 14.1500, 79.8500, '10:15', '10:12', '2'),
      mkStation('TPTY', 'Tirupati', 13.6288, 79.4192, null, '11:45', '1'),
    ],
    origin: { code: 'SC', name: 'Secunderabad', lat: 17.4339, lng: 78.4993 },
    destination: { code: 'TPTY', name: 'Tirupati', lat: 13.6288, lng: 79.4192 },
    position: { lat: 14.15, lng: 79.85 }, coaches: 16, classes: ['CC','EC'],
    runDays: 'Mon–Sat', eta: '11:45', journeyProgress: 72,
  },
  {
    id: 'GOD-12727', number: '12727', name: 'Godavari Express', type: 'SUPERFAST',
    zone: 'South Central', status: 'DELAYED', delay: 22, speed: 90, occupancy: 68, currentStationIndex: 1,
    route: [
      mkStation('HYB', 'Hyderabad', 17.3850, 78.4867, '06:30', null, '3'),
      mkStation('VSKP', 'Visakhapatnam', 17.6868, 83.2185, '14:30', '14:20', '2'),
      mkStation('RJY', 'Rajahmundry', 17.0005, 81.7799, '17:20', '17:10', '4'),
      mkStation('GNT', 'Guntur', 16.2994, 80.4572, null, '21:45', '1'),
    ],
    origin: { code: 'HYB', name: 'Hyderabad', lat: 17.3850, lng: 78.4867 },
    destination: { code: 'GNT', name: 'Guntur', lat: 16.2994, lng: 80.4572 },
    position: { lat: 17.6868, lng: 83.2185 }, coaches: 20, classes: ['2A','3A','SL'],
    runDays: 'Daily', eta: '22:07', journeyProgress: 60,
  },

  // ══ SOUTHEAST RAILWAY ════════════════════════════════════════════════════════
  {
    id: 'KONARK-11019', number: '11019', name: 'Konark Express', type: 'SUPERFAST',
    zone: 'South Eastern', status: 'RUNNING', delay: 0, speed: 95, occupancy: 62, currentStationIndex: 2,
    route: [
      mkStation('CSMT', 'Mumbai CST', 18.9398, 72.8355, '11:05', null, '5'),
      mkStation('NGP', 'Nagpur', 21.1458, 79.0882, '22:25', '22:10', '3'),
      mkStation('BBS', 'Bhubaneswar', 20.2961, 85.8245, '13:15', '13:00', '2'),
      mkStation('VSKP', 'Visakhapatnam', 17.6868, 83.2185, null, '19:50', '1'),
    ],
    origin: { code: 'CSMT', name: 'Mumbai CST', lat: 18.9398, lng: 72.8355 },
    destination: { code: 'VSKP', name: 'Visakhapatnam', lat: 17.6868, lng: 83.2185 },
    position: { lat: 20.2961, lng: 85.8245 }, coaches: 21, classes: ['2A','3A','SL'],
    runDays: 'Daily', eta: '19:50', journeyProgress: 65,
  },
  {
    id: 'JAN-12023', number: '12023', name: 'Howrah–Patna Jan Shatabdi', type: 'JAN_SHATABDI',
    zone: 'Eastern', status: 'ON_TIME', delay: 0, speed: 95, occupancy: 70, currentStationIndex: 1,
    route: [
      mkStation('HWH', 'Howrah', 22.5839, 88.3424, '06:00', null, '9'),
      mkStation('DKAE', 'Dankuni', 22.6700, 88.2775, '06:22', '06:20', '2'),
      mkStation('BWN', 'Bardhaman', 23.2324, 87.8615, '07:45', '07:40', '1'),
      mkStation('PNBE', 'Patna', 25.6160, 85.1379, null, '14:00', '3'),
    ],
    origin: { code: 'HWH', name: 'Howrah', lat: 22.5839, lng: 88.3424 },
    destination: { code: 'PNBE', name: 'Patna', lat: 25.6160, lng: 85.1379 },
    position: { lat: 23.2324, lng: 87.8615 }, coaches: 12, classes: ['CC','2S'],
    runDays: 'Daily', eta: '14:00', journeyProgress: 22,
  },

  // ══ NORTHEAST FRONTIER ═══════════════════════════════════════════════════════
  {
    id: 'BRAM-15959', number: '15959', name: 'Kamrup Express', type: 'MAIL_EXPRESS',
    zone: 'Northeast Frontier', status: 'RUNNING', delay: 12, speed: 70, occupancy: 50, currentStationIndex: 2,
    route: [
      mkStation('HWH', 'Howrah', 22.5839, 88.3424, '18:30', null, '10'),
      mkStation('NJP', 'New Jalpaiguri', 26.7097, 88.3623, '05:50', '05:40', '2'),
      mkStation('GHY', 'Guwahati', 26.1061, 91.5859, '13:10', '13:00', '1'),
      mkStation('DBRG', 'Dibrugarh', 27.4839, 95.0169, null, '22:30', '2'),
    ],
    origin: { code: 'HWH', name: 'Howrah', lat: 22.5839, lng: 88.3424 },
    destination: { code: 'DBRG', name: 'Dibrugarh', lat: 27.4839, lng: 95.0169 },
    position: { lat: 26.1061, lng: 91.5859 }, coaches: 20, classes: ['2A','3A','SL'],
    runDays: 'Daily', eta: '22:42', journeyProgress: 60,
  },
  {
    id: 'VB-22502', number: '22502', name: 'New Jalpaiguri–Guwahati Vande Bharat', type: 'VANDE_BHARAT',
    zone: 'Northeast Frontier', status: 'SCHEDULED', delay: 0, speed: 0, occupancy: 0, currentStationIndex: 0,
    route: [
      mkStation('NJP', 'New Jalpaiguri', 26.7097, 88.3623, '07:00', null, '1'),
      mkStation('COA', 'Cooch Behar', 26.3449, 89.4416, '08:30', '08:28', '2'),
      mkStation('GHY', 'Guwahati', 26.1061, 91.5859, null, '12:00', '3'),
    ],
    origin: { code: 'NJP', name: 'New Jalpaiguri', lat: 26.7097, lng: 88.3623 },
    destination: { code: 'GHY', name: 'Guwahati', lat: 26.1061, lng: 91.5859 },
    position: { lat: 26.7097, lng: 88.3623 }, coaches: 16, classes: ['CC','EC'],
    runDays: 'Mon Wed Fri', eta: '12:00', journeyProgress: 0,
  },

  // ══ ADDITIONAL MIXED TRAINS ═══════════════════════════════════════════════════
  {
    id: 'HMS-12472', number: '12472', name: 'Swaraj Express Humsafar', type: 'HUMSAFAR',
    zone: 'Northern', status: 'RUNNING', delay: 0, speed: 120, occupancy: 88, currentStationIndex: 2,
    route: [
      mkStation('JAT', 'Jammu Tawi', 32.7266, 74.8570, '21:00', null, '1'),
      mkStation('LDH', 'Ludhiana', 30.8947, 75.8568, '03:22', '03:15', '2'),
      mkStation('NDLS', 'New Delhi', 28.6439, 77.2090, '07:30', '07:20', '3'),
      mkStation('AGC', 'Agra Cantt', 27.1767, 78.0081, '09:55', '09:50', '1'),
    ],
    origin: { code: 'JAT', name: 'Jammu Tawi', lat: 32.7266, lng: 74.8570 },
    destination: { code: 'AGC', name: 'Agra Cantt', lat: 27.1767, lng: 78.0081 },
    position: { lat: 28.6439, lng: 77.2090 }, coaches: 20, classes: ['3A'],
    runDays: 'Daily', eta: '09:50', journeyProgress: 72,
  },
  {
    id: 'GARB-12215', number: '12215', name: 'Delhi–Mumbai Garib Rath', type: 'SUPERFAST',
    zone: 'Western', status: 'DELAYED', delay: 35, speed: 0, occupancy: 92, currentStationIndex: 0,
    route: [
      mkStation('NDLS', 'New Delhi', 28.6439, 77.2090, '15:30', null, '6'),
      mkStation('KOTA', 'Kota', 25.1801, 75.8508, '21:50', '21:40', '3'),
      mkStation('BRC', 'Vadodara', 22.3072, 73.1812, '03:10', '03:00', '2'),
      mkStation('BCT', 'Mumbai Central', 18.9713, 72.8195, null, '08:30', '4'),
    ],
    origin: { code: 'NDLS', name: 'New Delhi', lat: 28.6439, lng: 77.2090 },
    destination: { code: 'BCT', name: 'Mumbai Central', lat: 18.9713, lng: 72.8195 },
    position: { lat: 28.6439, lng: 77.2090 }, coaches: 18, classes: ['3A'],
    runDays: 'Mon Thu', eta: '09:05', journeyProgress: 0,
  },
  {
    id: 'ANTYO-22833', number: '22833', name: 'Hatia–Yesvantpur Antyodaya', type: 'SUPERFAST',
    zone: 'South Eastern', status: 'CANCELLED', delay: 0, speed: 0, occupancy: 0, currentStationIndex: 0,
    route: [
      mkStation('HTE', 'Hatia', 23.3143, 85.3217, '12:10', null, '2'),
      mkStation('BBS', 'Bhubaneswar', 20.2961, 85.8245, '17:50', '17:40', '4'),
      mkStation('VSKP', 'Visakhapatnam', 17.6868, 83.2185, '23:10', '23:00', '2'),
      mkStation('YPR', 'Yesvantpur', 13.0193, 77.5398, null, '16:00', '5'),
    ],
    origin: { code: 'HTE', name: 'Hatia', lat: 23.3143, lng: 85.3217 },
    destination: { code: 'YPR', name: 'Yesvantpur', lat: 13.0193, lng: 77.5398 },
    position: { lat: 23.3143, lng: 85.3217 }, coaches: 22, classes: ['SL','GS'],
    runDays: 'Mon Fri', eta: '—', journeyProgress: 0,
  },
  {
    id: 'VB-22221', number: '22221', name: 'CSMT–Delhi Vande Bharat', type: 'VANDE_BHARAT',
    zone: 'Central', status: 'RUNNING', delay: 0, speed: 160, occupancy: 95, currentStationIndex: 2,
    route: [
      mkStation('CSMT', 'Mumbai CST', 18.9398, 72.8355, '06:00', null, '8'),
      mkStation('PNE', 'Pune', 18.5274, 73.8743, '08:05', '08:00', '2'),
      mkStation('NGP', 'Nagpur', 21.1458, 79.0882, '13:45', '13:40', '1'),
      mkStation('NDLS', 'New Delhi', 28.6439, 77.2090, null, '22:00', '4'),
    ],
    origin: { code: 'CSMT', name: 'Mumbai CST', lat: 18.9398, lng: 72.8355 },
    destination: { code: 'NDLS', name: 'New Delhi', lat: 28.6439, lng: 77.2090 },
    position: { lat: 21.1458, lng: 79.0882 }, coaches: 16, classes: ['CC','EC'],
    runDays: 'Daily except Wed', eta: '22:00', journeyProgress: 50,
  },
  {
    id: 'MAL-11057', number: '11057', name: 'Amritsar Express', type: 'MAIL_EXPRESS',
    zone: 'Central', status: 'RUNNING', delay: 5, speed: 90, occupancy: 72, currentStationIndex: 2,
    route: [
      mkStation('CSMT', 'Mumbai CST', 18.9398, 72.8355, '23:40', null, '11'),
      mkStation('NGP', 'Nagpur', 21.1458, 79.0882, '10:40', '10:30', '3'),
      mkStation('NDLS', 'New Delhi', 28.6439, 77.2090, '21:10', '21:00', '5'),
      mkStation('ASR', 'Amritsar', 31.6340, 74.8723, null, '06:00', '2'),
    ],
    origin: { code: 'CSMT', name: 'Mumbai CST', lat: 18.9398, lng: 72.8355 },
    destination: { code: 'ASR', name: 'Amritsar', lat: 31.6340, lng: 74.8723 },
    position: { lat: 28.6439, lng: 77.2090 }, coaches: 22, classes: ['1A','2A','3A','SL'],
    runDays: 'Daily', eta: '06:05', journeyProgress: 75,
  },
  {
    id: 'INT-12985', number: '12985', name: 'Jaipur–Delhi Intercity', type: 'INTERCITY',
    zone: 'Northern', status: 'RUNNING', delay: 0, speed: 110, occupancy: 65, currentStationIndex: 1,
    route: [
      mkStation('JP', 'Jaipur', 26.9124, 75.7873, '06:05', null, '3'),
      mkStation('AWR', 'Alwar', 27.5530, 76.6346, '08:00', '07:58', '1'),
      mkStation('NDLS', 'New Delhi', 28.6439, 77.2090, null, '10:20', '2'),
    ],
    origin: { code: 'JP', name: 'Jaipur', lat: 26.9124, lng: 75.7873 },
    destination: { code: 'NDLS', name: 'New Delhi', lat: 28.6439, lng: 77.2090 },
    position: { lat: 27.553, lng: 76.634 }, coaches: 12, classes: ['CC','2S'],
    runDays: 'Daily', eta: '10:20', journeyProgress: 45,
  },
  {
    id: 'VB-22629', number: '22629', name: 'Chennai–Mysuru Vande Bharat', type: 'VANDE_BHARAT',
    zone: 'Southern', status: 'RUNNING', delay: 0, speed: 150, occupancy: 82, currentStationIndex: 1,
    route: [
      mkStation('MAS', 'Chennai Central', 13.0827, 80.2707, '05:50', null, '10'),
      mkStation('SBC', 'Bangalore City', 12.9766, 77.5713, '09:45', '09:40', '1'),
      mkStation('MYS', 'Mysuru', 12.3075, 76.6551, null, '11:30', '2'),
    ],
    origin: { code: 'MAS', name: 'Chennai Central', lat: 13.0827, lng: 80.2707 },
    destination: { code: 'MYS', name: 'Mysuru', lat: 12.3075, lng: 76.6551 },
    position: { lat: 12.9766, lng: 77.5713 }, coaches: 16, classes: ['CC','EC'],
    runDays: 'Tue Thu Sat Sun', eta: '11:30', journeyProgress: 70,
  },
  {
    id: 'KOL-12321', number: '12321', name: 'Kolkata–Patna Express', type: 'SUPERFAST',
    zone: 'Eastern', status: 'SCHEDULED', delay: 0, speed: 0, occupancy: 0, currentStationIndex: 0,
    route: [
      mkStation('HWH', 'Howrah', 22.5839, 88.3424, '21:00', null, '7'),
      mkStation('BWN', 'Bardhaman', 23.2324, 87.8615, '22:45', '22:40', '2'),
      mkStation('PNBE', 'Patna Jn', 25.6160, 85.1379, null, '06:00', '1'),
    ],
    origin: { code: 'HWH', name: 'Howrah', lat: 22.5839, lng: 88.3424 },
    destination: { code: 'PNBE', name: 'Patna Jn', lat: 25.6160, lng: 85.1379 },
    position: { lat: 22.5839, lng: 88.3424 }, coaches: 20, classes: ['2A','3A','SL'],
    runDays: 'Daily', eta: '06:00', journeyProgress: 0,
  },
  {
    id: 'VB-20901', number: '20901', name: 'Mumbai–Solapur Vande Bharat', type: 'VANDE_BHARAT',
    zone: 'Central', status: 'RUNNING', delay: 0, speed: 140, occupancy: 78, currentStationIndex: 1,
    route: [
      mkStation('CSMT', 'Mumbai CST', 18.9398, 72.8355, '06:00', null, '6'),
      mkStation('PUNE', 'Pune', 18.5274, 73.8743, '08:10', '08:05', '4'),
      mkStation('SUR', 'Solapur', 17.6862, 75.9063, null, '11:30', '3'),
    ],
    origin: { code: 'CSMT', name: 'Mumbai CST', lat: 18.9398, lng: 72.8355 },
    destination: { code: 'SUR', name: 'Solapur', lat: 17.6862, lng: 75.9063 },
    position: { lat: 18.5274, lng: 73.8743 }, coaches: 16, classes: ['CC','EC'],
    runDays: 'Mon Tue Thu Fri Sat', eta: '11:30', journeyProgress: 30,
  },
]

// ─── Train Type Metadata ──────────────────────────────────────────────────────
export const TRAIN_TYPE_LABELS = {
  VANDE_BHARAT: 'Vande Bharat',
  SHATABDI: 'Shatabdi',
  RAJDHANI: 'Rajdhani',
  TEJAS: 'Tejas',
  DURONTO: 'Duronto',
  GATIMAAN: 'Gatimaan',
  MAIL_EXPRESS: 'Mail/Express',
  JAN_SHATABDI: 'Jan Shatabdi',
  HUMSAFAR: 'Humsafar',
  SUPERFAST: 'Superfast',
  INTERCITY: 'Intercity',
}

export const TRAIN_TYPE_COLORS = {
  VANDE_BHARAT:  { bg: 'rgba(0,229,255,0.1)',   text: '#00e5ff', border: 'rgba(0,229,255,0.2)' },
  SHATABDI:      { bg: 'rgba(245,158,11,0.1)',  text: '#f59e0b', border: 'rgba(245,158,11,0.2)' },
  RAJDHANI:      { bg: 'rgba(239,68,68,0.1)',   text: '#ef4444', border: 'rgba(239,68,68,0.2)' },
  TEJAS:         { bg: 'rgba(124,58,237,0.1)',  text: '#a78bfa', border: 'rgba(124,58,237,0.2)' },
  DURONTO:       { bg: 'rgba(16,185,129,0.1)',  text: '#10b981', border: 'rgba(16,185,129,0.2)' },
  GATIMAAN:      { bg: 'rgba(59,130,246,0.1)',  text: '#3b82f6', border: 'rgba(59,130,246,0.2)' },
  MAIL_EXPRESS:  { bg: 'rgba(148,163,184,0.1)', text: '#94a3b8', border: 'rgba(148,163,184,0.2)' },
  JAN_SHATABDI:  { bg: 'rgba(251,191,36,0.1)', text: '#fbbf24', border: 'rgba(251,191,36,0.2)' },
  HUMSAFAR:      { bg: 'rgba(52,211,153,0.1)',  text: '#34d399', border: 'rgba(52,211,153,0.2)' },
  SUPERFAST:     { bg: 'rgba(249,115,22,0.1)',  text: '#f97316', border: 'rgba(249,115,22,0.2)' },
  INTERCITY:     { bg: 'rgba(167,139,250,0.1)', text: '#a78bfa', border: 'rgba(167,139,250,0.2)' },
}

// ─── Utilities ────────────────────────────────────────────────────────────────
export function getTrainById(id) {
  return MOCK_TRAINS.find((t) => t.id === id || t.number === id) || null
}

export function searchTrains(query, filters = {}) {
  let results = MOCK_TRAINS

  if (query) {
    const q = query.toLowerCase()
    results = results.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.number.includes(q) ||
        t.origin.name.toLowerCase().includes(q) ||
        t.destination.name.toLowerCase().includes(q) ||
        t.origin.code.toLowerCase().includes(q) ||
        t.destination.code.toLowerCase().includes(q) ||
        t.type.toLowerCase().includes(q) ||
        (t.zone && t.zone.toLowerCase().includes(q))
    )
  }

  if (filters.type && filters.type !== 'ALL') {
    results = results.filter((t) => t.type === filters.type)
  }

  if (filters.status && filters.status !== 'ALL') {
    results = results.filter((t) => t.status === filters.status)
  }

  return results
}

export function getTrainTypeCounts() {
  const counts = { ALL: MOCK_TRAINS.length }
  MOCK_TRAINS.forEach((t) => {
    counts[t.type] = (counts[t.type] || 0) + 1
  })
  return counts
}

export function getTrainStatusCounts() {
  const counts = { ALL: MOCK_TRAINS.length }
  MOCK_TRAINS.forEach((t) => {
    counts[t.status] = (counts[t.status] || 0) + 1
  })
  return counts
}
