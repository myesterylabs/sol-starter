import { Queries, Query } from '../types/Queries'

import os from 'os'
import path from 'path'
import { CommandResult } from '../types/Command'

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

export default RunQuery
