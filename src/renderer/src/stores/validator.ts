import { getRecoil, setRecoil } from 'recoil-nexus'

import { Topics } from '@type/Topic'
import { atom } from 'recoil'
import { ulid } from 'ulid'

// import { Commands } from '@type/Command'

// isValidatorRunning
const valTrigger = atom({
  key: 'valTrigger',
  default: 0
})

const validatorStats = atom({
  key: 'validatorStats',
  default: {
    processed: 0,
    confirmed: 0,
    finalized: 0
  }
})

const validatorStatus = atom({
  key: 'validatorStatus',
  default: false
})

const validatorLogs = atom({
  key: 'validatorLogs',
  default: [] as { id: string; message: string }[]
})
const parseLog = (
  inputString: string
): {
  processed: number
  confirmed: number
  finalized: number
} | null => {
  // const inputString =
  // '00:03:49 | Processed Slot: 2527 | Confirmed Slot: 2527 | Finalized Slot: 2495 | Full Snapshot Slot: 2408 | Incremental Snapshot Slot: - | Transactions: 2509 | ◎499.987455000'

  // Define a regular expression pattern to match the relevant information
  const pattern = /Processed Slot: (\d+) \| Confirmed Slot: (\d+) \| Finalized Slot: (\d+)/

  // Use the regular expression to extract the information
  const match = inputString.match(pattern)

  if (match) {
    const processed = parseInt(match[1])
    const confirmed = parseInt(match[2])
    const finalized = parseInt(match[3])

    // Create the desired JSON object
    const result = {
      processed: processed,
      confirmed: confirmed,
      finalized: finalized
    }

    return result
  }
  return null
}

window.api.listen(Topics.STDOUT_STREAM, Topics.VALIDATOR, (val: string) => {
  let oldLogs = getRecoil(validatorLogs)
  let parsed = parseLog(val)
  if (parsed) {
    setRecoil(validatorStats, parsed)
  }
  setRecoil(validatorLogs, [
    ...oldLogs,
    {
      id: ulid(),
      message: val
    }
  ])
  if (parsed?.processed) {
    window.api.updateStore('last_block', parsed?.processed)
  }
})

window.api.listen(Topics.VALIDATOR, Topics.STATUS, (val: boolean) => {
  setRecoil(validatorStatus, val)
})

export { validatorStatus, valTrigger, validatorLogs, validatorStats }
