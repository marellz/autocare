import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <>
      <header className="border-b">
        <div className="p-4 md:px-12 flex items-center space-x-4 container mx-auto relative">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft />
              <span className='hidden md:inline'>Go back</span>
            </Button>
          </Link>
          <h1 className="font-bold text-xl md:absolute md:left-1/2 md:-translate-x-1/2">Autocare</h1>
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
