import AuthLayout from '@/layouts/Auth'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { useNavigate } from 'react-router-dom'
import LoginForm from '@/components/partials/auth/LoginForm'

const Login = () => {
  const navigate = useNavigate()

  const handleSuccess = () => {
    navigate('/dashboard')
  }

  return (
    <AuthLayout>
      <Card className="w-full max-w-sm mx-auto">
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>Enter your email below to login to your account</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm onSuccess={handleSuccess} />
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <div className="text-center">
            <a href="#" className="ml-auto inline-block text-sm underline-offset-4 hover:underline">
              Forgot your password?
            </a>
          </div>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}

export default Login
