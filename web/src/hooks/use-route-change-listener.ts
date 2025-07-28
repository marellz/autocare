import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

interface Props {
  onChange: (path: string) => void
}
const RouteChangeListener = ({ onChange }: Props) => {
  const location = useLocation()

  useEffect(() => {
    onChange(location.pathname)
  }, [location])

  return null
}

export default RouteChangeListener
