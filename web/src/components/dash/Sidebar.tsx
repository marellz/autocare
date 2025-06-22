import { Home, ListOrdered, Store } from 'lucide-react'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar'
import { NavLink } from 'react-router-dom'

const DashSidebar = () => {
  const links = [
    {
      path: '/dashboard/',
      label: 'Dashboard',
      icon: Home,
    },
    {
      path: '/dashboard/requests',
      label: 'Requests',
      icon: ListOrdered,
    },
    {
      path: '/dashboard/vendors',
      label: 'Vendors',
      icon: Store,
    },
  ]
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {links.map((item) => (
                <SidebarMenuItem key={item.label}>
                  <SidebarMenuButton asChild>
                    <NavLink to={item.path}>
                      <item.icon />
                      <span>{item.label}</span>
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  )
}

export default DashSidebar
