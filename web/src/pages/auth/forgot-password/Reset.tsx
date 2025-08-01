import PasswordResetForm from '@/components/partials/auth/PasswordResetForm'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

const PasswordReset = () => {
  const onSuccess = () => {}
  return (
    <Card className="w-full max-w-sm mx-auto">
      <CardHeader>
        <CardTitle>Create a new password</CardTitle>
        <CardDescription>
          Almost there! Set a strong password to protect your account.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <PasswordResetForm onSubmit={onSuccess} />
      </CardContent>
    </Card>
  )
}

export default PasswordReset
