'use client'
import Skeleton from '@/components/ui/Skeleton'
import { Brand, Screen, ShowtimeWithTheaterAndScreen, Theater } from '@/types'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

type ScreenGroup = {
	screen: Screen
	showtimes: ShowtimeWithTheaterAndScreen[]
}


type TheaterGroup = {
	theater: Theater & { brands: Brand | null }
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


export default function ShowtimeSection({
	movieId,
	selectedDate,
	onShowtimeSelect,
}: {
	movieId: string
	selectedDate: Date
	onShowtimeSelect: (showtime: ShowtimeWithTheaterAndScreen) => void
}
) {
	const [grouped, setGrouped] = useState<TheaterGroup[]>([]);
	const [selectedId, setSelectedId] = useState<string | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchAndGroup = async () => {
			setLoading(true)

			const start = new Date(selectedDate)
			start.setHours(0, 0, 0, 0)

			const end = new Date(selectedDate)
			end.setHours(23, 59, 59, 999)

			const { data, error } = await supabase
				.from('showtimes')
				.select(`*,
                theater:theater_id(*, brands:brand_id(*)),
                screen:screen_id(*)
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

			// Group flat rows → theater → screen → showtimes
			const theaterMap = new Map<string, TheaterGroup>()

			for (const row of (data ?? []) as ShowtimeWithTheaterAndScreen[]) {
				const theaterId = row.theater_id as string
				const screenId = row.screen_id as string

				if (!theaterMap.has(theaterId)) {
					theaterMap.set(theaterId, {
						theater: row.theater as Theater & { brands: Brand | null },
						screens: [],
					})
				}

				const theaterGroup = theaterMap.get(theaterId)!

				let screenGroup = theaterGroup.screens.find(
					(s) => s.screen.id === screenId
				)

				if (!screenGroup) {
					screenGroup = {
						screen: row.screen as Screen,
						showtimes: [],
					}
					theaterGroup.screens.push(screenGroup)
				}

				screenGroup.showtimes.push(row)
			}

			setGrouped(Array.from(theaterMap.values()))
			setLoading(false)
		}
		if (!movieId) return
		fetchAndGroup()
	}, [movieId, selectedDate])

	const getPriceRange = (showtimes: ShowtimeWithTheaterAndScreen[]) => {
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
					<Skeleton
						key={i}
						w='w-full'
						h='h-20'
						rounded='rounded-xl'
					/>
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
		<div className='mt-12 flex flex-col gap-11'>
			{grouped.map(({ theater, screens }) => (
				<div
					key={theater.id}
					className='border border-shade-200 rounded-xl p-4 md:p-6'
				>
					{/* ── Theater Header ── */}
					<div className='flex items-center justify-between mb-1'>
						<div className='flex items-center gap-2'>
							<span className='text-yellow-400 text-lg'>★</span>
							<span className='text-shade-900 font-bold text-[16px] uppercase'>
								{theater.name}
							</span>
						</div>

						{/* Brand badge */}
						{theater.brands?.name && (
							<span className='bg-royal-blue text-white text-xs px-2 py-1 rounded font-bold uppercase'>
								{theater.brands.name}
							</span>
						)}
					</div>

					{/* Theater address */}
					<p className='text-shade-400 text-sm mb-4'>{theater.address ?? ''}</p>

					<hr className='border-shade-200 mb-4' />

					{/* ── Screens ── */}
					{screens.map(({ screen, showtimes }) => (
						<div key={screen.id} className='mb-5 last:mb-0'>

							{/* Screen name + price range */}
							<div className='flex items-center justify-between mb-3'>
								<span className='text-shade-900 font-semibold text-[16px] uppercase'>
									{screen.name}
								</span>
								<span className='text-shade-600 text-sm'>
									{getPriceRange(showtimes)}
								</span>
							</div>

							{/* ── Time buttons ── */}
							<div className='flex flex-wrap gap-2'>
								{showtimes.map((showtime) => {
									const isSelected = selectedId === showtime.id

									return (
										<button
											key={showtime.id}
											onClick={() => {
												setSelectedId(showtime.id)
												onShowtimeSelect(showtime)
											}}
											className={`
                        px-4 py-2 rounded-lg text-sm font-medium border transition-all
                        ${isSelected
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
