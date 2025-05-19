import { useRequestStore } from '@/stores/requests.store'

export const userRequestService = () => {
  const requestStore = useRequestStore()
  const baseUrl = import.meta.env.VITE_API_URL
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  }

  const getRequests = async () => {
    const response = await fetch(`${baseUrl}/requests`, {
      method: 'GET',
      headers,
    })
    const { data } = await response.json()

    // store
    requestStore.setRequests(data)
    return data
  }

  const createRequest = async (request: any) => {
    const response = await fetch(`${baseUrl}/requests`, {
      method: 'POST',
      headers,
      body: JSON.stringify(request),
    })
    const { data } = await response.json()
    requestStore.addRequest(data)
    return data
  }

  return { getRequests, createRequest }
}
