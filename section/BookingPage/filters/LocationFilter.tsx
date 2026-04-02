'use client'
import { City } from "@/types"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useRef, useState } from "react"
import { FaCaretDown, FaCaretUp } from "react-icons/fa"
import { FiSearch } from "react-icons/fi"
import { SlLocationPin } from "react-icons/sl"

const supabase = createClient()

export default function LocationFilter(
    {
        selectedCityId,
        onCitySelect
    }: {
        selectedCityId: string | null
        onCitySelect: (cityId: string | null) => void
    }) {

    const [isOpen, setIsOpen] = useState(false)
    const [cities, setCities] = useState<City[]>([])
    const [search, setSearch] = useState('')
    const [selectedCity, setSelectedCity] = useState<City | null>(null)
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchCities = async () => {
            const { data, error } = await supabase
                .from('cities')
                .select('*')
                .order('name', { ascending: true })

            if (data) setCities(data)
            else console.error('Error fetching cities:', error)
        }
        fetchCities()
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

    const filtered = cities.filter(city => city.name.toLowerCase().includes(search.toLowerCase()))

    const handleSelect = (city: City) => {
        setSelectedCity(city)
        onCitySelect(city.id)
        setIsOpen(false)
        setSearch('')
    }

    const handleClear = () => {
        setSelectedCity(null)
        onCitySelect(null)
        setIsOpen(false)
    }
    return (
        <div ref={ref} className="relative sm:mt-4">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-shade-900 hover:bg-shade-100 rounded-lg transition cursor-pointer'
            >
                <SlLocationPin className='text-royal-blue text-2xl font-normal' />
                <span className='uppercase text-[20px] font-normal text-black'>
                    {selectedCity ? selectedCity.name : 'Location'}
                </span>
                {isOpen ? <FaCaretUp className='text-sm' /> : <FaCaretDown className='text-sm' />}
            </button>

            {isOpen && (
                <div className="absolute top-0 left-0 w-fit bg-white rounded-lg shadow-md/30 shadow-gray-900 border border-gray-100 z-50 py-2 animate-in fade-in zoom-in-95">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className='flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-shade-900 hover:bg-shade-100 rounded-lg transition cursor-pointer'
                    >
                        <span className='uppercase text-[20px] font-normal text-black'>
                            Location
                        </span>
                        {isOpen ? <FaCaretUp className='text-sm' /> : <FaCaretDown className='text-sm' />}
                    </button>
                    <div className="px-3 pb-2 mt-4">
                        <div className="w-57 flex items-center gap-2 border border-shade-200 rounded-lg px-3 py-1">
                            <FiSearch className="text-shade-400 text-sm" />
                            <input
                                type='text'
                                placeholder='Search City'
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className='text-[16px] outline-none w-full text-shade-900 leading-6 placeholder:text-shade-400'
                            />
                        </div>
                    </div>

                    <div className='max-h-48 overflow-y-auto flex flex-col px-2 no-scrollbar'>
                        {selectedCityId && (
                            <button
                                onClick={handleClear}
                                className='w-full text-left px-4 py-2 text-[13px] text-red-400 hover:bg-shade-100 rounded-lg transition'
                            >
                                Clear filter
                            </button>
                        )}
                        {filtered.map((city) => (
                            <button
                                key={city.id}
                                onClick={() => handleSelect(city)}
                                className={`text-left mx-4 py-2.5 text-[16px] leading-2xl transition cursor-pointer border-b border-shade-200
                                    ${selectedCityId === city.id
                                        ? 'text-royal-blue font-normal'
                                        : 'text-shade-900 hover:bg-shade-100'
                                    }`}
                            >
                                {city.name.toUpperCase()}
                            </button>
                        ))}
                        {filtered.length === 0 && (
                            <p className='px-4 py-2 text-[13px] text-shade-400'>No cities found</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
