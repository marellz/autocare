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
import { useEffect, useState } from 'react'
import { Label } from '../ui/label'
import { Check, Plus } from 'lucide-react'
import useVendorStore from '@/stores/useVendorStore'
import type { NewVendor } from '@/services/useVendorService'
import { toast } from 'sonner'
import VendorBrandSelect from './vendor/VendorBrandSelect'
import { useForm } from 'react-hook-form'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '../ui/input'
import formSchema, {type VendorFormSchema} from '@/schemas/vendor.schema'

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
  
  const setForm = (payload: NewVendor) => {
    form.reset({ ...payload, location: payload.location ?? '' })
  }


  const form = useForm<VendorFormSchema>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      phone: '',
      location: '',
      brands: [],
    },
  })

  useEffect(() => {
    if (id) {
      const vendor = vendors.find((v) => v.id === id)
      if (!vendor) return
      setForm(vendor)
      setShowDialog(true)
    }
  }, [id])

  const _handleSubmit = async (payload: VendorFormSchema) => {
    try {
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
        description: payload.name,
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

          <Form {...form}>
            <form onSubmit={form.handleSubmit(_handleSubmit)}>
              <div className="space-y-4">
                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor name</FormLabel>
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
                      <FormLabel>Phone number</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                      <FormDescription>
                        Phone number must start with <b>254</b>
                      </FormDescription>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  name="location"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Vendor's location</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                ></FormField>

                <div className="mb-4 space-y-2">
                  <FormField
                    name="brands"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <Label>Vendor's brands</Label>
                        <VendorBrandSelect
                          brands={field.value}
                          onChange={(values) => form.setValue('brands', values)}
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
              </div>
              <div className="flex space-x-3 justify-end items-center mt-8">
                <Button type="button" variant="secondary" onClick={() => setShowDialog(false)}>
                  Cancel
                </Button>
                <Button disabled={loading}>Save details</Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default VendorForm
