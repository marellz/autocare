import { Turnstile } from '@marsidev/react-turnstile'
import { Alert, AlertTitle } from '../ui/alert'
import { AlertCircle } from 'lucide-react'
import { useTheme } from '../theme/Provider'
import { useIsMobile } from '@/hooks/use-mobile'

interface Props {
  onSuccess?: (token: string) => void
}
const ReCaptcha = ({ onSuccess }: Props) => {
  const isMobile = useIsMobile()
  const { theme } = useTheme()
  const siteKey = import.meta.env.VITE_CF_TURNSTILE_SITE_KEY
  if (!siteKey)
    return (
      <Alert variant="destructive">
        <AlertCircle />
        <AlertTitle>Site key not found</AlertTitle>
      </Alert>
    )

  return (
    <Turnstile
      siteKey={siteKey}
      onSuccess={onSuccess}
      options={{
        size: isMobile ? 'compact' : 'normal',
        theme: theme === 'system' ? undefined : theme,
      }}
    />
  )
}

export default ReCaptcha
