import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  // CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  ChartContainer,
  type ChartConfig,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart'
import DashboardLayout from '@/layouts/Dashboard'
import type { DashboardStats } from '@/services/useDashboardService'
import useDashboardStore from '@/stores/useDashboardStore'
import { Plus, RefreshCcw } from 'lucide-react'
import { useEffect } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const DashHome = () => {
  const addNewVendor = () => {
    console.log('Add new vendor!')
  }

  const { lastSyncedAt, newRequests, topVendors, chartData, stats, getData, loading } =
    useDashboardStore()

  const quickActions = [
    {
      label: 'Add new vendor',
      action: addNewVendor,
    },
  ]

  const chartConfig = {
    requests: {
      label: 'Requests',
      color: '#2563eb',
    },
    quotes: {
      label: 'Quotes',
      color: '#60a5fa',
    },
  } satisfies ChartConfig

  const statLabels: Record<keyof DashboardStats, string> = {
    uniqueInteractions: 'Unique interactions',
    vendors: "Vendors",
    requests: "Requests",
    quotes: "Quotes",
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="pb-4 flex items-center">
          <div className="flex-auto">
            <h1 className="text-4xl">Dashboard</h1>
            <p className="text-muted-foreground text-sm">Last synced at {lastSyncedAt}</p>
          </div>
          <Button onClick={getData} disabled={loading}>
            <span>Sync</span>
            <RefreshCcw />
          </Button>
        </div>
        <div className="flex border-b pb-4">
          {quickActions.map(({ label, action }, i) => (
            <Button variant="outline" onClick={action} key={`actions-${i}`}>
              <span>{label}</span>
              <Plus></Plus>
            </Button>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-4 gap-x-10 gap-y-4">
          <div className="col-span-4">
            <h1 className="text-lg font-medium">Stats</h1>
          </div>
          {(Object.keys(stats) as Array<keyof DashboardStats>).map((stat) => (
            <Card key={`stats-${stat}`}>
              <CardHeader>
                <CardTitle>
                  <h1 className="text-4xl font-bold">{stats[stat] ?? stat}</h1>
                </CardTitle>
                <CardDescription>{statLabels[stat]}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-4">
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Latest requests</CardTitle>
              </CardHeader>
              {newRequests.map((request) => (
                <CardContent key={request.id}>
                  <div className="flex">
                    <p className="font-medium text-sm flex-auto">{request.name}</p>
                    <Badge>{request.status}</Badge>
                  </div>
                </CardContent>
              ))}
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Top vendors</CardTitle>
              </CardHeader>
              {topVendors.map(({ name, id, vendor_requests }) => (
                <CardContent key={id}>
                  <div className="flex">
                    <p className="font-medium text-sm flex-auto">{name} </p>
                    <Badge className="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
                      {vendor_requests?.length}
                    </Badge>
                  </div>
                </CardContent>
              ))}
            </Card>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-x-10 gap-y-4">
          <div className="col-span-2">
            <h1 className="text-lg font-medium">Tables/Charts</h1>
          </div>
          <div className="">
            <Card>
              <CardContent>
                <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
                  <BarChart accessibilityLayer data={chartData}>
                    <CartesianGrid vertical={false} />
                    <Bar dataKey="requests" fill="var(--color-requests)" radius={4} />
                    <Bar dataKey="quotes" fill="var(--color-quotes)" radius={4} />
                    <XAxis dataKey="month" tickLine={false} axisLine={false} />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent payload={chartData} />} />
                  </BarChart>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default DashHome
