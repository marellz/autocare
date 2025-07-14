import { create } from 'zustand'
import {
  useRequestService as service,
  type NewRequest,
  type Request,
  type RequestChannel,
  type RequestStatus,
} from '@/services/useRequestService'
import type { RequestParams, ResultParams } from '@/types/pagination'

type RequestRequestParams = RequestParams<Request> & {
  status?: RequestStatus
  channel?: RequestChannel
  phone?: string
}

type RequestResultParams = ResultParams<Request> & {
  status?: RequestStatus
  channel?: RequestChannel
  phone?: string
}

interface Store {
  requests: Request[]
  loading: boolean
  error: string | undefined
  resultParams: RequestResultParams

  getRequests: (params: RequestRequestParams) => Promise<void>
  createRequest: (payload: NewRequest) => Promise<void>
  updateRequest: (id: number, updated: Partial<Request>) => Promise<void>
  resetRequests: () => void
  // deleteRequest: (id: number) => Promise<void>;

  handlePaginationChange: (page: number, limit: number) => void
}

const useRequestStore = create<Store>((set) => {
  const requests: Request[] = []
  const loading: boolean = false
  const error: string | undefined = undefined

  const resultParams: RequestResultParams = {
    page_count: 1,
    count: 0,
    channel: '',
    status: '',
    query: '',
  }

  const handlePaginationChange = (page: number, limit: number) => {
    getRequests({
      page,
      limit,
    })
  }

  const getRequests = async ({
    query = '',
    status = '',
    channel = '',
    phone = '',

    page = 1,
    limit = 10,
    sort_by = 'id',
    sort_order = 'ASC',
  }: RequestRequestParams) => {
    try {
      set({ loading: true })
      const params = {
        query,
        status,
        channel,
        phone,
        page,
        limit,
        sort_by,
        sort_order,
      }
      const { items, pagination } = await service.getRequests(params)
      set({ requests: items })
      set({ resultParams: pagination })
    } catch (error) {
      console.error('Error fetching requests:', error)
      set({ error: error as string })
    } finally {
      set({ loading: false })
    }
  }

  const createRequest = async (request: NewRequest) => {
    try {
      set({ loading: true })
      const newRequest = await service.createRequest(request)
      set((state) => ({ requests: [newRequest, ...state.requests] }))
    } catch (error) {
      console.error('Error creating request:', error)
      set({ error: error as string })
    } finally {
      set({ loading: false })
    }
  }

  const updateRequest = async (id: number, updated: Partial<Request>) => {
    try {
      set({ loading: true })
      await service.updateRequest(id, updated)
      set((state) => ({
        requests: state.requests.map((request) =>
          request.id === id ? { ...request, ...updated } : request,
        ),
      }))
    } catch (error) {
      console.error('Error updating request:', error)
      set({ error: error as string })
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
            set({ error: error as string });
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
    resultParams,
    getRequests,
    createRequest,
    updateRequest,
    // deleteRequest,

    //
    handlePaginationChange,

    resetRequests
  }
})

export default useRequestStore
