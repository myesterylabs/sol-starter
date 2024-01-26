import { SavedStore } from '../../types/Store'
import Store from 'electron-store'

const schema: Store.Schema<SavedStore> = {
  foo: {
    type: 'number',
    maximum: 100,
    minimum: 1,
    default: 50
  },
  bar: {
    type: 'string',
    format: 'uri',
    default: 'http://jp.com'
  }
}

export const store = new Store({
  schema
})

// console.log(store.get('foo'))
//=> 50

// store.set('foo', '1')
