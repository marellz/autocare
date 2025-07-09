import AppSidebar from '@/components/dash/Sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
// import useAuthStore from '@/stores/useAuthStore'
// import { useEffect } from 'react'
import { Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  // const { user } = useAuthStore()
  // const navigate = useNavigate()
  // useEffect(() => {
  //   if (!user) {
  //     // todo: use proper guards?
  //     navigate('/login')
  //   }
  // }, [])
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-auto">
          <SidebarTrigger />
          <div className="container max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </>
  )
}

export default DashboardLayout
