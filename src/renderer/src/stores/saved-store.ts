import { SavedStore } from '@type/Store'
import { Topics } from '@type/Topic'
import { atom } from 'recoil'
import { setRecoil } from 'recoil-nexus'

// import { Commands } from '@type/Command'
const syncStorageEffect =
  () =>
  ({ setSelf, trigger }) => {
    // Initialize atom value to the remote storage state
    if (trigger === 'get') {
      // Avoid expensive initialization
      window.api.fetchSavedStore().then((val: SavedStore) => {
        setSelf(val)
      })
    }

    // Subscribe to remote storage changes and update the atom value
    window.api.listen(Topics.SAVEDSTORE, Topics.UPDATE, (val: SavedStore) => {
      setSelf(val)
    })

    // Cleanup remote storage subscription
    return () => {}
  }
// isValidatorRunning
const savedStore = atom({
  key: 'savedStore',
  default: {} as SavedStore,
  effects: [syncStorageEffect()]
})

window.api.listen(Topics.SAVEDSTORE, Topics.UPDATE, (val: SavedStore) => {
  // get the hashed value of the store
  const hashedVal = btoa(JSON.stringify(val))
  // doing this just to trigger an update
  // console.log(hashedVal.length,hashedVal)
  hashedVal
  setRecoil(savedStore, val)
})

window.api.fetchSavedStore().then((val: SavedStore) => {
  setRecoil(savedStore, val)
})

export { savedStore }
