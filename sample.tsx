'use client'
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Autoplay, Navigation } from 'swiper/modules';

const movies = [
  { title: "Spider-Man: No Way Home", image: "/images/homepage/Spiderman_ No Way Home.png" },
  { title: "Yowis Ben", image: "/images/homepage/Yowis Ben.png" },
  { title: "Avatar", image: "/images/homepage/House of Gucci.png" },
  { title: "Batman", image: "/images/homepage/Ghostbusters Afterlife.png" },
];

const Hero = () => {
  return (
    <div className="w-full max-w-6xl mx-auto py-10 px-4 sm:px-8 lg:px-16 relative">
      {/* Prev / Next - hide on smallest screens so they don't overflow */}
      <div className="hidden sm:flex custom-prev absolute left-0 md:-left-20 top-1/2 z-20 -translate-y-1/2 cursor-pointer bg-white text-black w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 items-center justify-center rounded-full shadow-md">
        <FaChevronLeft size={18} />
      </div>

      <div className="hidden sm:flex custom-next absolute right-0 md:-right-20 top-1/2 z-20 -translate-y-1/2 cursor-pointer bg-white text-black w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 items-center justify-center rounded-full shadow-md">
        <FaChevronRight size={18} />
      </div>

      <Swiper
        modules={[Navigation, Autoplay]}
        navigation={{ nextEl: '.custom-next', prevEl: '.custom-prev' }}
        spaceBetween={24}
        loop={true}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        breakpoints={{
          0: { slidesPerView: 1, spaceBetween: 16 },
          640: { slidesPerView: 2, spaceBetween: 20 },
          1024: { slidesPerView: 3, spaceBetween: 30 },
        }}
      >
        {movies.map((movie, index) => (
          <SwiperSlide key={index}>
            <div className="flex flex-col items-center gap-4">
              <div className="w-full max-w-[320px] sm:max-w-[380px] lg:max-w-[420px]">
                <div className="relative w-full h-[0] pb-[133%] rounded-2xl overflow-hidden"> 
                  {/* pb 133% approximates aspect ~3/4; you can adjust */}
                  <Image
                    src={movie.image}
                    alt={movie.title}
                    fill
                    sizes="(max-width: 640px) 320px, (max-width: 1024px) 380px, 420px"
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="text-lg sm:text-2xl lg:text-3xl font-semibold text-shade-900 text-center">
                {movie.title}
              </div>

              <div className="flex gap-3">
                <button className="px-3 py-1 text-xs rounded bg-gradient-to-r from-xxi-gold to-xxi-gold-dark text-white">XXI</button>
                <button className="px-3 py-1 text-xs rounded bg-cgv-red text-white">CGV</button>
                <button className="px-3 py-1 text-xs rounded bg-cinepolis-blue text-white">CINÉPOLIS</button>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Hero;