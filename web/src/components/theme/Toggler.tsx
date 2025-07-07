import { Check, MonitorCog, Moon, Sun, type LucideIcon } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useTheme, type Theme } from '@/components/theme/Provider'
import { SidebarMenuButton } from '../ui/sidebar'

export function ModeToggle() {
  const { theme, setTheme } = useTheme()
  const options: { value: Theme; label: string; icon: LucideIcon }[] = [
    {
      value: 'light',
      label: 'Light',
      icon: Sun,
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: Moon,
    },
    {
      value: 'system',
      label: 'System',
      icon: MonitorCog,
    },
  ]
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <SidebarMenuButton variant="outline">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span>Toggle theme</span>
        </SidebarMenuButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[var(--radix-popper-anchor-width)]">
        {options.map(({ icon: Icon, value, label }) => (
          <DropdownMenuItem onClick={() => setTheme(value)}>
            <Icon />
            <span>{label}</span>
            {value===theme && <Check className='ml-auto' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
