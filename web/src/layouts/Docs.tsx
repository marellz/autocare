import { Button } from '@/components/ui/button'
import clsx from 'clsx'
import { ArrowLeft } from 'lucide-react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const links = [
  { name: 'About us', path: '/about' },
  { name: 'Terms', path: '/terms' },
  { name: 'Privacy', path: '/privacy' },
]

const DocsLayout = () => {
  const loc = useLocation()
  return (
    <div className="h-screen p-5 md:p-10 pb-0 container mx-auto flex flex-col md:grid md:grid-cols-5">
      <div className="lg:col-start-2 sticky top-0 md:static">
        <nav className="flex flex-row md:flex-col items-center">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft />
              <span className="hidden md:inline">Go back</span>
            </Button>
          </Link>
          <ul className="md:space-y-2 md:mt-10 pl-4 flex md:flex-col space-x-2 md:space-x-2">
            {links.map(({ path, name }, i) => (
              <li
                key={i}
                className={clsx(
                  'text-muted-foreground',
                  loc.pathname === path && '!text-foreground',
                )}
              >
                <Link className="font-medium" to={path}>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
      {/* Sidebar */}
      <div className="flex-auto overflow-auto flex flex-col lg:col-span-2 pt-10 md:pt-0">
        <div className="flex-auto">
          <Outlet />
        </div>
        <footer>
          <div className="container mx-auto py-4">
            <p className="text-sm text-muted-foreground">
              {new Date().getFullYear()}. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default DocsLayout
