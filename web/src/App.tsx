// src/App.tsx
import { Suspense, lazy, useState } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { ThemeProvider } from './components/theme/Provider'
import { ErrorBoundary } from 'react-error-boundary'
import { AlertCircle } from 'lucide-react'
import { Button } from './components/ui/button'
import TypTitle from './components/custom/typography/Title'
import RouteChangeListener from './hooks/use-route-change-listener'

// Lazy-loaded pages & layouts
const Home = lazy(() => import('./pages/Home'))
const About = lazy(() => import('./pages/docs/About'))
const Requests = lazy(() => import('./pages/dash/Requests'))
const Vendors = lazy(() => import('./pages/dash/Vendors'))
const DashHome = lazy(() => import('./pages/dash/Main'))
const DashContact = lazy(() => import('./pages/dash/Contact'))
const Login = lazy(() => import('./pages/auth/Login'))
const DefaultLayout = lazy(() => import('./layouts/Default'))
const DashboardLayout = lazy(() => import('./layouts/Dashboard'))
const AuthLayout = lazy(() => import('./layouts/Auth'))
const ProtectedRoute = lazy(() => import('./layouts/Protected'))
const MyRequests = lazy(() => import('./pages/MyRequests'))
const DocsLayout = lazy(() => import('./layouts/Docs'))
const Terms = lazy(() => import('./pages/docs/Terms'))
const Privacy = lazy(() => import('./pages/docs/Privacy'))
const Contact = lazy(() => import('./pages/Contact'))
const FAQs = lazy(() => import('./pages/dash/FAQs'))

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
              <div className="mt-4 space-y-4">
                <hr />
                <div className="text-muted-foreground text-sm">{error.stack}</div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={resetErrorBoundary}>Reset error</Button>
            </div>
          </div>
        )}
      >
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-48">
              <span>Loading...</span>
            </div>
          }
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
              <Route path="/dashboard/faqs" element={<FAQs />} />
              <Route path="/dashboard/vendors" element={<Vendors />} />
              <Route path="/dashboard/contact" element={<DashContact />} />
            </Route>

            <Route element={<DocsLayout />}>
              <Route path="/about" element={<About />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
            </Route>

          <Route element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/forgot-password" element={<PassowrdRecovery />} />
            <Route path="/reset-password" element={<PasswordReset />} />
          </Route>
        </Routes>
      </ErrorBoundary>
    </ThemeProvider>
  )
}
