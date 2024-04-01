import { CommandResult, Commands } from '@type/Command'
import { rustVersion as RustVersion, parsedRustVersion, solTrigger } from '@/stores/installation'
import { useEffect, useState } from 'react'
import { useRecoilValue, useResetRecoilState } from 'recoil'

import { CheckCircle2 } from 'lucide-react'
import { Queries } from '@type/Queries'
// import React from 'react'
import Terminal from '@/components/terminal/Main.jsx'
import { Topics } from '@type/Topic'

/**
    @param {{solanaInstalled:boolean, parsedVersion: {cliVersion: string, src: string, feat:string,client: string }}} props
 */
export function Step3() {
  // const [expectedPath, setExpectedPath] = useState('')
  
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [error, setError] = useState('')
  const rustVersion = useRecoilValue(RustVersion)
  const ParsedRustVersion = useRecoilValue(parsedRustVersion)
  const reset = useResetRecoilState(solTrigger)
  let [downloadLog, setDownloadLog] = useState([] as Array<{ id: number; message: string }>)
  const [queued, setQueued] = useState('')
  const download = async () => {
    window.api.runCommand({
      command: Commands.INSTALL_RUST,
      channel: Commands.INSTALL_RUST,
      async: true
    })

    window.api.listen(Topics.STDOUT_STREAM, Commands.INSTALL_RUST, (val: any) => {
      console.log(val)
      setQueued(val)
    })

    window.api.listen(Topics.STDOUT_EXIT, Commands.INSTALL_RUST, (_: any) => {
      setDownloaded(true)
    })

    setDownloading(true)
  }
  // async function checkRustInstallation() {
  //   let res = window.api.runCommand({
  //     command: Commands.CHECK_RUST_INSTALLATION,
  //     channel: Commands.CHECK_RUST_INSTALLATION,
  //     async: false
  //   }) as CommandResult

  //   if ((await res).success) {
  //     // setSolVersion(() => res)
  //     reset()
  //     setError('')
  //   } else {
  //     setError('Rust is not Installed, pls follow the instructions to install')
  //   }
  // }

  return (
    <>
      <div className="mt-5">
        <div className="px-5 mt-10">
          <div className="font-medium text-center text-lg">Rust Installation</div>
          <div className="text-slate-500 text-center mt-2 ">
            {rustVersion.success ? (
              <div className="flex gap-2 justify-center">
                <div>Rust Installation have been verified. version {ParsedRustVersion}</div>
                <CheckCircle2 size={16} color="green" className="mx-1" />
              </div>
            ) : (
              <ul>
                <li>Please click the button below to begin installation of rust.</li>
              </ul>
            )}
          </div>

          {!rustVersion.success && <Terminal body={downloadLog.join('\n')} />}
        </div>
        <div className="px-5 sm:px-20">
          {!rustVersion.success && (
            <div className="accordion-body text-slate-600 dark:text-slate-500 leading-relaxed">
              Click the button below to verify path settings
              <div className="mt-5">
                <button
                  type="button"
                  className="my-3 btn py-3 btn-primary w-full md:w-52"
                  onClick={() => download()}
                >
                  Install Rust
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

export default Step3
