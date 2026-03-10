'use client';

import { useState, useEffect } from 'react';
import NewsForm from '@/components/admin/NewsForm';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';

const supabase = createClient();
type News = {
  id: string;
  title: string;
  subtitle: string;
  tag: string;
  release_date: string;
  category: string;
  img: string;
}
const News = () => {
  const [showForm, setShowForm] = useState(false);
  const [news, setNews] = useState<News[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(3);
      // console.log(data);
      if (error) {
        setError(error.message);
      } else {
        setNews(data || []);
      }
    };

    fetchNews();
  }, []);

  return (
    <div className="w-full mt-35 px-16">
      <div className="flex justify-between">
        <div>
          <div className="text-2xl font-medium py-2 text-shade-900">
            Coming soon
          </div>
          <div className='text-[16px] leading-6 text-shade-600 '>The latest news about the world of cinema for you!</div>
        </div>

        <div className="flex items-center gap-4">
          <Link href={"/news"} className="text-sky-blue text-2xl font-medium leading-8 hover:underline">
            View All
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

      {error && <div className="text-red-500">{error}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
        {news.map((item) => (
          <div key={item.id} className="w-full">
            <div className='w-full h-60 relative'>
              <Image src={item.img} alt={item.title} sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw" fill className='object-cover rounded-xl' priority ></Image>
            </div>
            <button className='border px-3 py-2 text-xs font-normal mt-10 '>{item.category}</button>
            <h2 className="text-2xl font-medium leading-8 my-4.5">{item.title}</h2>
            <p className="text-[16px] font-normal leading-6 text-shade-600">{new Date(item.release_date).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })} | TIX ID</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;