import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import RequestForm from '../components/partials/RequestForm'

interface Props {
  children: ReactNode
}

const DefaultLayout = ({ children }: Props) => {
  const headerLinks = [
    {
      path: '/',
      label: 'Home',
    },
    {
      path: '/about',
      label: 'About',
    },
  ]
  return (
    <>
      <header>
        <nav className="navbar navbar-expand-lg bg-body-tertiary">
          <div className="container">
            <NavLink className="navbar-brand" to="/">
              Autocare
            </NavLink>
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto mb-2 mb-lg-0 align-items-lg-center">
                {/* <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    Home
                  </a>
                </li> */}
                {headerLinks.map((link, i) => (
                  <li className="nav-item" key={i}>
                    <NavLink
                      className={({ isActive }) =>
                        ['nav-link', isActive && 'text-primary'].join(' ')
                      }
                      to={link.path}
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}

                <li className="nav-item nav-link">
                  <button
                    className="btn btn-outline-success"
                    type="button"
                    data-bs-toggle="modal"
                    data-bs-target="#requestFormModal"
                  >
                    Make request
                  </button>
                </li>
              </ul>

              {/* <form className="d-flex" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="btn btn-outline-success" type="submit">
                  Search
                </button>
              </form> */}
            </div>
          </div>
        </nav>
        <RequestForm></RequestForm>
      </header>
      <main>
        <div className="container">{children}</div>
      </main>
      <footer>
        <div className="container">
          <p>Footer</p>
        </div>
      </footer>
    </>
  )
}

export default DefaultLayout
