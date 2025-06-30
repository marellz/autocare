import { useEffect, useState } from 'react'
import DashboardLayout from '@/layouts/Dashboard'
import useRequestStore from '@/stores/useRequestStore'
import type { Request } from '@/services/useRequestService'
import RequestDisplay from '@/components/partials/RequestDisplay'
import { Drawer, DrawerContent } from '@/components/ui/drawer'
import { Badge } from '@/components/ui/badge'
/*
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'

*/
import DataTable from '@/components/custom/DataTable'
import StatusBadge from '@/components/custom/requests/StatusBadge'
import { type ColumnDef } from '@tanstack/react-table'
// import { useClearHash, useHashEffect } from '@/utils/useHashEffect'

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

  const columns: ColumnDef<Request>[] = [
    {
      accessorKey: 'name',
      header: 'Client',
      cell: ({ row }) => {
        const { name, phone, channel } = row.original
        return (
          <div>
            <div className="flex items-center space-x-1">
              <h2 className="font-medium">{name}</h2>
              <Badge variant="outline" className="text-gray-500">
                {channel}{' '}
              </Badge>
            </div>
            <a className="text-muted-foreground" href={`tel:${phone}`}>
              {phone}
            </a>
          </div>
        )
      },
    },
    {
      accessorKey: 'originalMessages',
      header: 'Item',
      cell: ({ row }) => {
        const { originalMessages: texts, status, createdAt } = row.original
        return (
          <div>
            <div className="flex items-center space-x-2 pb-2">
              <StatusBadge status={status} />
              <p className="text-xs text-muted-foreground">{createdAt}</p>
            </div>
            <div className="flex flex-wrap text-sm">
              {texts.map((text, i) => (
                <span key={`text-${i}`}>{text}</span>
              ))}
            </div>
          </div>
        )
      },
    },

    {
      accessorKey: 'actions',
      header: () => (<p className='text-right pr-4'>Actions</p>),
      cell: () => (<p className="text-center">***</p>)
      /*
      cell: ({ row }) => {
        const { id } = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className='flex justify-center'>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => showRequest(id)}>Show request</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },

      * Todo: Implement:
      * assign(to vendors)
      * see available offers(if any)
      * respond to client
      * refund(if nothing)
      * change status
      */
    },
  ]

  // getRequests
  return (
    <DashboardLayout>
      <div>
        <div className="py-4">
          <h1 className="text-4xl font-bold">Requests</h1>
        </div>
        <div className="mt-4">
          <DataTable columns={columns} data={requests} onClickRow={(id) => showRequest(id)}/>
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
