import DataTable from '@/components/custom/DataTable'
import Loader from '@/components/custom/Loader'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import type { Request } from '@/services/useRequestService'
import useRequestStore from '@/stores/useRequestStore'
import { zodResolver } from '@hookform/resolvers/zod'
import type { ColumnDef } from '@tanstack/react-table'
import { AlertCircle, ArrowDownCircle, MoreHorizontal } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import z from 'zod'

const MyRequests = () => {
  const formSchema = z.object({
    phone: z
      .string()
      .length(12, { message: 'Not a valid phone number' })
      .startsWith('254', { message: "Phone number must start with '254'" })
      .regex(/^[0-9]+$/, { message: 'Phone number must only contain digits' }),
  })

  type SchemaType = z.infer<typeof formSchema>
  const form = useForm<SchemaType>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      phone: '',
    },
  })

  const [dirty, setDirty] = useState<boolean>(false)

  const { loading, resultParams, requests, resetRequests, updateParams } = useRequestStore()

  const handlePaginationChange = (page: number, limit: number) => {
    updateParams({ page, limit })
  }
  
  const onSubmit = ({ phone }: SchemaType) => {
    updateParams({ phone })
    setDirty(true)
  }

  useEffect(() => {
    resetRequests()
  }, [])

  const getOffers = async (id: number) => {
    // todo: get proposed offers for this requests
    console.log({ request: id })
  }

  const processPayment = async (id: number) => {
    // todo: feature: add way to process payment for this request
    console.log({ request: id })
  }

  const columns: ColumnDef<Request>[] = [
    {
      accessorKey: 'id',
      header: '# ID',
      cell: ({ row }) => <p className="font-bold">#{row.original.id}</p>,
    },
    {
      accessorKey: 'channel',
      header: 'Channel',
      cell: ({ row }) => (
        <Badge variant="outline" className="text-gray-500">
          {row.original.channel}
        </Badge>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => <Badge>{row.original.status}</Badge>,
    },
    {
      accessorKey: 'originalMessages',
      header: 'Request',
      cell: ({ row }) => (
        <ul>
          {row.original.originalMessages.map((message, i) => (
            <li key={i}>{message}</li>
          ))}
        </ul>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created',
    },
    {
      header: 'Actions',
      cell: ({ row }) => {
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
              <DropdownMenuItem onClick={() => processPayment(row.original.id)}>
                {/* if status === 'submitted */}
                Make payment
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => getOffers(row.original.id)}>
                {/* if status === pending */}
                View offers
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-bold text-4xl">Track Your Car Part Requests</h1>
        <p className="text-muted-foreground">
          Enter your phone number to view all the quotes and responses you've received. No login
          needed.
        </p>
      </div>
      <div className="grid grid-cols-2">
        <Card>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="grid-cols-3 ">
                  <div className="mb-1">
                    <FormLabel>Your phone number</FormLabel>
                  </div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <FormField
                    name="phone"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="col-span-3">
                        <FormControl>
                          <Input placeholder="254XXXXXXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                        <FormDescription className="mt-1">
                          <div className="flex items-start space-x-4 text-muted-foreground">
                            <AlertCircle size={20} className="flex-none" />
                            <p className="text-sm ">
                              We'll search for requests that were made using this phone number. Only
                              numbers used in real requests will return results. We never share your
                              data.
                            </p>
                          </div>
                        </FormDescription>
                      </FormItem>
                    )}
                  ></FormField>
                  <div>
                    <Button disabled={loading}>
                      <span>Get requests</span>
                      <ArrowDownCircle />
                    </Button>
                  </div>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
      <div>
        {loading ? (
          <Loader />
        ) : requests.length ? (
          <DataTable
            data={requests}
            columns={columns}
            pagination={resultParams}
            onPaginationChange={handlePaginationChange}
          />
        ) : (
          form.watch('phone').length > 0 &&
          dirty && (
            <Alert>
              <AlertCircle />
              <AlertTitle>No Requests Found for That Number</AlertTitle>
              <AlertDescription>
                <div className="space-y-4">
                  <p>We couldn’t find any part requests tied to this phone number.</p>
                  <div className="grid grid-cols-2 gap-10">
                    <div>
                      <p className="mb-2 font-medium underline">Possible reasons</p>
                      <ul className="list-disc">
                        <li>You might have entered the wrong number.</li>
                        <li>Your request may not have been processed yet.</li>
                        <li>You used a different number to make the request.</li>
                      </ul>
                    </div>
                    <div className="pl-10 border-l list-disc">
                      <p className="mb-2 font-medium underline">What to do next</p>
                      <ul className="list-disc">
                        <li>Double-check the number and try again.</li>
                        <li>Give it a few minutes if you just sent the request.</li>
                        <li>Start a new request if you haven’t already.</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )
        )}
      </div>
    </div>
  )
}

export default MyRequests
