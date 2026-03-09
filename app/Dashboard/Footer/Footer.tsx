import Image from 'next/image'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'

export default function Footer() {
  return (
    <div className='mt-8'>
      <hr className='border-shade-300 mb-10' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 md:gap-6 px-16 mb-18 mx-auto'>
        <div className='col-span-1'>
          <Image
            src="/images/homepage/logo.png"
            alt="TIX ID"
            width={120}
            height={40} 
          />
        </div>
        <div className='lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 '>
          <div className='flex flex-col gap-2 lg:gap-4'>
            <h1 className='text-lg font-medium text-shade-900'>Company</h1>
            <p className='text-[16px] font-normal text-shade-900'>Contact Us</p>
            <p className='text-[16px] font-normal text-shade-900'>About Us</p>
            <p className='text-[16px] font-normal text-shade-900'>Partners</p>
          </div>
          <div className='flex flex-col gap-2 lg:gap-4'>
            <h1 className='text-lg font-medium text-shade-900'>About</h1>
            <p className='text-[16px] font-normal text-shade-900'>TIX ID News</p>
            <p className='text-[16px] font-normal text-shade-900'>Cinema</p>
            <p className='text-[16px] font-normal text-shade-900'>My Ticket</p>
            <p className='text-[16px] font-normal text-shade-900'>Payment</p>
            <p className='text-[16px] font-normal text-shade-900'>Instalment</p>
          </div>
          <div className='flex flex-col gap-2 lg:gap-4'>
            <h1 className='text-lg font-medium text-shade-900'>Support</h1>
            <p className='text-[16px] font-normal text-shade-900'>Help Center</p>
            <p className='text-[16px] font-normal text-shade-900'>Privacy Policy</p>
            <p className='text-[16px] font-normal text-shade-900'>FAQ</p>
            <p className='text-[16px] font-normal text-shade-900'>Terms and Conditions</p>
            <p className='text-[16px] font-normal text-shade-900'>Covid-19 Updates</p>
          </div>
        </div>
        <div className='lg:col-span-2 lg:pl-20'>
          <div>
            <h1 className='text-lg font-medium mb-4 text-shade-900'>Follow Social Media</h1>
            <div className='flex gap-6 mb-4'>
              <FaInstagram size={24} />
              <FaTwitter size={24} />
              <FaFacebook size={24} />
            </div>
            <div className=' mt-8'>
              <h1 className='text-lg font-medium text-shade-900'>Download the TIX ID Application</h1>
              <div className='flex flex-col sm:flex-row gap-5 my-6'>
                <Image src="/images/homepage/googleplay.png" alt="googleplay" width={110} height={33} />
                <Image src="/images/homepage/appstore.png" alt="appstore" width={110} height={33} />
              </div>
            </div>
            <div className='text-[12px] font-normal text-shade-900'>2021 TIX ID - PT Nusantara Elang Sejahtera.</div>
          </div>
        </div>
      </div>
    </div>
  )
}
