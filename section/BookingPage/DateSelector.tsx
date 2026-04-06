'use client'

import { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, FreeMode } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/free-mode'
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa6'

const generateDates = () =>
  Array.from({ length: 8 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() + i)
    return date
  })

const getDayName = (date: Date) =>
  date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()

const getMonthName = (date: Date) =>
  date.toLocaleDateString('en-US', { month: 'short' })

const getDateNumber = (date: Date) => date.getDate()

export default function DateSelector({
  onDateSelect,
}: {
  onDateSelect: (date: Date) => void
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const dates = generateDates()

  const handleSelect = (date: Date, index: number) => {
    if (index >= 5) return 
    setSelectedIndex(index)
    onDateSelect(date)
  }

  return (
    <div className='w-full max-w-145 overflow-hidden mt-4 sm:mt-6 relative px-8'>
      <Swiper
        modules={[Navigation, FreeMode]}
        navigation={{
          prevEl: '.swiper-prev',
          nextEl: '.swiper-next',
        }}
        slidesPerView={'auto'} 
        spaceBetween={20}
        freeMode={true}
        allowTouchMove={true}
        className='mySwiper static!'
      >
        <button
          className='swiper-prev absolute left-0 top-1/2 -translate-y-1/2 z-10
            w-7 h-7 flex items-center justify-center
            rounded-lg bg-white
            hover:bg-shade-200 transition-all cursor-pointer'
        >
          <FaChevronLeft size={20} />
        </button>

        {dates.map((date, index) => {
          const isDisabled = index >= 5
          const isSelected = selectedIndex === index

          return (
            <SwiperSlide key={index} className='w-auto!'>
              <button
                onClick={() => handleSelect(date, index)}
                disabled={isDisabled}
                className={`
                  w-18 sm:w-21.5 h-18 sm:h-20.5 flex flex-col items-center justify-center
                  py-3 px-2 rounded-xl transition-all border
                  ${isSelected
                    ? 'bg-royal-blue border-royal-blue text-white'
                    : isDisabled
                      ? 'bg-shade-200 border-shade-200 text-shade-400 cursor-not-allowed'
                      : 'bg-white border-shade-600 text-shade-900 hover:bg-royal-blue-hover hover:text-white hover:border-royal-blue-hover active:bg-royal-blue-while-pressed active:text-white   cursor-pointer'
                  }
                `}
              >
                <span className='text-[16px] font-medium text-shade-500'>
                  {getDateNumber(date)} {getMonthName(date)}
                </span>
                <span className='text-[20px] font-bold mt-0.5'>
                  {getDayName(date)}
                </span>
              </button>
            </SwiperSlide>
          )
        })}

        {/* Next Arrow */}
        <button
          className='swiper-next absolute right-0 top-1/2 -translate-y-1/2 z-10
            w-7 h-7 flex items-center justify-center
            rounded-lg bg-white
            hover:bg-shade-200 transition-all cursor-pointer'
        >
          <FaChevronRight size={20}/>
        </button>
      </Swiper>
    </div>
  )
}