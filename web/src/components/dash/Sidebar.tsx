import {
  ChevronDown,
  ChevronUp,
  Home,
  LifeBuoy,
  ListOrdered,
  LogOut,
  Send,
  Store,
  User2,
  type LucideIcon,
} from 'lucide-react'
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
import { NavLink, useNavigate } from 'react-router-dom'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '../ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu'
import { ModeToggle } from '../theme/Toggler'
import useAuthStore from '@/stores/useAuthStore'
// import { Button } from '../ui/button'

interface LinkItem {
  label: string
  path: string
  icon: LucideIcon
}

const DashSidebar = () => {
  const { logout, user } = useAuthStore()

  const navigate = useNavigate()
  const onLogout =  async () => {
    await logout() // todo: fix glitch when there is error
    navigate('/')

  }
  const links: LinkItem[] = [
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

  const helpLinks: LinkItem[] = [
    {
      path: '/support',
      label: 'Support',
      icon: LifeBuoy,
    },
    {
      path: '/feedback',
      label: 'Feedback',
      icon: Send,
    },
  ]

  return (
    <Sidebar>
      <SidebarHeader></SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenuLinks links={links} />
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Collapsible>
          <SidebarGroup>
            <SidebarGroupLabel>Settings</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <ModeToggle />
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
          <SidebarGroup>
            <SidebarGroupLabel asChild>
              <CollapsibleTrigger>
                <span className="flex-auto text-left">Help</span>
                <ChevronDown></ChevronDown>
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenuLinks links={helpLinks} />
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        {user && <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  <User2 /> <span>{user.name}</span>
                  <ChevronUp className="ml-auto" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" className="w-[var(--radix-popper-anchor-width)]">
                <DropdownMenuItem onClick={onLogout} className="justify-between">
                  <span>Sign out</span>
                  <LogOut />
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>}
      </SidebarFooter>
    </Sidebar>
  )
}
interface SidebarMenuLinkProps {
  links: LinkItem[]
}

const SidebarMenuLinks = ({ links }: SidebarMenuLinkProps) => {
  return (
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
  )
}

export default DashSidebar
