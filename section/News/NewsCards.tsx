"use client"
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react'

const supabase = createClient();

type News = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  release_date: string;
  category: string;
  img: string;
};

export default function NewsCards() {
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .limit(3);
      // console.log(data);
      if (error) {
        console.log(error.message);
      } else {
        setNews(data || []);
      }
    };

    fetchNews();
  }, []);
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">

        {news.map((item) => {
          return (
            <Link href={`news/${item.id}`} key={item.id}>
              <div className="w-full">
                <div className='w-full h-60 relative'>
                  <Image src={item.img} alt={item.title} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill className='object-cover rounded-xl' priority ></Image>
                </div>
                <button className='border px-3 py-2 text-xs font-normal mt-10 '>{item.category}</button>
                <h2 className="text-2xl font-medium leading-8 my-4.5 text-shade-900">{item.title}</h2>
                <p className="text-[16px] font-normal leading-6 text-shade-600">{new Date(item.release_date).toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })} | TIX ID</p>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
