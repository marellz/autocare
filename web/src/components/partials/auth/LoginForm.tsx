import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import useAuthStore from '@/stores/useAuthStore'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircleIcon } from 'lucide-react'

interface Props {
  onSuccess: () => void
}

const LoginForm = ({ onSuccess }: Props) => {
  const { login, error, loading } = useAuthStore()
  const formSchema = z.object({
    email: z.string().email(),
    password: z.string().min(1, "Password is required"),
  })

  type SchemaType = z.infer<typeof formSchema>

  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const onSubmit = async (values: SchemaType) => {
    const { email, password } = values
    const success = await login({ username: email, password })
    if (success) {
      onSuccess()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="email@example.com" {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          ></FormField>
          {error && (
            <Alert variant="destructive">
              <AlertCircleIcon />
              <AlertTitle>Problem logging in</AlertTitle>
              <AlertDescription>
                <p>{error}</p>
              </AlertDescription>
            </Alert>
          )}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Logging in ' : 'Login'}
          </Button>
        </div>
      </form>
    </Form>
  )
}

export default LoginForm
