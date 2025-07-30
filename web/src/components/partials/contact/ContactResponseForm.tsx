import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import useResponseStore from '@/stores/useResponseStore'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  contactResponseSchema as formSchema,
  type ContactResponseSchema as Schema,
} from '@/schemas/contact.schema'
import { useForm } from 'react-hook-form'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import type { ContactMessage } from '@/services/useContactService'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { AlertCircle, SendHorizonal } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { toast } from 'sonner'

interface Props {
  open: boolean
  contact: ContactMessage | undefined
  onSubmit: () => void
}

const ContactResponseForm = ({ open, contact, onSubmit }: Props) => {
  const { error, resetError, sendContactResponse } = useResponseStore()

  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  })

  const handleOpenChange = (value: boolean) => {
    if (!value) {
      form.reset()
      resetError()
      onSubmit()
    }
  }

  const handleSubmit = async ({ message }: Schema) => {
    if (!contact) {
      toast.error('Contact message does not exist.')
      return
    }
    const response = await sendContactResponse(contact.id, message)
    if (!response) {
      toast.error('Error sending response', { description: error })
      return
    }
    
    toast('Successfully sent response.')

    handleOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="space-y-4">
              <DialogHeader>
                <DialogTitle>Contact response</DialogTitle>
                <DialogDescription>
                  Respond to a client message. The message will be sent to their most available
                  channel.
                </DialogDescription>
              </DialogHeader>
              {contact !== undefined && (
                <div className="bg-muted p-4 rounded-lg">
                  <p className="font-medium text-sm">{contact.name} said:</p>
                  <p className="text-sm mt-2">{contact.message}</p>
                </div>
              )}

              {error && (
                <Alert variant="destructive">
                  <AlertCircle />
                  <AlertTitle>An error occurred</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              <FormField
                name="message"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <Label>Write your response.</Label>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage></FormMessage>
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button variant="secondary" type="button" onClick={() => handleOpenChange(false)}>
                  <span>Close</span>
                </Button>
                <Button>
                  <span>Send it!</span>
                  <SendHorizonal />
                </Button>
              </DialogFooter>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default ContactResponseForm
