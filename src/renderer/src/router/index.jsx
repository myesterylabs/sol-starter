import NotFound from '../views/404/Main'
// import Petupage2 from "../views/page-2/Main";
import Setup from '../views/setup/Main'
import SideMenu from '../layouts/side-menu/Main'
import { useRoutes } from 'react-router-dom'

function Router() {
  const routes = [
    {
      path: '/',
      element: <SideMenu />,
      children: [
        {
          path: '/',
          element: <Setup />
        },
        {
          path: '/setup',
          element: <Setup />
        }
      ]
    },
    {
      path: '*',
      element: <NotFound />
    }
  ]

  return useRoutes(routes)
}

export default Router
