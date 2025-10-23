import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import {
  type ResetPasswordSchema as Schema,
  resetPasswordSchema as formSchema,
} from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import useAuthStore from '@/stores/useAuthStore'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Loader, ShieldCheck } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ReCaptcha from '@/components/utils/ReCaptcha'
import { useEffect } from 'react'

interface Props {
  onSubmit: () => void
  token: string;
}

const PasswordResetForm = ({ onSubmit, token }: Props) => {
  const { loading, error, resetPassword } = useAuthStore()
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
  })

  const handleSubmit = async (values: Schema) => {
    const success = await resetPassword(values)
    if (success) {
      toast('Password request sent', { description: 'Check your email' })
      onSubmit()
    } else {
      const { error: description } = useAuthStore.getState()
      toast.error('Error submitting request', { description })
    }
  }


  useEffect(() => {
    form.setValue("secure_token", token)
  }, [])

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {error && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Error resetting your password</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* show when token is missing in the url/search */}
          {/* {tokenError && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle />
              <AlertTitle>Token is missing</AlertTitle>
            </Alert>
          )} */}

          <div className="space-y-4">
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>
                    Choose something secure — at least 8 characters, with a mix of letters and
                    numbers.
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                  <FormDescription>Just making sure you didn’t mistype.</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              name="token"
              control={form.control}
              render={() => (
                <FormItem>
                  <div className="flex justify-center md:justify-start">
                    <ReCaptcha onSuccess={(token: string) => form.setValue('token', token)} />
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <span>Loading</span>
                  <Loader className="transform animate-spin" />
                </>
              ) : (
                <>
                  <span>Reset password</span>
                  <ShieldCheck />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default PasswordResetForm
