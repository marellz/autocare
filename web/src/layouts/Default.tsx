import { NavLink, Outlet } from 'react-router-dom'
import RequestForm from '../components/partials/RequestForm'

const DefaultLayout = () => {
  const headerLinks = [
    {
      path: '/about',
      label: 'About',
    },
    {
      path: '/dashboard',
      label: 'Admin',
    },

    // soon to be dash-only
  ]
  return (
    <>
      <header>
        <div className="container mx-auto py-4 px-4">
          <ul className="flex items-center space-x-2">
            <li>
              <NavLink to="/" className="text-lg font-bold">Autocare</NavLink>
            </li>
            {headerLinks.map((link, i) => (
              <li className="" key={i}>
                <NavLink
                  className={({ isActive }) => ['py-2 px-2', isActive && 'bg-gray-100 dark:bg-gray-800'].join(' ')}
                  to={link.path}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            <li className="!ml-auto">
              <RequestForm></RequestForm>
            </li>
          </ul>
        </div>
      </header>
      <main className="flex-auto">
        <div className="container mx-auto px-4">
          <Outlet />
        </div>
      </main>
      <footer>
        <div className="container mx-auto px-4">
          <p>Footer</p>
        </div>
      </footer>
    </>
  )
}

export default DefaultLayout
