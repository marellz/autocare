import { useState, type FormEvent } from 'react'
import Input from '../form/Input'
import Text from '../form/Text'
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

const RequestForm = () => {
  const { createRequest, error, loading } = useRequestStore()

  const [open, setOpen] = useState<boolean>(false)
  const handleSubmit = async (e: FormEvent) => {

    e.preventDefault()

    await createRequest({
      phone,
      name,
      channel: 'web',
      item,
    })

    if (error) {
      // throw error
    } else {
      // close modal
      setOpen(false)
    }
  }

  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [item, setItem] = useState<string>('')

  return (
    <Dialog open={open} onOpenChange={(v)=>setOpen(v)}>
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

        <form onSubmit={handleSubmit}>
          <div>
            <Input
              label="Name"
              required
              defaultValue={name}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
            <Input
              label="Phone"
              placeholder="254XXXXXXXXXX"
              required
              defaultValue={phone}
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            />
            <Text
              label="Item description"
              required
              defaultValue={item}
              onInput={(e: React.ChangeEvent<HTMLTextAreaElement>) => setItem(e.target.value)}
            ></Text>
          </div>
          <div className="flex items-center space-x-3">
            <Button type="button" variant="secondary">
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>Submit</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
export default RequestForm
