import { Brand } from "@/types"
import { createClient } from "@/utils/supabase/client"
import { useEffect, useRef, useState } from "react"
import { FaCaretDown, FaCaretUp } from "react-icons/fa"
import { FiCheck } from "react-icons/fi"

const supabase = createClient()

export default function CinemaFilter(
    {
        selectedBrandId,
        onSelect
    }: {
        selectedBrandId: string | null
        onSelect: (brandId: string | null) => void
    }
) {
    const [isOpen, setIsOpen] = useState(false)
    const [brands, setBrands] = useState<Brand[]>([])
    const ref = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const fetchBrands = async () => {
            const { data } = await supabase
                .from('brands')
                .select('*')
                .order('name', { ascending: true })
            if (data) setBrands(data as Brand[])
        }
        fetchBrands()
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

    const selectedBrand = brands.find((b) => b.id === selectedBrandId)

    return (
        <div ref={ref} className='relative'>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className='flex items-center gap-2 px-4 py-2 text-[14px] font-normal text-shade-900 hover:bg-shade-100 rounded-lg transition cursor-pointer'
            >
                <span>Cinema</span>
                {isOpen ? <FaCaretUp className='text-sm' /> : <FaCaretDown className='text-sm' />}
            </button>

            {isOpen && (
                <div className='absolute top-0 left-0 w-44 bg-white rounded-lg shadow-md/30 shadow-gray-900 border border-gray-100 z-50 py-2 animate-in fade-in zoom-in-95'>
                    <button
                        onClick={() => setIsOpen(false)}
                        className='flex items-center gap-3 w-full text-left px-6 py-2 text-[14px] font-normal text-gray-900 hover:bg-gray-50 transition'
                    >
                        Cinema
                        <FaCaretUp className='text-sm' />
                    </button>

                    <div className='flex flex-col mt-2 px-2'>
                        {brands.map((brand) => (
                            <button
                                key={brand.id}
                                onClick={() => { onSelect(selectedBrandId === brand.id ? null : brand.id); setIsOpen(false) }}
                                className='w-full flex items-center justify-between px-4 py-2.5 text-[14px] transition cursor-pointer text-gray-900 hover:bg-shade-200 rounded-lg'
                            >
                                <span className='font-medium'>{brand.name}</span>
                                {selectedBrandId === brand.id && (
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
