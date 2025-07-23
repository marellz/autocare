import { Link, Outlet, useLocation } from 'react-router-dom'
import RequestForm from '../components/partials/RequestForm'
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from '@/components/ui/navigation-menu'
import clsx from 'clsx'
import useAuthStore from '@/stores/useAuthStore'
import {
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenu,
  DropdownMenuLabel,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Blocks, ChevronDown, LogOut, User } from 'lucide-react'
import DefaultLayoutToggler from '@/components/theme/DefaultLayoutToggler'


const DefaultLayout = () => {
  const { user, logout } = useAuthStore()
  const headerLinks = [
    {
      path: '/about',
      label: 'About',
    },
    {
      path: '/my-requests',
      label: 'My requests', //todo: implement
    },
  ]

  const footerLinks = [
    { path: '/terms', label: 'Terms' },
    { path: '/privacy', label: 'Privacy' },
    { path: '/contact', label: 'Contact' },
  ]

  const location = useLocation()

  const year = new Date().getFullYear()

  const onLogout = () => {
    logout()
  }
  return (
    <>
      <header>
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col items-center justify-between">
            <Link to="/" className="font-bold text-lg">
              Autocare
            </Link>
            <NavigationMenu className="w-full max-w-full">
              <NavigationMenuList className="w-full">
                {headerLinks.map(({ path, label }, i) => (
                  <NavigationMenuItem key={`${label}-${i}`}>
                    <NavigationMenuLink asChild>
                      <Link to={path} className={clsx(location.pathname === path && 'bg-accent')}>
                        {label}
                      </Link>
                    </NavigationMenuLink>
                  </NavigationMenuItem>
                ))}
                {location.pathname === '/' && (
                  <NavigationMenuItem>
                    <NavigationMenuLink href="#faqs">Faqs</NavigationMenuLink>
                  </NavigationMenuItem>
                )}
              </NavigationMenuList>
            </NavigationMenu>
            <div className='flex space-x-2'>
              <DefaultLayoutToggler />
            {user === null ? (
              <RequestForm />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost">
                    <User />
                    <span>{user.name}</span>
                    <ChevronDown />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>User menu</DropdownMenuLabel>
                  <DropdownMenuItem asChild>
                    <Link to="/dashboard">
                      <span>Dashboard</span>
                      <Blocks />
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={onLogout}>
                    <span>Logout</span>
                    <LogOut className="ml-auto" />
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            </div>
          </div>
        </div>
      </header>
      <main className="flex-auto">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
      <footer>
        <div className="container mx-auto py-2 px-4 text-sm text-muted-foreground">
          <div className="flex justify-between">
            <p className="">© {year} Alex Autocare. All rights reserved.</p>
            <div className="flex">
              {user === null && (
                <Link className="hover:underline px-2" to="/login">
                  Login
                </Link>
              )}
              {footerLinks.map(({ label, path }, i) => (
                <Link key={i} to={path} className="hover:underline px-2">
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default DefaultLayout
