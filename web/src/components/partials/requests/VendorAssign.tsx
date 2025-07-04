import type { Request } from '@/services/useRequestService'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useEffect, useState } from 'react'
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { BookX, X } from 'lucide-react'
import useVendorStore from '@/stores/useVendorStore'
import Checkbox from '@/components/form/Checkbox'
import useVendorRequestStore from '@/stores/useVendorRequestStore'
import type { Vendor } from '@/services/useVendorService'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Toaster } from '@/components/ui/sonner'
import { toast } from 'sonner'
interface Props {
  request?: Request
  hideDialog: () => void
  open: boolean
}

const VendorAssign = ({ open, request, hideDialog }: Props) => {
  // const [request, setRequest] = useState<Request>(null)
  const { getVendors, vendors } = useVendorStore()
  const { vendorRequests, getVendorRequests, createVendorRequest } = useVendorRequestStore()
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>(vendors)

  const initiate = async (/*brand: string*/) => {
    await getVendors({})
    await getVendorRequests({
      // will not run if request is null.
      requestId: request!.id,
    })
  }

  const [selected, setSelected] = useState<number[]>([])

  const handleVendorSelect = (id: number) => {
    if (selected.includes(id)) {
      setSelected((prev) => [...prev.filter((i) => i !== id)])
    } else {
      setSelected((prev) => [...prev, id])
    }
  }

  // todo: create toast! ✅
  const handleSubmit = async () => {
    try {
      await Promise.all(selected.map((vendorId) => {
        createVendorRequest({
            vendorId,
            requestId: request!.id,
          })
      }))

      hideDialog()
      toast.success('Successfully assigned request to vendors', {
        description: `Request ID #${request!.id}`,
      })
    } catch (error) {
      toast.error('Error assiging request to vendors', {
        description: error as string,
      })
    }
  }

  const handleOpenChange = (v: boolean) => {
    if (!v) hideDialog()
  }

  const handleSearchInput = (query: string) => {
    const _vendors = vendors.filter((v) => v.name.toLowerCase().includes(query.toLowerCase()))
    setFilteredVendors(_vendors)
  }

  useEffect(() => {
    if (!request) return
    initiate()
  }, [request])

  return (
    <>
      <Dialog open={open} onOpenChange={handleOpenChange}>
        {request ? (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Assign vendors</DialogTitle>
              <DialogDescription>Select vendors to send this request to</DialogDescription>
            </DialogHeader>
            <div className="space-y-8">
              {/**
               * TODO:
               * 1. display current vendor requests, or bring up in the list
               * 2. display recommended vendors
               * 3. offer search for other vendors
               */}

              <div>
                <div className="space-y-1">
                  <Label>Search</Label>
                  <div className="flex">
                    <Input
                      onInput={(e: React.ChangeEvent<HTMLInputElement>) =>
                        handleSearchInput(e.target.value)
                      }
                    />
                    <Button variant="ghost">
                      <X />
                    </Button>
                  </div>
                </div>
              </div>

              <ul className="space-y-4 max-h-[500px] overflow-auto">
                {!vendors.length && (
                  <li className="my-4">
                    <Alert>
                      <BookX />
                      <AlertTitle>No vendors</AlertTitle>
                      <AlertDescription>
                        We currently do not have dealers specializing with the requested brand
                      </AlertDescription>
                    </Alert>
                  </li>
                )}
                {!filteredVendors.length && (
                  <li className="my-4">
                    <Alert>
                      <BookX />
                      <AlertTitle>No results</AlertTitle>
                      <AlertDescription>Currently, no vendors match your query</AlertDescription>
                    </Alert>
                  </li>
                )}

                {filteredVendors.map((vendor) => (
                  <li key={vendor.id}>
                    <Checkbox
                      onCheckedChange={() => handleVendorSelect(vendor.id)}
                      checked={
                        selected.includes(vendor.id) ||
                        [...vendorRequests].map((vR) => vR.vendorId).includes(vendor.id)
                      }
                      disabled={vendorRequests.map((vR) => vR.vendorId).includes(vendor.id)}
                    >
                      <div className="space-y-1">
                        <p className="">{vendor.name}</p>
                        <p className="text-muted-foreground">{vendor.brands.join(', ')}</p>
                      </div>
                    </Checkbox>
                  </li>
                ))}
              </ul>
            </div>
            <DialogFooter>
              <div className="flex space-x-3 items-center justify-end">
                <Button variant="outline" onClick={hideDialog}>
                  Cancel
                </Button>
                <Button disabled={selected.length === 0} onClick={handleSubmit}>
                  Submit
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        ) : (
          <DialogContent>
            <DialogHeader>
              <DialogTitle>No request</DialogTitle>
              <DialogDescription>Request not set/loaded.</DialogDescription>
            </DialogHeader>
          </DialogContent>
        )}
      </Dialog>
      <Toaster position="top-center" />
    </>
  )
}

export default VendorAssign
