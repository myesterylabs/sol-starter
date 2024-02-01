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

import { faker as $f } from '@/utils'
import classnames from 'classnames'
import { useState } from 'react'

function Main() {
  const [deleteConfirmationModal, setDeleteConfirmationModal] = useState(false)

  return (
    <>
      <h2 className="intro-y text-lg font-medium mt-10">Projects</h2>
      <div className="grid grid-cols-12 gap-6 mt-5">
        <div className="intro-y col-span-12 flex flex-wrap sm:flex-nowrap items-center mt-2">
          <button className="btn btn-primary shadow-md mr-2">Create Project</button>
        </div>
        {/* BEGIN: Data List */}
        <div className="intro-y col-span-12 overflow-auto lg:overflow-visible">
          <table className="table table-report sm:mt-2">
            <thead>
              <tr>
                {/* <th className="whitespace-nowrap">IMAGES</th> */}
                <th className="whitespace-nowrap">PROJECT NAME</th>
                <th className="text-center whitespace-nowrap">LAST MODIFIED</th>
                <th className="text-center whitespace-nowrap">STATUS</th>
                <th className="text-center whitespace-nowrap">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {$_.take($f(), 4).map((faker, fakerKey) => (
                <tr key={fakerKey} className="intro-x">
                  <td>
                    <a href="" className="font-medium whitespace-nowrap">
                      {faker.products[0].name}
                    </a>
                    <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">V 0.0.1</div>
                  </td>
                  <td className="text-center">26 Jan 2024</td>
                  <td className="w-40">
                    <div
                      className={classnames({
                        'flex items-center justify-center': true,
                        'text-success': faker.trueFalse[0],
                        'text-danger': !faker.trueFalse[0]
                      })}
                    >
                      {faker.trueFalse[0] ? 'Deployed' : 'Local'}
                    </div>
                  </td>
                  <td className="table-report__action w-56">
                    <div className="flex justify-center items-center">
                      <a className="flex items-center mr-3" href="">
                        <Lucide icon="Code" className="w-4 h-4 mr-1" />
                        Code
                      </a>
                      <a className="flex items-center text-danger" href="">
                        <Lucide icon="Trash2" className="w-4 h-4 mr-1" /> Delete
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
      <Modal
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
      </Modal>
      {/* END: Delete Confirmation Modal */}
    </>
  )
}

export default Main
