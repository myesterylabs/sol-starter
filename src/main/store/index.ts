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
  },
  json_rpc_url: {
    type: 'string',
    default: 'http://127.0.0.1:8899'
  },
  port: {
    type: 'string',
    pattern: '^[0-9]{4,5}$',
    default: '8899'
  },
  ws_url: {
    type: 'string',
    format: 'uri',
    default: 'ws://127.0.0.1:8900'
  },
  accounts: {
    type: 'array',
    default: []
  },
  programs: {
    type: 'array',
    default: []
  },
  last_block: {
    type: 'number',
    default: 0
  }
}

export const store = new Store({
  schema
})

// console.log(store.get('foo'))
//=> 50

// store.set('foo', '1')
