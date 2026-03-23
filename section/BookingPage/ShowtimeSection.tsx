'use client'

import Skeleton from '@/components/ui/Skeleton'
import { Brand, City, Screen, ShowtimeForBooking, ShowtimeWithTheaterAndScreen, Theater } from '@/types'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'
import { ImStarFull } from 'react-icons/im'
import { SortOption } from './Bookshow'

type LeanShowtime = {
	id: string
	show_time: string
	price: number | null
	movie_id: string | null
	theater_id: string | null
	screen_id: string | null
	is_active: boolean | null
	created_at: string | null
	updated_at: string | null
}

type ScreenGroup = {
	screen: Screen
	showtimes: LeanShowtime[]
}

type TheaterGroup = {
	theater: Theater & { brands: Brand | null; cities: City | null }
	screens: ScreenGroup[]
}

const supabase = createClient()

const formatTime = (timestamp: string) =>
	new Date(timestamp).toLocaleTimeString('en-IN', {
		hour: '2-digit',
		minute: '2-digit',
		hour12: false,
	})

const formatPrice = (price: number | null) =>
	price ? `₹${price.toLocaleString('en-IN')}` : '—'

const isPastTime = (timestamp: string) =>
	new Date(timestamp) < new Date()

const getDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
	const R = 6371
	const dLat = ((lat2 - lat1) * Math.PI) / 180
	const dLng = ((lng2 - lng1) * Math.PI) / 180
	const a =
		Math.sin(dLat / 2) ** 2 +
		Math.cos((lat1 * Math.PI) / 180) *
		Math.cos((lat2 * Math.PI) / 180) *
		Math.sin(dLng / 2) ** 2
	return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

export default function ShowtimeSection({
	movieId,
	selectedDate,
	onShowtimeSelect,
	cityId,
	searchText,
	screenType,
	brandId,
	sortBy,
	userLocation,
}: {
	movieId: string
	selectedDate: Date
	onShowtimeSelect: (showtime: ShowtimeWithTheaterAndScreen) => void
	cityId: string | null
	searchText: string
	screenType: string | null
	brandId: string | null
	sortBy: SortOption | null
	userLocation: { lat: number; lng: number } | null
}) {
	const [allGrouped, setAllGrouped] = useState<TheaterGroup[]>([])
	const [grouped, setGrouped] = useState<TheaterGroup[]>([])
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchData = async () => {
			setLoading(true)

			const start = new Date(selectedDate)
			start.setHours(0, 0, 0, 0)

			const end = new Date(selectedDate)
			end.setHours(23, 59, 59, 999)


			//don't select every thing just fetch what you want to use
			// const { data, error } = await supabase
			// 	.from('showtimes')
			// 	.select(`
			// 		*,
			// 		theater:theater_id(
			// 		*,
			// 		brands:brand_id(*),
			// 		cities:city_id(*)
			// 		),	
			// 		screen:screen_id(*)
			// 	`)
			// 	.eq('movie_id', movieId)
			// 	.eq('is_active', true)
			// 	.gte('show_time', start.toISOString())
			// 	.lte('show_time', end.toISOString())
			// 	.order('show_time', { ascending: true })
			const { data, error } = await supabase
				.from('showtimes')
				.select(`
					id,
					show_time,
					price,
					is_active,
					movie_id,
					theater_id,
					screen_id,
					created_at,
					updated_at,
					theater:theater_id(
					id,
					name,
					address,
					brand_id,
					city_id,
					latitude,
					longitude,
					brands:brand_id(id, name, logo_url),
					cities:city_id(id, name, latitude, longitude)
					),
					screen:screen_id(
					id,
					name,
					type
					)
				`)
				.eq('movie_id', movieId)
				.eq('is_active', true)
				.gte('show_time', start.toISOString())
				.lte('show_time', end.toISOString())
				.order('show_time', { ascending: true })

			if (error) {
				console.error('Error fetching showtimes:', error.message)
				setLoading(false)
				return
			}

			const theaterMap = new Map<string, TheaterGroup>()

			for (const row of (data ?? []) as ShowtimeForBooking[]) {
				const theaterId = row.theater_id as string
				const screenId = row.screen_id as string

				if (!theaterMap.has(theaterId)) {
					theaterMap.set(theaterId, {
						theater: row.theater as Theater & { brands: Brand | null; cities: City | null },
						screens: [],
					})
				}

				const theaterGroup = theaterMap.get(theaterId)!

				let screenGroup = theaterGroup.screens.find((s) => s.screen.id === screenId)

				if (!screenGroup) {
					screenGroup = { screen: row.screen as Screen, showtimes: [] }
					theaterGroup.screens.push(screenGroup)
				}

				screenGroup.showtimes.push({
					id: row.id,
					show_time: row.show_time,
					price: row.price,
					movie_id: row.movie_id,
					theater_id: row.theater_id,
					screen_id: row.screen_id,
					is_active: row.is_active,
					created_at: row.created_at,
					updated_at: row.updated_at,
				})
			}

			setAllGrouped(Array.from(theaterMap.values()))
			setLoading(false)
		}
		// console.log(allGrouped)
		if (!movieId) return
		fetchData()
	}, [movieId, selectedDate])

	useEffect(() => {

		const applyFilters = (source: TheaterGroup[]) => {
			let result = source

			if (cityId) {
				result = result.filter((g) => g.theater.cities?.id === cityId)
			}

			if (searchText.trim()) {
				result = result.filter((g) =>
					g.theater.name.toLowerCase().includes(searchText.trim().toLowerCase())
				)
			}

			if (screenType) {
				result = result
					.map((g) => ({
						...g,
						screens: g.screens.filter((s) => s.screen.name === screenType),
					}))
					.filter((g) => g.screens.length > 0)
			}

			if (brandId) {
				result = result.filter((g) => g.theater.brands?.id === brandId)
			}

			if (sortBy === 'cheapest') {
				result = [...result].sort((a, b) => {
					const minA = Math.min(...a.screens.flatMap((s) => s.showtimes.map((t) => t.price ?? Infinity)))
					const minB = Math.min(...b.screens.flatMap((s) => s.showtimes.map((t) => t.price ?? Infinity)))
					return minA - minB
				})
			} else if (sortBy === 'alphabet') {
				result = [...result].sort((a, b) =>
					a.theater.name.localeCompare(b.theater.name)
				)
			} else if (sortBy === 'nearest' && userLocation) {
				result = [...result].sort((a, b) => {
					// Use theater coords first, fall back to city coords
					const latA = a.theater.latitude ?? a.theater.cities?.latitude
					const lngA = a.theater.longitude ?? a.theater.cities?.longitude
					const latB = b.theater.latitude ?? b.theater.cities?.latitude
					const lngB = b.theater.longitude ?? b.theater.cities?.longitude

					const distA = latA && lngA
						? getDistance(userLocation.lat, userLocation.lng, latA, lngA)
						: Infinity
					const distB = latB && lngB
						? getDistance(userLocation.lat, userLocation.lng, latB, lngB)
						: Infinity

					return distA - distB
				})
			}

			setGrouped(result)
		}
		applyFilters(allGrouped)
	}, [allGrouped, cityId, searchText, screenType, brandId, sortBy, userLocation])


	const getPriceRange = (showtimes: LeanShowtime[]) => {
		const prices = showtimes
			.map((s) => s.price)
			.filter((p): p is number => p !== null)
		if (prices.length === 0) return '—'
		const min = Math.min(...prices)
		const max = Math.max(...prices)
		return min === max
			? formatPrice(min)
			: `${formatPrice(min)} - ${formatPrice(max)}`
	}

	if (loading) {
		return (
			<div className='mt-6 flex flex-col gap-4'>
				{[1, 2].map((i) => (
					<Skeleton key={i} w='w-full' h='h-20' rounded='rounded-xl' />
				))}
			</div>
		)
	}

	if (grouped.length === 0) {
		return (
			<div className='mt-6 text-shade-400 text-[16px]'>
				No showtimes available for this date.
			</div>
		)
	}

	return (
		<div className='my-11 flex flex-col gap-11'>
			{grouped.map(({ theater, screens }) => (
				<div key={theater.id}>

					<div className='sm:flex items-center justify-between mb-1 w-full'>
						<div className='flex items-center gap-2'>
							<span className='flex items-center justify-center shrink-0 text-pastel-yellow bg-royal-blue rounded-full size-8 text-lg'>
								<ImStarFull className='shrink-0'/>
							</span>
							<span className='text-shade-900 font-medium text-[18px] sm:text-2xl uppercase'>
								{theater.name}
							</span>
						</div>

						{theater.brands?.name && (
							<div
								className={`
                  text-white w-fit text-xs font-semibold px-2 py-1 mt-3 sm:mt-0 rounded-md uppercase
                  ${theater.brands.name.toUpperCase() === 'CGV' ? 'bg-cgv-red' :
										theater.brands.name.toUpperCase() === 'CINEPOLIS' ? 'bg-cinepolis-blue' :
											theater.brands.name.toUpperCase() === 'XXI' ? 'bg-linear-to-r from-xxi-gold to-xxi-gold-dark' :
												theater.brands.name.toUpperCase() === 'PVR' ? 'bg-purple-700' :
													theater.brands.name.toUpperCase() === 'INOX' ? 'bg-blue-600' : 'bg-gray-400'}
                `}
							>
								{theater.brands.name}
							</div>
						)}
					</div>

					<div className='font-normal text-[14px] sm:text-[16px] leading-6 text-shade-600 sm:mt-4.5'>
						{theater.address ?? ''}
					</div>

					{screens.map(({ screen, showtimes }) => (
						<div key={screen.id} className='mt-2 sm:mt-6'>
							<div className='flex justify-between items-center'>
								<div className='font-medium text-[18px] sm:text-2xl text-shade-600 leading-8'>
									{screen.name}
								</div>
								<div className='text-[18px] font-normal leading-7 text-shade-600'>
									{getPriceRange(showtimes)}
								</div>
							</div>

							<div className='flex flex-wrap sm:w-86 gap-4.5 sm:mt-4'>
								{showtimes.map((showtime) => {
									const isSelected = selectedId === showtime.id
									const isPast = isPastTime(showtime.show_time)

									return (
										<button
											key={showtime.id}
											onClick={() => {
												if (isPast) return
												setSelectedId(showtime.id)
												onShowtimeSelect({
													id: showtime.id,
													show_time: showtime.show_time,
													price: showtime.price,
													is_active: showtime.is_active,
													movie_id: showtime.movie_id,
													theater_id: showtime.theater_id,
													screen_id: showtime.screen_id,
													created_at: showtime.created_at,
													updated_at: showtime.updated_at,
													theater: {
														...theater,
														created_at: null,
														updated_at: null,
														user_id: null,
													},
													screen: {
														...screen,
														created_at: null,
														updated_at: null,
														seat_col: null,
														seat_row: null,
														total_seats: null,
														theater_id: null,
													},
												} as ShowtimeWithTheaterAndScreen)
											}}
											className={`
                        						px-4 py-2 rounded-md text-sm font-medium border transition-all
                        						${isPast
													? 'bg-shade-200 border-shade-200 text-shade-400 cursor-not-allowed'
													: isSelected
														? 'bg-royal-blue border-royal-blue text-white'
														: 'bg-white border-shade-600 text-shade-900 hover:bg-royal-blue-hover hover:text-white hover:border-royal-blue-hover cursor-pointer'
												}
                      						`}
										>
											{formatTime(showtime.show_time)}
										</button>
									)
								})}
							</div>
						</div>
					))}
				</div>
			))}
		</div>
	)
}