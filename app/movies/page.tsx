'use client'
import Skeleton from "@/components/ui/Skeleton"
import Typography from "@/components/ui/Typography"
import { useGetMoviesListQuery } from "@/lib/features/api/moviesApi"
import Image from "next/image"
import Link from "next/link"

export default function Movies() {
	const { data: movies = [], isLoading } = useGetMoviesListQuery({});

	return (
		<div className="w-full px-8 md:px-16">
			<div className="flex justify-between">
				<div>
					<Typography variant="h2" color="shade-900" className="py-5">
						Movies
					</Typography>
					<Typography color="shade-700">
						Enjoy movies with friends on the big screen
					</Typography>
				</div>
			</div>
			{isLoading ? (
				<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-12 overflow-hidden w-full">
					{[...Array(7)].map((_, i) => (
						<div key={i} className="flex flex-col items-center gap-4 w-full">
							<Skeleton w="w-full" h="h-90" rounded="rounded-2xl" />
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
						<div className="w-full mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 sm:gap-12 justify-items-center">							{movies.map((movie) => {
							return (
								<Link key={movie.id} href={`/booking/${movie.id}`}>
									<div className='flex flex-col gap-2 max-w-90'>
										<div className='w-full mb-2'>
											<div className='max-w-90 max-h-127 relative rounded-2xl'>
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
										<div className="w-full min-h-[3rem] sm:min-h-[3.5rem]">
											<Typography
												variant="h3"
												color="shade-900"
												className="line-clamp-2 text-ellipsis overflow-hidden"
											>
												{movie.name}
											</Typography>
										</div>
										<div className='flex gap-3'>
											<button className='bg-linear-to-r from-xxi-gold to-xxi-gold-dark text-white rounded-[5px] py-1 px-3 text-[8px] md:text-xs'>XXI</button>
											<button className='bg-cgv-red text-white rounded-[5px] py-1 px-3 text-[8px] md:text-xs'>CGV</button>
											<button className='bg-cinepolis-blue text-white rounded-[5px] py-1 px-3 text-[8px] md:text-xs'>CINÉPOLIS</button>
										</div>
									</div>
								</Link>
							)
						})
						}
						</div>
					)}
		</div>
	)
}
