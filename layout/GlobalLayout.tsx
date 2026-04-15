'use client'
import Footer from '@/app/Dashboard/Footer/Footer'
import Navbar from '@/app/Dashboard/Navbar/Navbar'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  const isAuthPage = pathName === '/login' || pathName === '/signup' || pathName === '/forgotPassword' || pathName === '/resetPassword';
  const isAdminPage = pathName.startsWith('/admin');
  const hideGlobalChrome = isAuthPage || isAdminPage;

  return (
    <div className={`min-h-screen flex flex-col w-full ${!hideGlobalChrome ? 'max-w-400 mx-auto' : ''}`}>
      {!hideGlobalChrome && <Navbar />}
      <div className='grow'>
        {children}
      </div>
      <div>
        {!hideGlobalChrome && <Footer />}
      </div>
    </div>
  )
}
