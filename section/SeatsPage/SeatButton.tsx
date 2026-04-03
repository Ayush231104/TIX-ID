import { SeatWithStatus } from "@/types"

const rowToLetter = (row: number) => String.fromCharCode(64 + row)

const getSeatLabel = (seat: SeatWithStatus) =>
    `${rowToLetter(seat.seat_row)}${seat.seat_col}`

export default function SeatButton({
    seat,
    isSelected,
    currentUserId,
    onClick,
}: {
    seat: SeatWithStatus
    isSelected: boolean
    currentUserId: string | null
    onClick: () => void
}) {
    const label = getSeatLabel(seat)

    const isBooked = seat.is_booked
    const isLockedByMe = isSelected
    const isLockedByOther = seat.is_locked && seat.locked_by_user_id !== currentUserId
    const isProcessingByMe = seat.is_locked && seat.locked_by_user_id === currentUserId && !isSelected

    let colorClass: string

    if (isBooked) {
        colorClass = 'bg-royal-blue text-white cursor-not-allowed'
    }else if (isLockedByOther) {
        colorClass = 'bg-white border-2 border-yellow-400 text-shade-900 cursor-not-allowed'
    } else if (isLockedByMe) {
        colorClass = 'bg-sky-blue text-white cursor-pointer'
    } else {
        colorClass = 'bg-white border border-shade-300 text-shade-900 hover:bg-royal-blue hover:text-white active:bg-royal-blue-while-pressed cursor-pointer'
    }

    return (
        <button
            onClick={onClick}
            disabled={isBooked || isLockedByOther || isProcessingByMe}
            title={isLockedByOther ? 'Held by another user' : label}
            className={`w-7 h-6 sm:w-10 sm:h-9 text-[10px] sm:text-xs mb-1 sm:mb-3 leading-3 font-medium rounded-md transition-all ${colorClass}`}
        >
            {label}
        </button>
    )
}