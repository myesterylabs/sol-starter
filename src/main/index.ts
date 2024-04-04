import { BrowserWindow, app, dialog, ipcMain, shell } from 'electron'
import { FileSystemWallet, NETWORK, SavedStore, SolProgram } from '../types/Store'
import { RunCommand, createAccount, createProgram } from './commands'
import RunQuery, { sendSettings } from './queries'
import { electronApp, is, optimizer } from '@electron-toolkit/utils'
import { exec, execSync, spawn } from 'child_process'

import { Command } from '../types/Command'
import { Query } from '../types/Queries'
import { Topics } from '../types/Topic'
import { promises as fsp } from 'fs'
import icon from '../../resources/icon.png?asset'
import { join } from 'path'
import { store } from './store/index'
import { ulid } from 'ulid'

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
  ipcMain.handle(Topics.OPEN_FOLDER, async (_event, path: string) => {
    return await shell.openPath(path)
  })
  ipcMain.handle(Topics.SELECT_FOLDER, async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
      properties: ['openDirectory']
    })
    if (canceled) {
      return
    } else {
      return filePaths[0]
    }
  })

  ipcMain.handle(Topics.GET_PROGRAM_DETAILS, async (_event, id: string) => {
    let programs = store.get('programs') as Array<SolProgram>
    let program = programs.find((p) => p.id === id)
    if (!program) {
      return null
    }
    // load details like amount of files, last modified, version
    let no_of_files: string[], last_modified: Date
    try {
     no_of_files = await fsp.readdir(program.path)
       last_modified = (await fsp.stat(program.path)).mtime
    } catch (error) {
      // if file does not exist, delete from records and throw error
      store.set('programs', programs.filter((p) => p.id !== id))
      throw new Error('File does not exist')
    }


    return {
      ...program,
      no_of_files: no_of_files.length,
      last_modified: last_modified.toDateString()
    }
  })

  ipcMain.handle(Topics.GET_ACCOUNT_DETAILS, async (_event, id: string) => {
    // if validator is off, switch on
    if (!isValidatorRunning()) {
      runValidator()
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
    let accounts = store.get('accounts') as Array<FileSystemWallet>
    let account = accounts.find((a) => a.publicKey === id)
    if (!account) {
      return null
    }
    // get balance using solana cli
    // command should look like solana balance 9Gz7x9hqcshJsMmu3PUMWaSsraH51Sqotj91wnHsQzNh --url=http://localhost:8899
    let command = `solana balance ${account.publicKey} --url=${store.store.json_rpc_url}`
    let balance = (execSync(command)).toString()

    return {
      ...account,
      balance: balance
    }
  })

  ipcMain.handle(Topics.DELETE_PROGRAM, (_event, id: string) => {
    let programs = store.get('programs') as Array<SolProgram>
    let program = programs.find((p) => p.id === id)
    if (!program) {
      return false
    }
    let index = programs.indexOf(program)
    if (index > -1) {
      programs.splice(index, 1)
      store.set('programs', programs)
      // unlink the directory
      fsp.rmdir(program.path, { recursive: true })
      return true
    }
    return false
  })

  ipcMain.handle(Topics.CREATE_ACCOUNT, (_event, name: string, override: boolean) => {
    let outfile: string | null = null
    if (!override) {
      outfile = `${app.getPath('home')}/.config/solana/id-${ulid()}.json`
    }
    let res = createAccount(outfile, override)

    if (res?.success) {
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

  ipcMain.handle(Topics.AIRDROP, async (_event, id: string, amount: number) => {
    let accounts = store.get('accounts') as Array<FileSystemWallet>
    let account = accounts.find((a) => a.publicKey === id)
    if (!account) {
      return false
    }
    // if validator is off, switch on
    if (!isValidatorRunning()) {
      runValidator()
      // wait for 3 seconds
      await new Promise((resolve) => setTimeout(resolve, 3000))
    }
    // airdrop using solana cli
    // command should look like solana airdrop 1 9Gz7x9hqcshJsMmu3PUMWaSsraH51Sqotj91wnHsQzNh --url=http://localhost:8899
    let command = `solana airdrop ${amount} ${account.publicKey} --url=${store.store.json_rpc_url}`
    try {
      execSync(command)
    } catch (error) {
      return false
    }
    return true
  })

  ipcMain.handle(Topics.SETTINGS, () => {
    let settings = sendSettings()
    return settings
  })

  ipcMain.handle(Topics.CREATE_PROGRAM, async (_event, name: string, path: string) => {
    let res = await createProgram(name, path, app)
    if (res) {
      store.set('programs', [
        ...(store.get('programs') || []),
        {
          name,
          path: res,
          created_at: new Date().toISOString(),
          id: ulid()
        }
      ])
    }
    return res
  })

  ipcMain.handle(Topics.SET_RPC_PORT, (_event, port: string) => {
    let command = `solana config set --url http://localhost:${port}`
    try {
      execSync(command)
      store.store.json_rpc_url = `http://localhost:${port}`
      let settings;
      if ((settings = sendSettings())) {
        mainWindow.webContents.send(`${Topics.SETTINGS}:${Topics.UPDATE}`, settings)
      }
    } catch (error) {
      return false
    }
    return true
  })

  ipcMain.handle(Topics.SET_MAIN_ACCOUNT, (_event, id: string) => {
    let account = store.store.accounts?.find((a) => a.publicKey === id)
    if (!account) {
      return false
    }
    let command = `solana config set --keypair ${account.path}`
    try {
      execSync(command)
      let settings;
      if ((settings = sendSettings())) {
        mainWindow.webContents.send(`${Topics.SETTINGS}:${Topics.UPDATE}`, settings)
      }
    } catch (error) {
      return false
    }
    return true
  })
  // Topics.SET_NETWORK
  ipcMain.handle(Topics.SET_NETWORK, (_event, id: NETWORK) => {
    console.log("setting network to ", id)
    // if we are switching back to localhost, we need to construct the url: this is because we use custom ports
    if (id === NETWORK.LOCALHOST) {
      store.set("json_rpc_url", `http://localhost:${store.store.port}`)
      // make sure validator is running
      if (!isValidatorRunning()) {
        runValidator()
        // wait for 3 seconds
        setTimeout(() => {
          mainWindow.webContents.send(`${Topics.VALIDATOR}:${Topics.STATUS}`, true)
        }, 3000)
      }
    } else {
      store.set("json_rpc_url",id)
    }
    let settings;
    if ((settings = sendSettings())) {
      mainWindow.webContents.send(`${Topics.SETTINGS}:${Topics.UPDATE}`, settings)
    }
    return true
  })

  ipcMain.handle(Topics.CODE, async (_event, path: string) => {
    // open in vscode
    try {
      await exec(`code ${path}`)
    } catch (error) {
      return false
    }

    return true
  })

  ipcMain.handle(
    `${Topics.SAVEDSTORE}:${Topics.UPDATE}`,
    (_event, key: keyof SavedStore, val: any) => {
      store.set(key, val)
    }
  )
  store.onDidAnyChange(() => {
    mainWindow.webContents.send(`${Topics.SAVEDSTORE}:${Topics.UPDATE}`, store.store)
  })

  setTimeout(() => {
    mainWindow.webContents.send(`${Topics.SAVEDSTORE}:${Topics.UPDATE}`, store.store)
    let settings
    if ((settings = sendSettings())) {
      mainWindow.webContents.send(`${Topics.SETTINGS}:${Topics.UPDATE}`, settings)
    }
  }, 2000)

  // console.log(app.getAppPath())
  console.log(app.getPath('userData'))
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
