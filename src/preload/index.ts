import { Command, CommandResult } from '../types/Command'
import { FileSystemWallet, SavedStore, SolProgram } from '../types/Store'
import { contextBridge, ipcRenderer } from 'electron'

import { Query } from '../types/Queries'
import { SolanaConfig } from '../types/SolSettings'
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
  query: (query: Query) => ipcRenderer.invoke(Topics.QUERY, query) as CommandResult,
  runValidator: () => ipcRenderer.invoke(Topics.RUN_VALIDATOR),
  killValidator: () => ipcRenderer.invoke(Topics.KILL_VALIDATOR),
  isValidatorRunning: (): Promise<boolean> =>
    ipcRenderer.invoke(Topics.IS_VALIDATOR_RUNNING) as Promise<boolean>,
  fetchSavedStore: (): Promise<SavedStore> => ipcRenderer.invoke(Topics.SAVEDSTORE),
  fetchSettings: (): Promise<SolanaConfig> => ipcRenderer.invoke(Topics.SETTINGS),
  openFolder: (path): Promise<string> => ipcRenderer.invoke(Topics.OPEN_FOLDER, path),
  createAccount: (name: string, override: boolean) =>
    ipcRenderer.invoke(Topics.CREATE_ACCOUNT, name, override),
  selectFolder: (): Promise<string> => ipcRenderer.invoke(Topics.SELECT_FOLDER),
  createProgram: (name: string, template:string, path: string) =>
    ipcRenderer.invoke(Topics.CREATE_PROGRAM, name,template, path) as Promise<boolean>,
  code: (path: string): Promise<string> => ipcRenderer.invoke(Topics.CODE, path),
  updateStore: (key: keyof SavedStore, value: any) =>
    ipcRenderer.invoke(`${Topics.SAVEDSTORE}:${Topics.UPDATE}`, key, value),
  getProgramDetails: (id: string) =>
    ipcRenderer.invoke(Topics.GET_PROGRAM_DETAILS, id) as Promise<
      SolProgram & {
        no_of_files: number
        last_modified: string
      }
    >,
  deleteProgram: (id: string) => ipcRenderer.invoke(Topics.DELETE_PROGRAM, id) as Promise<boolean>,
  getAccountDetails: (id: string) => ipcRenderer.invoke(Topics.GET_ACCOUNT_DETAILS, id) as Promise<FileSystemWallet & {
    balance: string
  }>,
  airdrop: (id: string, amount: number) => ipcRenderer.invoke(Topics.AIRDROP, id, amount) as Promise<boolean>,
  setRpcPort: (port: string) => ipcRenderer.invoke(Topics.SET_RPC_PORT, port) as Promise<boolean>,
  setMainAccount: (id: string) => ipcRenderer.invoke(Topics.SET_MAIN_ACCOUNT, id) as Promise<boolean>,
  setNetwork: (network: string) => ipcRenderer.invoke(Topics.SET_NETWORK, network) as Promise<boolean>,
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
