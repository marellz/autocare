import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useVendorService } from '@/services/useVendorService'

export interface Vendor {
  id: number
  name: string
  phone: string
  brands: string[]
  location: string | null
  createdAt: string
  updatedAt: string | null
}

export const useVendorStore = defineStore('vendors', () => {
  const vendors = ref<Vendor[]>()
  const service = useVendorService()

  const getVendors = async () => {
    const { data: items } = await service.getVendors()
    if (items.length) {
      vendors.value = items
    }
  }

  const setVendors = (items: Vendor[]) => {
    vendors.value = items
  }

  return { vendors, getVendors, setVendors }
})
