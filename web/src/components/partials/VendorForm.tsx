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
import Checkbox from '../form/Checkbox'
import { Plus } from 'lucide-react'
import useVendorStore from '@/stores/useVendorStore'
import type { NewVendor } from '@/services/useVendorService'

interface Props {
  id?: number | null
  onCancel: () => void
  onSubmit: () => void
  btnProps?: {
    variant: "secondary" | "outline" | 'default'
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

  const brandOptions = [
    'Toyota',
    'Honda',
    'Nissan',
    'Ford',
    'Chevrolet',
    'Volkswagen',
    'Hyundai',
    'Kia',
    'Mazda',
    'Subaru',
    'Mercedes-Benz',
    'BMW',
    'Audi',
    'Lexus',
    'Porsche',
  ]

  const handleBrandSelect = (brand: string) => {
    if (brands.includes(brand)) {
      // remove
      const _brands = [...brands]
      _brands.splice(_brands.indexOf(brand), 1)
      setBrands([..._brands])
    } else {
      setBrands([...brands, brand])
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      const payload = {
        name,
        phone,
        brands,
        location,
      }
      
      if (id) {
        updateVendor(id, payload).then(() => setShowDialog(false))
      } else {
        createVendor(payload).then(() => setShowDialog(false))
      }
      
      onSubmit()
    } catch (error) {
      console.error(error)
    }
  }

  const [showDialog, setShowDialog] = useState(false)
  useEffect(() => {
    if (!showDialog) {
      onCancel()
      setForm({ name: '', phone: '', location: '', brands: [] })
    }
  }, [showDialog])

  return (
    <Dialog open={showDialog} onOpenChange={(value) => setShowDialog(value)}>
      <DialogTrigger asChild>
        <Button onClick={() => setShowDialog(true)} {...btnProps}>
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
            <div className="flex gap-4 flex-wrap">
              {brandOptions.map((brand) => (
                <Checkbox
                  key={brand}
                  checked={brands.includes(brand)}
                  onCheckedChange={() => handleBrandSelect(brand)}
                >
                  <p>{brand}</p>
                </Checkbox>
              ))}
            </div>
          </div>
          <div className="flex space-x-3 items-center">
            <Button type="button" variant="secondary" onClick={() => setShowDialog(false)}>
              Cancel
            </Button>
            <Button disabled={loading}>Save vendor details</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default VendorForm
