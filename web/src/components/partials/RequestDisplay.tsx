import type { Request } from '@/services/useRequestService'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useEffect, useState } from 'react'
import {
  DrawerClose,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { BookX } from 'lucide-react'
import useVendorStore from '@/stores/useVendorStore'
import Checkbox from '../form/Checkbox'
import useVendorRequestStore from '@/stores/useVendorRequestStore'
interface Props {
  request?: Request
  hideDrawer: () => void
}

const RequestDisplay = ({ request, hideDrawer }: Props) => {
  // const [request, setRequest] = useState<Request>(null)
  const { getVendors, vendors } = useVendorStore()
  const { vendorRequests, getVendorRequests, createVendorRequest } = useVendorRequestStore()

  const initiate = async (/*brand: string*/) => {
    await getVendors()
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

  const handleSubmit = async () => {
    selected.forEach(async (vendorId) => {
      await createVendorRequest({
        vendorId,
        requestId: request!.id,
      })
    })

    hideDrawer()

    // todo: create toast!
  }

  useEffect(() => {
    if (!request) return
    initiate()
  }, [request])

  return (
    <div>
      {request ? (
        <div className="w-full max-w-4xl mx-auto">
          <DrawerHeader>
            <DrawerTitle>Request #{request.id}</DrawerTitle>
            <DrawerDescription>
              Showing the details/progress on the selected request.
            </DrawerDescription>
          </DrawerHeader>
          <div>
            <div className="mb-8">
              <p className="font-bold">Vendors</p>
              <p className="text-muted-foreground text-sm">
                Select vendors to send this request to
              </p>
            </div>
            <ul className="space-y-4">
              {!vendors.length && (
                <li className="my-4">
                  <Alert>
                    <BookX />
                    <AlertTitle>No results</AlertTitle>
                    <AlertDescription>
                      We currently do not have dealers specializing with the requested brand
                    </AlertDescription>
                  </Alert>
                </li>
              )}

              {/**
               * TODO:
               * 1. display vendor requests
               * 2. display potential vendors
               * 3. offer search for other vendors
               */}
              {vendors.map((vendor) => (
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
          <DrawerFooter>
            <div className="flex space-x-3 items-center justify-end">
              <DrawerClose asChild>
                <Button variant="outline" onClick={hideDrawer}>
                  Cancel
                </Button>
              </DrawerClose>
              <Button disabled={selected.length === 0} onClick={handleSubmit}>
                Submit
              </Button>
            </div>
          </DrawerFooter>
        </div>
      ) : (
        <DrawerHeader>
          <DrawerTitle>No request</DrawerTitle>
          <DrawerDescription>Request not set/loaded.</DrawerDescription>
        </DrawerHeader>
      )}
    </div>
  )
}

export default RequestDisplay
