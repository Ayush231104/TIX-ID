'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation'
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import { RiThumbUpLine } from 'react-icons/ri';
import { useGetArticleQuery, useLikeArticleMutation } from '@/lib/features/api/newsApi';
import Skeleton from '@/components/ui/Skeleton';


export default function ArticlePage() {
  const params = useParams();
  const id = params.article as string;

  const { data, isLoading, isError } = useGetArticleQuery(id, {skip: !id});

  const [likeArticle, { isLoading: isLiking }] = useLikeArticleMutation();

  const handleLikeChange = async () => {
    if (!data?.article || isLiking) return;
    await likeArticle({ id: data.article.id, currentLikes: data.article.likes ?? 0 });
  }

  if (isLoading) return (
    <div className='w-full my-10 px-8 md:px-16'>
      <div className='w-full max-w-4xl mx-auto flex flex-col justify-center items-center'>
        
        {/* Title & Date Skeleton */}
        <div className='sm:my-10  w-full flex flex-col items-center gap-4'>
          <Skeleton w="w-3/4 md:w-2/3" h="h-20 md:h-16" className="my-2" />
          <Skeleton w="w-48" h="h-6" />
        </div>

        {/* Main Image Skeleton */}
        <div className='w-full'>
          <div className='w-full lg:w-214.5 h-80 sm:h-111.75 relative my-10'>
            <Skeleton w="w-full" h="h-full" rounded="rounded-xl" />
          </div>
        </div>

        {/* Content Paragraphs Skeleton */}
        <div className='w-full mt-16.75 flex flex-col gap-4'>
          <Skeleton w="w-full" h="h-6" />
          <Skeleton w="w-full" h="h-6" />
          <Skeleton w="w-11/12" h="h-6" />
          <Skeleton w="w-full" h="h-6" />
          <Skeleton w="w-4/5" h="h-6" />
          <Skeleton w="w-full" h="h-6" className="mt-4" />
          <Skeleton w="w-10/12" h="h-6" />
        </div>

        {/* Share & Like Skeleton */}
        <div className='w-full mt-22'>
          <Skeleton w="w-48" h="h-8" className="mb-4" />
          <div className='flex gap-4.5 mb-4'>
            <Skeleton w="w-8" h="h-8" rounded="rounded-full" />
            <Skeleton w="w-8" h="h-8" rounded="rounded-full" />
            <Skeleton w="w-8" h="h-8" rounded="rounded-full" />
          </div>
        </div>
        
        <div className="w-full flex justify-center">
          <Skeleton w="w-24" h="h-12" rounded="rounded-[59px]" />
        </div>

        {/* Related News Grid Skeleton */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-12">
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
          ))}
        </div>
      </div>
    </div>
  );

  if (isError || !data?.article) return (
    <div className="w-full text-center py-20 text-gray-500">Article not found.</div>
  );

  const { article, relatedNews } = data;

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

          <button
            onClick={handleLikeChange}
            disabled={isLiking}
            className={`px-4 py-2 border rounded-[59px] border-shade-800 transition-colors ${
              isLiking ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:bg-gray-100'
            }`}
          >
            <div className='flex gap-1 items-center'>
              <RiThumbUpLine size={24} />
              <div className='text-xl font-normal text-shade-900'>{article.likes ?? 0}</div>
            </div>
          </button>
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