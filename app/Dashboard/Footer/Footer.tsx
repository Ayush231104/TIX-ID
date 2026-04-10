import Typography from '@/components/ui/Typography'
import Image from 'next/image'
import Link from 'next/link'
import { FaApple, FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa'
import { FaGooglePlay } from 'react-icons/fa6'

export default function Footer() {
  return (
    <div className='mt-8'>
      <hr className='border-shade-300 mb-10' />
      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 md:gap-6 px-8 sm:px-16 mb-8 sm:mb-18 mx-auto'>
        <Link href="/" className='col-span-1'>
          <Image
            src="/images/homepage/logo.png"
            alt="TIX ID"
            width={120}
            height={40}
            loading='lazy'
          />
        </Link>
        <div className='lg:col-span-3 grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8 '>
          <div className='flex flex-col lg:gap-4 mt-6 sm:mt-0'>
            <Typography variant='h4' color='shade-900' className='mb-3 md:mb-0'>Company</Typography>
            <Typography color='shade-900'>Contact Us</Typography>
            <Typography color='shade-900'>About Us</Typography>
            <Typography color='shade-900'>Partners</Typography>
          </div>
          <div className='flex flex-col lg:gap-4'>
            <Typography variant='h4' className='text-lg font-medium text-shade-900 mb-3 md:mb-0'>About</Typography>
            <Link href='/about'><Typography color='shade-900'>TIX ID News</Typography></Link>
            <Link href='/movies'><Typography color='shade-900'>Cinema</Typography></Link>
            <Link href='/tickets'><Typography color='shade-900'>My Ticket</Typography></Link>
            <Typography color='shade-900'>Payment</Typography>
            <Typography color='shade-900'>Instalment</Typography>
          </div>
          <div className='flex flex-col lg:gap-4'>
            <Typography variant='h4' className='text-lg font-medium text-shade-900 mb-3 md:mb-0'>Support</Typography>
            <Typography color='shade-900'>Help Center</Typography>
            <Typography color='shade-900'>Privacy Policy</Typography>
            <Typography color='shade-900'>FAQ</Typography>
            <Typography color='shade-900'>Terms and Conditions</Typography>
            <Typography color='shade-900'>Covid-19 Updates</Typography>
          </div>
        </div>
        <div className='lg:col-span-2 lg:pl-20 mt-6 sm:mt-0'>
          <div>
            <Typography variant='h4' color='shade-900' className='mb-2 sm:mb-6'>Follow Social Media</Typography>
            <div className='flex gap-6 mb-5 sm:mb-10.5'>
              <FaInstagram size={24} />
              <FaTwitter size={24} />
              <FaFacebook size={24} />
            </div>
            <div>
              <Typography variant='h4' color='shade-900'>Download the TIX ID Application</Typography>
              <div className='flex flex-col sm:flex-row gap-2 sm:gap-5 my-2 sm:my-6'>
                <Image src="/images/homepage/googleplay.png" alt="googleplay" width={110} height={33} loading='lazy' />
                <Image src="/images/homepage/appstore.png" alt="appstore" width={110} height={33} loading='lazy' />
              </div>
            </div>
            <Typography variant="body-small" color='shade-600' className='mt-9'>© 2026 TIX ID. All rights reserved.</Typography>
          </div>
        </div>
      </div>
    </div>
  )
}
