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
  type RequestPasswordResetSchema as Schema,
  requestPasswordResetSchema as formSchema,
} from '@/schemas/auth.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import useAuthStore from '@/stores/useAuthStore'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, Loader, SendHorizonal } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import ReCaptcha from '@/components/utils/ReCaptcha'

interface Props {
  onSubmit: () => void
}

const PasswordResetRequestForm = ({ onSubmit }: Props) => {
  const { loading, error, requestPasswordReset } = useAuthStore()
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
  })

  const handleSubmit = async (values: Schema) => {
    const success = await requestPasswordReset(values)
    if (success) {
      toast('Password request sent', { description: 'Check your email' })
      onSubmit()
    } else {
      const { error: description } = useAuthStore.getState()
      toast.error('Error submitting request', { description })
    }
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)}>
          {error && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Error requesting for a password reset</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-4">
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email address</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter the email you used to sign up. We’ll send you a secure link to reset your
                    password.
                  </FormDescription>
                  <FormMessage />
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
                  <span>Sending request</span>
                  <Loader className="transform animate-spin" />
                </>
              ) : (
                <>
                  <span>Send request</span>
                  <SendHorizonal />
                </>
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}

export default PasswordResetRequestForm
