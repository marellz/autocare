import type {
  DashboardChartItem,
  DashboardData,
  DashboardStats,
} from '@/services/useDashboardService'
import type { Request } from '@/services/useRequestService'
import type { Vendor } from '@/services/useVendorService'
import { create } from 'zustand'

import { useDashboardService as service } from '@/services/useDashboardService'
interface Store extends DashboardData {
  getData: () => Promise<void>
  loading: boolean
  error: string | undefined
  lastSyncedAt?: string | undefined
}

const useDashboardStore = create<Store>((set) => {
  const lastSyncedAt = undefined
  const stats: DashboardStats = {
    vendors: 0,
    requests: 0,
    quotes: 0,
    uniqueInteractions: 0,
  }

  const error: string | undefined = undefined
  const loading: boolean = false

  const newRequests: Request[] = []
  const topVendors: Vendor[] = []
  const chartData: DashboardChartItem[] = []

  const getData = async () => {
    try {
      set({ loading: true, error: undefined })
      const { stats, newRequests, topVendors, chartData } = await service.getData()
      set({
        stats,
        newRequests,
        topVendors,
        chartData,
      })

      set({ lastSyncedAt: new Date().toISOString() })
    } catch (error) {
      set({ error: error as string })
    } finally {
      set({ loading: false })
    }
  }

  return {
    lastSyncedAt,
    error,
    loading,
    stats,
    newRequests,
    topVendors,
    chartData,

    getData,
  }
})

export default useDashboardStore
