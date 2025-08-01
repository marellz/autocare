import PasswordResetRequestForm from '@/components/partials/auth/PasswordResetRequestForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Link } from 'react-router-dom'

const RequestPasswordReset = () => {
  const onSuccess = () => {}
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Forgot your password?</CardTitle>
        <CardDescription>No worries — we’ll help you get back in.</CardDescription>
      </CardHeader>
      <CardContent>
        <PasswordResetRequestForm onSubmit={onSuccess} />
      </CardContent>
      <CardFooter className="justify-center">
        <Link
          to="/login"
          className="inline text-sm underline-offset-4 hover:underline"
        >
          Cancel, go back to login.
        </Link>
      </CardFooter>
    </Card>
  )
}

export default RequestPasswordReset
