import { Lucide } from '@/base-components'
import { savedStore } from '@renderer/stores/saved-store'
import { solSettings } from '@renderer/stores/sol-settings'
import { useRecoilValue } from 'recoil'
import { useState } from 'react'

function Main() {
  const [tab, setTab] = useState('account')
  const SolSettings = useRecoilValue(solSettings)
  const store = useRecoilValue(savedStore)
  const [mainAccount, setMainAccount] = useState(
    store.accounts?.filter((account) => account.path === SolSettings.keypairPath)[0].publicKey
  )
  const [rpcPort, setRpcPort] = useState(SolSettings.rpcUrl.split(':').pop())
  return (
    <>
      <div className="intro-y flex items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">Settings</h2>
      </div>
      <div className="grid grid-cols-12 gap-6 mt-5">
        {/* BEGIN: Profile Menu */}
        <div className="col-span-12 lg:col-span-4 2xl:col-span-3 flex lg:block flex-col-reverse">
          <div className="intro-y box mt-5 lg:mt-0">
            <div className="p-5 border-t border-slate-200/60 dark:border-darkmode-400">
              <div
                className={`cursor-pointer flex items-center mt-5 ${tab == 'account' ? 'font-medium' : ''}`}
                onClick={() => setTab('account')}
              >
                <Lucide icon="Box" className="w-4 h-4 mr-2" /> Account Settings
              </div>
              <div
                className={`cursor-pointer flex items-center mt-5 ${tab == 'validator' ? 'font-medium' : ''}`}
                onClick={() => setTab('validator')}
              >
                <Lucide icon="Settings" className="w-4 h-4 mr-2" /> Validator Settings
              </div>
            </div>
          </div>
        </div>
        {/* END: Profile Menu */}
        <div className="col-span-12 lg:col-span-8 2xl:col-span-9">
          <div className="grid grid-cols-12 gap-6">
            {tab == 'account' && (
              <div className="intro-y box col-span-12 2xl:col-span-6">
                <div className="flex items-center px-5 py-5 sm:py-3 border-b border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="font-medium text-base mr-auto">Default Account</h2>
                </div>
                <div className="m-4">
                  <label>Select Default Account</label>
                  {store.accounts?.map((account) => (
                    <div className="form-check mt-2" key={account.publicKey}>
                      <input
                        id="radio-switch-1"
                        className="form-check-input"
                        type="radio"
                        name="default_account"
                        value={account.publicKey}
                        onChange={() => {
                          setMainAccount(account.publicKey)
                        }}
                        defaultChecked={mainAccount === account.publicKey}
                      />
                      <label className="form-check-label" htmlFor="radio-switch-1">
                        {account.name} - {account.publicKey}
                      </label>
                    </div>
                  ))}

                  <div className="my-3">
                    <button
                      onClick={() => {
                        window.api.setMainAccount(mainAccount as string)
                        alert('Default account set successfully')
                      }}
                      type="button" className="btn btn-primary w-24">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
            {tab == 'validator' && (
              <div className="intro-y box col-span-12 2xl:col-span-6">
                <div className="flex items-center px-5 py-5 sm:py-3 border-b border-slate-200/60 dark:border-darkmode-400">
                  <h2 className="font-medium text-base mr-auto">Customise RPC URL</h2>
                </div>
                <div className="m-4">
                  <label>Select RPC Port</label>
                  <div className="form-check mt-2">
                    <input
                      id="radio-switch-1"
                      className="form-check-input"
                      type="radio"
                      name="rpc_port"
                      value="8899"
                      defaultChecked={rpcPort === '8899'}
                      onChange={() => {
                        setRpcPort('8899')
                      }}
                    />
                    <label className="form-check-label" htmlFor="radio-switch-1">
                      :8899
                    </label>
                  </div>
                  <div className="form-check mt-2">
                    <input
                      id="radio-switch-2"
                      className="form-check-input"
                      type="radio"
                      name="rpc_port"
                      value="8999"
                      defaultChecked={rpcPort === '8999'}
                      onChange={() => {
                        setRpcPort('8999')
                      }}
                    />
                    <label className="form-check-label" htmlFor="radio-switch-2">
                      :8999
                    </label>
                  </div>
                  <div className="form-check mt-2">
                    <input
                      id="radio-switch-3"
                      className="form-check-input"
                      type="radio"
                      name="rpc_port"
                      value="9999"
                      defaultChecked={rpcPort === '9999'}
                      onChange={() => {
                        setRpcPort('9999')
                      }}
                    />
                    <label className="form-check-label" htmlFor="radio-switch-3">
                      :9999
                    </label>
                  </div>

                  <div className="my-3">
                    <button
                      onClick={() => {
                        window.api.setRpcPort(rpcPort as string)
                        alert('RPC Port set successfully')
                      }}
                      type="button" className="btn btn-primary w-24">
                      Save
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Main
