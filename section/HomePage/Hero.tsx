'use client'
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation'
import { Autoplay, Navigation } from 'swiper/modules'
import MoviesForm from '@/components/admin/MoviesForm';
import { useState } from 'react';

const movies = [
  {
    title: "Spider-Man: No Way Home",
    image: "/images/homepage/Spiderman_ No Way Home.png",
  },
  {
    title: "Yowis Ben",
    image: "/images/homepage/Yowis Ben.png",
  },
  {
    title: "Avatar",
    image: "/images/homepage/House of Gucci.png",
  },
  {
    title: "Batman",
    image: "/images/homepage/Ghostbusters Afterlife.png",
  },
]

const Hero = () => {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="w-full my-16 mx-auto px-8 sm:px-8 md:px-12 lg:px-16 relative">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-royal-blue-default hover:bg-royal-blue-hover active:bg-royal-blue-while-pressed text-white px-4 py-2 rounded mb-4"
      >
        Add Movies
      </button>
      {showForm && <MoviesForm/>}
      <div className='w-full mx-auto sm:px-12 lg:px-24'>
        <div className="flex custom-prev absolute left-2 sm:left-15  top-1/2  z-20 -translate-y-1/2 cursor-pointer bg-white text-black w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 items-center justify-center rounded-full transition shadow-md ">
          <FaChevronLeft size={18} />
        </div>

        <div className="flex custom-next absolute right-2 sm:right-15 top-1/2 z-20 -translate-y-1/2 cursor-pointer bg-white text-black w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 items-center justify-center rounded-full  transition shadow-md">
          <FaChevronRight size={18} />

        </div>
        <div className=''>
          <Swiper
            modules={[Navigation, Autoplay]}
            navigation={{
              nextEl: '.custom-next',
              prevEl: '.custom-prev',
            }}
            spaceBetween={83}
            loop={true}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false
            }}
            breakpoints={{
              0: { slidesPerView: 1, spaceBetween: 16 },
              640: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 2, spaceBetween: 83 },
            }}
          >

            {movies.map((movie, index) => {
              return <SwiperSlide key={index}>
                <div className='flex flex-col items-center gap-2 md:gap-4'>
                  <div className='w-full '>
                    <div className='relative w-full rounded-2xl'>
                      <Image
                        className='aspect-3/4 rounded-2xl w-full'
                        src={movie.image}
                        alt={movie.title}
                        width={400}
                        height={300}
                      />
                    </div>
                  </div>
                  <div className='text-center text-xl md:text-2xl lg:text-4xl  sm:font-medium  md:font-bold'>{movie.title}</div>
                  <div className='flex gap-3'>
                    <button className='bg-linear-to-r from-xxi-gold to-xxi-gold-dark text-white rounded-[5px] py-1 px-3 text-xs'>XXI</button>
                    <button className='bg-cgv-red text-white rounded-[5px] py-1 px-3 text-xs'>CGV</button>
                    <button className='bg-cinepolis-blue text-white rounded-[5px] py-1 px-3 text-xs'>CINÉPOLIS</button>
                  </div>
                </div>
              </SwiperSlide>
            })}
          </Swiper>
        </div>
      </div>

    </div>
  )
}

export default Hero
