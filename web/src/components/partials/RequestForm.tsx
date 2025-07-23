import { useState } from 'react'
import { Input } from '../ui/input'
import { Textarea } from '../ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import useRequestStore from '@/stores/useRequestStore'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { SendHorizonal } from 'lucide-react'
import ReCaptcha from '../utils/ReCaptcha'
import formSchema, { type NewRequestFormSchema } from '@/schemas/request.schema'

const RequestForm = () => {
  const { createRequest, error, loading } = useRequestStore()

  const [open, setOpen] = useState<boolean>(false)

  const form = useForm<NewRequestFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      item: '',
      token: undefined,
    },
  })

  const onTokenSuccess = (token: string) => form.setValue('token', token)

  const handleSubmit = async (values: NewRequestFormSchema) => {
    await createRequest({
      ...values,
      channel: 'web',
    })

    if (error) {
      // todo: throw error
    } else {
      // close modal
      setOpen(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => setOpen(v)}>
      <DialogTrigger asChild>
        <Button onClick={() => setOpen(true)}>Make request</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Make a new request</DialogTitle>
          <DialogDescription>
            Leave your details and the details for the part you would like, and we will follow up.
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertTitle>Problem submitting request</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-4">
              <FormField
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                name="phone"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your phone number</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              ></FormField>
              <FormField
                name="item"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Item description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                    <FormDescription>
                      <span>
                        Describe the item you need in this nice format: <br />
                        <i>
                          I need a <b>&lt;part&gt;</b> for a <b>&lt;year&gt;</b>
                          <b>&lt;brand&gt;</b> <b>&lt;model&gt;</b> <b>&lt;variant&gt;</b>
                        </i>
                        <br />
                        <b> eg: </b>
                        <i>I need a water pump for a 2006 BMW X3 25i</i>
                        {/* todo: feature: have a way to assist a client through this process, e.g using VIN, pics etc */}
                      </span>
                    </FormDescription>
                  </FormItem>
                )}
              ></FormField>

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
            <div className="flex space-x-3 justify-end items-center mt-8">
              <Button type="button" variant="secondary" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                <span>Send request</span>
                <SendHorizonal />
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
export default RequestForm
