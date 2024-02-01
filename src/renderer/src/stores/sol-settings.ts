import { SolanaConfig } from '@type/SolSettings'
import { Topics } from '@type/Topic'
import { atom } from 'recoil'
import { setRecoil } from 'recoil-nexus'

const syncStorageEffect =
  () =>
  ({ setSelf, trigger }) => {
    // Initialize atom value to the remote storage state
    if (trigger === 'get') {
      // Avoid expensive initialization
      window.api.fetchSettings().then((val: SolanaConfig) => {
        setSelf(val)
      })
    }

    // Subscribe to remote storage changes and update the atom value
    window.api.listen(Topics.SETTINGS, Topics.UPDATE, (val: SolanaConfig) => {
      setSelf(val)
    })

    // Cleanup remote storage subscription
    return () => {}
  }

// isValidatorRunning
const solSettings = atom({
  key: 'solSettings',
  default: {} as SolanaConfig,
  effects: [syncStorageEffect()]
})

window.api.listen(Topics.SETTINGS, Topics.UPDATE, (val: SolanaConfig) => {
  // get the hashed value of the store
  const hashedVal = btoa(JSON.stringify(val))
  // doing this just to trigger an update
  console.log(hashedVal)
  setRecoil(solSettings, val)
})

export { solSettings }
