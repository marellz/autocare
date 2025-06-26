import { Badge } from '@/components/ui/badge'
import useRequestStore from '@/stores/useRequestStore'
import DashboardLayout from '@/layouts/Dashboard'

import { useEffect, useState } from 'react'
// import { useClearHash, useHashEffect } from '@/utils/useHashEffect'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import type { Request } from '@/services/useRequestService'
import RequestDisplay from '@/components/partials/RequestDisplay'
const Requests = () => {
  const { requests, getRequests } = useRequestStore()

  useEffect(() => {
    getRequests()
  }, [])

  const [open, setOpen] = useState<boolean>(false)
  const [displayRequest, setDisplayRequest] = useState<Request | undefined>()

/*
  useHashEffect((id) => {
    if (id) {
      const request = requests.find((r) => r.id === id)
      if (!request) return
      setOpen(true)
      setDisplayRequest(request)
    } else {
      console.log('no id')
      // if(open) setOpen(false)
    }
  })

  const clearHash = useClearHash()
*/
  const hideDrawer = () => {
    setOpen(false)
    setDisplayRequest(undefined)
  }

  const showRequest = (id: number) => {
    const request = requests.find((r) => r.id === id)
    if (!request) return
    setOpen(true)
    setDisplayRequest(request)
  }

  // getRequests
  return (
    <DashboardLayout>
      <div>
        <div className="py-4">
          <h1 className="text-4xl">Requests</h1>
        </div>
        <div className="mt-4">
          <ul className="space-y-4">
            {!requests.length && (
              <li className="">
                <h5 className="text-lg">No requests atm.</h5>
              </li>
            )}

            {requests.map((request) => (
              <li className="" key={request.id}>
                <a
                  href={`#${request.id}`}
                  className="border block rounded-lg p-4"
                  onClick={() => showRequest(request.id)}
                >
                  <div className="flex items-center space-x-4">
                    <p className="font-medium text-lg">{request.name}</p>
                    <Badge>{request.status}</Badge>
                  </div>
                  <p className="text-gray-500">{request.phone}</p>
                  <ul className="flex items-center gap-2">
                    {request.originalMessages.map((message, i) => (
                      <li key={`${request.id}-${i}`}>{message}</li>
                    ))}
                  </ul>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Drawer open={open}>
        <DrawerContent>
          <RequestDisplay request={displayRequest} hideDrawer={hideDrawer}></RequestDisplay>
        </DrawerContent>
      </Drawer>
    </DashboardLayout>
  )
}

export default Requests
