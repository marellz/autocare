import useAuthStore from '@/stores/useAuthStore'
import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  
  const { user } = useAuthStore()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}
