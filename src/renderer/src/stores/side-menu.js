import { atom } from 'recoil'

const sideMenu = atom({
  key: 'sideMenu',
  default: {
    menu: [
      {
        icon: 'Home',
        pathname: '/',
        title: 'Home'
      },
      {
        icon: 'Download',
        pathname: '/setup',
        title: 'Setup'
      },
      {
        icon: 'Code',
        pathname: '/projects',
        title: 'Projects'
      },
      {
        icon: 'Wallet',
        pathname: '/accounts',
        title: 'Accounts'
      },
      {
        icon: 'Monitor',
        pathname: '/validator',
        title: 'Validator'
      },
      {
        icon: 'Settings',
        pathname: '/settings',
        title: 'Settings'
      }
    ]
  }
})

export { sideMenu }
