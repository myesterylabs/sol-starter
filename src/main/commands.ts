// import * as TOML from 'fast-toml'

import { Command, Commands } from '../types/Command'
import { execSync, spawn } from 'child_process'

import { BrowserWindow } from 'electron'
import { Topics } from '../types/Topic'
import fs from 'fs'
import path from 'path'
import { stringify } from 'querystring'

const fsp = fs.promises
const commandMap: Record<Commands, string> = {
  INSTALL_SOLANA: 'sh -c "$(curl -sSfL https://release.solana.com/stable/install)"',
  CHECK_SOLANA_INSTALLATION: 'solana --version',
  CHECK_RUST_INSTALLATION: 'cargo --version',
  INSTALL_RUST: "curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh"
}
export const RunCommand = (
  command: Command,
  mainWindow: BrowserWindow
): { stderr: string; stdout: string; success: boolean } | null => {
  const childProcess = spawn(commandMap[command.command], { shell: true })
  console.log('running', commandMap[command.command])
  if (!command.async) {
    try {
      // Replace 'ls -l' with your command
      const output = execSync(commandMap[command.command], { encoding: 'utf-8' })
      return {
        stderr: '',
        stdout: output,
        success: true
      }
    } catch (error) {
      return {
        stderr: error as string,
        stdout: '',
        success: false
      }
    }
  } else {
    // let stream = childProcess.stdout
    childProcess.stdout.on('data', (data) => {
      // get all lines
      mainWindow.webContents.send(`${Topics.STDOUT_STREAM}:${command.channel}`, data.toString())
    })

    childProcess.stderr.on('data', (data) => {
      mainWindow.webContents.send(`${Topics.STDOUT_STREAM}:${command.channel}`, data.toString())
    })

    childProcess.on('close', (code) => {
      mainWindow.webContents.send(`${Topics.STDOUT_EXIT}:${command.channel}`, code)
    })

    return null
  }
}

export const createAccount = (
  outfile: string | null,
  override: boolean
): { stderr: string; stdout: string; success: boolean } & {
  pubKey?: string | null
  seedPhrase?: string | null
} => {
  try {
    // Replace 'ls -l' with your command
    const output = execSync(
      `solana-keygen new --no-passphrase ${outfile ? '-o ' + outfile : ''} ${override ? '--force' : ''}`,
      { encoding: 'utf-8' }
    )
    const pubkeyRegex = /pubkey: (\w+)/
    const seedPhraseRegex = /Save this seed phrase to recover your new keypair:\n(.+)/

    // Extract pubkey and seed phrase from the string
    const pubkeyMatch = output.match(pubkeyRegex)
    const seedPhraseMatch = output.match(seedPhraseRegex)

    // Create a JSON object
    const result = {
      pubKey: pubkeyMatch ? pubkeyMatch[1] : null,
      seedPhrase: seedPhraseMatch ? seedPhraseMatch[1].trim() : null
    }

    // Log the JSON result
    // console.log(result)
    return {
      stderr: '',
      stdout: output,
      success: true,
      ...result
    }
  } catch (error) {
    return {
      stderr: error as string,
      stdout: '',
      success: false
    }
  }
}

const stringify = (str: string) => {
  return str.trim().replace(/\s/g, '-').toLowerCase()
}

export const createProgram = async (
  name: string,
  destinationPath: string,
  app: Electron.App
): Promise<string> => {
  // ensure the path exists
  let exists = fs.existsSync(destinationPath)
  if (!exists) {
    return Promise.reject(false)
  }
  // make sure directory has no files
  let files = await fsp.readdir(destinationPath)
  if (files.length > 1) {
    console.log('destination directory is not empty, it has ' + files.length + ' files ' + files[0])
    destinationPath = path.join(destinationPath, stringify(name))
    await fsp.mkdir(destinationPath)
  }
  // copy the template to the path
  let res = await copyDirectory(
    path.join(app.getAppPath(), 'resources', 'sample-program'),
    destinationPath
  )
  if (res) {
    // we need to use fast-toml to edit the content of the Cargo.toml file and set the name
    const toml = await fsp.readFile(path.join(destinationPath, 'Cargo.toml'), 'utf-8')
    // let stringify replace spaces with - and make lowercase after trimming
    let stringifiedName = stringify(name)

    const newToml = toml
      .replace('test-prog', stringifiedName)
      .replace('hello_world', stringify(name))
    await fsp.writeFile(path.join(destinationPath, 'Cargo.toml'), newToml, 'utf-8')
    return destinationPath
  }
  return destinationPath
}

async function copyDirectory(source, destination) {
  // files are src/lib.rs, .gitignore, Cargo.toml
  // we need to copy all of them to the destination manually

  // make src folder
  await fsp.mkdir(path.join(destination, 'src'))

  // copy lib.rs
  await fsp.copyFile(path.join(source, 'src', 'lib.rs'), path.join(destination, 'src', 'lib.rs'))

  // copy .gitignore
  await fsp.copyFile(path.join(source, '.gitignore'), path.join(destination, '.gitignore'))

  // copy Cargo.toml
  await fsp.copyFile(path.join(source, 'Cargo.toml'), path.join(destination, 'Cargo.toml'))

  return true
}

export default RunCommand
