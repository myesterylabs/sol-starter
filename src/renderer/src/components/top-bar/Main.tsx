import * as $_ from 'lodash'

import {
  Dropdown,
  DropdownContent,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Lucide
} from '@/base-components'
import React, { useEffect, useState } from 'react'

function Main() {
  const [json_rpc_url, setJsonRpcUrl] = useState(null as null | string)

  const handleRadioChange = (e) => {
    window.api.setNetwork(e.target.value)
    setJsonRpcUrl(e.target.value)
  }
  useEffect(() => {
    window.api.fetchSavedStore().then((val) => {
      setJsonRpcUrl(val.json_rpc_url)
    })
    console.log('fetching saved store')
    return () => {}
  }, [])

  return (
    <>
      {/* BEGIN: Top Bar */}
      <div className="top-bar">
        {/* BEGIN: Breadcrumb */}
        <nav aria-label="breadcrumb" className="-intro-x mr-auto hidden sm:flex">
          {/* helo */}
        </nav>
        {/* {React.useMemo(
          () => (
            <> */}
        <Dropdown className="intro-x w-8 h-8">
          <DropdownToggle
            tag="div"
            role="button"
            className="w-8 h-8 rounded-full overflow-hidden shadow-lg image-fit zoom-in"
          >
            {/* rounded M for mainnet, D for devnet and L for localhost */}
            <div className="rounded-full bg-primary text-white flex items-center justify-center font-medium text-lg w-full h-full">
              {json_rpc_url &&
                (json_rpc_url.startsWith('http') || json_rpc_url.startsWith('l')
                  ? 'L'
                  : json_rpc_url.includes('mainnet')
                    ? 'M'
                    : json_rpc_url.includes('devnet')
                      ? 'D'
                      : 'T')}
            </div>
          </DropdownToggle>
          <DropdownMenu className="w-56">
            <DropdownContent className="bg-primary text-white">
              <DropdownHeader tag="div" className="!font-normal">
                <div className="font-medium">Switch Network</div>
                <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                  Using{' '}
                  {json_rpc_url?.includes('mainnet')
                    ? 'Mainnet'
                    : json_rpc_url?.includes('devnet')
                      ? 'Devnet'
                      : json_rpc_url?.includes('testnet')
                        ? 'Testnet'
                        : 'Localhost'}
                </div>
              </DropdownHeader>

              <DropdownItem className="hover:bg-white/5">
                <div className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="vertical_radio_button"
                    value="localhost"
                    onChange={handleRadioChange}
                    defaultChecked={json_rpc_url?.startsWith('http')}
                  />
                  <label className="form-check-label" htmlFor="radio-switch-1">
                    Localhost
                  </label>
                </div>
              </DropdownItem>

              <DropdownDivider className="border-white/[0.08]" />
              <DropdownItem className="hover:bg-white/5">
                <div className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="vertical_radio_button"
                    value="mainnet-beta"
                    onChange={handleRadioChange}
                    defaultChecked={json_rpc_url?.includes('mainnet')}
                  />
                  <label className="form-check-label" htmlFor="radio-switch-1">
                    Mainnet
                  </label>
                </div>
              </DropdownItem>

              <DropdownItem className="hover:bg-white/5">
                <div className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="vertical_radio_button"
                    value="devnet"
                    onChange={handleRadioChange}
                    defaultChecked={json_rpc_url?.includes('devnet')}
                  />
                  <label className="form-check-label" htmlFor="radio-switch-1">
                    Devnet
                  </label>
                </div>
              </DropdownItem>

              <DropdownItem className="hover:bg-white/5">
                <div className="form-check mt-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="vertical_radio_button"
                    value="testnet"
                    onChange={handleRadioChange}
                    defaultChecked={json_rpc_url?.includes('testnet')}
                  />
                  <label className="form-check-label" htmlFor="radio-switch-1">
                    Testnet
                  </label>
                </div>
              </DropdownItem>
            </DropdownContent>
          </DropdownMenu>
        </Dropdown>
        {/* </>
          ),
          [json_rpc_url]
        )} */}
      </div>
      {/* END: Top Bar */}
    </>
  )
}

export default Main
