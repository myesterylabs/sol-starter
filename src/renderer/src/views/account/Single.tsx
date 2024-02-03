import { Modal, ModalBody } from '@/base-components'
import { useEffect, useState } from 'react'

import { FileSystemWallet } from '@type/Store'

function Main() {
  const [amount, setAmount] = useState(0)
  const [accountDetails, setAccountDetails] = useState(
    {} as FileSystemWallet & {
      balance: string
    }
  )
  const [airdropModal, setAirdropModal] = useState(false)
  const getAccountDetails = async () => {
    let id = window.location.pathname.split('/').pop()
    setAccountDetails(await window.api.getAccountDetails(id as string))
  }
  useEffect(() => {
    getAccountDetails()
  }, [])
  return (
    <>
      <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
        <h2 className="text-lg font-medium mr-auto">
          {accountDetails.name ? accountDetails.name : 'Account'}
        </h2>
        <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
          <a
            href="#"
            onClick={() => {
              if (confirm('Are you sure you want to delete this account?')) {
                window.api.deleteProgram(accountDetails.publicKey)
                window.location.href = '/accounts'
              }
            }}
            className="btn btn-danger shadow-md mr-2"
          >
            Delete
          </a>

          <a
            href="#"
            onClick={() => {
              setAirdropModal(true)
            }}
            className="btn btn-primary shadow-md mr-2"
          >
            Airdrop
          </a>
        </div>
      </div>
      <div className="intro-y grid grid-cols-12 gap-5 mt-5">
        {/* BEGIN: Item List */}
        <div className="intro-y col-span-12 lg:col-span-8">
          <div className="lg:flex intro-y"></div>
          <div className="grid grid-cols-12 gap-5 mt-5">
            <div className="col-span-12  box p-5 cursor-pointer zoom-in">
              <div className="font-medium text-base">Public Key</div>
              <div className="text-slate-500 ">{accountDetails.publicKey}</div>
            </div>
            <div className="col-span-12 sm:col-span-4 2xl:col-span-3 box  p-5 cursor-pointer zoom-in">
              <div className="font-medium text-base">Created At</div>
              <div className="text-opacity-80 dark:text-slate-500">
                {new Date(accountDetails.created_at).toLocaleDateString()}
              </div>
            </div>
            <div className="col-span-12 sm:col-span-4 2xl:col-span-3 box p-5 cursor-pointer zoom-in">
              <div className="font-medium text-base">Balance</div>
              <div className="text-slate-500 text-xs">{accountDetails.balance}</div>
            </div>
            <div className="col-span-12 sm:col-span-4 2xl:col-span-3 box p-5 cursor-pointer zoom-in">
              <div className="font-medium text-base">Created At</div>
              <div className="text-slate-500">{accountDetails.created_at}</div>
            </div>
            <div className="col-span-12  box p-5 cursor-pointer zoom-in">
              <div className="font-medium text-base">Location</div>
              <div className="text-slate-500">{accountDetails.path}</div>
            </div>
          </div>
        </div>
      </div>

      <Modal
        show={airdropModal}
        onHidden={() => {
          setAirdropModal(false)
        }}
      >
        <ModalBody className="p-0">
          <div className="intro-y flex items-center mt-8 px-8 py-4">
            <h2 className="text-lg font-medium mr-auto">Airdrop to {accountDetails.name}</h2>
          </div>
          <div className="intro-y box p-5">
            <div>
              <label htmlFor="crud-form-1" className="form-label">
                Public Key
              </label>
              <input
                defaultValue={accountDetails.publicKey}
                id="crud-form-1"
                type="text"
                className="form-control w-full"
                disabled
              />
            </div>

            <div>
              <label htmlFor="crud-form-1" className="form-label">
                Amount
              </label>
              <input
                type="number"
                id="crud-form-1"
                className="form-control w-full"
                onChange={(e) => {
                  setAmount(+e.target.value)
                }}
              />
            </div>

            <div className="text-right mt-5">
              <button
                onClick={() => {
                  setAirdropModal(false)
                }}
                type="button"
                className="btn btn-outline-secondary w-24 mr-1"
              >
                Cancel
              </button>
              <button
                onClick={(ev) => {
                  ev.preventDefault()
                  window.api.airdrop(accountDetails.publicKey, amount)
                  setAirdropModal(false)
                  getAccountDetails()
                }}
                type="submit"
                className="btn btn-primary w-24"
              >
                Send
              </button>
            </div>
          </div>
        </ModalBody>
      </Modal>
    </>
  )
}

export default Main
