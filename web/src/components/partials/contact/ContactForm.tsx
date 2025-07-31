import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormLabel,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ReCaptcha from '@/components/utils/ReCaptcha'
import contactFormSchema from '@/schemas/contact.schema'
import formSchema, { type ContactFormSchema } from '@/schemas/contact.schema'
import useContactStore from '@/stores/useContactStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { AlertCircle, Check, CheckCheckIcon, Pen, Send } from 'lucide-react'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

const ContactForm = () => {
  const form = useForm<ContactFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      message: '',
      token: undefined,
    },
  })

  const onTokenSuccess = (token: string) => form.setValue('token', token)
  const [submitted, setSubmitted] = useState<boolean>(false)

  const { loading, error, create } = useContactStore()
  const onSubmit = async (values: ContactFormSchema) => {
    const response = await create(values)
    if (!response) {
      toast.error('Error occurred when sending the message', {
        description: "We've logged this and it will get taken care of. Sorry for the inconvenience",
      })

      return
    }

    setSubmitted(true)
    // reset form
    Object.keys(contactFormSchema)
      .filter((k) => k !== 'token')
      .forEach((k) => form.setValue(k as keyof ContactFormSchema, ''))

    // toast!
    toast('Contact message sent!', { description: "You'll receive a response in a few hours." })
  }

  return (
    <>
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      <Form {...form}>
        <form aria-disabled={submitted} onSubmit={form.handleSubmit(onSubmit)}>
          <Card>
            <CardHeader>
              <div className="inline-flex space-x-2 items-center">
                <Pen size="16" />
                <CardTitle>Or write to us..</CardTitle>
                {submitted && (
                  <div className="">
                    <CheckCheckIcon className="text-green-500" />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <FormField
                    name="name"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Your name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email address</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="md:col-span-2">
                  <FormField
                    name="message"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What do you want to tell us?</FormLabel>
                        <FormControl>
                          <Textarea {...field} />
                        </FormControl>
                        <FormMessage />
                        <FormDescription>
                          A little context will go a long way into helping us help you.
                        </FormDescription>
                      </FormItem>
                    )}
                  />
                </div>
                <div>
                  <FormField
                    name="token"
                    control={form.control}
                    render={() => (
                      <FormItem>
                        <div className="flex justify-center md:justify-start">
                          <ReCaptcha onSuccess={onTokenSuccess} />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
              </div>
            </CardContent>
            <CardFooter className="md:justify-end">
              {submitted ? (
                <div className="p-2 inline-flex items-center space-x-2 text-green-500">
                  <span className="font-medium text-sm mt-0.5">Already sent</span>
                  <Check size={16} />
                </div>
              ) : (
                <Button type="submit" className="w-full md:w-auto" disabled={loading}>
                  <span>Send it!</span>
                  <Send />
                </Button>
              )}
            </CardFooter>
          </Card>
        </form>
      </Form>
    </>
  )
}

export default ContactForm
