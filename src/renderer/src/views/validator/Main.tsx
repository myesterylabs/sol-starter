import { Lucide, TabGroup } from '@/base-components'
import { useEffect, useState } from 'react'
import { validatorLogs, validatorStats, validatorStatus } from '@/stores/validator'

import { solVersion as RsolVersion } from '@/stores/installation'
import Terminal from '@/components/terminal/Main.jsx'
import { solSettings } from '@renderer/stores/sol-settings'
import { useRecoilValue } from 'recoil'

const parseSolVersion = (str) => {
  let cliVersion = /\d+\.\d+\.\d+/.exec(str) as Array<any>
  let src = /src:.+;/.exec(str) as Array<any>
  let feat = /feat:.+,/.exec(str) as Array<any>
  let client = /client:.+\)/.exec(str) as Array<any>
  return {
    cliVersion: cliVersion[0],
    src: src[0].replace('src:', '').replace(';', ''),
    feat: feat[0].replace('feat:', '').replace(',', ''),
    client: client[0].replace('client:', '').replace(')', '')
  }
}

function Main() {
  // const reset = useResetRecoilState(valTrigger)
  const solVersion = useRecoilValue(RsolVersion)
  let [parsedVersion, setParsedVersion] = useState({} as ReturnType<typeof parseSolVersion>)
  const running = useRecoilValue(validatorStatus)
  const parsedLog = useRecoilValue(validatorStats)
  let downloadLog = useRecoilValue(validatorLogs)

  const SolSettings = useRecoilValue(solSettings)

  useEffect(() => {
    async function waiter() {
      if (solVersion.success) {
        setParsedVersion(parseSolVersion(solVersion.stdout))
      }
    }
    waiter()
  }, [solVersion])

  return (
    <>
      <div className="intro-y flex items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Solana Test Validator</h2>
      </div>
      <TabGroup>
        {/* BEGIN: Profile Info */}
        <div className="intro-y box px-5 pt-5 mt-5">
          <div className="flex flex-col lg:flex-row border-b border-slate-200/60 dark:border-darkmode-400 pb-5 -mx-5">
            <div className="flex flex-1 px-5 items-center justify-center lg:justify-start">
              <div className="w-20 h-20 sm:w-24 sm:h-24 flex-none lg:w-32 lg:h-32 image-fit relative">
                <img alt="Validator Icon" className="rounded-full" src="/img/validity.png" />
              </div>
              <div className="ml-5">
                <div className="w-24 sm:w-40 truncate sm:whitespace-normal font-medium text-lg">
                  solana-test-validator
                </div>
                <div className="text-slate-500">{parsedVersion.cliVersion}</div>
              </div>
            </div>
            <div className="mt-6 lg:mt-0 flex-1 px-5 border-l border-r border-slate-200/60 dark:border-darkmode-400 border-t lg:border-t-0 pt-5 lg:pt-0">
              <div className="font-medium text-center lg:text-left lg:mt-3">Validator Details</div>
              <div className="flex flex-col justify-center items-center lg:items-start mt-4">
                <div className="truncate sm:whitespace-normal flex items-center">
                <span className="block mr-2 font-medium">RPC :</span>
                  <a target="_blank" href={SolSettings.rpcUrl}>
                    {SolSettings.rpcUrl}
                  </a>
                </div>

                <div className="truncate sm:whitespace-normal flex items-center">
                  {/* <Lucide icon="BarChart" className="w-4 h-4 mr-2" />
                   */}
                  <span className="block mr-2 font-medium">WS :</span>

                  <a href={SolSettings.webSocketUrl}>{SolSettings.webSocketUrl}</a>
                </div>
                
                <div className="truncate sm:whitespace-normal flex items-center mt-3">
                  <Lucide icon="BarChart" className="w-4 h-4 mr-2" />
                  {(running && <span className="text-green-500">Running</span>) || (
                    <span className="text-red-500">Offline</span>
                  )}
                </div>
              </div>
            </div>
            <div className="mt-6 lg:mt-0 flex-1 flex items-center justify-center px-5 border-t lg:border-0 border-slate-200/60 dark:border-darkmode-400 pt-5 lg:pt-0">
              <div className="text-center rounded-md w-20 py-3">
                <div className="font-medium text-primary text-xl">{parsedLog.processed || 0}</div>
                <div className="text-slate-500">Processed</div>
              </div>
              <div className="text-center rounded-md w-20 py-3">
                <div className="font-medium text-primary text-xl">{parsedLog.confirmed || 0}</div>
                <div className="text-slate-500">Confirmed</div>
              </div>
              <div className="text-center rounded-md w-20 py-3">
                <div className="font-medium text-primary text-xl">{parsedLog.finalized || 0}</div>
                <div className="text-slate-500">Finalized</div>
              </div>
            </div>
            <div className="items-center mr-5">
              {(running && (
                <button
                  onClick={() => window.api.killValidator()}
                  className="btn btn-danger w-24 ml-2"
                >
                  Switch off
                </button>
              )) || (
                <button
                  className="btn btn-info w-24 ml-2"
                  onClick={() => {
                    window.api.runValidator()
                  }}
                >
                  Switch on
                </button>
              )}
            </div>
          </div>
        </div>
      </TabGroup>

      <Terminal
        body={downloadLog.map((log) => (
          <div key={log.id}>{log.message}</div>
        ))}
      />
    </>
  )
}

export default Main
