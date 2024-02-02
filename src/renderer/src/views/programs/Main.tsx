import { Lucide, Modal, ModalBody } from '@/base-components'
import { adjectives, animals, colors, uniqueNamesGenerator } from 'unique-names-generator'
import { useEffect, useState } from 'react'

import classnames from 'classnames'
import { savedStore } from '@renderer/stores/saved-store'
import { useRecoilValue } from 'recoil'
import { Link } from 'react-router-dom'

function Main() {
  const [accountName, setAccountName] = useState('')
  // const [mainAccount, setMainAccount] = useState(false)
  const [folder, setFolder] = useState('')
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
      {/* BEGIN: Delete Confirmation Modal */}
      {/* <Modal
        show={deleteConfirmationModal}
        onHidden={() => {
          setDeleteConfirmationModal(false)
        }}
      >
        <ModalBody className="p-0">
          <div className="p-5 text-center">
            <Lucide icon="XCircle" className="w-16 h-16 text-danger mx-auto mt-3" />
            <div className="text-3xl mt-5">Are you sure?</div>
            <div className="text-slate-500 mt-2">
              Do you really want to delete these records? <br />
              This process cannot be undone.
            </div>
          </div>
          <div className="px-5 pb-8 text-center">
            <button
              type="button"
              onClick={() => {
                setDeleteConfirmationModal(false)
              }}
              className="btn btn-outline-secondary w-24 mr-1"
            >
              Cancel
            </button>
            <button type="button" className="btn btn-danger w-24">
              Delete
            </button>
          </div>
        </ModalBody>
      </Modal> */}

      {/* END: Delete Confirmation Modal */}

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
                disabled={!folder}
                onClick={() => {
                  window.api.createProgram(accountName, folder).then((res) => {
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
