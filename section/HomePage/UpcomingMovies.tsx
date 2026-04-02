'use client'
import Skeleton from "@/components/ui/Skeleton"
import Typography from "@/components/ui/Typography"
import { useGetMoviesListQuery } from "@/lib/features/api/moviesApi"
import Image from "next/image"
import Link from "next/link"

export default function UpcomingMovies() {
	const { data: movies = [], isLoading } = useGetMoviesListQuery({ limit: 3, status: 'upcoming' });

	return (
		<div className="w-full my-12 md:my-22 px-8 md:px-16">
			<div className="sm:flex justify-between">
				<div>
					<Typography variant="h3" color="shade-900" className="py-2">
						Upcoming Movies
					</Typography>
					<Typography color="shade-600">
						Wait for its presence at your favorite cinema!
					</Typography>
				</div>

				<div className="flex items-center gap-4">
					<Link href={"/upcoming"} className="shrink-0">
						<Typography variant="h3" color="sky-blue" className="text-center hover:underline">
							View All
						</Typography>
					</Link>
				</div>
			</div>
			{isLoading ? (
				<div className="flex gap-6 overflow-hidden w-full">
					{[...Array(3)].map((_, i) => (
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
			) : movies.length === 0 ? (
				<div className="flex justify-center items-center h-96">
					<p className="text-gray-500 text-lg">No movies found</p>
				</div>
			) : (
				<div className="w-full mt-4 sm:mt-12 flex justify-start overflow-x-auto gap-8 lg:gap-20">
					{movies.map((movie) => {
						return (
							<div key={movie.id}>
								<div className='flex flex-col gap-2 md:gap-4 max-w-95'>
									<div className='w-full'>
										<div className='max-w-90 sm:min-w-90 max-h-127 relative rounded-2xl'>
											<Image
												className='aspect-3/4 rounded-2xl object-fit'
												src={movie.movie_img ?? '/placeholder.jpg'}
												alt={movie.name ?? 'Movie'}
												width={360}
												height={510}
												loading="lazy"
											/>
										</div>
									</div>
									<Typography variant="h3" color="shade-900" className="sm:mt-6">
										{movie.name}
									</Typography>
									<div className='flex gap-3'>
										<button className='bg-linear-to-r from-xxi-gold to-xxi-gold-dark text-white rounded-[5px] py-1 px-3 text-[8px] md:text-xs'>XXI</button>
										<button className='bg-cgv-red text-white rounded-[5px] py-1 px-3 text-[8px] md:text-xs'>CGV</button>
										<button className='bg-cinepolis-blue text-white rounded-[5px] py-1 px-3 text-[8px] md:text-xs'>CINÉPOLIS</button>
									</div>
								</div>
							</div>
						)
					})
					}</div>
			)}
		</div>
	)
}
