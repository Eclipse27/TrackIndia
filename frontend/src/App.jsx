import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Suspense, lazy } from 'react'
import { ROUTES } from './utils/constants'
import MainLayout from './layouts/MainLayout'
import { useSocket } from './hooks/useSocket'
import { useSocketStore } from './store/socketStore'

// Lazy load heavy pages for Phase 10 optimization
const HomePage = lazy(() => import('./pages/HomePage'))
const FlightsPage = lazy(() => import('./pages/FlightsPage'))
const TrainsPage = lazy(() => import('./pages/TrainsPage'))
const DashboardPage = lazy(() => import('./pages/DashboardPage'))

// Loading fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 rounded-full border-2 border-transparent border-t-cyan-400 animate-spin" />
        <p className="text-slate-500 text-sm">Loading...</p>
      </div>
    </div>
  )
}

// Inner component that initialises the socket
function AppInner() {
  useSocket() // Initialise socket singleton
  const isConnected = useSocketStore((s) => s.isConnected)

  return (
    <Routes>
      <Route element={<MainLayout isSocketConnected={isConnected} />}>
        <Route path={ROUTES.HOME} element={<HomePage />} />
        <Route path={ROUTES.FLIGHTS} element={<FlightsPage />} />
        <Route path={ROUTES.TRAINS} element={<TrainsPage />} />
        <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
      </Route>
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <AppInner />
      </Suspense>
    </BrowserRouter>
  )
}
