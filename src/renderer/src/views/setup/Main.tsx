import { useEffect, useState } from 'react'

// import { Commands } from '@type/Command'
import { solVersion as RsolVersion } from '@renderer/stores/installation'
import Step1 from './Step1'
import Step2 from './Step2'
import { useRecoilValue } from 'recoil'

/**
 * @returns {{cliVersion: string, src: string, feat:string,client: string }} The result of the operation.
 */
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
  const solVersion = useRecoilValue(RsolVersion)
  let [parsedVersion, setParsedVersion] = useState({})
  let [step1Complete, setStep1Complete] = useState(false)
  let [step2Complete, setStep2Complete] = useState(false)
  let [step, setStep] = useState(1)
  const increaseStep = () => {
    if (step < 2) {
      setStep(step + 1)
    }
  }
  const decreaseStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }
  useEffect(() => {
    async function waiter() {
      // let solanaInstalled = await checkSolanaInstallation()
      // setSolVersion(solanaInstalled)
      // setSolanaInstalled(solanaInstalled.success)
      if (solVersion.success) {
        setStep2Complete(true)
        setStep1Complete(true)
        setParsedVersion(parseSolVersion(solVersion.stdout))
      }
    }
    waiter()
  }, [])
  return (
    <>
      <div className="flex items-center mt-8">
        <h2 className="intro-y text-lg font-medium mr-auto">Setup</h2>
      </div>
      {/* BEGIN: Wizard Layout */}
      <div className="intro-y box py-10 sm:py-20 mt-5">
        <div className="flex justify-center">
          <button
            className={`intro-y w-10 h-10 rounded-full btn ${
              step === 1 ? 'btn-primary' : 'bg-slate-100 text-slate-500'
            } mx-2`}
            onClick={() => setStep(1)}
          >
            1
          </button>
          <button
            className={`intro-y w-10 h-10 rounded-full btn ${
              step === 2 ? 'btn-primary' : 'bg-slate-100 text-slate-500'
            } mx-2`}
            onClick={() => setStep(2)}
            disabled={!step1Complete}
          >
            2
          </button>
          {/* <button
            className={`intro-y w-10 h-10 rounded-full btn ${
              step === 3 ? 'btn-primary' : 'bg-slate-100 text-slate-500'
            } mx-2`}
            onClick={() => setStep(3)}
          >
            3
          </button> */}
        </div>
        <>
          {step === 1 && (
            <Step1
              setStep1Complete={setStep1Complete}
              parsedVersion={parsedVersion}
            />
          )}
          {step === 2 && <Step2 setStep2Complete={setStep2Complete} />}
          {/* {step === 3 && <Step3 solanaInstalled={solanaInstalled} />} */}
        </>
      </div>
      <div className="intro-y col-span-12 flex items-center justify-center sm:justify-end mt-5">
        <button onClick={() => decreaseStep()} className="btn btn-secondary w-24">
          Previous
        </button>
        <button
          onClick={() => increaseStep()}
          className="btn btn-primary w-24 ml-2"
          disabled={(step == 1 && !step1Complete) || (step == 2 && !step2Complete)}
        >
          Next
        </button>
      </div>
      {/* END: Wizard Layout */}
    </>
  )
}

export default Main
