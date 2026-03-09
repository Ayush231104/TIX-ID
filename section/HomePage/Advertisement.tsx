'use client'
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import { Swiper, SwiperSlide } from 'swiper/react';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/scrollbar';
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const advertismentsImg = [
    "/images/homepage/Ads 1.png",
    "/images/homepage/Ads 2.png",
    "/images/homepage/Ads 3.png"
]


const Advertisement = () => {
    return (
        <div className='relative w-full px-4 sm:px-8 mt-16'>
            <div className="custom-prev1 absolute left-8 top-1/2  z-10 -translate-y-1/2 cursor-pointer bg-white text-black size-8 sm:size-14  md:size-16 flex items-center justify-center rounded-full transition shadow-md shadow-gray-300">
                <FaChevronLeft size={20} />
            </div>

            <div className="custom-next1 absolute right-8 top-1/2 z-10 -translate-y-1/2 cursor-pointer bg-white text-black size-8 sm:size-14  md:size-16 flex items-center justify-center rounded-full  transition shadow-md shadow-gray-300">
                <FaChevronRight size={20} />
            </div>
            <Swiper
                // install Swiper modules
                modules={[Navigation, Autoplay, Pagination]}
                spaceBetween={50}
                slidesPerView={1}
                navigation={{
                    nextEl: '.custom-next1',
                    prevEl: '.custom-prev1',
                }}
                pagination={{ clickable: true }}
                loop={true}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false
                }}
            >
                {advertismentsImg.map((img, index) => {
                    return <SwiperSlide key={index}>
                        <div className='relative w-full px-8 '>
                            <Image
                                src={img}
                                width={1296}
                                height={300}
                                className='w-full object-cover'
                                alt="Advertisements"
                            />
                        </div>
                    </SwiperSlide>
                })}
            </Swiper>
        </div>
    )
}

export default Advertisement
