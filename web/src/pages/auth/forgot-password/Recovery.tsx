import PasswordRecoveryForm from '@/components/partials/auth/PasswordRecoveryForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useState } from 'react'
import { Link } from 'react-router-dom'

const RequestPasswordReset = () => {
  const [requestSent, setRequestSent] = useState<boolean>(false)

  const onSuccess = () => {
    setRequestSent(true)
  }
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        {requestSent ? (
          <>
            <CardTitle>Reset request has been sent</CardTitle>
            <CardDescription>Check your email for a reset link.</CardDescription>
          </>
        ) : (
          <>
            <CardTitle>Forgot your password?</CardTitle>
            <CardDescription>No worries — we’ll help you get back in.</CardDescription>
          </>
        )}
      </CardHeader>

      {!requestSent && (
        <>
          <CardContent>
            <PasswordRecoveryForm onSubmit={onSuccess} />
          </CardContent>
          <CardFooter className="justify-center">
            <Link to="/login" className="inline text-sm underline-offset-4 hover:underline">
              Cancel, go back to login.
            </Link>
          </CardFooter>
        </>
      )}
    </Card>
  )
}

export default RequestPasswordReset
