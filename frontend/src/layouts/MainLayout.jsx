import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'

export default function MainLayout({ isSocketConnected }) {
  return (
    <div className="min-h-screen">
      <Navbar isSocketConnected={isSocketConnected} />
      <main className="pt-16">
        <Outlet />
      </main>
    </div>
  )
}
