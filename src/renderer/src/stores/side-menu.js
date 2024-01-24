import { atom } from "recoil";

const sideMenu = atom({
  key: "sideMenu",
  default: {
    menu: [
      {
        icon: "Play",
        pathname: "/",
        title: "Setup",
      },
      {
        icon: "Wallet",
        pathname: "/wallet",
        title: "Wallet",
      },
    ],
  },
});

export { sideMenu };
