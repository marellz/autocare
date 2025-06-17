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
  id: number
  name: string
  phone: string
  brands: string[]
  location?: string
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
      
      const { data } = await response.json<{ message: 'ok'; data: Vendor }>()
      if(data) setVendors([...vendors, data])
      return data
    } catch (error) {
      console.error('Failed to create vendor:', error)
      setError(error as string)
      return null
    } finally {
      setLoading(true)
    }
  }

  useEffect(() => {
      getVendors()
    }, [])

  return { vendors, loading, error, getVendors, createVendor }
}
