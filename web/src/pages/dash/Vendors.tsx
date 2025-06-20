import DefaultLayout from '../../layouts/Default'
import VendorForm from '@/components/partials/VendorForm'
import { Badge } from '@/components/ui/badge'
import { Edit, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
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
import { useEffect, useState } from 'react'
import useVendorStore from '@/stores/useVendorStore'

const Vendors = () => {
  const { vendors, getVendors, deleteVendor } = useVendorStore()
  const [id, setId] = useState<number | null>(null)

  useEffect(() => {
    getVendors()
  }, [])

  return (
    <DefaultLayout>
      <div className="py-4 flex justify-between items-center">
        <h1 className="text-4xl">Vendors</h1>
        <VendorForm id={id} onSubmit={() => setId(null)} onCancel={() => setId(null)} />
      </div>
      <div className="mt-4">
        <ul className="space-y-4">
          {!vendors.length && (
            <li className="">
              <h5 className="text-lg">No vendors atm.</h5>
            </li>
          )}
          {vendors.map((vendor) => (
            <li key={vendor.id}>
              <a href={`#"${vendor.name}"`} className="border block rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-lg">{vendor.name}</p>

                  <div className="flex items-center space-x-2">
                    <Button type="button" variant="ghost" onClick={() => setId(vendor.id)}>
                      <Edit />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="icon" variant="secondary">
                          <X></X>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete vendor?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the vendor
                            from your database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction asChild onClick={() => deleteVendor(vendor.id)}>
                            <Button variant="destructive">Yes, remove vendor</Button>
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
                <p className="text-gray-500">{vendor.phone}</p>
                <ul className="flex items-center gap-2">
                  {vendor.brands.map((brand) => (
                    <li key={brand}>
                      <Badge>{brand}</Badge>
                    </li>
                  ))}
                </ul>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </DefaultLayout>
  )
}

export default Vendors
