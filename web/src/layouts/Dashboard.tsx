import AppSidebar from '@/components/dash/Sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Link, Outlet } from 'react-router-dom'

const DashboardLayout = () => {
  const year = new Date().getFullYear()
  const footerLinks = [
    { path: '/', label: 'Homepage' },
    { path: '/terms', label: 'Terms' },
    { path: '/privacy', label: 'Privacy' },
    { path: '/contact', label: 'Contact' },
  ]
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-auto flex flex-col">
          <SidebarTrigger />
          <div className="container max-w-5xl mx-auto px-4 flex-auto">
            <Outlet />
          </div>
          <footer>
            <div className="container max-w-5xl mx-auto py-2 px-4 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <p className="">© {year} Alex Autocare. All rights reserved.</p>
                <div className="flex">
                  {footerLinks.map(({ label, path }, i) => (
                    <Link key={i} to={path} className="hover:underline px-2">
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </footer>
        </main>
      </SidebarProvider>
    </>
  )
}

export default DashboardLayout
