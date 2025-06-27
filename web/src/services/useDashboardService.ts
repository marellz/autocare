import { createKyInstance } from '@/utils/kyCreator'
import type { Request } from './useRequestService'
import type { Vendor } from './useVendorService'

const api = createKyInstance('/dashboard')

export interface DashboardStats {
  vendors: number
  requests: number
  quotes: number
  uniqueInteractions: number
}

export interface DashboardChartItem {
  month: string
  requests: number
  quotes: number
}

export interface DashboardData {
  stats: DashboardStats
  newRequests: Request[]
  topVendors: Vendor[]
  chartData: DashboardChartItem[] // last x months
}

export const useDashboardService = {
  async getData() {
    const response = await api.get('')
    if (!response.ok) {
      throw new Error('API response was not ok')
    }

    const { data } = await response.json<{ messsage: 'ok'; data: DashboardData }>()

    return data
  },
}
