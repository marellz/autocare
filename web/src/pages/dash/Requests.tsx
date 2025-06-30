import { useEffect, useState } from 'react'
import DashboardLayout from '@/layouts/Dashboard'
import useRequestStore from '@/stores/useRequestStore'
import type { Request } from '@/services/useRequestService'
import VendorAssign from '@/components/partials/requests/VendorAssign'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
/**/

import DataTable from '@/components/custom/DataTable'
import StatusBadge from '@/components/custom/requests/StatusBadge'
import { type ColumnDef } from '@tanstack/react-table'

const Requests = () => {
  const { requests, getRequests } = useRequestStore()

  useEffect(() => {
    getRequests()
  }, [])

  const [displayRequest, setDisplayRequest] = useState<Request | undefined>()

  const columns: ColumnDef<Request>[] = [
    {
      accessorKey: 'id',
      header: 'ID #',
      cell: ({ row }) => <p className="font-bold px-2">{row.original.id}</p>,
    },
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
      header: () => <p className="text-right pr-4">Actions</p>,
      cell: ({ row }) => {
        // const { id } = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild className="flex justify-center">
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleVendorAssign(row.original)}>
                Assign to vendors
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },

      /*
       * Todo: Implement:
       * assign(to vendors) ✅
       * see available offers(if any)
       * respond to client
       * refund(if nothing)
       * change status
       */
    },
  ]

  //
  const handleVendorAssign = (request: Request) => {
    setShowVendorAssign(true)
    setDisplayRequest(request)
  }
  const [showVendorAssign, setShowVendorAssign] = useState<boolean>(false)
  const hideVendorAssign = () => {
    setShowVendorAssign(false)
    setDisplayRequest(undefined)
  }
  // getRequests
  return (
    <DashboardLayout>
      <div>
        <div className="py-4">
          <h1 className="text-4xl font-bold">Requests</h1>
        </div>
        <div className="mt-4">
          <DataTable columns={columns} data={requests} />
        </div>
      </div>

      {/**
       * VendorAssign
       * show vendors to assign to
       */}

      <VendorAssign
        open={showVendorAssign}
        request={displayRequest}
        hideDialog={hideVendorAssign}
      ></VendorAssign>

      {/**
       * RequestOffers
       * show offers for the request
       */}
    </DashboardLayout>
  )
}

export default Requests
