import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Link, Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <>
      <header className="border-b">
        <div className="py-4 px-12 flex items-center container mx-auto relative">
          <Link to="/">
            <Button variant="ghost">
              <ArrowLeft />
              <span>Go back</span>
            </Button>
          </Link>
          <h1 className="font-bold text-xl mx-aut absolute left-1/2 -translate-x-1/2">Autocare</h1>
        </div>
      </header>
      <main className="flex-auto mt-12">
        <div className="container mx-auto">
          <Outlet />
        </div>
      </main>
      <footer>
        <div className="container mx-auto py-4">
          <p className="text-sm text-muted-foreground">All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}

export default AuthLayout
