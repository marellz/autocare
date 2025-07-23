import TypTitle from '@/components/custom/typography/Title'
import VendorForm from '@/components/partials/VendorForm'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
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
import type { DashboardStats } from '@/services/useDashboardService'
import useDashboardStore from '@/stores/useDashboardStore'
import { RefreshCcw } from 'lucide-react'
import { useEffect } from 'react'
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

const DashHome = () => {
  const { lastSyncedAt, newRequests, topVendors, chartData, stats, getData, loading } =
    useDashboardStore()

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
    vendors: 'Vendors',
    requests: 'Requests',
    quotes: 'Quotes',
  }

  useEffect(() => {
    getData()
  }, [])

  return (
    <div className="space-y-8">
      <div className="pb-4 flex items-center">
        <div className="flex-auto">
          <TypTitle>Dashboard</TypTitle>
          <p className="text-muted-foreground text-sm">Last synced at {lastSyncedAt}</p>
        </div>
        <Button onClick={getData} disabled={loading}>
          <span>Sync</span>
          <RefreshCcw />
        </Button>
      </div>
      <div className="flex border-b pb-4">
        <VendorForm btnProps={{ variant: 'outline' }} />
      </div>
      <div className="mt-4 grid grid-cols-4 gap-x-10 gap-y-4">
        <div className="col-span-4">
          <h1 className="text-lg font-medium">Stats</h1>
        </div>
        {(Object.keys(stats) as Array<keyof DashboardStats>).map((stat) => (
          <Card key={`stats-${stat}`}>
            <CardHeader>
              <CardTitle>
                <TypTitle>{stats[stat] ?? stat}</TypTitle>
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
  )
}

export default DashHome
