import { Lucide, Modal, ModalBody } from '@/base-components'
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator'
import { useEffect, useState } from 'react'

import Empty from '@/components/empty/Main'
import { Link } from 'react-router-dom'
import { savedStore } from '@/stores/saved-store'
import { solSettings } from '@/stores/sol-settings'
import { useRecoilValue } from 'recoil'

function Main() {
  const openModal = window.location.search.match(/openModal=(?<openModal>\w+)/)?.groups || {}
  const [creationModal, setCreationModal] = useState(openModal?.openModal === 'true')
  const [accountName, setAccountName] = useState('')
  const [mainAccount, setMainAccount] = useState(false)
  const store = useRecoilValue(savedStore)
  const settings = useRecoilValue(solSettings)
  const trim = (str: string) => {
    return str.length > 20 ? str.substring(0, 30) + '...' : str
  }

  useEffect(() => {
    const shortName = uniqueNamesGenerator({
      dictionaries: [adjectives, animals, colors],
      length: 2,
      separator: '-'
    })

    setAccountName(shortName)
  }, [creationModal])

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10">Accounts</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <button
            onClick={() => {
              setCreationModal(true)
            }}
            className="btn btn-primary shadow-md mr-2"
          >
            Create New Account
          </button>
        </div>
        {/* BEGIN: Data List */}
        <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
          {!!store.accounts?.length ? (
            <table className="table table-report -mt-2">
              <thead>
                <tr>
                  {/* <th className="whitespace-nowrap">IMAGES</th> */}
                  <th className="whitespace-nowrap">ACCOUNT</th>
                  <th className="text-center whitespace-nowrap">PATH</th>
                  <th className="text-center whitespace-nowrap">ALIAS</th>
                  <th className="text-center whitespace-nowrap">DEFAULT</th>
                </tr>
              </thead>
              <tbody>
                {store.accounts?.map((account) => (
                  <tr key={account.publicKey} className="intro-x">
                    <td>
                      <Link
                        to="`/accounts/${account.publicKey}`"
                        className="font-medium whitespace-nowrap text-xs xl:text-sm"
                      >
                        {account.publicKey}
                      </Link>
                      <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                        {account.created_at}
                      </div>
                    </td>
                    <td className="text-center">
                      <Link
                        to="/"
                        onClick={(e) => {
                          e.preventDefault()
                          window.api.openFolder(account.path)
                        }}
                      >
                        {trim(account.path)}
                      </Link>
                    </td>
                    <td className="w-40">
                      <div>{account.name}</div>
                    </td>
                    <td className="w-40">
                      {settings.keypairPath === account.path ? (
                        <div className="flex justify-center items-center">
                          <Lucide icon="CheckSquare" className="w-5 h-5 text-green-500" />
                        </div>
                      ) : (
                        <div className="flex justify-center items-center">
                          <Lucide icon="Minus" className="w-5 h-5 text-red-500" />
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <Empty />
          )}
        </div>

        <Modal
          show={creationModal}
          onHidden={() => {
            setCreationModal(false)
          }}
        >
          <ModalBody className="p-0">
            <div className="intro-y flex items-center mt-8 px-8 py-4">
              <h2 className="text-lg font-medium mr-auto">Create Filesystem Account</h2>
            </div>
            <div className="intro-y box p-5">
              <div>
                <label htmlFor="crud-form-1" className="form-label">
                  Name or Alias
                </label>
                <input
                  defaultValue={accountName}
                  id="crud-form-1"
                  type="text"
                  className="form-control w-full"
                  onChange={(e) => {
                    setAccountName(e.target.value)
                  }}
                />
              </div>
              <div className="mt-3">
                <label>Override main account?</label>
                <div className="form-switch mt-2">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    defaultChecked={mainAccount}
                    onChange={(e) => {
                      setMainAccount(e.target.checked)
                    }}
                  />
                </div>
              </div>

              <div className="text-right mt-5">
                <button
                  onClick={() => {
                    setCreationModal(false)
                  }}
                  type="button"
                  className="btn btn-outline-secondary w-24 mr-1"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    window.api.createAccount(accountName, mainAccount)
                    setCreationModal(false)
                  }}
                  type="button"
                  className="btn btn-primary w-24"
                >
                  Save
                </button>
              </div>
            </div>
          </ModalBody>
        </Modal>
        {/* END: Delete Confirmation Modal */}
      </div>
    </>
  )
}

export default Main
