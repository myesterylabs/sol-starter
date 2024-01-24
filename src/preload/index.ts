import { Command, CommandResult } from '../types/Command'
import { contextBridge, ipcRenderer } from 'electron'

import { Query } from '../types/Queries'
import { Topics } from '../types/Topic'
import { electronAPI } from '@electron-toolkit/preload'

// Custom APIs for renderer
const api = {
  runCommand: (command: Command) => {
    if (command.async) {
      ipcRenderer.send(Topics.RUN_COMMAND, command)
      return null
    }
    return ipcRenderer.invoke(Topics.RUN_COMMAND, command) as CommandResult
  },
  listen: (event: string, channel: string, callback: Function) =>
    ipcRenderer.on(`${event}:${channel}`, (_event, value) => callback(value)),
  query: (query: Query) => ipcRenderer.invoke(Topics.QUERY,query) as CommandResult
}

export type APIType = typeof api

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-ignore (define in dts)
  window.electron = electronAPI
  // @ts-ignore (define in dts)
  window.api = api
}

// const { contextBridge, ipcRenderer } = require('electron/renderer')

// contextBridge.exposeInMainWorld('electronAPI', {
//   setTitle: (title) => ipcRenderer.send('set-title', title)
// })