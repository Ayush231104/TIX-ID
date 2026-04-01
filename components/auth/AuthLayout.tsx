// components/auth/AuthLayout.tsx
'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { GoArrowLeft } from 'react-icons/go';
import React from 'react';
import Typography from '../ui/Typography';

interface AuthLayoutProps {
  children: React.ReactNode;
  bgImage: string;
  bgAlt?: string;
}

export default function AuthLayout({ children, bgImage, bgAlt = "Background" }: AuthLayoutProps) {
  const router = useRouter();

  return (
    <div className="relative w-full min-h-screen bg-black">
      
      <div className="absolute inset-0 z-0">
        <Image
          src={bgImage}
          alt={bgAlt}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="relative z-10 w-full max-w-400 mx-auto flex justify-center md:justify-end px-4 md:px-16 lg:px-30 py-12">
        
        <button
          onClick={() => router.back()}
          className="absolute top-12 left-4 md:left-16 lg:left-30 hidden lg:flex items-center gap-4 text-white cursor-pointer hover:opacity-80 transition-opacity"
        >
          <GoArrowLeft className="text-xl lg:text-2xl" />
          <Typography variant="h3" color="white" className='font-bold' >Return</Typography>
        </button>

        <div className="w-full md:w-164 bg-white shadow-2xl relative rounded-sm">
          
          <button
            onClick={() => router.back()}
            className="flex lg:hidden items-center gap-3 text-shade-900 cursor-pointer hover:opacity-80 transition-opacity p-8 pb-0"
          >
            <GoArrowLeft className="text-xl lg:text-2xl" />
            <Typography variant="h3" color='shade-900'>Return</Typography>
          </button>

          {children}
        </div>
      </div>
    </div>
  );
}