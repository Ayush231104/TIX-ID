'use client'
import { upcomingMovies } from "@/actions/movieActions"
import Skeleton from "@/components/ui/Skeleton"
import { Movie } from "@/types"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function UpcomingPage() {
	const [movies, setmovies] = useState<Movie[]>([])
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchMovies = async () => {
			const result = await upcomingMovies()
			if (result.success && result.data) setmovies(result.data)
			else console.error('Error fetching upcoming movies: ', result.error)
			setLoading(false)
		}
		fetchMovies()
	}, [])

	return (
		<div className="w-full px-16">
			<div className="flex justify-between">
				<div>
					<div className="text-2xl sm:text-4xl font-bold py-2 text-shade-900">
						Upcoming Movies
					</div>
					<div className='text-[16px] leading-6 text-shade-600 '>Wait for its presence at your favorite cinema!</div>
				</div>
			</div>
			{loading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12 overflow-hidden w-full">
					{[...Array(5)].map((_, i) => (
						<div key={i} className="flex flex-col items-center gap-4 w-full">
							<Skeleton w="w-full" h="h-125" rounded="rounded-2xl" />
							<Skeleton w="w-40" h="h-6" />
							<div className="flex gap-2">
								<Skeleton w="w-12" h="h-5" />
								<Skeleton w="w-12" h="h-5" />
								<Skeleton w="w-16" h="h-5" />
							</div>
						</div>
					))}
				</div>
			) :
			movies.length === 0 ? (
				<div className="flex justify-center items-center h-96">
					<p className="text-gray-500 text-lg">No movies found</p>
				</div>
			) : 
			(
				<div className="w-full mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
					{movies.map((movie) => {
						return (
							<div key={movie.id}>
								<div className='flex flex-col gap-2 md:gap-4 max-w-90'>
									<div className='w-full'>
										<div className='max-w-90 max-h-127 relative rounded-2xl'>
											<Image
												className='aspect-3/4  object-fit rounded-2xl '
												src={movie.movie_img ?? '/placeholder.jpg'}
												alt={movie.name ?? 'Movie'}
												width={360}
												height={510}
												loading="lazy"
											/>
										</div>
									</div>
									<div className='text-[16px] md:text-2xl sm:font-medium'>
										{movie.name}
									</div>
									<div className='flex gap-3'>
										<button className='bg-linear-to-r from-xxi-gold to-xxi-gold-dark text-white rounded-[5px] py-1 px-3 text-[8px] md:text-xs'>XXI</button>
										<button className='bg-cgv-red text-white rounded-[5px] py-1 px-3 text-[8px] md:text-xs'>CGV</button>
										<button className='bg-cinepolis-blue text-white rounded-[5px] py-1 px-3 text-[8px] md:text-xs'>CINÉPOLIS</button>
									</div>
								</div>
							</div>
						)
					})
					}
				</div>
			)}
		</div>
	)
}
