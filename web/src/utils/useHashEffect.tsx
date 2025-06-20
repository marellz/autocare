import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useHashEffect = (onHashChange: (id: number | null) => void) => {
  const location = useLocation()

  useEffect(() => {
    const match = location.hash.match(/^#(\d+)$/)
    const id = match ? parseInt(match[1], 10) : null

    onHashChange(id)
  }, [location.hash, onHashChange])
}

export const useClearHash = () => {
  const navigate = useNavigate()
  const location = useLocation()

  //   remove hash
  navigate(location.pathname + location.search, { replace: true })
}
