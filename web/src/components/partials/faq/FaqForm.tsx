import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import type { FAQ } from '@/services/useFAQService'
import { zodResolver } from '@hookform/resolvers/zod'
import { faqFormSchema as formSchema, type FAQFormSchema as Schema } from '@/schemas/faq.schema'
import { useForm } from 'react-hook-form'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import useFAQStore from '@/stores/useFAQStore'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useEffect } from 'react'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  item: FAQ | null
  onCancel: () => void
}

const FaqForm = ({ open, item, onOpenChange, onCancel }: Props) => {
  const { error, loading, create, update } = useFAQStore()
  const form = useForm<Schema>({
    resolver: zodResolver(formSchema),
  })

  const handleCancel = () => {
    form.clearErrors()
    form.setValue('title', '')
    form.setValue('content', '')
    onCancel()
  }

  const handleSubmit = async (values: Schema) => {
    try {
      if (item?.id) {
        await update(item?.id, values)
        toast('FAQ updated')
      } else {
        await create(values)
        toast('FAQ created')
      }

      handleCancel()
    } catch (error) {
      console.error(error)
      toast.message('Error occurred on FAQ submission', {
        description: String(error),
      })
    }
  }

  useEffect(() => {
    if(item) {
        form.setValue('title', item.title)
        form.setValue('content', item.content)
    }
  }, [item])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item?.id ? 'Update' : 'Create'} FAQ</DialogTitle>
          <DialogDescription>Control what your users see on the FAQs</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)}>
              <div className="space-y-4 mt-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Content</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end space-x-4 mt-8">
                  <Button variant="secondary" type="button" onClick={handleCancel}>
                    <span>Cancel</span>
                  </Button>
                  <Button type="submit" disabled={loading}>
                    <span>Save</span>
                  </Button>
                </div>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default FaqForm
