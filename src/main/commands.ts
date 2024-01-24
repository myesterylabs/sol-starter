import { Command, Commands } from '../types/Command'
import { execSync, spawn } from 'child_process'

import { BrowserWindow } from 'electron'
import { Topics } from '../types/Topic'

const commandMap: Record<Commands, string> = {
  INSTALL_SOLANA: 'sh -c "$(curl -sSfL https://release.solana.com/stable/install)"',
  CHECK_SOLANA_INSTALLATION: 'solana --version'
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

export default RunCommand
