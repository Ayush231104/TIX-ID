'use client'

import { createClient } from '@/utils/supabase/client';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { useEffect, useState } from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { RiThumbUpLine } from 'react-icons/ri';
import type { NewsCard } from '@/types/index';

const supabase = createClient();

export default function ArticlePage() {
  const params = useParams();
  const id = params.article as string;

  const [article, setArticle] = useState<NewsCard | null>(null);
  const [relatedNews, setRelatedNews] = useState<NewsCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [like, setLike] = useState(0);

  useEffect(() => {
    if (!id) return;

    const fetchArticle = async () => {
      setLoading(true);

      const { data: mainArticle, error: mainError } = await supabase
        .from('news')
        .select('*')
        .eq('id', id)
        .single();

      if (mainArticle) {
        setArticle(mainArticle as NewsCard);
        setLike(mainArticle.likes ?? 0);
      }

      const { data: otherArticles, error: otherError } = await supabase
        .from('news')
        .select('*')
        .neq('id', id)
        .limit(3);

      if (otherArticles) {
        setRelatedNews(otherArticles as NewsCard[]);
      }

      setLoading(false);

      if (mainError) console.error('Error fetching main article:', mainError.message);
      if (otherError) console.error('Error fetching related news:', otherError.message);
    }

    fetchArticle();
  }, [id]);

  const handleLikeChange = async () => {
    if (!article) return;

    const { data } = await supabase
      .from('news')
      .select('likes')
      .eq('id', article.id)
      .single();

    const newLikes = (data?.likes ?? 0) + 1;
    setLike(newLikes);

    const { error } = await supabase
      .from('news')
      .update({ likes: newLikes })
      .eq('id', article.id);

    if (error) console.error('Error updating likes:', error.message);
  }

  if (loading) return (
    <div className="w-full text-center py-20 text-gray-500">
      Loading article...
    </div>
  );

  if (!article) return (
    <div className="w-full text-center py-20 text-gray-500">
      Article not found.
    </div>
  );

  return (
    <div>
      <div className='w-full my-10 px-8 md:px-16'>
        <div className='w-full max-w-4xl mx-auto flex flex-col justify-center items-center'>
          <div className='sm:my-10'>
            <div className='text-2xl md:text-[56px] font-bold my-4.5 text-shade-900'>
              {article.title}
            </div>
            <p className="text-xs sm:text-xl md:text-2xl font-normal leading-3.5 text-shade-600">
              {new Date(article.release_date).toLocaleDateString('en-GB', {
                day: '2-digit',
                month: 'short',
                year: 'numeric'
              })} | TIX ID
            </p>
          </div>

          <div className='w-full'>
            <div className='w-full lg:w-214.5 h-80 sm:h-111.75 relative my-10'>
              <Image
                src={article.img}
                alt={article.title}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                // fill
                width={800}
                height={750}
                className='object-cover w-full rounded-xl'
                priority
              />
            </div>
          </div>

          <div className='w-full mt-16.75'>
            <p className='lg:w-187 whitespace-pre-line font-normal text-[18px] leading-7 text-shade-900'>
              {article.content}
            </p>
          </div>

          <div className='w-full mt-22'>
            <div className='text-2xl leading-8 font-medium py-3.5 text-shade-900'>
              Share This Article
            </div>
            <div className='flex gap-4.5 mb-4'>
              <FaInstagram size={24} />
              <FaTwitter size={24} />
              <FaFacebook size={24} />
            </div>
          </div>

          <div
            className='px-4 py-2 border rounded-[59px] border-shade-800 cursor-pointer'
            onClick={handleLikeChange}
          >
            <div className='flex gap-1 items-center'>
              <RiThumbUpLine size={24} />
              <div className='text-xl font-normal text-shade-900'>{like}</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
          {relatedNews.map((item) => (
            <Link href={`${item.id}`} key={item.id}>
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
          ))}
        </div>
      </div>
    </div>
  )
}