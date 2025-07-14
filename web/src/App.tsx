// src/App.tsx
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import Requests from './pages/dash/Requests'
import Vendors from './pages/dash/Vendors'
import DashHome from './pages/dash/Main'
import { ThemeProvider } from './components/theme/Provider'
import Login from './pages/auth/Login'
import DefaultLayout from './layouts/Default'
import DashboardLayout from './layouts/Dashboard'
import AuthLayout from './layouts/Auth'
import ProtectedRoute from './layouts/Protected'
import MyRequests from './pages/MyRequests'

export default function App() {
  return (
    <ThemeProvider>
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/my-requests" element={<MyRequests />} />
        </Route>
        <Route
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashHome />} />
          <Route path="/dashboard/requests" element={<Requests />} />
          <Route path="/dashboard/vendors" element={<Vendors />} />
        </Route>

        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}
