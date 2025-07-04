import DashboardLayout from '@/layouts/Dashboard'
import VendorForm from '@/components/partials/VendorForm'
import { Badge } from '@/components/ui/badge'
import { MoreHorizontal, Search } from 'lucide-react'
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
import { Input } from '@/components/ui/input'
import BrandSelect from '@/components/partials/vendor/BrandSelect'

const Vendors = () => {
  const { vendors, resultParams, loading, getVendors, handlePaginationChange, deleteVendor } =
    useVendorStore()
  const [id, setId] = useState<number | null>(null)

  const handleVendorEdit = (vendor: Vendor) => {
    setId(vendor.id)
  }

  const columns: ColumnDef<Vendor>[] = [
    {
      accessorKey: 'id',
      header: 'ID #',
      cell: ({ row }) => <p className="font-bold px-2">{row.original.id}</p>,
    },
    {
      accessorKey: 'name',
      header: 'Vendor',
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
                Edit vendor details
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      size="icon"
                      variant="destructive"
                      className="w-full bg-red-100 text-red-500 hover:text-white mt-1"
                    >
                      <span>Delete vendor</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete vendor?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the vendor from
                        your database.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction asChild onClick={() => deleteVendor(id)}>
                        <Button variant="destructive">Yes, remove vendor</Button>
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const [query, setQuery] = useState<string>('')
  const handleQueryInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setQuery(val)
  }

  const handleQueryFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    //

    console.log('searching ' + query)
    getVendors({ query })
  }

  return (
    <DashboardLayout>
      <div className="py-4 flex items-center">
        <h1 className="text-4xl font-bold">Vendors</h1>
        <VendorForm
          btnProps={{ variant: 'outline' }}
          id={id}
          onSubmit={() => setId(null)}
          onCancel={() => setId(null)}
        />
      </div>
      <div className="mt-4 space-y-8">
        <div className="flex space-x-4">
          <form onSubmit={handleQueryFormSubmit}>
            <div className="flex gap-2">
              <Input onInput={handleQueryInput} placeholder="Search for a name, phone" />
              <Button type="submit">
                <span>Search</span>
                <Search />
              </Button>
            </div>
          </form>

          <div>
            <BrandSelect
              onSelect={(brand: string | null) => getVendors({ query: '', brand: brand ?? '' })}
            />
          </div>
        </div>
        <DataTable
          columns={columns}
          data={vendors}
          loading={loading}
          pagination={resultParams}
          onPaginationChange={handlePaginationChange}
        />
      </div>
    </DashboardLayout>
  )
}

export default Vendors
