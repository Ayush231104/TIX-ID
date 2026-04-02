'use client';

import { useState } from 'react';
import NewsForm from '@/components/admin/NewsForm';
import Link from 'next/link';
import Image from 'next/image';
import Skeleton from '@/components/ui/Skeleton';
import { useGetNewsQuery } from '@/lib/features/api/newsApi';
import Typography from '@/components/ui/Typography';

const News = () => {
  const [showForm, setShowForm] = useState(false);

  const { data: news = [], isLoading, isError } = useGetNewsQuery({ limit: 3 });

  return (
    <div className="w-full mt-10 md:mt-35 px-8 md:px-16">
      <div className="flex justify-between">
        <div>
          <Typography variant='h3' color='shade-900' className="py-2">
            TIX ID News
          </Typography>
          <Typography color='shade-600'>The latest news about the world of cinema for you!</Typography>
        </div>

        <div className="flex items-center gap-4">
          <Link href={"/news"} className="shrink-0">
            <Typography variant="h3" color="sky-blue" className="text-center hover:underline">
              View All
            </Typography>
          </Link>

          <button
            onClick={() => setShowForm(!showForm)}
            className="hidden bg-blue-600 text-white px-4 py-2 rounded"
          >
            Add News
          </button>
        </div>
      </div>

      {showForm && <NewsForm />}

      {isError && <div className="text-red-500">Error fetching news</div>}
      {isLoading ? (
        <div className="flex gap-6 overflow-hidden w-full">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-4 w-full">
              <Skeleton w="w-full" h="h-80" rounded="rounded-2xl" />
              <Skeleton w="w-40" h="h-6" />
              <div className="flex gap-2">
                <Skeleton w="w-12" h="h-5" />
                <Skeleton w="w-12" h="h-5" />
                <Skeleton w="w-16" h="h-5" />
              </div>
            </div>
          ))}
        </div>
      ) : news.length === 0 ? (
        <div className="flex justify-center items-center h-96">
          <p className="text-gray-500 text-lg">No news found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-4 sm:mt-12">
          {news.map((item) => (
            <div key={item.id} className="w-full">
              <div className='max-w-105 h-60 relative'>
                <Image src={item.img} alt={item.title} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill className='object-cover rounded-xl' priority ></Image>
              </div>
              <button className='border px-3 py-2 text-xs font-normal mt-4 sm:mt-10 '>{item.category}</button>
              <Typography variant="h3" color="shade-900" className="my-2 sm:my-4.5 max-w-105">
                {item.title}
              </Typography>
              <Typography color='shade-600'>{new Date(item.release_date ?? new Date()).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })} | TIX ID</Typography>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default News;