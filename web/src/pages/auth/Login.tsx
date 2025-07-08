import AuthLayout from '@/layouts/Auth'
import {
  Card,
  //   CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Input from '@/components/form/Input'
import { useState } from 'react'
import useAuthStore from '@/stores/useAuthStore'
import { useNavigate } from 'react-router-dom'

const Login = () => {
  const { login, error,  loading } = useAuthStore()

  const navigate = useNavigate()

  const [email, setEmail] = useState<string>('dave@test.com')
  const [password, setPassword] = useState<string>('secret')

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const success = await login({ username: email, password })

    if(success) navigate('/dashboard')
        
  }

  return (
    <AuthLayout>
      <form onSubmit={handleLoginSubmit}>
        <Card className="w-full max-w-sm mx-auto">
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>Enter your email below to login to your account</CardDescription>
          </CardHeader>
          <CardContent>
            
            <div className="flex flex-col gap-y-2">
              <Input
                label="Email"
                id="email"
                type="email"
                placeholder="email@example.com"
                required
                error={error}
                value={email}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              />
              <Input
                margin=""
                label="Password"
                id="password"
                type="password"
                required
                value={password}
                onInput={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              />
            </div>
          </CardContent>
          <CardFooter className="flex-col space-y-2">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in ' : 'Login'}
            </Button>
            <div className="text-center">
              <a
                href="#"
                className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
              >
                Forgot your password?
              </a>
            </div>
          </CardFooter>
        </Card>
      </form>
    </AuthLayout>
  )
}

export default Login
