import { Queries, Query } from '../types/Queries'

import { CommandResult } from '../types/Command'
import { SolanaConfig } from '../types/SolSettings'
import { execSync } from 'child_process'
import os from 'os'
import path from 'path'

export const RunQuery = (query: Query): CommandResult => {
  switch (query.query) {
    case Queries.GET_EXPECTED_PATH:
      // Get the home directory of the current user
      const homeDir = os.homedir()

      // Construct the path to /Users/myestery/.local/share/solana/install/active_release/bin/solana'
      const localShareDir = path.join(
        homeDir,
        '.local',
        'share',
        'solana',
        'install',
        'active_release',
        'bin',
        'solana'
      )

      return Promise.resolve({
        stdout: localShareDir,
        stderr: '',
        success: true
      })
  }
}

export const sendSettings = (): SolanaConfig | null => {
  try {
    let configString = execSync('solana config get').toString()

    // Extract key-value pairs
    // Define regular expressions for each key pattern
    const regexPatterns: Record<string, RegExp> = {
      configFile: /^Config File: (.+)$/m,
      rpcUrl: /^RPC URL: (.+)$/m,
      webSocketUrl: /^WebSocket URL: (.+)$/m,
      keypairPath: /^Keypair Path: (.+)$/m,
      commitment: /^Commitment: (.+)$/m
    }

    // Create a SolanaConfig object
    const configObject: Partial<SolanaConfig> = {}

    // Iterate over regex patterns and match against the config string
    Object.entries(regexPatterns).forEach(([key, regex]) => {
      const match = configString.match(regex)
      if (match) {
        configObject[key] = match[1].trim()
      }
    })

    // Create a fully-typed SolanaConfig object with default values
    const solanaConfig: SolanaConfig = {
      configFile: configObject.configFile || '',
      rpcUrl: configObject.rpcUrl || '',
      webSocketUrl: configObject.webSocketUrl?.replace(" (computed)", "") || '',
      keypairPath: configObject.keypairPath || '',
      commitment: configObject.commitment || 'confirmed'
    }
    return solanaConfig
  } catch (error) {
    return null
  }
}

export default RunQuery
