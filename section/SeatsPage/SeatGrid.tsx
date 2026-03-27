import { SeatWithStatus } from "@/types"
import SeatButton from "./SeatButton"

interface SeatGridProps {
    seats: SeatWithStatus[]
    selectedSeatIds: string[]
    currentUserId: string | null
    onSeatClick: (seat: SeatWithStatus) => void
} 

export default function SeatGrid({ seats, selectedSeatIds, currentUserId, onSeatClick }: SeatGridProps) {
    const totalCols = seats.length > 0
        ? Math.max(...seats.map((s) => s.seat_col))
        : 0;

    const halfCols = Math.floor(totalCols / 2)

    const seatsByRow = seats.reduce<Record<number, SeatWithStatus[]>>((acc, seat) => {
        if (!acc[seat.seat_row]) acc[seat.seat_row] = []
        acc[seat.seat_row].push(seat)
        return acc
    }, {})

    return (
        <div className=" w-full overflow-x-auto no-scrollbar">
            <div className="w-fit mx-auto">
            {Object.entries(seatsByRow)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([rowNum, rowSeats]) => {
                    const sorted = [...rowSeats].sort((a, b) => a.seat_col - b.seat_col)
                    const leftSeats = sorted.filter((s) => s.seat_col <= halfCols)
                    const rightSeats = sorted.filter((s) => s.seat_col > halfCols)
                    return (
                        <div key={rowNum} className="flex gap-10 sm:gap-20 justify-center">
                            <div className='flex gap-2 sm:gap-3'>
                                {leftSeats.map((seat) => (
                                    <SeatButton
                                    key={seat.id}
                                    seat={seat}
                                    currentUserId={currentUserId}
                                    isSelected={selectedSeatIds.includes(seat.id)}
                                    onClick={() => onSeatClick(seat)}
                                    />
                                ))}
                            </div>

                            <div className='flex gap-2 sm:gap-3'>
                                {rightSeats.map((seat) => (
                                    <SeatButton
                                    key={seat.id}
                                    seat={seat}
                                    currentUserId={currentUserId}
                                    isSelected={selectedSeatIds.includes(seat.id)}
                                        onClick={() => onSeatClick(seat)}
                                        />
                                    ))}
                            </div>
                        </div>
                    )
                })
            }
            </div>
        </div>
    )
}


