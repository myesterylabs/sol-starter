import { CommandResult, Commands } from '@type/Command'
import { solVersion as RsolVersion, solTrigger } from '@/stores/installation'
import { useEffect, useState } from 'react'
import { useRecoilValue, useResetRecoilState } from 'recoil'

import { CheckCircle2 } from 'lucide-react'
import { Queries } from '@type/Queries'
// import React from 'react'
import Terminal from '@/components/terminal/Main.jsx'

/**
    @param {{solanaInstalled:boolean, parsedVersion: {cliVersion: string, src: string, feat:string,client: string }}} props
 */
export function Step2() {
  const [expectedPath, setExpectedPath] = useState('')
  // const [addedToPath, setAddedToPath] = useState(false)
  const [error, setError] = useState('')
  const solVersion = useRecoilValue(RsolVersion)
  const reset = useResetRecoilState(solTrigger)
  // const setSolVersion = useSetRecoilState(RsolVersion)

  async function checkSolanaInstallation() {
    let res = window.api.runCommand({
      command: Commands.CHECK_SOLANA_INSTALLATION,
      channel: Commands.CHECK_SOLANA_INSTALLATION,
      async: false
    }) as CommandResult

    if ((await res).success) {
      // setSolVersion(() => res)
      reset()
      setError('')
    } else {
      setError("PATH settings couldn't be verified, please follow the instructions carefully")
    }
  }

  useEffect(() => {
    window.api
      .query({
        async: false,
        query: Queries.GET_EXPECTED_PATH,
        channel: Queries.GET_EXPECTED_PATH
      })
      .then((res) => {
        setExpectedPath(res.stdout)
      })

    // checkSolanaInstallation()
  }, [])

  return (
    <>
      <div className="mt-5">
        <div className="px-5 mt-10">
          <div className="font-medium text-center text-lg">Path Settings</div>
          <div className="text-slate-500 text-center mt-2 ">
            {solVersion.success ? (
              <div className="flex gap-2 justify-center">
                <div>Path Settings have been verified.</div>
                <CheckCircle2 size={16} color="green" className="mx-1" />
              </div>
            ) : (
              <ul>
                <li>Please run the command below to add solana to your path.</li>
                <li>After doing that please exit the terminal</li>
                <li>Click the Verify button to verify</li>
              </ul>
            )}
          </div>

          {!solVersion.success && <Terminal body={`export PATH="${expectedPath}:$PATH"`} />}
        </div>
        <div className="px-5 sm:px-20">
          {!solVersion.success && (
            <div className="accordion-body text-slate-600 dark:text-slate-500 leading-relaxed">
              Click the button below to verify path settings
              <div className="mt-5">
                <button
                  type="button"
                  className="my-3 btn py-3 btn-primary w-full md:w-52"
                  onClick={() => checkSolanaInstallation()}
                >
                  Verify
                </button>
              </div>
            </div>
          )}
          {error && <div className="text-center text-red-500 mt-5">{error}</div>}
        </div>
      </div>
    </>
  )
}

export default Step2
