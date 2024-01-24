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
        icon: 'Wallet',
        pathname: '/wallet',
        title: 'Wallet'
      },
      {
        icon: 'Monitor',
        pathname: '/validator',
        title: 'Validator'
      }
    ]
  }
})

export { sideMenu }
