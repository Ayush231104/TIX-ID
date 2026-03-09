'use client'
import Footer from '@/app/Dashboard/Footer/Footer'
import Navbar from '@/app/Dashboard/Navbar/Navbar'
import { usePathname } from 'next/navigation'
import React from 'react'

export default function GlobalLayout({children}: {children: React.ReactNode}) {
  const pathName = usePathname();

  const isAuthPage = pathName === '/login' || pathName === '/signup' || pathName === '/forgotPassword' || pathName === '/resetPassword';
  
  return (
    <div>
    {!isAuthPage && <Navbar/>}
    {children}
    {!isAuthPage && <Footer/>}
    </div>
  )
}
