// 'use client'

// import { useState, useMemo } from 'react'
// import type { Movie, ShowtimeWithTheaterAndScreen, GroupedShowtime } from '@/types/index'
// import ShowDetails from '@/section/BookingPage/ShowDetails'
// import Bookshow from '@/section/BookingPage/Bookshow'

// interface Props {
//   movie: Movie
//   showtimes: ShowtimeWithTheaterAndScreen[]
// }

// export default function BookingPage({ movie, showtimes }: Props) {

//   // get unique dates from showtimes
//   const dates = useMemo(() => {
//     return [...new Set(
//       showtimes.map((s) => new Date(s.show_time).toDateString())
//     )]
//   }, [showtimes])

//   const [selectedDate, setSelectedDate] = useState<string>(dates[0] ?? '')
//   const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeWithTheaterAndScreen | null>(null)

//   // filter showtimes by selected date
//   const filteredShowtimes = useMemo(() => {
//     return showtimes.filter((s) =>
//       new Date(s.show_time).toDateString() === selectedDate
//     )
//   }, [showtimes, selectedDate])

//   // group by theater
//   const groupedByTheater = useMemo(() => {
//     return Object.values(
//       filteredShowtimes.reduce((acc: Record<string, GroupedShowtime>, showtime) => {
//         const theaterId = showtime.theater?.id
//         if (!theaterId) return acc
//         if (!acc[theaterId]) {
//           acc[theaterId] = {
//             theater: showtime.theater,
//             showtimes: []
//           }
//         }
//         acc[theaterId].showtimes.push(showtime)
//         return acc
//       }, {})
//     )
//   }, [filteredShowtimes])

//   return (
//     <div className='w-full px-8 md:px-16 py-10'>
//       <div className='flex flex-col lg:flex-row gap-10'>
//         {/* Left - Timetable */}
//         <div className='w-full lg:w-2/3'>
//           <Bookshow
//             movie={movie}
//             dates={dates}
//             selectedDate={selectedDate}
//             onDateSelect={(date) => {
//               setSelectedDate(date)
//               setSelectedShowtime(null)
//             }}
//             groupedByTheater={groupedByTheater}
//             selectedShowtime={selectedShowtime}
//             onShowtimeSelect={setSelectedShowtime}
//           />
//         </div>

//         {/* Right - Movie Details + Selected Showtime */}
//         <div className='w-full lg:w-1/3'>
//           <ShowDetails
//             movie={movie}
//             selectedShowtime={selectedShowtime}
//           />
//         </div>
//       </div>
//     </div>
//   )
// }

// import Image from 'next/image'
// import Link from 'next/link'
// import type { Movie, ShowtimeWithTheaterAndScreen } from '@/types/index'

// interface Props {
//   movie: Movie
//   selectedShowtime: ShowtimeWithTheaterAndScreen | null
// }

// export default function ShowDetails({ movie, selectedShowtime }: Props) {
//   return (
//     <div className='sticky top-4'>

//       {/* Movie Image */}
//       <div className='w-full h-80 relative rounded-xl overflow-hidden mb-6'>
//         <Image
//           src={movie.movie_img ?? '/placeholder.jpg'}
//           alt={movie.name}
//           fill
//           className='object-cover'
//           priority
//         />
//       </div>

//       {/* Movie Info */}
//       <div className='mb-6'>
//         <h2 className='text-xl font-bold text-shade-900 mb-4 uppercase'>
//           {movie.name}
//         </h2>
//         <div className='grid grid-cols-2 gap-y-3 text-sm'>
//           <span className='text-shade-500'>Genre</span>
//           <span className='text-shade-900 capitalize'>
//             {movie.genre ?? '-'}
//           </span>

//           <span className='text-shade-500'>Duration</span>
//           <span className='text-shade-900'>
//             {movie.duration ?? '-'}
//           </span>

//           <span className='text-shade-500'>Director</span>
//           <span className='text-shade-900'>
//             {movie.director ?? '-'}
//           </span>

//           <span className='text-shade-500'>Age Rating</span>
//           <span className='text-shade-900'>
//             {movie.age_rating ?? '-'}
//           </span>
//         </div>
//       </div>

//       {/* Selected Showtime Summary */}
//       {selectedShowtime && (
//         <div className='border rounded-xl p-4 mb-4'>
//           <h3 className='font-bold text-shade-900 mb-3'>
//             {selectedShowtime.theater?.name}
//           </h3>

//           <div className='flex justify-between items-center mb-1'>
//             <span className='text-shade-600 text-sm uppercase'>
//               {selectedShowtime.screen?.type} {selectedShowtime.screen?.name}
//             </span>
//             <span className='font-bold text-shade-900'>
//               {new Date(selectedShowtime.show_time).toLocaleTimeString('en-IN', {
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 hour12: false
//               })}
//             </span>
//           </div>

//           <p className='text-sm text-shade-500 mb-4'>
//             ₹{selectedShowtime.price?.toLocaleString() ?? '-'}
//           </p>

//           <Link
//             href={`/booking/${movie.id}/seats/${selectedShowtime.id}`}
//             className='block w-full bg-royal-blue-default hover:bg-royal-blue-hover text-white text-center py-3 rounded-lg font-bold transition'
//           >
//             BUY NOW
//           </Link>
//         </div>
//       )}
//     </div>
//   )
// }

// 'use client'

// import { useEffect, useState } from 'react'
// import { useDispatch, useSelector } from 'react-redux'
// import { getShowtimes } from '@/actions/bookingActions'
// import type { ShowtimeWithTheaterAndScreen, GroupedShowtime } from '@/types/index'
// import { ChevronLeft, ChevronRight, MapPin } from 'lucide-react'
// import { RootState } from '@/lib/store'
// import { setSelectedDate, setSelectedShowtime } from '@/lib/features/booking/bookingSlice'

// interface Props {
//   movieId: string
// }

// // generate 5 visible dates starting from offset
// function generateDates(offset: number): Date[] {
//   return Array.from({ length: 5 }, (_, i) => {
//     const d = new Date()
//     d.setDate(d.getDate() + offset + i)
//     return d
//   })
// }

// function formatDateLabel(date: Date) {
//   const day = date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' })
//   const weekday = date.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase()
//   return { day, weekday }
// }

// function toDateString(date: Date): string {
//   return date.toISOString().split('T')[0]
// }

// // group showtimes by theater
// function groupByTheater(showtimes: ShowtimeWithTheaterAndScreen[]): GroupedShowtime[] {
//   const map = new Map<string, GroupedShowtime>()

//   for (const showtime of showtimes) {
//     const theaterId = showtime.theater_id!
//     if (!map.has(theaterId)) {
//       map.set(theaterId, {
//         theater: showtime.theater as any,
//         showtimes: [],
//       })
//     }
//     map.get(theaterId)!.showtimes.push(showtime)
//   }

//   return Array.from(map.values())
// }

// export default function Bookshow({ movieId }: Props) {
//   const dispatch = useDispatch()
//   const selectedDate = useSelector((state: RootState) => state.booking.selectedDate)
//   const selectedShowtime = useSelector((state: RootState) => state.booking.selectedShowtime)

//   const [dateOffset, setDateOffset] = useState(0)
//   const [groupedShowtimes, setGroupedShowtimes] = useState<GroupedShowtime[]>([])
//   const [loading, setLoading] = useState(false)

//   const dates = generateDates(dateOffset)

//   // set today as default selected date
//   useEffect(() => {
//     if (!selectedDate) {
//       dispatch(setSelectedDate(toDateString(new Date())))
//     }
//   }, [])

//   // fetch showtimes when date changes
//   useEffect(() => {
//     if (!selectedDate) return

//     const fetch = async () => {
//       setLoading(true)
//       const result = await getShowtimes(movieId, selectedDate)

//       if (result.success && result.data) {
//         const grouped = groupByTheater(result.data as ShowtimeWithTheaterAndScreen[])
//         setGroupedShowtimes(grouped)
//       }
//       setLoading(false)
//     }

//     fetch()
//   }, [selectedDate, movieId])

//   const handleDateSelect = (date: Date) => {
//     dispatch(setSelectedDate(toDateString(date)))
//   }

//   const handleShowtimeSelect = (group: GroupedShowtime, showtime: ShowtimeWithTheaterAndScreen) => {
//     dispatch(setSelectedShowtime({
//       showtime: showtime,
//       theater: group.theater,
//       screen: showtime.screen,
//     }))
//   }

//   const formatTime = (isoString: string) => {
//     return new Date(isoString).toLocaleTimeString('en-US', {
//       hour: '2-digit',
//       minute: '2-digit',
//       hour12: false,
//     })
//   }

//   return (
//     <div className='mt-6'>
//       {/* Header */}
//       <div>
//         <h1 className='text-4xl font-bold mb-1.5 text-shade-900'>TIMETABLE</h1>
//         <p className='text-gray-600 text-[16px] font-normal'>
//           Select the cinema schedule you want to watch
//         </p>
//       </div>

//       {/* Date Picker */}
//       <div className='flex items-center gap-2 mt-6'>
//         <button
//           onClick={() => setDateOffset((prev) => Math.max(0, prev - 1))}
//           disabled={dateOffset === 0}
//           className='w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-100 transition'
//         >
//           <ChevronLeft size={18} />
//         </button>

//         <div className='flex gap-2'>
//           {dates.map((date) => {
//             const { day, weekday } = formatDateLabel(date)
//             const dateStr = toDateString(date)
//             const isSelected = selectedDate === dateStr
//             const isPast = date < new Date(new Date().setHours(0, 0, 0, 0))

//             return (
//               <button
//                 key={dateStr}
//                 onClick={() => !isPast && handleDateSelect(date)}
//                 disabled={isPast}
//                 className={`
//                   w-[72px] h-[72px] rounded-xl flex flex-col items-center justify-center gap-0.5
//                   text-sm font-semibold transition-all
//                   ${isSelected
//                     ? 'bg-[#1e2356] text-white'
//                     : isPast
//                       ? 'bg-gray-100 text-gray-300 cursor-not-allowed'
//                       : 'bg-white border border-gray-200 text-gray-800 hover:bg-[#1e2356] hover:text-white'
//                   }
//                 `}
//               >
//                 <span className='text-xs font-normal'>{day}</span>
//                 <span className='text-base font-bold'>{weekday}</span>
//               </button>
//             )
//           })}
//         </div>

//         <button
//           onClick={() => setDateOffset((prev) => prev + 1)}
//           className='w-10 h-10 flex items-center justify-center rounded-lg border border-gray-200 hover:bg-gray-100 transition'
//         >
//           <ChevronRight size={18} />
//         </button>
//       </div>

//       {/* Showtimes by Theater */}
//       <div className='mt-8 flex flex-col gap-6'>
//         {loading ? (
//           <p className='text-gray-400'>Loading showtimes...</p>
//         ) : groupedShowtimes.length === 0 ? (
//           <p className='text-gray-400'>No showtimes available for this date.</p>
//         ) : (
//           groupedShowtimes.map((group) => (
//             <div key={group.theater.id} className='flex flex-col gap-3'>
//               {/* Theater Header */}
//               <div className='flex items-center justify-between'>
//                 <div className='flex items-center gap-2'>
//                   {group.theater.brands?.logo_url && (
//                     <img
//                       src={group.theater.brands.logo_url}
//                       alt={group.theater.brands.name ?? ''}
//                       className='h-6 w-auto object-contain'
//                     />
//                   )}
//                   <span className='font-bold text-shade-900 uppercase'>
//                     {group.theater.name}
//                   </span>
//                 </div>
//                 {group.theater.brands?.name && (
//                   <span className='text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 font-semibold uppercase'>
//                     {group.theater.brands.name}
//                   </span>
//                 )}
//               </div>

//               {/* Address */}
//               <div className='flex items-center gap-1 text-gray-400 text-sm -mt-1'>
//                 <MapPin size={13} />
//                 <span>{group.theater.address}</span>
//               </div>

//               {/* Screen type + price + time buttons */}
//               <div className='flex flex-col gap-2'>
//                 {/* Group times by screen type */}
//                 {Object.entries(
//                   group.showtimes.reduce<Record<string, ShowtimeWithTheaterAndScreen[]>>(
//                     (acc, s) => {
//                       const key = s.screen?.type ?? '2D'
//                       if (!acc[key]) acc[key] = []
//                       acc[key].push(s)
//                       return acc
//                     },
//                     {}
//                   )
//                 ).map(([screenType, times]) => (
//                   <div key={screenType} className='flex items-center gap-4'>
//                     <span className='text-sm font-semibold text-gray-700 w-24'>
//                       {screenType}
//                     </span>
//                     <span className='text-sm text-gray-500 w-36'>
//                       Rp. {times[0].price?.toLocaleString()}
//                     </span>
//                     <div className='flex flex-wrap gap-2'>
//                       {times.map((showtime) => {
//                         const isSelected =
//                           selectedShowtime?.showtime.id === showtime.id
//                         return (
//                           <button
//                             key={showtime.id}
//                             onClick={() => handleShowtimeSelect(group, showtime)}
//                             className={`
//                               px-4 py-2 rounded-lg text-sm font-semibold border transition-all
//                               ${isSelected
//                                 ? 'bg-[#1e2356] text-white border-[#1e2356]'
//                                 : 'bg-white text-gray-700 border-gray-300 hover:bg-[#1e2356] hover:text-white hover:border-[#1e2356]'
//                               }
//                             `}
//                           >
//                             {formatTime(showtime.show_time)}
//                           </button>
//                         )
//                       })}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   )
// }