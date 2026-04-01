'use client'
import Footer from '@/app/Dashboard/Footer/Footer'
import Navbar from '@/app/Dashboard/Navbar/Navbar'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function GlobalLayout({ children }: { children: React.ReactNode }) {
  const pathName = usePathname();

  const isAuthPage = pathName === '/login' || pathName === '/signup' || pathName === '/forgotPassword' || pathName === '/resetPassword';

  return (
    <div className={`min-h-screen flex flex-col w-full ${!isAuthPage ? 'max-w-400 mx-auto' : ''}`}>
      <div>
        {!isAuthPage && <Navbar />}
      </div>
      <div className='grow'>
        {children}
      </div>
      <div>
        {!isAuthPage && <Footer />}
      </div>
    </div>
  )
}
