import ky from 'ky'
import { useEffect, useState } from 'react'

export interface Vendor {
  id: number
  name: string
  phone: string
  brands: string[]
  location: string | null
}

export interface NewVendor {
  name: string
  phone: string
  brands: string[]
  location?: string | null
}

export const useVendorService = () => {
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()
  const api = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL + '/vendors',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  const getVendors = async () => {
    setLoading(true)
    try {
      const response = await api.get('')
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const { data } = await response.json<{ message: 'ok'; data: Vendor[] }>()
      setVendors(data)
      return data
    } catch (error) {
      console.error('Failed to fetch vendors:', error)
      setError(error as string)
      return null
    } finally {
      setLoading(false)
    }
  }

  const createVendor = async (vendorData: NewVendor) => {
    setLoading(true)
    try {
      const response = await api.post('', {
        json: vendorData,
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const { data } = await response.json<{ message: 'ok'; data: Vendor }>()
      if (data) setVendors((prev) => [...prev, data])
      return data
    } catch (error) {
      console.error('Failed to create vendor:', error)
      setError(error as string)
      return null
    } finally {
      setLoading(true)
    }
  }

  const updateVendor = async (id: number, vendorData: NewVendor) => {
    setLoading(true)
    try {
      const response = await api.put(id.toString(), {
        json: vendorData,
      })
      if (!response.ok) throw new Error('Error updating vendor')

      const { error } = await response.json<{ error?: string; message: 'ok' | 'error' }>()
      if (error) throw new Error(error)

      // update vendors
      setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, ...vendorData } : v)))
    } catch (error) {
      console.error('Error deleting vendor', error)
      setError(error as string)
    } finally {
      setLoading(false)
    }
  }

  const deleteVendor = async (id: number) => {
    setLoading(true)
    try {
      const response = await api.delete(id.toString())
      if (!response.ok) throw new Error('Error deleting vendor')
      const { error, message } = await response.json<{ error: string; message: 'ok' | 'error' }>()
      if (error) throw new Error(message)

      // remove vendor
      setVendors((prev) => prev.filter((v) => v.id !== id))

      return true
    } catch (error) {
      console.error('Error deleting vendor', error)
      setError(error as string)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getVendors()
  }, [])

  return { vendors, loading, error, getVendors, createVendor, updateVendor, deleteVendor }
}
