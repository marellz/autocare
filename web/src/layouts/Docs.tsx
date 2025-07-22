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
    <div className="h-screen p-10 pb-0 container mx-auto grid grid-cols-5 ">
      <div className="w-64 flex-none col-start-2">
        <nav>
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft />
              <span>Go back</span>
            </Button>
          </Link>
          <ul className="space-y-2 mt-10 pl-4">
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
      <div className="flex-auto overflow-auto flex flex-col col-span-2">
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
