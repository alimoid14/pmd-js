import React from 'react'
import Navbar from './components/layout/Navbar'
import { Outlet } from 'react-router-dom'

function Layout() {
  return (
    <div>
      <Navbar />
      <main className='mt-11 min-h-[calc(100vh-44px)] '>
          <Outlet />
      </main>
    </div>
  )
}

export default Layout
