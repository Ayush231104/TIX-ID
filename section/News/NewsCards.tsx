'use client'

import Image from 'next/image';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';
import { useGetNewsQuery } from '@/lib/features/api/newsApi';
import Typography from '@/components/ui/Typography';

export default function NewsCards() {
  const { data: news = [], isLoading, isError } = useGetNewsQuery({ limit: 3 });

  return (
    <div className="flex justify-start overflow-x-auto gap-5 mt-12 pb-8 no-scrollbar">
      
      {isLoading ? (
        <>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="shrink-0 w-[85vw] md:w-[320px] lg:w-105 snap-start flex flex-col gap-4">
              <Skeleton w="w-full" h="h-60" rounded="rounded-xl" />
              <div className="flex flex-col gap-2">
                <Skeleton w="w-20" h="h-8" rounded="rounded-md" />
                <Skeleton w="w-full" h="h-8" />
                <Skeleton w="w-3/4" h="h-8" />
                <Skeleton w="w-40" h="h-5" className="mt-2" />
              </div>
            </div>
          ))}
        </>
      ) : isError ? (
        <div className="w-full flex justify-center items-center h-96">
          <Typography variant='body-large' color='shade-500'>No news found</Typography>
        </div>
      ) : (
        news.map((item) => (
          <Link 
            href={`news/${item.id}`} 
            key={item.id}
            className="w-[80vw] md:w-90 lg:w-105"
          >
            <div className="w-full flex flex-col h-full">
              <div className='w-[80vw] md:w-90 lg:w-105 h-60 relative'>
                <Image
                  src={item.img}
                  alt={item.title}
                  sizes="(max-width: 768px) 85vw, 350px"
                  fill
                  className='object-cover rounded-xl'
                  priority
                />
              </div>
              
              <button className='w-fit border border-shade-300 rounded-md px-3 py-2 mt-4 sm:mt-6'>
                <Typography variant='body-small' color='shade-900'>
                  {item.category}
                </Typography>
              </button>
              
              <Typography variant='h3' color='shade-900' className="my-3 line-clamp-2">
                {item.title}
              </Typography>
              
              <Typography color='shade-600' className="mt-auto">
                {new Date(item.release_date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })} | TIX ID
              </Typography>
            </div>
          </Link>
        ))
      )}
    </div>
  )
}