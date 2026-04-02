'use client'
import { useEffect, useState } from 'react'
import Bookshow from './Bookshow'
import ShowDetails from './ShowDetails'
import { useParams } from 'next/navigation'
import { ShowtimeForBooking } from '@/types'
import { useAppDispatch } from '@/lib/hooks'
import { setSelectedMovie, setSelectedShowtime as setShowtimeRedux, setSelectedDate as setDateRedux } from '@/lib/features/slice/bookingSlice'
import { useGetMovieByIdQuery } from '@/lib/features/api/bookingApi'

export default function   BookingPage() {
  const params = useParams()
  const movieId = params.bookingId as string
  const dispatch = useAppDispatch();

  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeForBooking | null>(null)
  
  const { data: movie, isLoading } = useGetMovieByIdQuery(movieId, { skip: !movieId })

  useEffect(() => {
    if (movie) {
      dispatch(setSelectedMovie(movie))
    }
  }, [movie, dispatch])

  if (isLoading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-8 h-8 bg-royal-blue rounded-full animate-bounce" />
    </div>
  )
  if (!movie) return <div>Movie not found</div>


  return (
    <div className='grid grid-cols-1 md:grid-cols-2'>
      <div className='col-span-1 pr-4 md:pl-16'>
        <Bookshow
          movieId={movieId}
          onDateSelect={(date) => {
            setSelectedShowtime(null)
            dispatch(setDateRedux(date.toISOString()))
          }}
          onShowtimeSelect={(showtime) => {
            setSelectedShowtime(showtime)
            dispatch(setShowtimeRedux(showtime))         
          }} />
      </div>

      <div className='col-span-1 mx-auto w-full'>
        <ShowDetails movie={movie} selectedShowtime={selectedShowtime} />
      </div>

    </div>
  )
}
