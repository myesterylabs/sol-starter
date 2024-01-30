import { SavedStore } from '@type/Store'
import { Topics } from '@type/Topic'
import { atom, } from 'recoil'
import { setRecoil } from 'recoil-nexus'

// import { v4 as uuidv4 } from 'uuid'

// import { Commands } from '@type/Command'

// isValidatorRunning
const savedStore = atom({
  key: 'savedStore',
  default: {} as SavedStore
})

window.api.listen(Topics.SAVEDSTORE, Topics.UPDATE, (val: SavedStore) => {
  setRecoil(savedStore, val)
})

window.api.fetchSavedStore().then((val: SavedStore) => {
  setRecoil(savedStore, val)
})

export { savedStore }
