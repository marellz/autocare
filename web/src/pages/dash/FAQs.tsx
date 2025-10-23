import Loader from '@/components/custom/Loader'
import TypTitle from '@/components/custom/typography/Title'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import useFAQStore from '@/stores/useFAQStore'
import { AlertCircle, Edit, Plus, Trash } from 'lucide-react'
import { useEffect, useState } from 'react'
import type { FAQ } from '@/services/useFAQService'
import FaqForm from '@/components/partials/faq/FaqForm'
import { toast } from 'sonner'

interface FAQListProps {
  onDelete: (id: number) => void
  onUpdate: (id: number) => void
}

const FAQList = ({ onDelete, onUpdate }: FAQListProps) => {
  const { faqs } = useFAQStore()
  return faqs.map(({ id, title, content }) => (
    <Card key={id}>
      <CardHeader>
        <div className="flex">
          <CardTitle>{title}</CardTitle>
          <div className="ml-auto flex space-x-2 items-center">
            <Button variant="ghost" onClick={() => onUpdate(id)}>
              <Edit />
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="ghost" className="hover:text-destructive">
                  <Trash />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete the FAQ from the
                    database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button variant="destructive" onClick={() => onDelete(id)}>
                      Yes, delete
                    </Button>
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
        <CardDescription>{content}</CardDescription>
      </CardHeader>
    </Card>
  ))
}

const FAQs = () => {
  const { loading, error, faqs, getAll, getById, destroy } = useFAQStore()

  useEffect(() => {
    getAll()
  }, [])

  const [form, setForm] = useState<FAQ | null>(null)
  const [dialogOpen, setDialogOpen] = useState<boolean>(false)

  const handleUpdate = async (id: number) => {
    const _faq = await getById(id)
    if (!_faq) {
      toast.error('Error', { description: 'This FAQ does not exist.' })
      return
    }
    toast.success('FAQ successfully updated')
    setForm(_faq)
    setDialogOpen(true)
  }

  const handleDelete = async (id: number) => {
    await destroy(id)
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <TypTitle>FAQs</TypTitle>
        <Button
          onClick={() => {
            setDialogOpen(true)
          }}
        >
          <span>Add new</span>
          <Plus />
        </Button>
      </div>
      <div>
        {loading && (
          <div className="py-10">
            <Loader />
          </div>
        )}
        {error && (
          <Alert className="border-destructive bg-transparent" variant="destructive">
            <AlertCircle></AlertCircle>
            <AlertTitle>An error occurred</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        {faqs.length > 0 && (
          <div className="space-y-4 mt-8">
            <FAQList onDelete={handleDelete} onUpdate={handleUpdate} />
          </div>
        )}
      </div>

      <FaqForm
        item={form}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCancel={() => {
          setDialogOpen(false)
          setForm(null)
        }}
      />
    </div>
  )
}

export default FAQs
