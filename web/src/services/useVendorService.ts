import type { Vendor } from '@/stores/vendors'
import ky from 'ky'

export const useVendorService = () => {
  const api = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL + '/vendors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  const getVendors = async () => {
    try {
      const response = await api.get('')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return await response.json<{ message: 'ok'; data: Vendor[] }>()
    } catch (error) {
      console.error('Failed to fetch vendors:', error)
      throw error
    }
  }

  const createVendor = async (vendorData: any) => {
    try {
      const response = await api.get('/vendors', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(vendorData),
      })
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      return await response.json()
    } catch (error) {
      console.error('Failed to create vendor:', error)
      throw error
    }
  }

  return { getVendors, createVendor }
}
