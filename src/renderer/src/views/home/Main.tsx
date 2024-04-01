import { parsedVersion, rustVersion, solVersion } from '@renderer/stores/installation'

import { Link } from 'react-router-dom'
import { Lucide } from '@/base-components'
import classnames from 'classnames'
import { savedStore } from '@/stores/saved-store'
import { useRecoilValue } from 'recoil'

function Main() {
  const store = useRecoilValue(savedStore)
  const SolVersion = useRecoilValue(solVersion)
  const RustVersion = useRecoilValue(rustVersion)
  const ParsedVersion = useRecoilValue(parsedVersion)
  return (
    <div className="grid grid-cols-12 gap-6">
      <div className="col-span-12 2xl:col-span-9">
        <div className="grid grid-cols-12 gap-6">
          {/* BEGIN: General Report */}
          <div className="col-span-12 mt-8">
            <div className="intro-y flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">Welcome Back</h2>
            </div>
            <div className="grid grid-cols-12 gap-6 mt-5">
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <Link to="/programs">
                  <div className="report-box zoom-in relative">
                    <div className="box p-5">
                      <div className="flex">
                        <Lucide icon="Code" className="report-box__icon text-primary" />
                      </div>
                      <div className="text-3xl font-medium leading-8 mt-6">
                        {store.programs?.length}
                      </div>
                      <div className="text-base text-slate-500 mt-1">Solana Programs</div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <Link to="/accounts">
                  <div className="report-box zoom-in">
                    <div className="box p-5">
                      <div className="flex">
                        <Lucide icon="Wallet" className="report-box__icon text-pending" />
                      </div>
                      <div className="text-3xl font-medium leading-8 mt-6">
                        {store.accounts?.length}
                      </div>
                      <div className="text-base text-slate-500 mt-1">Accounts</div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <Link to="/setup">
                  <div className="report-box zoom-in">
                    <div className="box p-5">
                      <div className="flex">
                        <Lucide icon="Monitor" className="report-box__icon text-warning" />
                      </div>
                      <div className="text-3xl font-medium leading-8 mt-6">
                        {ParsedVersion.cliVersion}
                      </div>
                      <div className="text-base text-slate-500 mt-1">Sol Version</div>
                    </div>
                  </div>
                </Link>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <Link to="/validator">
                  <div className="report-box zoom-in">
                    <div className="box p-5">
                      <div className="flex">
                        <Lucide icon="User" className="report-box__icon text-success" />
                      </div>
                      <div className="text-3xl font-medium leading-8 mt-6">{store.last_block}</div>
                      <div className="text-base text-slate-500 mt-1">Processed Blocks</div>
                    </div>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/* END: General Report */}

          {/* BEGIN: Recent Solana Programs */}
          <div className="col-span-12 mt-6">
            <div className="intro-y block sm:flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">Recent Solana Programs</h2>
              <div className="flex items-center sm:ml-auto mt-3 sm:mt-0">
                <Link to="/programs?openModal=true">
                  <button className="btn box flex items-center text-slate-600 dark:text-slate-300">
                    <Lucide icon="Plus" className="hidden sm:block w-4 h-4 mr-2" />
                    Create Program
                  </button>
                </Link>

                <Link to="/accounts?openModal=true">
                  <button className="ml-3 btn box flex items-center text-slate-600 dark:text-slate-300">
                    <Lucide icon="Plus" className="hidden sm:block w-4 h-4 mr-2" />
                    Create Account
                  </button>
                </Link>
              </div>
            </div>
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
                        <Link
                          to={'/programs/' + program.id}
                          className="font-medium whitespace-nowrap"
                        >
                          {program.name}
                        </Link>
                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                          V 0.0.1
                        </div>
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
            <div className="w-full">
              {store.programs?.length ? (
                <Link
                  to="/programs"
                  className="intro-y w-full block text-center rounded-md py-3 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500"
                >
                  View More
                </Link>
              ) : (
                <div className="intro-y w-full block text-center rounded-md py-3 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500">
                  No Programs
                </div>
              )}
            </div>
          </div>
          {/* END: Recent Solana Programs */}
        </div>
      </div>
      <div className="col-span-12 2xl:col-span-3">
        <div className="2xl:border-l -mb-10 pb-10">
          <div className="2xl:pl-6 grid grid-cols-12 gap-x-6 2xl:gap-x-0 gap-y-6">
            {/* BEGIN: Accounts */}
            <div className="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12 mt-3 2xl:mt-8">
              <div className="intro-x flex items-center h-10">
                <h2 className="text-lg font-medium truncate mr-5">Accounts</h2>
              </div>
              <div className="mt-5">
                {store.accounts
                  ?.filter((_, i) => i < 5)
                  .map((account) => (
                    <div key={account.path} className="intro-x">
                      <div className="box px-5 py-3 mb-3 flex items-center zoom-in">
                        <div className="ml-4 mr-auto">
                          <div className="font-medium text-xs">
                            <Link
                              to={`/accounts/${account.publicKey}`}
                              className="font-medium whitespace-nowrap text-xs"
                            >
                              {account.publicKey}
                            </Link>
                          </div>
                          <div className="text-slate-500 text-xs mt-0.5 flex gap-2">
                            <span className="block">
                              <Lucide icon="Copy" className="text-success" />
                            </span>
                            <span className="block">{account.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                <Link
                  to="/accounts"
                  className="intro-x w-full block text-center rounded-md py-3 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500"
                >
                  View More
                </Link>
              </div>
            </div>
            {/* END: Accounts */}
            {/* Blocks */}
            <div className="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12 mt-3 2xl:mt-8">
              <div className="intro-x flex items-center h-10">
                <h2 className="text-lg font-medium truncate mr-5">Recent Blocks</h2>
              </div>
              <div className="mt-5">
                {new Array(5)
                  .fill(store.last_block)
                  .map((x, i) => x - i)
                  .map((blockNumber) => (
                    <div key={blockNumber} className="intro-x">
                      <div className="box px-5 py-3 mb-3 flex items-center zoom-in">
                        {/* <div className="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                        <img alt="Midone Tailwind HTML Admin Template" src={faker.photos[0]} />
                      </div> */}
                        <div className="ml-4 mr-auto">
                          <div className="font-medium">#{blockNumber}</div>
                          <div className="text-slate-500 text-xs mt-0.5">
                            {new Date().toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                <Link
                  to="/validator"
                  className="intro-x w-full block text-center rounded-md py-3 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500"
                >
                  View More
                </Link>
              </div>
            </div>

            {/* BEGIN: Milestones */}
            <div className="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12 mt-3">
              <div className="intro-x flex items-center h-10">
                <h2 className="text-lg font-medium truncate mr-5">Milestones</h2>
              </div>
              <div className="mt-5">
                <div className="intro-x">
                  <div className="box px-5 py-3 mb-3 flex items-center zoom-in">
                    <div className="flex justify-between w-full">
                      <div className="ml-4 mr-auto">
                        <div className="font-medium">Install Rust</div>
                        <div className="text-slate-500 text-xs mt-0.5">
                          {RustVersion.success ? 'completed' : 'pending'}
                        </div>
                      </div>

                      <div className="border-black">
                        {RustVersion.success ? (
                          <Lucide icon="CheckSquare" className="w-5 h-5 mt-2 text-green-500" />
                        ) : (
                          <Lucide icon="Loader" className="w-5 h-5 mt-2 text-warning" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="intro-x">
                  <div className="box px-5 py-3 mb-3 flex items-center zoom-in">
                    <div className="flex justify-between w-full">
                      <div className="ml-4 mr-auto">
                        <div className="font-medium">Install Solana CLI</div>
                        <div className="text-slate-500 text-xs mt-0.5">
                          {SolVersion.success ? 'completed' : 'pending'}
                        </div>
                      </div>

                      <div className="border-black">
                        {SolVersion.success ? (
                          <Lucide icon="CheckSquare" className="w-5 h-5 mt-2 text-green-500" />
                        ) : (
                          <Lucide icon="Loader" className="w-5 h-5 mt-2 text-warning" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="intro-x">
                  <div className="box px-5 py-3 mb-3 flex items-center zoom-in">
                    <div className="flex justify-between w-full">
                      <div className="ml-4 mr-auto">
                        <div className="font-medium">Create Accounts</div>
                        <div className="text-slate-500 text-xs mt-0.5">
                          {store.accounts?.length ? 'completed' : 'pending'}
                        </div>
                      </div>

                      <div className="border-black">
                        {store.accounts?.length ? (
                          <Lucide icon="CheckSquare" className="w-5 h-5 mt-2 text-green-500" />
                        ) : (
                          <Lucide icon="Loader" className="w-5 h-5 mt-2 text-warning" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="intro-x">
                  <div className="box px-5 py-3 mb-3 flex items-center zoom-in">
                    <div className="flex justify-between w-full">
                      <div className="ml-4 mr-auto">
                        <div className="font-medium">Create Programs</div>
                        <div className="text-slate-500 text-xs mt-0.5">
                          {store.programs?.length ? 'completed' : 'pending'}
                        </div>
                      </div>

                      <div className="border-black">
                        {store.programs?.length ? (
                          <Lucide icon="CheckSquare" className="w-5 h-5 mt-2 text-green-500" />
                        ) : (
                          <Lucide icon="Loader" className="w-5 h-5 mt-2 text-warning" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
