// src/App.tsx
import { Routes, Route, useLocation } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/docs/About'
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
import DocsLayout from './layouts/Docs'
import Terms from './pages/docs/Terms'
import Privacy from './pages/docs/Privacy'
import Contact from './pages/Contact'
import { ErrorBoundary } from 'react-error-boundary'
import { AlertCircle } from 'lucide-react'
import { Button } from './components/ui/button'
import TypTitle from './components/custom/typography/Title'
import { useState } from 'react'
import RouteChangeListener from './hooks/use-route-change-listener'
export default function App() {
  const location = useLocation()
  const [route, setRoute] = useState<string>(location.pathname)
  return (
    <ThemeProvider>
      <RouteChangeListener onChange={setRoute} />
      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <div className="max-w-4xl mx-auto pt-20 space-y-8 px-5 md:px-10">
            <div className="flex space-x-4 items-center">
              <AlertCircle size={40} />
              <TypTitle>An error occurred.</TypTitle>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Error details:</p>
              <p>{error.message}</p>
            </div>
            <div className="flex justify-end">
              <Button onClick={resetErrorBoundary}>Reset error</Button>
            </div>
          </div>
        )}
      >
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/my-requests" element={<MyRequests />} />
          </Route>
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout currentRoute={route} />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashHome />} />
            <Route path="/dashboard/requests" element={<Requests />} />
            <Route path="/dashboard/vendors" element={<Vendors />} />
          </Route>

          <Route element={<DocsLayout />}>
            <Route path="/about" element={<About />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/privacy" element={<Privacy />} />
          </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
