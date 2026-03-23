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

function formatShowtime(timestamp: string): string {
  return new Date(timestamp).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function formatShowDate(timestamp: string): string {
  return new Date(timestamp).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}

export default function ShowDetails({ movie, selectedShowtime }: Props) {
  return (
    <div className=' mt-27.75 pl-8 lg:pl-32'>
      <div>
        <div className='w-[90%] sm:max-w-110 h-100 sm:h-140 relative mb-12'>
          <Image
            src={movie.movie_img ?? '/placeholder.jpg'}
            alt="Show Details"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            fill
            className='object-fit rounded-xl'
            loading='lazy'
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
      {selectedShowtime && (
        <div className='border border-royal-blue rounded-xl max-w-105 p-9 px-6 mt-7.5'>
          <div className='font-bold text-[28px] text-shade-900'>
            {selectedShowtime?.theater?.name ?? '-'}
          </div>

          <div className='font-medium text-[18px] text-shade-600 mt-6'>
            {formatShowDate(selectedShowtime.show_time)}
          </div>

           <div className='flex items-center justify-between mt-3'>
            <div className='font-medium text-2xl leading-8 text-shade-900 uppercase'>
              {selectedShowtime.screen?.name ?? '-'}
            </div>
            <div className='font-medium text-2xl leading-8 text-shade-900'>
              {formatShowtime(selectedShowtime.show_time)}
            </div>
          </div>

          <div className='font-normal text-xs text-shade-400 mt-6'>
            * Seat selection can be done after this
          </div>

           <button className='w-full bg-royal-blue text-sunshine-yellow font-bold text-2xl py-4 rounded-xl hover:bg-royal-blue-hover transition-all cursor-pointer uppercase tracking-wide mt-9'>
            Buy Now
          </button>
        </div>
      )}
    </div>
  )
}
