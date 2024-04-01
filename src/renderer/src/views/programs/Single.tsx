import { useEffect, useState } from 'react'

import { SolProgram } from '@type/Store'

function Main() {
  const [projectDetails, setProjectDetails] = useState(
    {} as SolProgram & {
      last_modified: string
      no_of_files: number
    }
  )
  const [deleted, setDeleted] = useState(false)
  const getProgramDetails = async () => {
    let id = window.location.pathname.split('/').pop()
    let data
    try {
      data = await window.api.getProgramDetails(id as string)
    } catch (error) {
      setDeleted(true)
    }
    setProjectDetails(data)
  }
  useEffect(() => {
    getProgramDetails()
  }, [])
  return (
    <>
      {!deleted ? (
        <>
          <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
            <h2 className="text-lg font-medium mr-auto">
              {projectDetails.name ? projectDetails.name : 'Program'}
            </h2>
            <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
              <a
                href="#"
                onClick={() => {
                  if (confirm('Are you sure you want to delete this project?')) {
                    window.api.deleteProgram(projectDetails.id)
                    window.location.href = '/programs'
                  }
                }}
                className="btn btn-danger shadow-md mr-2"
              >
                Delete
              </a>

              <a
                href="#"
                onClick={() => {
                  window.api.code(projectDetails.path)
                }}
                className="btn btn-primary shadow-md mr-2"
              >
                Open in VS Code
              </a>
            </div>
          </div>
          <div className="intro-y grid grid-cols-12 gap-5 mt-5">
            {/* BEGIN: Item List */}
            <div className="intro-y col-span-12 lg:col-span-8">
              <div className="lg:flex intro-y"></div>
              <div className="grid grid-cols-12 gap-5 mt-5">
                <div className="col-span-12 sm:col-span-4 2xl:col-span-3 box p-5 cursor-pointer zoom-in">
                  <div className="font-medium text-base">No Of Files</div>
                  <div className="text-slate-500">{projectDetails.no_of_files} Items</div>
                </div>
                <div className="col-span-12 sm:col-span-4 2xl:col-span-3 box  p-5 cursor-pointer zoom-in">
                  <div className="font-medium text-base">Created At</div>
                  <div className="text-opacity-80 dark:text-slate-500">
                    {new Date(projectDetails.created_at).toLocaleDateString()}
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-4 2xl:col-span-3 box p-5 cursor-pointer zoom-in">
                  <div className="font-medium text-base">Id</div>
                  <div className="text-slate-500 text-xs">{projectDetails.id}</div>
                </div>
                <div className="col-span-12 sm:col-span-4 2xl:col-span-3 box p-5 cursor-pointer zoom-in">
                  <div className="font-medium text-base">Last Modified</div>
                  <div className="text-slate-500">{projectDetails.last_modified}</div>
                </div>
                <div className="col-span-12 sm:col-span-4 2xl:col-span-3 box p-5 cursor-pointer zoom-in">
                  <div className="font-medium text-base">Location</div>
                  <div className="text-slate-500 text-xs">{projectDetails.path}</div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <div className="intro-y flex flex-col sm:flex-row items-center mt-8">
          <h2 className="text-lg font-medium mr-auto">Program not found</h2>
          <div className="w-full sm:w-auto flex mt-4 sm:mt-0">
            <a href="/programs" className="btn btn-primary shadow-md mr-2">
              Go Back
            </a>
          </div>
        </div>
      )}
    </>
  )
}

export default Main
