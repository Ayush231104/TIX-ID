'use client'
import Image from 'next/image';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation'
import { Autoplay, Navigation } from 'swiper/modules'
import MoviesForm from '@/components/admin/MoviesForm';
import { useState} from 'react';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';
import { useGetMoviesListQuery } from '@/lib/features/api/moviesApi';

const Hero = () => {
  const [showForm, setShowForm] = useState(false);

  const { data: movies = [], isLoading } = useGetMoviesListQuery({ limit: 4 });

  return (
    <div className="w-full my-16 mx-auto px-8 sm:px-8 md:px-12 lg:px-16 relative">
      <button
        onClick={() => setShowForm(!showForm)}
        className="hidden bg-royal-blue-default hover:bg-royal-blue-hover active:bg-royal-blue-while-pressed text-white px-4 py-2 rounded mb-4"
      >
        Add Movies
      </button>

      {showForm && <MoviesForm />}
      {isLoading ? (
        <div className="flex gap-6 overflow-hidden w-full">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-4 w-full">
              <Skeleton w="w-full" h="h-140" rounded="rounded-2xl" />

              <Skeleton w="w-40" h="h-6" />

              <div className="flex gap-2">
                <Skeleton w="w-12" h="h-5" />
                <Skeleton w="w-12" h="h-5" />
                <Skeleton w="w-16" h="h-5" />
              </div>
            </div>
          ))}
        </div>
      ) : movies.length === 0 ? (
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-500 text-lg">No movies found</p>
        </div>
      ) : (
        <div className='w-full mx-auto sm:px-12 lg:px-24'>
          <div className="flex custom-prev absolute left-2 sm:left-15 top-1/2 z-20 -translate-y-1/2 cursor-pointer bg-white text-black w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 items-center justify-center rounded-full transition shadow-md">
            <FaChevronLeft size={18} />
          </div>

          <div className="flex custom-next absolute right-2 sm:right-15 top-1/2 z-20 -translate-y-1/2 cursor-pointer bg-white text-black w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 items-center justify-center rounded-full transition shadow-md">
            <FaChevronRight size={18} />
          </div>

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
            {movies.map((movie) => (
              <SwiperSlide key={movie.id} >
                <Link href={`/booking/${movie.id}`}>
                  <div className='flex flex-col items-center gap-2 md:gap-4'>
                    <div className='w-full'>
                      <div className='relative w-full rounded-2xl'>
                        <Image
                          className='aspect-3/4 rounded-2xl w-full'
                          src={movie.movie_img ?? '/placeholder.jpg'}
                          alt={movie.name ?? 'Movie'}
                          width={400}
                          height={300}
                        />
                      </div>
                    </div>
                    <div className='text-center text-xl md:text-2xl lg:text-4xl sm:font-medium md:font-bold'>
                      {movie.name}
                    </div>
                    <div className='flex gap-3'>
                      <button className='bg-linear-to-r from-xxi-gold to-xxi-gold-dark text-white rounded-[5px] py-1 px-3 text-xs'>XXI</button>
                      <button className='bg-cgv-red text-white rounded-[5px] py-1 px-3 text-xs'>CGV</button>
                      <button className='bg-cinepolis-blue text-white rounded-[5px] py-1 px-3 text-xs'>CINÉPOLIS</button>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default Hero;
