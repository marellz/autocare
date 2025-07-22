import { Turnstile } from '@marsidev/react-turnstile'
import { Alert, AlertTitle } from '../ui/alert'
import { AlertCircle } from 'lucide-react'
import { useTheme } from '../theme/Provider'
interface Props {
  onSuccess?: (token: string) => void
}
const ReCaptcha = ({ onSuccess }: Props) => {
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
        theme: theme === 'system' ? undefined : theme,
      }}
    />
  )
}

export default ReCaptcha
