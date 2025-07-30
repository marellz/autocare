import {
  ChevronDown,
  ChevronLeft,
  ChevronUp,
  Home,
  LifeBuoy,
  ListOrdered,
  LogOut,
  Send,
  Store,
  User2,
  MessageCircleQuestion,
  type LucideIcon,
  Mails,
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
import DarkModeToggler from '../theme/DashboardLayoutToggler'
import useAuthStore from '@/stores/useAuthStore'
import { Button } from '../ui/button'
// import { Button } from '../ui/button'

interface LinkItem {
  label: string
  path: string
  icon: LucideIcon
}

interface Props {
  onClose?: () => void
}

const DashSidebar = ({ onClose }: Props) => {
  const { logout, user } = useAuthStore()

  const navigate = useNavigate()
  const onLogout = async () => {
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
    {
      path: '/dashboard/faqs',
      label: 'FAQs',
      icon: MessageCircleQuestion,
    },
    {
      path: '/dashboard/contact',
      label: 'Messages',
      icon: Mails,
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
      <SidebarHeader>
        <div className="flex justify-end md:hidden">
          <Button variant="ghost" onClick={onClose}>
            <ChevronLeft />
          </Button>
        </div>
      </SidebarHeader>
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
                  <DarkModeToggler />
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
        {user && (
          <SidebarMenu>
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
          </SidebarMenu>
        )}
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
