import * as $_ from 'lodash'

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Lucide,
  Modal,
  ModalBody,
  Tippy
} from '@/base-components'
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator'
import { useEffect, useState } from 'react'

import { faker as $f } from '@/utils'
import Empty from '@/components/empty/Main'
import { savedStore } from '@renderer/stores/saved-store'
import { useRecoilValue } from 'recoil'

function Main() {
  const [creationModal, setCreationModal] = useState(false)
  const [accountName, setAccountName] = useState('')
  const [mainAccount, setMainAccount] = useState(false)
  const store = useRecoilValue(savedStore)

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
                  <th className="text-center whitespace-nowrap">BALANCE</th>
                </tr>
              </thead>
              <tbody>
                {store.accounts?.map((account) => (
                  <tr key={account.publicKey} className="intro-x">
                    <td>
                      <a href="" className="font-medium whitespace-nowrap text-xs xl:text-sm">
                        {account.publicKey}
                      </a>
                      <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                        {account.created_at}
                      </div>
                    </td>
                    <td className="text-center">{account.path}</td>
                    <td className="w-40">
                      <div>{account.name}</div>
                    </td>
                    <td className="table-report__action w-56">
                      <div className="flex justify-center items-center">2 SOL</div>
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
                <label>Set as main account?</label>
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
