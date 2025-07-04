import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Button } from '../ui/button'
import { Alert, AlertTitle, AlertDescription } from '../ui/alert'
import Input from '../form/Input'
import { useEffect, useState, type FormEvent } from 'react'
import { Label } from '../ui/label'
// import Checkbox from '../form/Checkbox'
import { Check, Plus } from 'lucide-react'
import useVendorStore from '@/stores/useVendorStore'
import type { NewVendor } from '@/services/useVendorService'
// import { brandOptions } from '@/stores/useVendorStore'
import { Toaster } from '../ui/sonner'
import { toast } from 'sonner'
import VendorBrandSelect from './vendor/VendorBrandSelect'

interface Props {
  id?: number | null
  onCancel?: () => void
  onSubmit?: () => void
  btnProps?: {
    variant: 'secondary' | 'outline' | 'default'
  }
}

const VendorForm = ({ id, onSubmit, onCancel, btnProps }: Props) => {
  const { error, loading, createVendor, vendors, updateVendor } = useVendorStore()

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [location, setLocation] = useState<string | null>(null)
  const [brands, setBrands] = useState<string[]>([])

  const setForm = ({ name, phone, location, brands }: NewVendor) => {
    setName(name)
    setPhone(phone)
    setLocation(location ?? null)
    setBrands(brands)
  }

  useEffect(() => {
    if (id) {
      const vendor = vendors.find((v) => v.id === id)
      if (!vendor) return
      setForm(vendor)
      setShowDialog(true)
    }
  }, [id])

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        name,
        phone,
        brands,
        location,
      }

      let action = 'created'
      if (id) {
        action = 'updated'
        await updateVendor(id, payload)
      } else {
        await createVendor(payload)
      }

      setShowDialog(false)

      toast.info(`Vendor ${action} successfully.`, {
        icon: <Check size={16} />,
        description: name,
        descriptionClassName: '!text-muted-foreground',
      })

      if (onSubmit) onSubmit()
    } catch (error) {
      toast.error('Error creating vendor', { description: error as string })
    }
  }

  const [showDialog, setShowDialog] = useState(false)
  useEffect(() => {
    if (!showDialog) {
      if (onCancel) onCancel()
      setForm({ name: '', phone: '', location: '', brands: [] })
    }
  }, [showDialog])

  return (
    <>
      <Dialog open={showDialog} onOpenChange={(value) => setShowDialog(value)}>
        <DialogTrigger asChild>
          <Button className="ml-auto" onClick={() => setShowDialog(true)} {...btnProps}>
            <span>Add new vendor</span>
            <Plus />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            {id !== null ? (
              <DialogTitle>Update a vendor </DialogTitle>
            ) : (
              <DialogTitle>Add a new vendor</DialogTitle>
            )}
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
            <Input
              value={name}
              label="Name"
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            />
            <Input
              value={phone}
              label="Phone"
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            />
            <Input
              value={location ?? ''}
              label="Location"
              onInput={(e: React.ChangeEvent<HTMLInputElement>) => setLocation(e.target.value)}
            />
            <div className="mb-4 space-y-2">
              <Label>Brands</Label>
              <VendorBrandSelect brands={brands} onChange={setBrands} />
            </div>
            <div className="flex space-x-3 justify-end items-center pt-8">
              <Button type="button" variant="secondary" onClick={() => setShowDialog(false)}>
                Cancel
              </Button>
              <Button disabled={loading}>Save details</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <Toaster position="top-center" />
    </>
  )
}

export default VendorForm
