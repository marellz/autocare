// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Requests from './pages/dash/Requests'
import Vendors from './pages/dash/Vendors'
import DashHome from './pages/dash/Home'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/dashboard" element={<DashHome />} />
      <Route path="/dashboard/requests" element={<Requests />} />
      <Route path="/dashboard/vendors" element={<Vendors />} />
    </Routes>
  )
}
