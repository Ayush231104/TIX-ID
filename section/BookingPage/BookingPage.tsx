import React, { useEffect, useState } from 'react'
import Bookshow from './Bookshow'
import ShowDetails from './ShowDetails'
import { useParams } from 'next/navigation'
import { getMovie } from '@/actions/movieActions'
import { Movie } from '@/types'
import { useDispatch } from 'react-redux'

export default function BookingPage() {
    const params = useParams()
  const movieId = params.bookingId as string
  const dispatch = useDispatch();

  const [movie, setMovie] = useState<Movie | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!movieId) return

    const fetchMovie = async () => {
      setLoading(true)

      const result = await getMovie(movieId)

      if (result.success && result.data) {
        setMovie(result.data as Movie)
      } else {
        console.error('Error fetching movie:', result.error)
      }

      setLoading(false)
    }

    fetchMovie()
  }, [movieId])

  if (loading) return <div>Loading...</div>
  if (!movie) return <div>Movie not found</div>
  return (
    <div className='grid grid-cols-2 '>
      <div className='col-span-1 ml-16.5'>
        {/* <Bookshow movieId={movieId}/> */}
        <Bookshow/>
      </div>
      <div className='col-span-1 ml-32.5'>
        <ShowDetails movie={movie} selectedShowtime={null}/>
      </div>
    </div>
  )
}
