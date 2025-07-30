import ContactFilters from '@/components/contact/Filters'
import StatusSelect from '@/components/contact/StatusSelect'
import DataTable from '@/components/custom/DataTable'
import TypTitle from '@/components/custom/typography/Title'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { ContactMessage, ContactMessageStatus } from '@/services/useContactService'
import useContactStore from '@/stores/useContactStore'
import type { ColumnDef } from '@tanstack/react-table'
import { AlertCircle, MoreHorizontal, User } from 'lucide-react'
import { useEffect } from 'react'

const Contact = () => {
  const { loading, error, messages, params, getAll, updateParams, update } = useContactStore()

  // actions
  const sendResponse = (id: number) => {
    console.log('Send response to ', id) // todo
  }

  const handleStatusUpdate = async (id: number, payload: { status: ContactMessageStatus }) => {
    await update(id, payload)
  }

  const columns: ColumnDef<ContactMessage>[] = [
    {
      accessorKey: 'name',
      header: 'User name',
      cell: ({ row }) => {
        const { name, email, phone } = row.original
        return (
          <div className="flex items-start space-x-2">
            <span className="p-2 border rounded-full">
              <User size={16} />
            </span>
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm">{email}</p>
              {phone && <p className="text-sm text-muted-foreground">{phone}</p>}
            </div>
          </div>
        )
      },
    },

    {
      accessorKey: 'message',
      header: 'Message body',
      cell: ({ row }) => {
        const { message, createdAt } = row.original
        return (
          <div>
            <p className="text-wrap">{message}</p>
            <p className="mt-2 text-xs text-muted-foreground">Sent at {createdAt}</p>
          </div>
        )
      },
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => {
        const { id, status } = row.original
        return (
          <StatusSelect
            status={status}
            onSelect={(newStatus) => handleStatusUpdate(id, { status: newStatus })}
          ></StatusSelect>
        )
      },
    },
    {
      accessorKey: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const { id } = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreHorizontal />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => sendResponse(id)}>
                <span>Send response</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  useEffect(() => {
    getAll()
  }, [])

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <TypTitle>Contact messages</TypTitle>
      </div>

      <ContactFilters />
      {error ? (
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>An error occcured.</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : (
        <DataTable
          loading={loading}
          columns={columns}
          data={messages}
          params={params}
          onParameterChange={updateParams}
        />
      )}
    </div>
  )
}

export default Contact
