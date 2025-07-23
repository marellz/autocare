import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import ReCaptcha from '@/components/utils/ReCaptcha'
import formSchema, { type ContactFormSchema } from '@/schemas/contact.schema'
import { zodResolver } from '@hookform/resolvers/zod'
import { Label } from '@radix-ui/react-label'
import { Pen, Send } from 'lucide-react'
import { useForm } from 'react-hook-form'

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

  // todo: implement contact endpoint. (and also cloudflare turnstile validation ✅).
  const onSubmit = () => {}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <Card>
          <CardHeader>
            <div className="inline-flex space-x-2 items-center">
              <Pen size="16" />
              <CardTitle>Or write to us..</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>Your name</Label>
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
                    <Label>Email address</Label>
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
                    <Label>Phone number</Label>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="col-span-2">
                <FormField
                  name="message"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <Label>What do you want to tell us?</Label>
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
                      <ReCaptcha onSuccess={onTokenSuccess} />
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit">
              <span>Send it!</span>
              <Send />
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}

export default ContactForm
