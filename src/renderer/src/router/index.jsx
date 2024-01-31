import Home from '../views/home/Main'
import NotFound from '../views/404/Main'
import Projects from '../views/projects/Main'
import Settings from '../views/settings/Main'
// import Petupage2 from "../views/page-2/Main";
import Setup from '../views/setup/Main'
import SideMenu from '../layouts/side-menu/Main'
import Validator from '../views/validator/Main'
import { useRoutes } from 'react-router-dom'
function Router() {
  const routes = [
    {
      path: '/',
      element: <SideMenu />,
      children: [
        {
          path: '/',
          element: <Home />
        },
        {
          path: '/setup',
          element: <Setup />
        },
        {
          path: '/validator',
          element: <Validator />
        },
        {
          path: '/projects',
          element: <Projects />
        },
        {
          path: '/accounts',
          element: <Projects />
        },
        {
          path: '/settings',
          element: <Settings />
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
