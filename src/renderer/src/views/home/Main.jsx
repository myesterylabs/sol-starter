import * as $_ from 'lodash'

import {
  Dropdown,
  DropdownContent,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Litepicker,
  Lucide,
  TinySlider,
  Tippy
} from '@/base-components'
import { useRef, useState } from 'react'

import { faker as $f } from '@/utils'
import ReportDonutChart from '@/components/report-donut-chart/Main'
import ReportDonutChart1 from '@/components/report-donut-chart-1/Main'
import ReportLineChart from '@/components/report-line-chart/Main'
import ReportMap from '@/components/report-map/Main'
import ReportPieChart from '@/components/report-pie-chart/Main'
import SimpleLineChart1 from '@/components/simple-line-chart-1/Main'
import classnames from 'classnames'

function Main() {
  const [salesReportFilter, setSalesReportFilter] = useState()
  const importantNotesRef = useRef()
  const prevImportantNotes = () => {
    importantNotesRef.current.tns.goTo('prev')
  }
  const nextImportantNotes = () => {
    importantNotesRef.current.tns.goTo('next')
  }

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
                <div className="report-box zoom-in">
                  <div className="box p-5">
                    <div className="flex">
                      <Lucide icon="Code" className="report-box__icon text-primary" />
                      <div className="ml-auto cursor-pointer">
                        <Tippy
                          tag="div"
                          className="report-box__indicator bg-success shadow-bg"
                          content="33% Higher than last month"
                        >
                          33%
                          <Lucide icon="Plus" className="w-4 h-4 ml-0.5" />
                        </Tippy>
                      </div>
                    </div>
                    <div className="text-3xl font-medium leading-8 mt-6">4</div>
                    <div className="text-base text-slate-500 mt-1">Solana Projects</div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div className="report-box zoom-in">
                  <div className="box p-5">
                    <div className="flex">
                      <Lucide icon="Wallet" className="report-box__icon text-pending" />
                      <div className="ml-auto">
                        <Tippy
                          tag="div"
                          className="report-box__indicator bg-danger cursor-pointer"
                          content="2% Lower than last month"
                        >
                          2%
                          <Lucide icon="ChevronDown" className="w-4 h-4 ml-0.5" />
                        </Tippy>
                      </div>
                    </div>
                    <div className="text-3xl font-medium leading-8 mt-6">3</div>
                    <div className="text-base text-slate-500 mt-1">Accounts</div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div className="report-box zoom-in">
                  <div className="box p-5">
                    <div className="flex">
                      <Lucide icon="Monitor" className="report-box__icon text-warning" />
                      <div className="ml-auto">
                        <Tippy
                          tag="div"
                          className="report-box__indicator bg-success cursor-pointer"
                          content="12% Higher than last month"
                        >
                          12% <Lucide icon="ChevronUp" className="w-4 h-4 ml-0.5" />
                        </Tippy>
                      </div>
                    </div>
                    <div className="text-3xl font-medium leading-8 mt-6">18.1</div>
                    <div className="text-base text-slate-500 mt-1">Sol Version</div>
                  </div>
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 xl:col-span-3 intro-y">
                <div className="report-box zoom-in">
                  <div className="box p-5">
                    <div className="flex">
                      <Lucide icon="User" className="report-box__icon text-success" />
                      <div className="ml-auto">
                        <Tippy
                          tag="div"
                          className="report-box__indicator bg-success cursor-pointer"
                          content="22% Higher than last month"
                        >
                          22% <Lucide icon="ChevronUp" className="w-4 h-4 ml-0.5" />
                        </Tippy>
                      </div>
                    </div>
                    <div className="text-3xl font-medium leading-8 mt-6">52357</div>
                    <div className="text-base text-slate-500 mt-1">Processed Transactions</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* END: General Report */}

          {/* BEGIN: Recent Solana Projects */}
          <div className="col-span-12 mt-6">
            <div className="intro-y block sm:flex items-center h-10">
              <h2 className="text-lg font-medium truncate mr-5">Recent Solana Projects</h2>
              <div className="flex items-center sm:ml-auto mt-3 sm:mt-0">
                <button className="btn box flex items-center text-slate-600 dark:text-slate-300">
                  <Lucide icon="Plus" className="hidden sm:block w-4 h-4 mr-2" />
                  Create Project
                </button>
                <button className="ml-3 btn box flex items-center text-slate-600 dark:text-slate-300">
                  <Lucide icon="Plus" className="hidden sm:block w-4 h-4 mr-2" />
                  Create Account
                </button>
              </div>
            </div>
            <div className="intro-y overflow-auto lg:overflow-visible mt-8 sm:mt-0">
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
                        <div className="text-slate-500 text-xs whitespace-nowrap mt-0.5">
                          V 0.0.1
                        </div>
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
            <div className="w-full">
              <a
                href=""
                className="intro-x w-full block text-center rounded-md py-3 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500"
              >
                View More
              </a>
            </div>
          </div>
          {/* END: Recent Solana Projects */}
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
                {$_.take($f(), 5).map((faker, fakerKey) => (
                  <div key={fakerKey} className="intro-x">
                    <div className="box px-5 py-3 mb-3 flex items-center zoom-in">
                      <div className="ml-4 mr-auto">
                        <div className="font-medium text-xs">
                          GorRLZ1mfhjUyFdd6ntZhimXypux27RBzcSumRUqSLL
                        </div>
                        <div className="text-slate-500 text-xs mt-0.5 flex gap-2">
                          <span className="block">
                            <Lucide icon="Copy" className="text-success" />
                          </span>
                          <span className="block">Account 1</span>
                        </div>
                      </div>
                      <div
                        className={classnames({
                          'text-success': faker.trueFalse[0],
                          'text-danger': !faker.trueFalse[0]
                        })}
                      >
                        2 SOL
                      </div>
                    </div>
                  </div>
                ))}
                <a
                  href=""
                  className="intro-x w-full block text-center rounded-md py-3 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500"
                >
                  View More
                </a>
              </div>
            </div>
            {/* END: Accounts */}
            {/* Blocks */}
            <div className="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12 mt-3 2xl:mt-8">
              <div className="intro-x flex items-center h-10">
                <h2 className="text-lg font-medium truncate mr-5">Recent Blocks</h2>
              </div>
              <div className="mt-5">
                {$_.take($f(), 5).map((faker, fakerKey) => (
                  <div key={fakerKey} className="intro-x">
                    <div className="box px-5 py-3 mb-3 flex items-center zoom-in">
                      {/* <div className="w-10 h-10 flex-none image-fit rounded-full overflow-hidden">
                        <img alt="Midone Tailwind HTML Admin Template" src={faker.photos[0]} />
                      </div> */}
                      <div className="ml-4 mr-auto">
                        <div className="font-medium">#69400</div>
                        <div className="text-slate-500 text-xs mt-0.5">{faker.dates[0]}</div>
                      </div>
                    </div>
                  </div>
                ))}
                <a
                  href=""
                  className="intro-x w-full block text-center rounded-md py-3 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500"
                >
                  View More
                </a>
              </div>
            </div>

            {/* BEGIN: Milestones */}
            <div className="col-span-12 md:col-span-6 xl:col-span-4 2xl:col-span-12 mt-3">
              <div className="intro-x flex items-center h-10">
                <h2 className="text-lg font-medium truncate mr-5">Milestones</h2>
              </div>
              <div className="mt-5">
                {$_.take($f(), 5).map((faker, fakerKey) => (
                  <div key={fakerKey} className="intro-x">
                    <div className="box px-5 py-3 mb-3 flex items-center zoom-in">
                      <div className="flex justify-between w-full">
                        <div className="ml-4 mr-auto">
                          <div className="font-medium">Install Rust</div>
                          <div className="text-slate-500 text-xs mt-0.5">{faker.dates[0]}</div>
                        </div>

                        <div className="border-black">
                          w
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                <a
                  href=""
                  className="intro-x w-full block text-center rounded-md py-3 border border-dotted border-slate-400 dark:border-darkmode-300 text-slate-500"
                >
                  View More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Main
