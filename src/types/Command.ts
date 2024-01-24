export enum Commands {
  INSTALL_SOLANA = 'INSTALL_SOLANA',
  CHECK_SOLANA_INSTALLATION = 'CHECK_SOLANA_INSTALLATION'
}

export type Command = {
  command: Commands
  channel: string
  async: boolean
}

export type CommandResult = Promise<{
  stderr: string
  stdout: string
  success: boolean
}>
