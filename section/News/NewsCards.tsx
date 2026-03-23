'use client'

import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import type { NewsCard } from '@/types/index';
import Skeleton from '@/components/ui/Skeleton';

const supabase = createClient();

export default function NewsCards() {
  const [news, setNews] = useState<NewsCard[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .limit(3);

      if (error) {
        console.error(error.message);
      } else {
        setNews((data as NewsCard[]) || []);
      }
      setLoading(false);
    };

    fetchNews();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
      {loading
        ? (<div>
          {
            [...Array(3)].map((_, i) => (
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
        </div>)
        : news.length === 0
          ? (<div className="flex justify-center items-center h-96">
            <p className="text-gray-500 text-lg">No news found</p>
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
                  <button className='border px-3 py-2 text-xs font-normal mt-10'>
                    {item.category}
                  </button>
                  <h2 className="text-2xl font-medium leading-8 my-4.5 text-shade-900">
                    {item.title}
                  </h2>
                  <p className="text-[16px] font-normal leading-6 text-shade-600">
                    {new Date(item.release_date).toLocaleDateString('en-GB', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })} | TIX ID
                  </p>
                </div>
              </Link>
            ))
          )}
    </div>
  )
}