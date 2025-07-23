import type { Request, RequestStatus } from '@/services/useRequestService'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { AlertCircle, SendHorizontal } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import StatusSelect from '@/components/custom/requests/StatusSelect'
import { useEffect, useState } from 'react'
import useResponseStore from '@/stores/useResponseStore'
import useRequestStore from '@/stores/useRequestStore'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from '@/components/ui/checkbox'
import formSchema, { type ClientResponseSchema } from '@/schemas/client-response.schema'

interface Props {
  open: boolean
  hideDialog: () => void
  request?: Request
}

const ClientResponse = ({ open, hideDialog, request }: Props) => {
  const { error, loading, sendClientResponse } = useResponseStore()
  const { updateRequest } = useRequestStore()

  const form = useForm<ClientResponseSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
      refund: false,
    },
  })

  const [status, setStatus] = useState<RequestStatus>(request?.status || 'submitted')

  const handleOpenChange = (show: boolean) => {
    if (!show) hideDialog()
  }

  const handleSubmit = async ({ message, refund }: ClientResponseSchema) => {
    if (!request) return //todo: throw error
    // send message
    const response = await sendClientResponse(request.id, message, refund)

    if (response) hideDialog()

    // if change in status, update that too
    if (status !== request.status) updateRequest(request.id, { status })
  }

  useEffect(() => {
    if (!open) {
      form.reset()
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        {request ? (
          <>
            <DialogHeader>
              <DialogTitle>
                Respond to client - <span className="font-bold">#{request.id}</span>
              </DialogTitle>
              <DialogDescription>Respond to client concerning their request</DialogDescription>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Send message to client</FormLabel>
                        <FormControl>
                          <Textarea {...field}></Textarea>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormItem>
                    <FormLabel>Change status</FormLabel>
                    <StatusSelect
                      status={status}
                      onSelect={(status: RequestStatus) => setStatus(status)}
                    />
                  </FormItem>

                  <FormField
                    name="refund"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="flex items-start gap-2">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <div>
                          <FormLabel>
                            <div className="space-y-0.5">
                              <p>Provide refund</p>
                              <FormDescription className="font-normal">
                                Return the service fee upon failure to provide said part.
                              </FormDescription>
                            </div>
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
            {error && (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertTitle>Error sending response</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={hideDialog}>
                Close
              </Button>
              <Button disabled={loading} onClick={form.handleSubmit(handleSubmit)}>
                <span>Send response</span>
                <SendHorizontal />
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogTitle>Invalid request</DialogTitle>
            <DialogDescription>Likely not your fault. We'll look into this.</DialogDescription>
            <div className="mt-8 flex justify-center">
              <Button onClick={hideDialog}>Close dialog</Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default ClientResponse
