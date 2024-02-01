import './saved-store'

import { CommandResultResolved, Commands } from '@type/Command'
import { atom, selector, useRecoilValue } from 'recoil'

import { setRecoil } from 'recoil-nexus'

const solTrigger = atom({
  key: 'solTrigger',
  default: 0
})

const parsedVersion = atom({
  key: 'parsedVersion',
  default: {} as {
    cliVersion: string
    src: string
    feat: string
    client: string
  }
})

const parseSolVersion = (str) => {
  let cliVersion = /\d+\.\d+\.\d+/.exec(str) as Array<any>
  let src = /src:.+;/.exec(str) as Array<any>
  let feat = /feat:.+,/.exec(str) as Array<any>
  let client = /client:.+\)/.exec(str) as Array<any>
  return {
    cliVersion: cliVersion[0],
    src: src[0].replace('src:', '').replace(';', ''),
    feat: feat[0].replace('feat:', '').replace(',', ''),
    client: client[0].replace('client:', '').replace(')', '')
  }
}

const solVersion = selector({
  key: 'solVersion',
  get: async ({ get }) => {
    get(solTrigger)
    let res = await window.api.runCommand({
      command: Commands.CHECK_SOLANA_INSTALLATION,
      channel: Commands.CHECK_SOLANA_INSTALLATION,
      async: false
    })
    if (res?.success) {
      let parsed = parseSolVersion(res.stdout)
      setRecoil(parsedVersion, parsed)
    }
    if (res == null) {
      throw new Error('Could not determine version')
    }
    return res
  }
})

export { solVersion, solTrigger, parsedVersion}
