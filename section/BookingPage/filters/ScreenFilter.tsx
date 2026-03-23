'use client'
import { createClient } from "@/utils/supabase/client"
import { useEffect, useRef, useState } from "react"
import { FaCaretDown, FaCaretUp } from "react-icons/fa"
import { FiCheck } from "react-icons/fi"

const supabase = createClient()

export default function ScreenFilter(
	{
		selectedScreenType,
		onSelect
	}: {
		selectedScreenType: string | null
		onSelect: (screenType: string | null) => void
	}
) {
	const [isOpen, setIsOpen] = useState(false)
	const [screenTypes, setScreenTypes] = useState<string[]>([])
	const ref = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const fetchScreenTypes = async () => {
			const { data, error } = await supabase
				.from('screen')
				.select('name')
				.order('name', { ascending: true })
			if (data) {
				const unique = [...new Set(data.map((s) => s.name))]
				setScreenTypes(unique)
			}
			else console.error('Error fetching screen types:', error)
		}
		fetchScreenTypes()
	}, [])

	useEffect(() => {
		const handler = (e: MouseEvent) => {
			if (ref.current && !ref.current.contains(e.target as Node)) {
				setIsOpen(false)
			}
		}
		document.addEventListener('mousedown', handler)
		return () => document.removeEventListener('mousedown', handler)
	}, [])

	return (
		<div ref={ref} className='relative'>
			<button
				onClick={() => setIsOpen(!isOpen)}
				className='flex items-center gap-2 px-4 py-2 text-[14px] font-normal text-shade-900 hover:bg-shade-100 rounded-lg transition cursor-pointer'
			>
				<span>Studio</span>
				{isOpen ? <FaCaretUp className='text-[12px]' /> : <FaCaretDown className='text-[12px]' />}
			</button>
			{isOpen && (
				<div className='absolute top-0 left-0 w-48 bg-white rounded-lg shadow-md/30 shadow-gray-900 border border-gray-100 z-50 py-2 animate-in fade-in zoom-in-95'>
					<button
						onClick={() => setIsOpen(false)}
						className='flex items-center gap-3 w-full text-left px-6 py-2 text-[14px] font-normal text-gray-900 hover:bg-gray-50 transition'
					>
						Studio
						<FaCaretUp className='text-sm' />
					</button>
					<div className='flex flex-col'>
						{screenTypes.map((type) => (
              <button
                key={type}
                onClick={() => { onSelect(selectedScreenType === type ? null : type); setIsOpen(false) }}
                className='w-full flex items-center justify-between px-4 py-2.5 text-[14px] transition cursor-pointer text-gray-900 hover:bg-shade-200 rounded-lg'
              >
                <span>{type}</span>
                {selectedScreenType === type && (
                  <FiCheck className='text-royal-blue text-lg' />
                )}
              </button>
            ))}
					</div>
				</div>
			)}
		</div>
	)
}
