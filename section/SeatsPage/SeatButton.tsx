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

    let colorClass: string

    if (isBooked) {
        colorClass = 'bg-royal-blue text-white cursor-not-allowed'
    } else if (isLockedByOther) {
        // yellow border — someone else has it in their cart
        colorClass = 'bg-white border-2 border-yellow-400 text-shade-900 cursor-not-allowed'
    } else if (isLockedByMe) {
        colorClass = 'bg-sky-blue text-white cursor-pointer'
    } else {
        colorClass = 'bg-white border border-shade-300 text-shade-900 hover:bg-royal-blue hover:text-white cursor-pointer'
    }

    return (
        <button
      onClick={onClick}
      disabled={isBooked || isLockedByOther}
      title={isLockedByOther ? 'Held by another user' : label}
      className={`w-10 h-9 text-xs mb-3 leading-3 font-medium rounded-md transition-all ${colorClass}`}
    >
      {label}
    </button>
    )
}