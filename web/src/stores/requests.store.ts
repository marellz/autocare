import { ref, computed } from 'vue'
import { acceptHMRUpdate, defineStore } from 'pinia'
export interface Request {
  id: string
  name: string
  phone: string
  item: string
  fulfilled_at: string | null
}

export interface RequestForm {
  id?: string
  name: string
  phone: string
  item: string
}

export const useRequestStore = defineStore('requests', () => {
  const requests = ref<Request[]>([])

  const addRequest = (request: Request) => {
    requests.value.push(request)
  }

  const setRequests = (newRequests: Request[]) => {
    requests.value = newRequests
  }

  return { requests, addRequest, setRequests }
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useRequestStore, import.meta.hot))
}