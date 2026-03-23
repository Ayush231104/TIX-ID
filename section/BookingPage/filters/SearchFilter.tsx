import { useEffect, useState } from "react"
import { FiSearch } from "react-icons/fi"
import { IoCloseOutline } from "react-icons/io5"

export default function SearchFilter(
    {
        value,
        onChange
    }: {
        value: string
        onChange: (value: string) => void
    }
) {
    const [inputValue, setInputValue] = useState("")

  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(inputValue)
    }, 400)
    return () => clearTimeout(timer)
  }, [inputValue])

    return (
        <div className='flex max-w-85 items-center gap-2 border border-shade-300 rounded-md px-4.5 py-2 bg-white hover:bg-shade-200'>
            <input
                type='text'
                placeholder='Search cinema...'
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className='text-[16px] outline-none w-full text-shade-900 placeholder:text-shade-400'
            />
            <FiSearch className='text-shade-400 text-[20px] shrink-0' />
        </div>
    )
}
