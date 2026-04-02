'use client'

import Image from 'next/image';
import Link from 'next/link';
import Skeleton from '@/components/ui/Skeleton';
import { useGetNewsQuery } from '@/lib/features/api/newsApi';
import Typography from '@/components/ui/Typography';

export default function NewsCards() {
  const { data : news = [], isLoading, isError} = useGetNewsQuery({ limit: 3});

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
      {isLoading
        ? (
        <div>
          {[...Array(3)].map((_, i) => (
              <div key={i} className="w-full flex flex-col gap-4">
                <Skeleton w="w-full" h="h-60" rounded="rounded-xl" />

                <div className="flex flex-col gap-2">
                  <Skeleton w="w-20" h="h-8" rounded="rounded-md" />

                  <Skeleton w="w-full" h="h-8" />
                  <Skeleton w="w-3/4" h="h-8" />

                  <Skeleton w="w-40" h="h-5" className="mt-2" />
                </div>
              </div>
            ))
          }
        </div>
        )
        : isError
          ? (<div className="flex justify-center items-center h-96">
            <Typography variant='body-large' color='shade-500'>No news found</Typography>
          </div>)
          : (
            news.map((item) => (
              <Link href={`news/${item.id}`} key={item.id}>
                <div className="w-full">
                  <div className='w-full h-60 relative'>
                    <Image
                      src={item.img}
                      alt={item.title}
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      fill
                      className='object-cover rounded-xl'
                      priority
                    />
                  </div>
                  <button className='border mt-10'>
                    <Typography variant='body-small' color='shade-900'>
                      {item.category}
                    </Typography>
                  </button>
                  <Typography variant='h3' color='shade-900' className="my-4.5">
                    {item.title}
                  </Typography>
                  <Typography color='shade-600'>
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