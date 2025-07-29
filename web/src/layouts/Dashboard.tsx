import AppSidebar from '@/components/dash/Sidebar'
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { Toaster } from '@/components/ui/sonner'
import { useIsMobile } from '@/hooks/use-mobile'
import { useEffect, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'

interface Props {
  currentRoute: string
}

const DashboardLayout = ({ currentRoute }: Props) => {
  const year = new Date().getFullYear()
  const footerLinks = [
    { path: '/', label: 'Homepage' },
    { path: '/terms', label: 'Terms' },
    { path: '/privacy', label: 'Privacy' },
    { path: '/contact', label: 'Contact' },
  ]

  // todo: close sidebar on route change 
  // ❗sidebar doesn't respond in mobile

  const [open, setOpen] = useState(false)
  
  const isMobile = useIsMobile()

  useEffect(() => {
    if(isMobile) setOpen(false)
  }, [currentRoute])
  return (
    <>
      <SidebarProvider defaultOpen={!isMobile} open={open} onOpenChange={setOpen}>
        <AppSidebar onClose={()=>setOpen(false)}/>
        <main className="flex-auto flex flex-col min-h-screen h-screen">
          <div className="py-4 px-2 md:px-4">
          <SidebarTrigger onClick={() => setOpen(!open)}></SidebarTrigger>
          </div>
          <div className="container max-w-5xl mx-auto px-4 flex-auto">
            <Outlet />
          </div>
          <footer className="mt-10">
            <div className="container max-w-5xl mx-auto p-2 md:px-4 text-sm text-muted-foreground">
              <div className="flex flex-col-reverse md:flex-row md:justify-between">
                <p className="mt-2 md:mt-0">© {year} Alex Autocare. All rights reserved.</p>
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
        <Toaster />
      </SidebarProvider>
    </>
  )
}

export default DashboardLayout
