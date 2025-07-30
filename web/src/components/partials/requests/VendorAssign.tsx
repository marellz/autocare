import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import Checkbox from '@/components/form/Checkbox'
import {
  Dialog,
  DialogHeader,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import type { VendorRequest } from '@/services/useVendorRequestService'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import useVendorStore from '@/stores/useVendorStore'
import useVendorRequestStore from '@/stores/useVendorRequestStore'
import useRequestStore from '@/stores/useRequestStore'
import type { Request, RequestStatus } from '@/services/useRequestService'
import type { Vendor } from '@/services/useVendorService'
import { Info } from 'lucide-react'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'

interface Props {
  request?: Request
  hideDialog: () => void
  open: boolean
}

const VendorAssign = ({ open, request, hideDialog }: Props) => {
  const { getVendors, vendors } = useVendorStore()
  const { vendorRequests, getVendorRequests, createVendorRequest } = useVendorRequestStore()
  const { updateRequest } = useRequestStore()

  const initiate = async (/*brand: string*/) => {
    if (!request) {
      // will not run if request is null.
      toast.error('Error occurred', { description: 'Request does not exist.' })
      return
    }

    await getVendors()
    await getVendorRequests({
      requestId: request.id,
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
    try {
      await Promise.all(
        selected.map((vendorId) => {
          createVendorRequest({
            vendorId,
            requestId: request!.id,
          })
        }),
      )

      if ((['pending', 'submitted'] as RequestStatus[]).includes(request!.status)) {
        updateRequest(request!.id, {
          status: 'completed',
        })
      }

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

  // first remove requested vendors
  const unrequestedVendors = vendors.filter(
    (vendor) => !vendorRequests.map((vr) => vr.vendorId).includes(vendor.id),
  )

  const requestBrand = 'Toyota' // todo: fix: get real brand from request
  const recommended = unrequestedVendors.filter((vendor) => vendor.brands.includes(requestBrand))
  const otherVendors = unrequestedVendors.filter((vendor) => !vendor.brands.includes(requestBrand))

  // proposition
  const proposeQuote = (id: number) => {
    // todo: update VendorRequest with status "proposed"
    console.log(`propose vendor-request id ${id}`)
  }

  useEffect(() => {
    if (!request) return
    if (!open) return
    initiate()
  }, [request, open])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      {request ? (
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign vendors</DialogTitle>
            <DialogDescription>Select vendors to send this request to.</DialogDescription>
          </DialogHeader>
          <div className="space-y-8">
            {vendorRequests.length > 0 && (
              <Alert className="w-full">
                <Info />
                <AlertTitle>
                  <p>Currently assigned to {vendorRequests.length} vendors</p>
                </AlertTitle>
                <AlertDescription>You can see them at the bottom of the list.</AlertDescription>
              </Alert>
            )}
            <Command className="rounded-lg border h-auto max-h-[500px]">
              <CommandList className="relative">
                <CommandInput placeholder="Search for a vendor, brand" />
                <CommandEmpty>No results found</CommandEmpty>
                {recommended.length > 0 && (
                  <>
                    <CommandGroup heading="Recommended">
                      <VendorList
                        vendors={recommended}
                        vendorRequests={vendorRequests}
                        selected={selected}
                        onSelect={handleVendorSelect}
                      />
                    </CommandGroup>
                    <CommandSeparator />
                  </>
                )}
                {otherVendors.length > 0 && (
                  <CommandGroup heading="Other vendors">
                    <VendorList
                      vendors={otherVendors}
                      vendorRequests={vendorRequests}
                      selected={selected}
                      onSelect={handleVendorSelect}
                    />
                  </CommandGroup>
                )}

                {vendorRequests.length > 0 && (
                  <>
                    <CommandSeparator />
                    <CommandGroup heading="Current">
                      {vendorRequests.map(({ id, vendor, status, price, condition }) => (
                        <CommandItem key={id}>
                          <div className="flex-auto space-y-1 py-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium">{vendor.name}</p>
                              {status === 'proposed' && (
                                <Badge variant="default" className="bg-green-500 text-white">
                                  {status}
                                </Badge>
                              )}
                              {status === 'quoted' && (
                                <Badge
                                  variant="outline"
                                  className="border-current text-green-500/90"
                                >
                                  {status}
                                </Badge>
                              )}
                              {!['proposed', 'quoted'].includes(status) && (
                                <Badge variant="secondary">{status}</Badge>
                              )}
                            </div>
                            {price && condition && (
                              <p className="text-muted-foreground">
                                Ksh. {Number(price).toLocaleString()} | {condition}
                              </p>
                            )}
                          </div>
                          <div></div>
                          {status === 'quoted' && (
                            <Button size="sm" variant="outline" onClick={() => proposeQuote(id)}>
                              <span>Propose</span>
                            </Button>
                          )}
                          {status === 'proposed' && <Badge>Proposed</Badge>}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </>
                )}
              </CommandList>
            </Command>

            {/**
             * todo:
             * 1. Create an API endpoint to send proposals using `proposeQuote`
             */}
          </div>
          <DialogFooter>
            <div className="flex space-x-3 items-center justify-end">
              <Button variant="outline" onClick={hideDialog}>
                Cancel
              </Button>
              <Button disabled={selected.length === 0} onClick={handleSubmit}>
                Send request
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
  )
}

interface VendorListItemProps {
  vendors: Vendor[]
  vendorRequests: VendorRequest[]
  selected: number[]
  onSelect?: (vendorId: number) => void
}

const VendorList = ({ onSelect, vendors, vendorRequests, selected }: VendorListItemProps) => {
  const handleCheckedChange = (id: number) => {
    if (onSelect) {
      onSelect(id)
    }
  }
  return vendors.map((vendor) => (
    <CommandItem key={vendor.id}>
      <Checkbox
        onCheckedChange={() => handleCheckedChange(vendor.id)}
        checked={
          selected.includes(vendor.id) ||
          [...vendorRequests].map((vR) => vR.vendorId).includes(vendor.id)
        }
        disabled={vendorRequests.map((vR) => vR.vendorId).includes(vendor.id)}
      >
        <div className="space-y-1">
          <p className="">
            {vendor.name} - #{vendor.id}
          </p>
          <p className="font-normal text-xs text-muted-foreground">{vendor.brands.join(', ')}</p>
        </div>
      </Checkbox>
    </CommandItem>
  ))
}

export default VendorAssign
