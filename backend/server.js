require('dotenv').config()
const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')
const morgan = require('morgan')

const app = express()
const server = http.createServer(app)

// ─── Socket.io Initialisation ────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
  transports: ['websocket', 'polling'],
})

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true,
}))
app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ─── Routes ───────────────────────────────────────────────────────────────────
const flightRoutes = require('./routes/flights')
const trainRoutes = require('./routes/trains')
const dashboardRoutes = require('./routes/dashboard')

app.use('/api/flights', flightRoutes)
app.use('/api/trains', trainRoutes)
app.use('/api/dashboard', dashboardRoutes)

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString(), uptime: process.uptime() })
})

// ─── Socket.io Connection ─────────────────────────────────────────────────────
const initSocketHandlers = require('./sockets/socketHandler')
initSocketHandlers(io)

// ─── Centralised Error Handler ────────────────────────────────────────────────
app.use((err, req, res, _next) => {
  const status = err.status || 500
  const message = err.message || 'Internal Server Error'
  console.error(`[ERROR] ${req.method} ${req.path} — ${message}`)
  res.status(status).json({ error: message, status })
})

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}`, status: 404 })
})

// ─── Start Server (only outside test environment) ────────────────────────────
const PORT = process.env.PORT || 3001
if (process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`\n🛰️  TrackIndia Backend running on http://localhost:${PORT}`)
    console.log(`📡  Socket.io ready`)
    console.log(`📋  Environment: ${process.env.NODE_ENV || 'development'}\n`)
  })
}

module.exports = { app, io, server }

