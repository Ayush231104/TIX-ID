import { getShowtimes } from "@/actions/bookingActions"
import { ShowtimeForBooking } from "@/types"
import { useEffect, useRef, useState } from "react"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { MdOutlineWatchLater } from "react-icons/md"

export default function ShowtimeDropdown(
	{
		selectedShowtime,
		movieId,
		onSelect
	}: {
		selectedShowtime: ShowtimeForBooking | null
		movieId: string
		onSelect: (newShowtime: ShowtimeForBooking) => void
	}
) {
	const [isOpen, setIsOpen] = useState(false)
	const [showtimes, setShowtimes] = useState<ShowtimeForBooking[]>([])
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handler)
		return () => document.removeEventListener('mousedown', handler)
	}, [])

	useEffect(() => {
		if (!isOpen) return
		const fetchShowtimes = async () => {
			if (!selectedShowtime?.show_time) return
			const date = new Date(selectedShowtime?.show_time).toISOString().split('T')[0] // Get date in YYYY-MM-DD format
			const result = await getShowtimes(movieId, date)
			if (result.success && result.data) {
				// setShowtimes(result.data as ShowtimeForBooking[])
				const filtered = (result.data as ShowtimeForBooking[]).filter(
					(st) => st.screen_id === selectedShowtime.screen_id
				)
				setShowtimes(filtered)
			}
		}
		fetchShowtimes()
	}, [isOpen, movieId, selectedShowtime])

	const formatTime = (timestamp: string | undefined) => {
		if (!timestamp) return '--:--'
		return new Date(timestamp).toLocaleTimeString('en-IN', {
			hour: '2-digit',
			minute: '2-digit',
			hour12: false,
		})
	}

	const isPast = (timestamp: string) => new Date(timestamp) < new Date()

	return (
		<div ref={ref} className="relative">

			<button
				onClick={() => setIsOpen(true)}
				className='flex justify-center items-center gap-2 cursor-pointer'
			>
				<span className='text-shade-900 text-lg'><MdOutlineWatchLater size={20} /></span>
				<span className='font-medium text-2xl leading-8 text-shade-900'>
					{formatTime(selectedShowtime?.show_time)}
				</span>
				<IoIosArrowDown className='text-shade-900 text-xl' />

			</button>

			{isOpen && (
				<div className='absolute -top-4.25 -left-4.25 w-42 sm:w-94.5 bg-white rounded-xl shadow-md/30 shadow-gray-900 border border-gray-100 z-50 p-4 animate-in fade-in zoom-in-95'>

					{/* Panel header */}
					<button
						onClick={() => setIsOpen(false)}
						className='flex items-center justify-center gap-2 cursor-pointer'
					>
						<span className='text-shade-900 text-lg'><MdOutlineWatchLater size={20} /></span>
						<span className='font-medium text-2xl leading-8 text-shade-900'>
							{formatTime(selectedShowtime?.show_time)}
						</span>
						<IoIosArrowUp className='text-shade-900 text-xl' />
					</button>

					<div className='grid grid-cols-1 sm:grid-cols-4 gap-3 mt-4'>
						{showtimes.length === 0 && (
							<span className='text-sm text-shade-400'>Loading...</span>
						)}
						{showtimes.map((st) => {
							const isSelected = st.id === selectedShowtime?.id
							const past = isPast(st.show_time)

							return (
								<button
									key={st.id}
									disabled={past}
									onClick={() => {
										onSelect(st)
										setIsOpen(false)
									}}
									className={`
										w-19.5 px-4 py-2 rounded-md text-sm font-medium border transition-all
										${past
											? 'bg-shade-200 border-shade-200 text-shade-400 cursor-not-allowed'
											: isSelected
												? 'bg-royal-blue border-royal-blue text-white'
												: 'bg-white border-shade-600 text-shade-900 hover:bg-royal-blue hover:text-white hover:border-royal-blue active:bg-royal-blue-while-pressed active:text-shade-200 cursor-pointer'
										}
                  `}
								>
									{formatTime(st.show_time)}
								</button>
							)
						})}
					</div>

				</div>
			)}
		</div>
	)
}
