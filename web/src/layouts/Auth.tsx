import type { ReactNode } from "react"

interface Props{
    children: ReactNode
}

const AuthLayout = ({children}:Props) => {
  return (
    <>
      <header>
        <div className="text-center py-8">
            <h1 className="font-bold text-xl">Autocare</h1>
        </div>
      </header>
      <main className="flex-auto mt-12">
        <div className="container mx-auto">{children}</div>
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