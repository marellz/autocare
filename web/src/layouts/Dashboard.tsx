import AppSidebar from '@/components/dash/Sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
}
const Dashboard = ({ children }: Props) => {
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-auto">
          <SidebarTrigger />
          <div className="container max-w-5xl mx-auto">{children}</div>
        </main>
      </SidebarProvider>
    </>
  )
}

export default Dashboard
