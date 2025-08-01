import VendorForm from '@/components/partials/VendorForm'
import { Badge } from '@/components/ui/badge'
import { Edit, MoreHorizontal, Trash2 } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

import { Button } from '@/components/ui/button'

import { useState } from 'react'
import useVendorStore from '@/stores/useVendorStore'
import DataTable from '@/components/custom/DataTable'
import type { ColumnDef } from '@tanstack/react-table'
import type { Vendor } from '@/services/useVendorService'
import VendorFilters from '@/components/partials/vendor/Filters'
import ToggleSort from '@/components/utils/ToggleSort'
import TypTitle from '@/components/custom/typography/Title'

const Vendors = () => {
  const { vendors, resultParams, loading, updateParams, deleteVendor } = useVendorStore()
  const [id, setId] = useState<number | null>(null)

  const handleVendorEdit = (vendor: Vendor) => {
    setId(vendor.id)
  }

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: 'id',
      enableResizing: true,
      size: 10,
      header: ({ column }) => <ToggleSort column={column}>ID #</ToggleSort>,
      cell: ({ row }) => <p className="font-bold px-2">{row.original.id}</p>,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => <ToggleSort column={column}>Vendor</ToggleSort>,
      cell: ({ row }) => {
        const { name, phone, location } = row.original
        return (
          <div>
            <p className="font-medium">{name}</p>
            <p className="text-muted-foreground">
              {phone} {location && `| ${location} `}
            </p>
          </div>
        )
      },
    },
    {
      accessorKey: 'brands',
      header: 'Brands',
      cell: ({ row }) => {
        const { brands, id } = row.original
        if (!brands.length) return <p>-</p>
        return (
          <ul className="flex items-center gap-2">
            {brands.map((brand, i) => (
              <li key={`${id}-${brand}-${i}`}>
                <Badge>{brand}</Badge>
              </li>
            ))}
          </ul>
        )
      },
    },
    {
      accessorKey: 'actions',
      header: () => <p className="text-right pr-4">Actions</p>,
      cell: ({ row }) => {
        const { id } = row.original
        return (
          <AlertDialog>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex justify-end mx-4">
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <span className="sr-only">Open menu</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => handleVendorEdit(row.original)}>
                  <Edit />
                  <span>Edit vendor</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <AlertDialogTrigger asChild>
                    <DropdownMenuItem className='text-destructive hover:!text-destructive'>
                      <Trash2 className='text-current' />
                      <span>Remove vendor</span>
                    </DropdownMenuItem>
                  </AlertDialogTrigger>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete vendor?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete the vendor from your
                  database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction asChild onClick={() => deleteVendor(id)}>
                  <Button variant="outline" className='border-destructive text-destructive hover:text-destructive'>Yes, remove vendor</Button>
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        )
      },
    },
  ]

  return (
    <>
      <div className="flex items-center">
        <TypTitle>Vendors</TypTitle>
        <VendorForm
          btnProps={{ variant: 'outline' }}
          id={id}
          onSubmit={() => setId(null)}
          onCancel={() => setId(null)}
        />
      </div>
      <div className="mt-4 space-y-8">
        <VendorFilters />
        <DataTable
          columns={columns}
          data={vendors}
          loading={loading}
          params={resultParams}
          onParameterChange={updateParams}
        />
      </div>
    </>
  )
}

export default Vendors
