'use client'
import { useEffect, useState } from 'react'
import Bookshow from './Bookshow'
import ShowDetails from './ShowDetails'
import { useParams } from 'next/navigation'
import { getMovie } from '@/actions/movieActions'
import { Movie, ShowtimeForBooking } from '@/types'
import { useAppDispatch } from '@/lib/hooks'
import { setSelectedMovie, setSelectedShowtime as setShowtimeRedux, setSelectedDate as setDateRedux } from '@/lib/features/booking/bookingSlice'

export default function BookingPage() {
  const params = useParams()
  const movieId = params.bookingId as string
  const dispatch = useAppDispatch();

  const [movie, setMovie] = useState<Movie | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [selectedShowtime, setSelectedShowtime] = useState<ShowtimeForBooking | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!movieId) return

    const fetchMovie = async () => {
      setLoading(true)
      const result = await getMovie(movieId)
      if (result.success && result.data) {
        const movieData = result.data as Movie
        setMovie(movieData)
        dispatch(setSelectedMovie(movieData))
      }
      else console.error('Error fetching movie:', result.error)
      setLoading(false)
    }

    fetchMovie()
  }, [movieId])

  if (loading) return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-8 h-8 bg-royal-blue rounded-full animate-bounce" />
    </div>
  )
  if (!movie) return <div>Movie not found</div>


  return (
    <div className='grid grid-cols-1 md:grid-cols-2'>
      <div className='order-2 md:order-1 col-span-1 pr-4 md:pl-16'>
        <Bookshow
          movieId={movieId}
          onDateSelect={(date) => {
            setSelectedDate(date)
            setSelectedShowtime(null)
            dispatch(setDateRedux(date.toISOString()))
          }}
          onShowtimeSelect={(showtime) => {
            setSelectedShowtime(showtime)
            dispatch(setShowtimeRedux(showtime))         
          }} />
      </div>

      <div className='order-1 md:order-2 col-span-1 mx-auto w-full'>
        <ShowDetails movie={movie} selectedShowtime={selectedShowtime} />
      </div>

    </div>
  )
}
