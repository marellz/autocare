// import { useAuthStore } from '@/stores/auth'
import axios from 'axios'

const baseURL = import.meta.env.VITE_API_URL ?? 'http://api.pos.localhost'
const api = axios.create({
  baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => config)

api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let message = 'An error occurred'

    if (error.response.data.error) {
      message = error.response.data.error
    } else {
      if (error.response) {
        message = error.response.data?.message || `Error ${error.response.status}`
      }
      if (error.request) {
        message = 'Network error: No response from server.'
      } else {
        message = error.message
      }
    }

    return Promise.reject(message) // Allow handling errors in specific requests if needed
  },
)

export default api
