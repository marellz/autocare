import { useState } from 'react'
import useRequestStore from '@/stores/useRequestStore'
import { type Request, type RequestStatus } from '@/services/useRequestService'
import VendorAssign from '@/components/partials/requests/VendorAssign'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import DataTable from '@/components/custom/DataTable'
import StatusSelect from '@/components/custom/requests/StatusSelect'
import RequestOffers from '@/components/partials/requests/Offers'
import ClientResponse from '@/components/partials/requests/ClientResponse'
import { type ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import RequestFilters from '@/components/partials/requests/Filters'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import ToggleSort from '@/components/utils/ToggleSort'
import TypTitle from '@/components/custom/typography/Title'

// todo soon: filter brands, paid_status(feature/payment)

const Requests = () => {
  const { requests, resultParams, loading, updateParams, updateRequest } = useRequestStore()

  const [displayRequest, setDisplayRequest] = useState<Request | undefined>()

  const columns: ColumnDef<Request>[] = [
    {
      accessorKey: 'id',
      header: ({ column }) => <ToggleSort column={column}>ID #</ToggleSort>,
      cell: ({ row }) => <p className="font-bold px-2">{row.original.id}</p>,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <ToggleSort column={column}>Client</ToggleSort>,
      cell: ({ row }) => {
        const { name, phone, channel } = row.original
        return (
          <div>
            <div className="flex items-center space-x-1">
              <h2 className="font-medium">{name}</h2>
              <Badge variant="outline" className="text-gray-500">
                {channel}
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
      maxSize: 300,
      header: 'Item',
      cell: ({ row }) => {
        const { originalMessages: texts, createdAt, capturedDetails } = row.original
        return (
          <div className="space-y-2">
            {Object.keys(capturedDetails).length > 0 ? (
              <p>
                {Object.keys(capturedDetails).map((k) => (
                  <span key={k}>{capturedDetails[k]} </span>
                ))}
              </p>
            ) : (
              <Popover>
                <PopoverTrigger>
                  <Badge variant="secondary">
                    View {texts.length} message{texts.length !== 1 && 's'}
                  </Badge>
                </PopoverTrigger>
                <PopoverContent align="start">
                  <div className="flex flex-col space-y-1 text-sm">
                    {texts.map((text, i) => (
                      <span className="hover:bg-accent" key={`text-${i}`}>
                        &quot;{text}&quot;
                      </span>
                    ))}
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <p className="text-xs text-muted-foreground">{createdAt}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: () => <p>Status</p>,
      maxSize: 10,
      cell: ({ row }) => (
        <StatusSelect
          status={row.original.status}
          onSelect={(status: RequestStatus) => changeRequestStatus(row.original.id, status)}
        />
      ),
    },

    {
      accessorKey: 'actions',
      size: 10,
      header: () => <p className="text-right pr-4">Actions</p>,
      cell: ({ row }) => {
        {
          /* todo:vary displayed options depending on status, also for opened dialogs */
        }
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
              <DropdownMenuItem onClick={() => handleShowOffers(row.original)}>
                View offers
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleShowClientResponse(row.original)}>
                Respond to client
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },

      /*
       * todo: Implement:
       * see available offers(if any) ✅
       * respond to client ✅
          > refund(if nothing)
       */
    },
  ]

  // VendorAssign
  const handleVendorAssign = (request: Request) => {
    setShowVendorAssign(true)
    setDisplayRequest(request)
  }
  const [showVendorAssign, setShowVendorAssign] = useState<boolean>(false)
  const hideVendorAssign = () => {
    setShowVendorAssign(false)
    setDisplayRequest(undefined)
  }

  // RequestOffers
  const [showOffers, setShowOffers] = useState<boolean>(false)

  const handleShowOffers = (request: Request) => {
    setShowOffers(true)
    setDisplayRequest(request)
  }

  const hideOffers = () => {
    setShowOffers(false)
    setDisplayRequest(undefined)
  }

  // Client Response

  const [showClientResponse, setShowClientResponse] = useState<boolean>(false)

  const handleShowClientResponse = (request: Request) => {
    setShowClientResponse(true)
    setDisplayRequest(request)
  }

  const hideClientResponse = () => {
    setShowClientResponse(false)
    setDisplayRequest(undefined)
  }

  // Status

  const changeRequestStatus = async (id: number, status: RequestStatus) => {
    await updateRequest(id, { status })
  }

  // getRequests
  return (
    <>
      <div className="space-y-8">
        <div>
          <TypTitle>Requests</TypTitle>
        </div>
        <RequestFilters />
        <div>
          <DataTable
            columns={columns}
            loading={loading}
            data={requests}
            params={resultParams}
            onParameterChange={updateParams}
          />
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

      <RequestOffers
        open={showOffers}
        request={displayRequest}
        hideDialog={hideOffers}
      ></RequestOffers>

      {/**
       * ClientResponse
       * respond to the client
       */}

      <ClientResponse
        open={showClientResponse}
        request={displayRequest}
        hideDialog={hideClientResponse}
      ></ClientResponse>
    </>
  )
}

export default Requests
