import { BrowserWindow, app, dialog, ipcMain, shell } from 'electron'
import { FileSystemWallet, SavedStore } from '../types/Store'
import { RunCommand, createAccount } from './commands'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'

import { Command } from '../types/Command'
import { Query } from '../types/Queries'
import RunQuery from './queries'
import { Topics } from '../types/Topic'
import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import { spawn } from 'child_process'
import { store } from './store/index'
import { v4 } from 'uuid'

let mainWindow: BrowserWindow
function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    ...(process.platform === 'linux' ? { icon } : {}),
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

let validatorProcess: import('child_process').ChildProcess | null = null
function runValidator(): boolean {
  if (validatorProcess) {
    validatorProcess.kill('SIGTERM')
    mainWindow.webContents.send(`${Topics.VALIDATOR}:${Topics.STATUS}`, false)
  }
  validatorProcess = spawn('solana-test-validator')
  // console.log(validatorProcess.pid)
  validatorProcess.stdout?.on('data', (data) => {
    mainWindow.webContents.send(`${Topics.STDOUT_STREAM}:VALIDATOR`, data.toString())
  })
  mainWindow.webContents.send(`${Topics.VALIDATOR}:${Topics.STATUS}`, true)
  return true
}

function killValidator(): boolean {
  if (validatorProcess) {
    validatorProcess.kill('SIGTERM')
  }
  validatorProcess = null
  mainWindow.webContents.send(`${Topics.VALIDATOR}:${Topics.STATUS}`, false)
  return true
}

function isValidatorRunning(): boolean {
  if (validatorProcess) {
    return true
  }
  return false
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  // Set app user model id for windows
  electronApp.setAppUserModelId('com.electron')

  // Default open or close DevTools by F12 in development
  // and ignore CommandOrControl + R in production.
  // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  createWindow()

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  ipcMain.on(Topics.RUN_COMMAND, (_event, command: Command) => {
    RunCommand(command, mainWindow)
  })

  ipcMain.handle(Topics.QUERY, (_event, query: Query) => {
    return RunQuery(query)
  })

  ipcMain.handle(Topics.RUN_COMMAND, (_event, command: Command) => {
    return RunCommand(command, mainWindow)
  })

  ipcMain.handle(Topics.RUN_VALIDATOR, (_event) => {
    return runValidator()
  })

  ipcMain.handle(Topics.KILL_VALIDATOR, (_event) => {
    return killValidator()
  })

  ipcMain.handle(Topics.IS_VALIDATOR_RUNNING, (_event) => {
    return isValidatorRunning()
  })
  ipcMain.handle(Topics.SAVEDSTORE, (_event) => {
    console.log('store sent to frontend')
    return store.store
  })
  ipcMain.handle(Topics.OPEN_FOLDER, async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })
    if (canceled) {
      return
    } else {
      return filePaths[0]
    }
  })
  ipcMain.handle(Topics.CREATE_ACCOUNT, (_event, name: string, override: boolean) => {
    let outfile: string | null = null
    if (!override) {
      outfile = `${app.getPath('home')}/.config/solana/id-${v4()}.json`
    }
    let res = createAccount(outfile, override)

    if (res?.success ) {
      store.set('accounts', [
        ...(store.get('accounts') || ([] as Array<FileSystemWallet>)),
        {
          name,
          path: outfile || `${app.getPath('home')}/.config/solana/id.json`,
          recoveryPhrase: res.seedPhrase,
          created_at: new Date().toISOString(),
          publicKey: res.pubKey
        }
      ])
    }

    return res
  })

  ipcMain.on(`${Topics.SAVEDSTORE}:${Topics.UPDATE}`, (_event, val: SavedStore) => {
    store.set(val)
  })
  store.onDidAnyChange((newVal, oldVal) => {
    console.log(oldVal, newVal, store.store)
    mainWindow.webContents.send(`${Topics.SAVEDSTORE}:${Topics.UPDATE}`, store.store)
  })
  // store.set('foo', 1 + Math.random())
})

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app"s specific main process
// code. You can also put them in separate files and require them here.
