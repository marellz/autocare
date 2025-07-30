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
import { Blocks, ChevronDown, FilePlus2, LogOut, Menu, User } from 'lucide-react'
import DefaultLayoutToggler from '@/components/theme/DefaultLayoutToggler'
import { useIsMobile } from '@/hooks/use-mobile'

const DefaultLayout = () => {
  const { user, logout } = useAuthStore()
  const headerLinks = [
    {
      path: '/about',
      label: 'About',
    },
    {
      path: '/my-requests',
      label: 'My requests',
    },
  ]

  const footerLinks = [
    { path: '/terms', label: 'Terms' },
    { path: '/privacy', label: 'Privacy' },
    { path: '/contact', label: 'Contact' },
  ]

  const location = useLocation()

  const year = new Date().getFullYear()

  const isMobile = useIsMobile()
  const onLogout = () => {
    logout()
  }
  return (
    <>
      <header>
        <div className="container mx-auto py-8 px-2 md:px-4">
          <div className="flex items-center md:justify-between space-x-4">
            <Link to="/" className="font-bold text-lg">
              Autocare
            </Link>
            {isMobile ? (
              <DropdownMenu>
                <DropdownMenuTrigger className="order-last ml-4 mr-0">
                  <Menu />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {headerLinks.map(({ path, label }, i) => (
                    <DropdownMenuItem key={i} asChild>
                      <Link to={path} className={clsx(location.pathname === path && 'bg-accent')}>
                        {label}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
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
            )}
            <div className="flex space-x-4 !ml-auto">
              {!isMobile && <DefaultLayoutToggler />}
              {user === null ? (
                <RequestForm
                  buttonChildren={
                    <>
                      <span className="hidden md:inline">Make request</span>
                      <FilePlus2 />
                    </>
                  }
                />
              ) : (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      <User />
                      <span className="hidden md:inline">{user.name}</span>
                      <ChevronDown />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>User menu</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link to="/dashboard">
                        <Blocks />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem variant="destructive" onClick={onLogout}>
                      <LogOut />
                      <span>Logout</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="flex-auto">
        <div className="container mx-auto px-2 md:px-4">
          <Outlet />
        </div>
      </main>
      <footer>
        <div className="container mx-auto py-2 px-4 text-sm text-muted-foreground">
          <div className="flex flex-col-reverse md:flex-row md:justify-between">
            <p className="mt-2 md:mt-0">© {year} Alex Autocare. All rights reserved.</p>
            <div className="flex items-center">
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
              {isMobile && (
                <div className="ml-auto">
                  {' '}
                  <DefaultLayoutToggler />
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

export default DefaultLayout
