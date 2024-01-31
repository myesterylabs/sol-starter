import { SolanaConfig } from '@type/SolSettings'
import { Topics } from '@type/Topic'
import { atom } from 'recoil'
import { setRecoil } from 'recoil-nexus'

// import { Commands } from '@type/Command'

// isValidatorRunning
const solSettings = atom({
  key: 'solSettings',
  default: {} as SolanaConfig
})

window.api.listen(Topics.SETTINGS, Topics.UPDATE, (val: SolanaConfig) => {
  // get the hashed value of the store
  const hashedVal = btoa(JSON.stringify(val))
  // doing this just to trigger an update
  console.log(hashedVal)
  setRecoil(solSettings, val)
})
// window.api.fetchSolSettings().then((val: SavedStore) => {
//   setRecoil(savedStore, val)
// })

export { solSettings }
