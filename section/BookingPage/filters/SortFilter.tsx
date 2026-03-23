'use client'

import { useRef, useState } from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'
import { FiCheck } from 'react-icons/fi'
import { SortOption } from '../Bookshow'

const SORT_OPTIONS: { label: string; value: SortOption }[] = [
  { label: 'Nearest',        value: 'nearest'  },
  { label: 'Cheapest Price', value: 'cheapest' },
  { label: 'Alphabet',       value: 'alphabet' },
]

export default function SortFilter({
  sortBy,
  onSelect,
  onLocationFetched,
}: {
  sortBy: SortOption | null
  onSelect: (sort: SortOption | null) => void
  onLocationFetched: (loc: { lat: number; lng: number }) => void
}) {
  const [isOpen, setIsOpen]       = useState(false)
  const [locLoading, setLocLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const handleSelect = (option: SortOption) => {
    if (sortBy === option) {
      onSelect(null)
      setIsOpen(false)
      return
    }

    if (option === 'nearest') {
      setLocLoading(true)
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onLocationFetched({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          onSelect('nearest')
          setLocLoading(false)
          setIsOpen(false)
        },
        () => {
          alert('Please allow location access to use Nearest filter.')
          setLocLoading(false)
        }
      )
      return
    }

    onSelect(option)
    setIsOpen(false)
  }

  const selectedLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label

  return (
    <div ref={ref} className='relative'>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className='flex items-center gap-2 px-4 py-2 text-[14px] font-normal text-shade-900 hover:bg-shade-100 rounded-lg transition cursor-pointer'
      >
        <span>Sort</span>
        {isOpen ? <FaCaretUp className='text-sm' /> : <FaCaretDown className='text-sm' />}
      </button>

      {isOpen && (
        <div className='absolute -top-3 -left-4 w-48 bg-white rounded-lg shadow-md/30 shadow-gray-900 border border-gray-100 z-50 py-2 animate-in fade-in zoom-in-95'>
          <button
            onClick={() => setIsOpen(false)}
            className='flex items-center gap-3 w-full text-left px-6 py-2 text-[14px] font-normal text-gray-900 hover:bg-gray-50 transition'
          >
            Sort
            <FaCaretUp className='text-sm' />
          </button>

          <div className='flex flex-col mt-2 px-2'>
            {SORT_OPTIONS.map((option) => (
              <button
                key={option.value}
                onClick={() => handleSelect(option.value)}
                disabled={locLoading && option.value === 'nearest'}
                className='w-full flex items-center justify-between px-4 py-2.5 text-[14px] transition cursor-pointer text-gray-900 hover:bg-shade-200 rounded-lg disabled:opacity-50'
              >
                <span>
                  {option.value === 'nearest' && locLoading
                    ? 'Getting location...'
                    : option.label}
                </span>
                {sortBy === option.value && (
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