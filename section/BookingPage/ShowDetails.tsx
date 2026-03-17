import { Movie, ShowtimeWithTheaterAndScreen } from '@/types'
import Image from 'next/image'

interface Props {
  movie: Movie
  selectedShowtime: ShowtimeWithTheaterAndScreen | null
}

function formatDuration(timetz: string | null): string {
  if (!timetz) return '—'
  
  const [time] = timetz.split('+')
  const [hours, minutes] = time.split(':')
  
  const h = parseInt(hours)
  const m = parseInt(minutes)

  if (h === 0) return `${m}min`
  if (m === 0) return `${h}h`
  return `${h}h ${m}min`
}
export default function ShowDetails({ movie, selectedShowtime }: Props) {
  return (
    <div className='mt-27.75'>
      <div>
        <div className='w-103.25 h-91 relative mb-12'>
          <Image
            src={movie.movie_img ?? '/placeholder.jpg'}
            alt="Show Details"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            className='object-fit rounded-xl'
          />
        </div>
        <div>
          <div className='my-5 font-medium text-[24px] leading-8 text-shade-900'>{movie.name ?? '-'}</div>
          <div className='flex gap-10'>
            <div className='flex flex-col gap-2.75'>
              <div className='font-normal text-[16px] text-shade-900'>Genre</div>
              <div className='font-normal text-[16px] text-shade-900'>Duration</div>
              <div className='font-normal text-[16px] text-shade-900'>Director</div>
              <div className='font-normal text-[16px] text-shade-900'>Age Rating</div>
            </div>
            <div className='flex flex-col gap-2.75'>
              <div className='font-normal text-[16px] text-shade-900'>{movie.genre ?? '-'}</div>
              <div className='font-normal text-[16px] text-shade-900'>{formatDuration(movie.duration)}</div>
              <div className='font-normal text-[16px] text-shade-900'>{movie.director ?? '-'}</div>
              <div className='font-normal text-[16px] text-shade-900'>{movie.age_rating ?? '-'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
