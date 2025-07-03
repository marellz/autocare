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

interface Props {
  open: boolean
  hideDialog: () => void
  request?: Request
}

const ClientResponse = ({ open, hideDialog, request }: Props) => {
  const handleOpenChange = (show: boolean) => {
    if (!show) hideDialog()
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent>
        {request ? (
          <>
            <DialogHeader>
              <DialogTitle>
                Respond to client - <span className="font-bold">#{request.id}</span>
              </DialogTitle>
              <DialogDescription>Respond to client concerning their request</DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={hideDialog}>
                Close
              </Button>
              <Button>Send response</Button>
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

export default ClientResponse
