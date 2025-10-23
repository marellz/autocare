import { create } from 'zustand'
import {
  useRequestService as service,
  type NewRequest,
  type Request,
  type RequestRequestParams,
  type RequestResultParams,
} from '@/services/useRequestService'

interface Store {
  requests: Request[]
  userRequests: Request[]
  loading: boolean
  error: string | null
  resultParams: RequestResultParams
  requestParams: RequestRequestParams
  missingDetails: string[] | undefined

  updateParams: (params: Partial<RequestRequestParams>) => void
  getRequests: () => Promise<void>
  getUserRequests: (phone: string) => Promise<void>
  createRequest: (payload: NewRequest) => Promise<boolean>
  updateRequest: (id: number, updated: Partial<Request>) => Promise<boolean>
  resetRequests: () => void
  resetParams: (params: Partial<RequestRequestParams>) => void
  // deleteRequest: (id: number) => Promise<void>;
}

const useRequestStore = create<Store>((set) => {
  const requests: Request[] = []
  const userRequests: Request[] = []
  const loading: boolean = false
  const error: string | null = null
  const missingDetails: string[] | undefined = undefined

  const resultParams: RequestResultParams = {
    page_count: 1,
    count: 0,
    channel: '',
    status: '',
    query: '',
  }

  const requestParams: RequestRequestParams = {
    query: '',
    status: '',
    channel: '',
    phone: '',

    page: 1,
    limit: 10,

    sort_by: 'id',
    sort_order: 'ASC',
  }

  const updateParams = async (params: Partial<RequestRequestParams>) => {
    const { requestParams: current } = useRequestStore.getState()
    set(() => ({
      requestParams: {
        ...current,
        ...params,
      },
    }))

    await getRequests()
  }

  const resetParams = (params: Partial<RequestRequestParams>) => {
    const { requestParams: initial } = useRequestStore.getInitialState()
    set(() => ({
      requestParams: {
        ...initial,
        ...params,
      },
    }))
  }

  const getRequests = async () => {
    try {
      set({ loading: true, error: null })
      const { requestParams } = useRequestStore.getState()
      const { items, pagination } = await service.getRequests(requestParams)
      set({ requests: items, resultParams: pagination })
    } catch (error) {
      console.error('Error fetching requests:', error)
      set({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      set({ loading: false })
    }
  }

  const getUserRequests = async (phone: string) => {
    try {
      set({ loading: true, error: null })
      const { requestParams } = useRequestStore.getState()
      const { items, pagination } = await service.getRequests({ ...requestParams, phone })
      set({ userRequests: items, resultParams: pagination })
    } catch (error) {
      console.error('Error fetching requests:', error)
      set({ error: error instanceof Error ? error.message : String(error) })
    } finally {
      set({ loading: false })
    }
  }

  const createRequest = async (request: NewRequest) => {
    try {
      set({ loading: true, missingDetails: undefined, error: null })
      const { response, missingDetails } = await service.createRequest(request)
      set({ missingDetails })
      if (missingDetails) {
        throw new Error(response ?? 'Request has missing details.')
      }

      return true
    } catch (error) {
      console.error('Error creating request:', error)
      set({ error: error instanceof Error ? error.message : String(error) })
      return false
    } finally {
      set({ loading: false })
    }
  }

  const updateRequest = async (id: number, update: Partial<Request>) => {
    try {
      set({ loading: true, missingDetails: undefined, error: null })

      const { updated } = await service.updateRequest(id, update)

      if (!updated) throw new Error('Failed to update request')

      set((state) => ({
        requests: state.requests.map((request) =>
          request.id === id ? { ...request, ...update } : request,
        ),
      }))

      return true
    } catch (error) {
      console.error('Error updating request:', error)
      set({ error: error instanceof Error ? error.message : String(error) })
      return false
    } finally {
      set({ loading: false })
    }
  }
  /*
    const deleteRequest = async (id: number) => {
        try {
            set({ loading: true });
            await service.deleteRequest(id);
            set((state) => ({
                requests: state.requests.filter((request) => request.id !== id),
            }));
        } catch (error) {
            console.error("Error deleting request:", error);
            set({ error: err instanceof Error ? error.message : String(error) });
        } finally {
            set({ loading: false });
        }
    }

    */

  const resetRequests = () => {
    set({
      requests: [],
    })
  }

  return {
    requests,
    loading,
    error,
    userRequests,
    getUserRequests,

    requestParams,
    updateParams,
    resetParams,
    resultParams,

    getRequests,
    createRequest,
    updateRequest,
    // deleteRequest,

    resetRequests,

    missingDetails,
  }
})

export default useRequestStore
