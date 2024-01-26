import { BrowserRouter } from 'react-router-dom'
import React from 'react'
import RecoilNexus from "recoil-nexus";
import { RecoilRoot } from 'recoil'
import Router from './router'
import ScrollToTop from '@/base-components/scroll-to-top/Main'
function App() {
  return (
    <RecoilRoot>
      <RecoilNexus />
      <React.Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <Router />
          <ScrollToTop />
        </BrowserRouter>
      </React.Suspense>
    </RecoilRoot>
  )
}

export default App
