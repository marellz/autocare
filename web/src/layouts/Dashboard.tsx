import AppSidebar from '@/components/dash/Sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import useAuthStore from '@/stores/useAuthStore'
import { useEffect, type ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

interface Props {
  children: ReactNode
}
const Dashboard = ({ children }: Props) => {
  const { user } = useAuthStore()
  const navigate = useNavigate()
  useEffect(() => {
    if (!user) {
      // todo: use proper guards?
      navigate('/login')
    }
  }, [])
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
