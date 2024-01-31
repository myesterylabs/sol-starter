import { CheckCircle, CheckCircle2 } from 'lucide-react'
import { Tab, TabGroup, TabList, TabPanel, TabPanels } from '@/base-components'
import { useEffect, useState } from 'react'

import { Commands } from '@type/Command'
import { solVersion as RsolVersion } from '@/stores/installation'
import Terminal from '@/components/terminal/Main.jsx'
import { Topics } from '@type/Topic'
import { useRecoilValue } from 'recoil'

/**
    @param {{solanaInstalled:boolean, parsedVersion: {cliVersion: string, src: string, feat:string,client: string }}} props
 */
export function Step1({ parsedVersion, setStep1Complete }) {
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [downloaded, setDownloaded] = useState(false)
  // const [solanaInstalled, setSolanaInstalled] = useState(false)
  const solVersion = useRecoilValue(RsolVersion)
  let [downloadLog, setDownloadLog] = useState([] as Array<{ id: number; message: string }>)
  const [queued, setQueued] = useState('')

  const download = async () => {
    window.api.runCommand({
      command: Commands.INSTALL_SOLANA,
      channel: Commands.INSTALL_SOLANA,
      async: true
    })

    window.api.listen(Topics.STDOUT_STREAM, Commands.INSTALL_SOLANA, (val: any) => {
      console.log(val)
      setQueued(val)
    })

    window.api.listen(Topics.STDOUT_EXIT, Commands.INSTALL_SOLANA, (_: any) => {
      setDownloaded(true)
    })

    setDownloading(true)
  }

  const addDownload = (download) => {
    setDownloadLog([
      ...downloadLog,
      {
        id: Math.random(),
        message: download
      }
    ])

    setDownloadProgress(downloadProgress + 10 < 99 ? downloadProgress + 10 : 99)
  }

  useEffect(() => {
    addDownload(queued)
  }, [queued])

  useEffect(() => {
    if (downloaded) {
      setDownloadProgress(100)
      setStep1Complete(true)
    }
  }, [downloaded])

  return (
    <>
      <div className="px-5 mt-10">
        <div className="font-medium text-center text-lg">Solana Installation</div>
        <div className="text-slate-500 text-center mt-2">
          {solVersion.success
            ? 'A valid installation of solana was found'
            : 'No Solana installation was found. Please follow the instructions below to install Solana.'}
        </div>
      </div>
      {!solVersion.success ? (
        <div className="px-5 sm:px-20 mt-10 pt-10 border-t border-slate-200/60 dark:border-darkmode-400">
          <div className="font-medium text-base">Installation instruction</div>
          <div className=" gap-y-5 mt-5">
            {downloading
              ? 'Installation in progress'
              : 'Please click the button below to install Solana CLI'}
          </div>
          {downloading ? (
            <>
              <div className="mt-5">
                <div id="faq-accordion-1" className="accordion">
                  <div className="accordion-item">
                    <div id="faq-accordion-content-1" className="accordion-header">
                      {' '}
                      <button
                        className="accordion-button flex justify-between"
                        type="button"
                        data-tw-toggle="collapse"
                        data-tw-target="#faq-accordion-collapse-1"
                        aria-expanded="true"
                        aria-controls="faq-accordion-collapse-1"
                      >
                        <span className="block">Downloading CLI</span>
                        <span className="block">{downloadProgress}%</span>
                      </button>{' '}
                      <div className="progress h-1 mt-2" style={{ width: downloadProgress + '%' }}>
                        <div
                          className="progress-bar bg-primary"
                          role="progressbar"
                          aria-valuenow="0"
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                    </div>
                    <div
                      id="faq-accordion-collapse-1"
                      className="accordion-collapse collapse show"
                      aria-labelledby="faq-accordion-content-1"
                      data-tw-parent="#faq-accordion-1"
                    >
                      <div className="accordion-body text-slate-600 dark:text-slate-500 leading-relaxed">
                        <Terminal
                          body={downloadLog.map((log) => (
                            <div key={log.id}>{log.message}</div>
                          ))}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {downloadProgress == 100 && (
                  <div className="flex gap-2 mt-2 justify-center">
                    <div>CLI installed, Please proceed to step 2</div>
                    <CheckCircle2 size={16} color="green" className="mx-1" />
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                type="button"
                className="my-3 btn py-3 btn-primary w-full md:w-52"
                onClick={() => download()}
              >
                Install
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="report intro-y mt-5">
          <div className=" grid grid-cols-12">
            <div className="col-span-12 lg:col-span-4 px-8 py-12 flex flex-col justify-center">
              <img src="/img/solana-sol-logo.svg" className="w-10 h-10 text-pending" />
              <div className="justify-start flex items-center text-slate-600 dark:text-slate-300 mt-12">
                Solana CLI
                <CheckCircle2 size={16} color="green" className="mx-1" />
              </div>
              <div className="flex items-center justify-start mt-4">
                <div className="relative text-2xl font-medium pl-3 ml-0.5">
                  V {parsedVersion.cliVersion}
                </div>
              </div>
              <div className="mt-4 text-slate-500 text-xs">working as expected.</div>
            </div>
            <div className="col-span-12 lg:col-span-8 p-8 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-darkmode-300 border-dashed">
              <TabGroup>
                <TabList className="hidden" role="tablist">
                  <Tab className="w-full py-1.5 px-2" tag="button"></Tab>
                </TabList>
                <TabPanels className="px-5 pb-5">
                  <TabPanel className="grid grid-cols-12 gap-y-8 gap-x-10">
                    <div className="col-span-6 sm:col-span-6 md:col-span-4">
                      <div className="text-slate-500 flex gap-2">
                        <span className="block">Client</span>
                        <CheckCircle size={16} color="green" />
                      </div>
                      <div className="mt-1.5 flex items-center">
                        <div className="text-base">{parsedVersion.client}</div>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 md:col-span-4">
                      <div className="text-slate-500 flex gap-2">
                        <span className="block">Src</span>
                        <CheckCircle size={16} color="green" />
                      </div>
                      <div className="mt-1.5 flex items-center">
                        <div className="text-base">{parsedVersion.src}</div>
                      </div>
                    </div>
                    <div className="col-span-12 sm:col-span-6 md:col-span-4">
                      <div className="text-slate-500 flex gap-2">
                        <span className="block">Feat</span>
                        <CheckCircle size={16} color="green" />
                      </div>
                      <div className="mt-1.5 flex items-center">
                        <div className="text-base">{parsedVersion.feat}</div>
                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Step1
