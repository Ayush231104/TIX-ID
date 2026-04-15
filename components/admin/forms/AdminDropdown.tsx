'use client'

import { useEffect, useRef, useState } from 'react'
import { FaCaretDown, FaCaretUp } from 'react-icons/fa'
import { FiCheck } from 'react-icons/fi'

type DropdownOption = {
  label: string
  value: string
}

export default function AdminDropdown({
  title,
  placeholder,
  options,
  value,
  onSelect,
  disabled = false,
  loading = false,
  loadingText = 'Loading...',
  optionsMaxHeightClass,
}: {
  title: string
  placeholder: string
  options: DropdownOption[]
  value: string | null
  onSelect: (value: string) => void
  disabled?: boolean
  loading?: boolean
  loadingText?: string
  optionsMaxHeightClass?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
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

  const selectedOption = options.find((option) => option.value === value)
  const triggerText = selectedOption?.label ?? placeholder

  return (
    <div ref={ref} className='relative'>
      <button
        type='button'
        onClick={() => {
          if (!disabled) {
            setIsOpen((prev) => !prev)
          }
        }}
        disabled={disabled}
        className='flex w-full items-center justify-between gap-2 rounded-lg border border-shade-300 px-4 py-3 text-left text-[14px] font-normal text-shade-900 transition hover:bg-shade-100 disabled:cursor-not-allowed disabled:bg-shade-200 disabled:text-shade-500'
      >
        <span>{triggerText}</span>
        {isOpen ? <FaCaretUp className='text-[12px]' /> : <FaCaretDown className='text-[12px]' />}
      </button>

      {isOpen ? (
        <div className='absolute top-0 left-0 z-50 w-full animate-in fade-in zoom-in-95 rounded-lg border border-gray-100 bg-white py-2 shadow-md/30 shadow-gray-900'>
          <button
            type='button'
            onClick={() => setIsOpen(false)}
            className='flex w-full items-center gap-3 px-6 py-2 text-left text-[14px] font-normal text-gray-900 transition hover:bg-gray-50'
          >
            {title}
            <FaCaretUp className='text-sm' />
          </button>

          <div className={`flex flex-col ${optionsMaxHeightClass ? `${optionsMaxHeightClass} overflow-y-auto no-scrollbar` : ''}`}>
            {loading ? (
              <div className='px-4 py-2.5 text-[14px] text-shade-500'>
                {loadingText}
              </div>
            ) : options.length === 0 ? (
              <div className='px-4 py-2.5 text-[14px] text-shade-500'>
                No options
              </div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type='button'
                  onClick={() => {
                    onSelect(option.value)
                    setIsOpen(false)
                  }}
                  className='flex w-full cursor-pointer items-center justify-between rounded-lg px-4 py-2.5 text-[14px] text-gray-900 transition hover:bg-shade-200'
                >
                  <span>{option.label}</span>
                  {value === option.value ? <FiCheck className='text-lg text-royal-blue' /> : null}
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
