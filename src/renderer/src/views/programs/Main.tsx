import { Lucide, Modal, ModalBody } from '@/base-components'
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator'
import { useEffect, useState } from 'react'

import { Link } from 'react-router-dom'
import classnames from 'classnames'
import { savedStore } from '@renderer/stores/saved-store'
import { useRecoilValue } from 'recoil'

function Main() {
  const [accountName, setAccountName] = useState('')
  // const [mainAccount, setMainAccount] = useState(false)
  const [folder, setFolder] = useState('')
  const [loading, setLoading] = useState(false)
  const [template, setTemplate] = useState('blank') // ['solana-dapp', 'anchor', 'blank']
  const store = useRecoilValue(savedStore)
  // check if a query param called openModal is set to true
  const openModal = window.location.search.match(/openModal=(?<openModal>\w+)/)?.groups || {}
  const [creationModal, setCreationModal] = useState(openModal?.openModal === 'true')

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
      <h2 className="intro-y text-lg font-medium mt-10">Programs</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <button
            onClick={() => {
              setCreationModal(true)
            }}
            className="btn btn-primary shadow-md mr-2"
          >
            Create Program
          </button>
        </div>
        {/* BEGIN: Data List */}
        <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
          <table className="table table-report sm:mt-2">
            <thead>
              <tr>
                {/* <th className="whitespace-nowrap">IMAGES</th> */}
                <th className="whitespace-nowrap">PROJECT NAME</th>
                <th className="text-center whitespace-nowrap">CREATED AT</th>
                <th className="text-center whitespace-nowrap">STATUS</th>
                <th className="text-center whitespace-nowrap">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {store.programs?.map((program) => (
                <tr key={program.id} className="intro-x">
                  <td>
                    <Link to={'/programs/' + program.id} className="font-medium whitespace-nowrap">
                      {program.name}
                    </Link>
                    <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">V 0.0.1</div>
                  </td>
                  <td className="text-center">
                    {new Date(program.created_at).toLocaleDateString()}
                  </td>
                  <td className="w-40">
                    <div
                      className={classnames({
                        'flex items-center justify-center': true
                      })}
                    >
                      {program.path}
                    </div>
                  </td>
                  <td className="table-report__action w-56">
                    <div className="flex justify-center items-center">
                      <a
                        onClick={() => {
                          window.api.code(program.path)
                        }}
                        className="flex items-center mr-3"
                        href="#"
                      >
                        <Lucide icon="Code" className="w-4 h-4 mr-1" />
                        Code
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* END: Data List */}
      </div>

      <Modal
        show={creationModal}
        onHidden={() => {
          setCreationModal(false)
        }}
      >
        <ModalBody className="p-0">
          <div className="intro-y flex items-center mt-8 px-8 py-4">
            <h2 className="text-lg font-medium mr-auto">Create Solana Program</h2>
          </div>
          <div className="intro-y box p-5">
            <div>
              <label htmlFor="crud-form-1" className="form-label">
                Name of Program
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
              <label>Choose Template</label>
            </div>

            <div className="p-4 grid grid-cols-4 gap-5">
              <div
                className={
                  'rounded-2xl px-4 cursor-pointer' +
                  (template == 'solana-dapp' ? 'border-red-100 border-2' : '')
                }
                onClick={() => {
                  setTemplate('solana-dapp')
                }}
              >
                <div className="flex justify-center my-3">
                  <img className="w-3/4 self-center" src="/img/nextjs-icon.svg" alt="anchor" />
                </div>
                <div className="text-center font-bold hover:text-blue-400">Solana Dapp</div>
              </div>
              <div
                className={
                  'rounded-2xl px-4 cursor-pointer' +
                  (template == 'anchor' ? 'border-red-100 border-2' : '')
                }
                onClick={() => {
                  setTemplate('anchor')
                }}
              >
                <div className="flex justify-center my-3">
                  <img className="w-3/4 self-center" src="/img/anchor-logo.webp" alt="anchor" />
                </div>
                <div className="text-center font-bold hover:text-blue-400">Anchor</div>
              </div>
              <div
                className={
                  'rounded-2xl px-4 cursor-pointer' +
                  (template == 'blank' ? 'border-red-100 border-2' : '')
                }
                onClick={() => {
                  setTemplate('blank')
                }}
              >
                <div className="flex justify-center my-3">
                  <img className="w-3/4 self-center" src="/img/blank-file.svg" alt="anchor" />
                </div>
                <div className="text-center font-bold hover:text-blue-400">Blank</div>
              </div>
            </div>

            <div className="mt-3">
              <label>Choose Root Folder</label>
              <div className="form-switch mt-2">
                <div className="">{folder}</div>
                <button
                  onClick={() => {
                    window.api.selectFolder().then((folder) => {
                      setFolder(folder)
                    })
                  }}
                  type="button"
                  className="btn btn-primary  mr-1"
                >
                  Select Folder
                </button>
              </div>
            </div>

            {loading && (
              <div className="grid">
                <div className="col-span-6 sm:col-span-3 xl:col-span-2 flex flex-col justify-end items-center">
                  <svg
                    width="20"
                    viewBox="0 0 58 58"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-8 h-8"
                  >
                    <g fill="none" fill-rule="evenodd">
                      <g transform="translate(2 1)" stroke="rgb(30, 41, 59)" stroke-width="1.5">
                        <circle
                          cx="42.601"
                          cy="11.462"
                          r="5"
                          fill-opacity="1"
                          fill="rgb(30, 41, 59)"
                        >
                          <animate
                            attributeName="fill-opacity"
                            begin="0s"
                            dur="1.3s"
                            values="1;0;0;0;0;0;0;0"
                            calcMode="linear"
                            repeatCount="indefinite"
                          ></animate>
                        </circle>
                        <circle
                          cx="49.063"
                          cy="27.063"
                          r="5"
                          fill-opacity="0"
                          fill="rgb(30, 41, 59)"
                        >
                          <animate
                            attributeName="fill-opacity"
                            begin="0s"
                            dur="1.3s"
                            values="0;1;0;0;0;0;0;0"
                            calcMode="linear"
                            repeatCount="indefinite"
                          ></animate>
                        </circle>
                        <circle
                          cx="42.601"
                          cy="42.663"
                          r="5"
                          fill-opacity="0"
                          fill="rgb(30, 41, 59)"
                        >
                          <animate
                            attributeName="fill-opacity"
                            begin="0s"
                            dur="1.3s"
                            values="0;0;1;0;0;0;0;0"
                            calcMode="linear"
                            repeatCount="indefinite"
                          ></animate>
                        </circle>
                        <circle cx="27" cy="49.125" r="5" fill-opacity="0" fill="rgb(30, 41, 59)">
                          <animate
                            attributeName="fill-opacity"
                            begin="0s"
                            dur="1.3s"
                            values="0;0;0;1;0;0;0;0"
                            calcMode="linear"
                            repeatCount="indefinite"
                          ></animate>
                        </circle>
                        <circle
                          cx="11.399"
                          cy="42.663"
                          r="5"
                          fill-opacity="0"
                          fill="rgb(30, 41, 59)"
                        >
                          <animate
                            attributeName="fill-opacity"
                            begin="0s"
                            dur="1.3s"
                            values="0;0;0;0;1;0;0;0"
                            calcMode="linear"
                            repeatCount="indefinite"
                          ></animate>
                        </circle>
                        <circle
                          cx="4.938"
                          cy="27.063"
                          r="5"
                          fill-opacity="0"
                          fill="rgb(30, 41, 59)"
                        >
                          <animate
                            attributeName="fill-opacity"
                            begin="0s"
                            dur="1.3s"
                            values="0;0;0;0;0;1;0;0"
                            calcMode="linear"
                            repeatCount="indefinite"
                          ></animate>
                        </circle>
                        <circle
                          cx="11.399"
                          cy="11.462"
                          r="5"
                          fill-opacity="0"
                          fill="rgb(30, 41, 59)"
                        >
                          <animate
                            attributeName="fill-opacity"
                            begin="0s"
                            dur="1.3s"
                            values="0;0;0;0;0;0;1;0"
                            calcMode="linear"
                            repeatCount="indefinite"
                          ></animate>
                        </circle>
                        <circle cx="27" cy="5" r="5" fill-opacity="0" fill="rgb(30, 41, 59)">
                          <animate
                            attributeName="fill-opacity"
                            begin="0s"
                            dur="1.3s"
                            values="0;0;0;0;0;0;0;1"
                            calcMode="linear"
                            repeatCount="indefinite"
                          ></animate>
                        </circle>
                      </g>
                    </g>
                  </svg>
                  <div className="text-center text-xs mt-2">Cloning Repository</div>
                </div>
              </div>
            )}
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
                disabled={!folder || loading}
                onClick={() => {
                  setLoading(true)
                  window.api.createProgram(accountName, template, folder).then((res) => {
                    setLoading(false)
                    if (res) {
                      setCreationModal(false)
                      alert('Project Created')
                    } else {
                      alert('Error creating project. Directory is not empty')
                    }
                  })
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
    </>
  )
}

export default Main
