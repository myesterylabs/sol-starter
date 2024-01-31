import { SavedStore } from '@type/Store'
import { Topics } from '@type/Topic'
import { atom, } from 'recoil'
import { setRecoil } from 'recoil-nexus'

// import { Commands } from '@type/Command'

// isValidatorRunning
const savedStore = atom({
  key: 'savedStore',
  default: {} as SavedStore
})

window.api.listen(Topics.SAVEDSTORE, Topics.UPDATE, (val: SavedStore) => {
  // get the hashed value of the store
  const hashedVal = btoa(JSON.stringify(val))
  // doing this just to trigger an update
  console.log(hashedVal)
  setRecoil(savedStore, val)
})

window.api.fetchSavedStore().then((val: SavedStore) => {
  setRecoil(savedStore, val)
})

export { savedStore }
