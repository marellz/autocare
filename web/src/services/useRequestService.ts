import ky from 'ky'
import { useEffect, useState } from 'react'

export interface Request {
  id: number
  phone: string
  name: string
  createdAt: string
  channel: 'web' | 'whatsapp'
  status: string
  updatedAt: string | null
  originalMessages: string[]
}

export interface NewRequest {
  phone: string
  item: string
  channel: 'web'
  name: string
}

export const useRequestService = () => {
  const [requests, setRequests] = useState<Request[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string>()

  const api = ky.create({
    prefixUrl: import.meta.env.VITE_API_URL + '/requests',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  })

  const getRequests = async () => {
    setLoading(true)
    try {
      const response = await api.get('')
      if (!response.ok) {
        throw new Error('API response was not ok')
      }

      const { data } = await response.json<{ messsage: 'ok'; data: Request[] }>()

      setRequests(data)

      return data
    } catch (error) {
      console.error('Failed to fetch requests:', error)
      setError(error as string)
    } finally {
      setLoading(false)
    }
  }

  const createRequest = async (request: NewRequest) => {
    setLoading(true)
    try {
      const response = await api.post('', {
        json: request,
      })

      if (!response.ok) {
        throw new Error('API response was not ok')
      }

      const { data } = await response.json<{ message: 'ok'; data: Request }>()

      setRequests([...requests, data])

      return data
    } catch (error) {
      console.error('Failed to create request:', error)
      setError(error as string)
    } finally {
      setLoading(true)
    }
  }

  useEffect(() => {
    getRequests()
  }, [])

  return { requests, error, loading, getRequests, createRequest }
}
