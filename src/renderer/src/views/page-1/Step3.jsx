import * as $_ from "lodash";

import {
  Lucide,
  Tab,
  TabGroup,
  TabList,
  TabPanel,
  TabPanels,
  TinySlider,
  Tippy,
} from "@/base-components";

import React from "react";

export function Step3({ solanaInstalled }) {
  return (
    <>
      <div className='px-5 mt-10'>
        <div className='font-medium text-center text-lg'>
          Solana Installation
        </div>
        <div className='text-slate-500 text-center mt-2'>
          {solanaInstalled
            ? "A valid installation of solana was found"
            : "No Solana installation was found. Please follow the instructions below to install Solana."}
        </div>
      </div>
      {!solanaInstalled ? (
        <div className='px-5 sm:px-20 mt-10 pt-10 border-t border-slate-200/60 dark:border-darkmode-400'>
          <div className='font-medium text-base'>Profile Settings</div>
          <div className='grid grid-cols-12 gap-4 gap-y-5 mt-5'>
            <div className='intro-y col-span-12 sm:col-span-6'>
              <label htmlFor='input-wizard-1' className='form-label'>
                From
              </label>
              <input
                id='input-wizard-1'
                type='text'
                className='form-control'
                placeholder='example@gmail.com'
              />
            </div>
            <div className='intro-y col-span-12 sm:col-span-6'>
              <label htmlFor='input-wizard-2' className='form-label'>
                To
              </label>
              <input
                id='input-wizard-2'
                type='text'
                className='form-control'
                placeholder='example@gmail.com'
              />
            </div>
            <div className='intro-y col-span-12 sm:col-span-6'>
              <label htmlFor='input-wizard-3' className='form-label'>
                Subject
              </label>
              <input
                id='input-wizard-3'
                type='text'
                className='form-control'
                placeholder='Important Meeting'
              />
            </div>
            <div className='intro-y col-span-12 sm:col-span-6'>
              <label htmlFor='input-wizard-4' className='form-label'>
                Has the Words
              </label>
              <input
                id='input-wizard-4'
                type='text'
                className='form-control'
                placeholder='Job, Work, Documentation'
              />
            </div>
            <div className='intro-y col-span-12 sm:col-span-6'>
              <label htmlFor='input-wizard-5' className='form-label'>
                Doesn't Have
              </label>
              <input
                id='input-wizard-5'
                type='text'
                className='form-control'
                placeholder='Job, Work, Documentation'
              />
            </div>
            <div className='intro-y col-span-12 sm:col-span-6'>
              <label htmlFor='input-wizard-6' className='form-label'>
                Size
              </label>
              <select id='input-wizard-6' className='form-select'>
                <option>10</option>
                <option>25</option>
                <option>35</option>
                <option>50</option>
              </select>
            </div>
          </div>
        </div>
      ) : (
        <div className='report-box-2 intro-y mt-5'>
          <div className='box grid grid-cols-12'>
            <div className='col-span-12 lg:col-span-4 px-8 py-12 flex flex-col justify-center'>
              <Lucide icon='PieChart' className='w-10 h-10 text-pending' />
              <div className='justify-start flex items-center text-slate-600 dark:text-slate-300 mt-12'>
                My Total Assets
                <Lucide
                  icon='AlertCircle'
                  className='tooltip w-4 h-4 ml-1.5'
                  title='Total value of your sales: $158.409.416'
                />
              </div>
              <div className='flex items-center justify-start mt-4'>
                <div className='relative text-2xl font-medium pl-3 ml-0.5'>
                  <span className='absolute text-xl font-medium top-0 left-0 -ml-0.5'>
                    $
                  </span>
                  1,413,102.02
                </div>
                <a className='text-slate-500 ml-4' href=''>
                  <Lucide icon='RefreshCcw' className='w-4 h-4' />
                </a>
              </div>
              <div className='mt-4 text-slate-500 text-xs'>
                Last updated 1 hour ago
              </div>
              <button className='btn btn-outline-secondary relative justify-start rounded-full mt-12'>
                Download Reports
                <span className='w-8 h-8 absolute flex justify-center items-center bg-primary text-white rounded-full right-0 top-0 bottom-0 my-auto ml-auto mr-0.5'>
                  <Lucide icon='ArrowRight' className='w-4 h-4' />
                </span>
              </button>
            </div>
            <div className='col-span-12 lg:col-span-8 p-8 border-t lg:border-t-0 lg:border-l border-slate-200 dark:border-darkmode-300 border-dashed'>
              <TabGroup>
                <TabList
                  className='nav-pills w-60 border border-slate-300 dark:border-darkmode-300 border-dashed rounded-md mx-auto p-1 mb-8'
                  role='tablist'>
                  <Tab className='w-full py-1.5 px-2' tag='button'>
                    Weekly
                  </Tab>
                  <Tab className='w-full py-1.5 px-2' tag='button'>
                    Monthly
                  </Tab>
                </TabList>
                <TabPanels className='px-5 pb-5'>
                  <TabPanel className='grid grid-cols-12 gap-y-8 gap-x-10'>
                    <div className='col-span-6 sm:col-span-6 md:col-span-4'>
                      <div className='text-slate-500'>Unpaid Loan</div>
                      <div className='mt-1.5 flex items-center'>
                        <div className='text-base'>4.501</div>
                        <div
                          className='text-danger flex text-xs font-medium tooltip cursor-pointer ml-2'
                          title='2% Lower than last month'>
                          2%
                          <Lucide
                            icon='ChevronDown'
                            className='w-4 h-4 ml-0.5'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='col-span-12 sm:col-span-6 md:col-span-4'>
                      <div className='text-slate-500'>Active Partner</div>
                      <div className='mt-1.5 flex items-center'>
                        <div className='text-base'>2</div>
                      </div>
                    </div>
                    <div className='col-span-12 sm:col-span-6 md:col-span-4'>
                      <div className='text-slate-500'>Paid Installment</div>
                      <div className='mt-1.5 flex items-center'>
                        <div className='text-base'>$72.000</div>
                      </div>
                    </div>
                    <div className='col-span-12 sm:col-span-6 md:col-span-4'>
                      <div className='text-slate-500'>Disbursement</div>
                      <div className='mt-1.5 flex items-center'>
                        <div className='text-base'>$54.000</div>
                      </div>
                    </div>
                    <div className='col-span-12 sm:col-span-6 md:col-span-4'>
                      <div className='text-slate-500'>Success Payment</div>
                      <div className='mt-1.5 flex items-center'>
                        <div className='text-base'>2.500</div>
                        <div
                          className='text-success flex text-xs font-medium tooltip cursor-pointer ml-2'
                          title='52% Higher than last month'>
                          52%
                          <Lucide icon='ChevronUp' className='w-4 h-4 ml-0.5' />
                        </div>
                      </div>
                    </div>
                    <div className='col-span-12 sm:col-span-6 md:col-span-4'>
                      <div className='text-slate-500'>Unpaid Loan</div>
                      <div className='mt-1.5 flex items-center'>
                        <div className='text-base'>$72.000</div>
                      </div>
                    </div>
                    <div className='col-span-12 sm:col-span-6 md:col-span-4'>
                      <div className='text-slate-500'>Posted Campaign</div>
                      <div className='mt-1.5 flex items-center'>
                        <div className='text-base'>4.501</div>
                      </div>
                    </div>
                    <div className='col-span-12 sm:col-span-6 md:col-span-4'>
                      <div className='text-slate-500'>Social Media</div>
                      <div className='mt-1.5 flex items-center'>
                        <div className='text-base'>2</div>
                      </div>
                    </div>
                    <div className='col-span-12 sm:col-span-6 md:col-span-4'>
                      <div className='text-slate-500'>Net Margin</div>
                      <div className='mt-1.5 flex items-center'>
                        <div className='text-base'>$72.000</div>
                        <div
                          className='text-success flex text-xs font-medium tooltip cursor-pointer ml-2'
                          title='49% Higher than last month'>
                          49%
                          <Lucide icon='ChevronUp' className='w-4 h-4 ml-0.5' />
                        </div>
                      </div>
                    </div>
                  </TabPanel>
                </TabPanels>
              </TabGroup>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Step3;
