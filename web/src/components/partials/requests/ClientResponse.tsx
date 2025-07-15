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
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Textarea } from '@/components/ui/textarea'
import StatusSelect from '@/components/custom/requests/StatusSelect'
import { useState } from 'react'
import useResponseStore from '@/stores/useResponseStore'
import useRequestStore from '@/stores/useRequestStore'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

interface Props {
  open: boolean
  hideDialog: () => void
  request?: Request
}

const ClientResponse = ({ open, hideDialog, request }: Props) => {
  const { error, loading, sendClientResponse } = useResponseStore()
  const { updateRequest } = useRequestStore()
  const formSchema = z.object({
    message: z.string().min(1, 'Message is required'),
  })

  type FormSchema = z.infer<typeof formSchema>

  const form = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: '',
    },
  })

  const [status, setStatus] = useState<RequestStatus>(request?.status || 'submitted')

  const handleOpenChange = (show: boolean) => {
    if (!show) hideDialog()
  }

  const handleSubmit = async ({ message }: FormSchema) => {
    if (!request) return //todo: throw error
    // send message
    const response = await sendClientResponse(request.id, message)

    if (response) hideDialog()

    // if change in status, update that too
    if (status !== request.status) updateRequest(request.id, { status })
  }

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
                  ></FormField>

                  <FormItem>
                    <FormLabel>Change status</FormLabel>
                    <StatusSelect
                      status={status}
                      onSelect={(status: RequestStatus) => setStatus(status)}
                    />
                  </FormItem>
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
