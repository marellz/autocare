import {Logo, LogoShort} from '@/components/app/Logo'
import { Button } from '@/components/ui/button'
import { useIsMobile } from '@/hooks/use-mobile'
import { ArrowLeft } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

const AuthLayout = () => {
  const isMobile = useIsMobile()
  return (
    <>
      <header className="border-b">
        <div className="p-4 md:px-12 flex items-center space-x-4 container mx-auto relative">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft />
              <span className="hidden md:inline">Go back</span>
            </Button>
          </Link>
          {isMobile ? (
            <LogoShort className="md:absolute md:left-1/2 md:-translate-x-1/2" />
          ) : (
            <Logo className="md:absolute md:left-1/2 md:-translate-x-1/2" />
          )}
        </div>
      </header>
      <main className="flex-auto mt-12">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
      <footer>
        <div className="container mx-auto py-4 px-2 md:px-4">
          <p className="text-sm text-muted-foreground">All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default AuthLayout
