import type { Request } from '@/services/useRequestService'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import useVendorRequestStore from '@/stores/useVendorRequestStore'
import Loader from '@/components/custom/Loader'
import { Badge } from '@/components/ui/badge'
import { RefreshCcw } from 'lucide-react'

interface Props {
  open: boolean
  hideDialog: () => void
  request?: Request
}

const RequestOffers = ({ open, hideDialog, request }: Props) => {
  const handleOpenChange = (show: boolean) => {
    if (!show) hideDialog()
  }

  const { loading, vendorRequests: offers, getVendorRequests } = useVendorRequestStore()
  const getOffers = async () => {
    if (!request) return // todo: show error alert
    await getVendorRequests({ requestId: request.id, price: true })
  }

  useEffect(() => {
    if (!open) return
    getOffers()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        {request ? (
          <>
            <DialogHeader>
              <DialogTitle>
                Offers - <span className="font-bold">#{request.id}</span>
              </DialogTitle>
              <DialogDescription>View offers from vendors for this request</DialogDescription>
            </DialogHeader>

            {loading ? (
              <Loader />
            ) : (
              <table>
                <tbody>
                  {offers.length === 0 && (
                    <tr>
                      <td colSpan={4}>
                        <div className="text-center border rounded-lg py-2">
                          <p className="font-medium">Empty.</p>
                          <p className="text-sm text-muted-foreground">
                            No offers for this request yet.
                          </p>
                        </div>
                      </td>
                    </tr>
                  )}
                  {offers.map((offer) => (
                    <>
                      <tr>
                        <td className="border-b py-2">
                          <p className="font-medium">{offer.vendor.name}</p>
                        </td>
                        <td className="border-b py-2">
                          <span className="text-xs">Ksh.</span>
                          <b> {offer.price?.toLocaleString()}</b>
                        </td>
                        <td className="border-b py-2">
                          <Badge variant="outline">{offer.condition}</Badge>
                        </td>
                        <td className="border-b py-2">
                          <p className="text-sm">{offer.createdAt}</p>
                        </td>
                      </tr>
                    </>
                  ))}
                </tbody>
              </table>
            )}

            <DialogFooter>
              <Button onClick={getOffers} disabled={loading}>
                <span>Refresh</span>
                <RefreshCcw />
              </Button>
              <Button type="button" variant="outline" onClick={hideDialog}>
                Close
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

export default RequestOffers
