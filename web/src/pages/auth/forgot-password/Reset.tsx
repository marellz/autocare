import Loader from '@/components/custom/Loader'
import PasswordResetForm from '@/components/partials/auth/PasswordResetForm'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import useAuthStore from '@/stores/useAuthStore'
import { AlertCircle } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const PasswordReset = () => {
  const navigate = useNavigate()
  type TokenStatus = 'loading' | 'verified' | 'invalid'
  const [token, setToken] = useState<string>()
  const [invalidReason, setInvalidReason] = useState<string | null>(null)
  const [tokenStatus, setTokenStatus] = useState<TokenStatus | undefined>(undefined)
  const { verifyToken } = useAuthStore()
  const onSuccess = () => {
    navigate('/login')

    toast.success('Password has been reset', {
      description: 'Login with your new password',
    })
  }

  const verify = async (token: string) => {
    setInvalidReason(null)
    setTokenStatus('loading')
    const verified = await verifyToken(token!)
    setTokenStatus(verified ? 'verified' : 'invalid')
    if (!verified) {
      const { error } = useAuthStore.getState()
      setInvalidReason(error)
    }
  }

  const { search } = useLocation()

  const getTokenFromUrl = () => {
    const params = new URLSearchParams(search)
    const { token } = Object.fromEntries(params.entries())
    return token
  }

  useEffect(() => {
    const token = getTokenFromUrl()
    if (!token) {
      setInvalidReason('Token not found!')
      toast.error('Invalid reset session', { description: 'Request for another password reset' })
      return
    }

    setToken(token)
    verify(token)
  }, [])

  return (
    <div className="w-full max-w-sm mx-auto">
      {tokenStatus === 'loading' && (
        <Card>
          <CardHeader>
            <CardTitle>Working...</CardTitle>
            <CardDescription>Verifying your token.</CardDescription>
          </CardHeader>
          <CardContent>
            <Loader />
          </CardContent>
        </Card>
      )}
      {tokenStatus === 'invalid' && (
        <>
          <Alert variant="destructive">
            <AlertCircle />
            <AlertTitle>Error verifying your token</AlertTitle>
            <AlertDescription>
              {invalidReason || 'Probably your token is invalid, or outdated, or not present.'}
            </AlertDescription>
          </Alert>
          <div className="text-center py-5">
            <Link
              to="/forgot-password"
              className="inline text-sm underline-offset-4 hover:underline"
            >
              Retry password recovery
            </Link>
          </div>
        </>
      )}
      {tokenStatus === 'verified' && (
        <Card>
          <CardHeader>
            <CardTitle>Create a new password</CardTitle>
            <CardDescription>
              Almost there! Set a strong password to protect your account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PasswordResetForm token={token!} onSubmit={onSuccess} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default PasswordReset
