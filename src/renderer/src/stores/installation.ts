import { CommandResultResolved, Commands } from '@type/Command'
import { atom, selector, useRecoilValue } from 'recoil'

// import { set } from 'lodash'

// const solVersionValue = atom<CommandResultResolved>({
//   key: 'solVersionValue',
//   default: (await window.api.runCommand({
//     command: Commands.CHECK_SOLANA_INSTALLATION,
//     channel: Commands.CHECK_SOLANA_INSTALLATION,
//     async: false
//   })) as CommandResultResolved
// })

// const solVersion = atom({
//   key: 'solVersion',
//   default: async () => {
//     let res = await window.api.runCommand({
//       command: Commands.CHECK_SOLANA_INSTALLATION,
//       channel: Commands.CHECK_SOLANA_INSTALLATION,
//       async: false
//     })
//     if (res == null) {
//       throw new Error('Could not determine version')
//     }
//     console.log(res)
//     return res
//   }
// })

const solTrigger = atom({
  key: 'solTrigger',
  default: 0
})

const solVersion = selector({
  key: 'solVersion',
  get: async ({ get }) => {
    get(solTrigger)
    let res = await window.api.runCommand({
      command: Commands.CHECK_SOLANA_INSTALLATION,
      channel: Commands.CHECK_SOLANA_INSTALLATION,
      async: false
    })
    if (res == null) {
      throw new Error('Could not determine version')
    }
    return res
  }
})

export { solVersion, solTrigger }
