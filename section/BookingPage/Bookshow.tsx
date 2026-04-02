'use client'
import { useState } from "react";
import DateSelector from "./DateSelector";
import { ShowtimeForBooking } from "@/types";
import ShowtimeSection from "./ShowtimeSection";
import LocationFilter from "./filters/LocationFilter";
import SearchFilter from "./filters/SearchFilter";
import ScreenFilter from "./filters/ScreenFilter";
import SortFilter from "./filters/SortFilter";
import CinemaFilter from "./filters/CinemaFilter";

export type SortOption = 'nearest' | 'cheapest' | 'alphabet'

export default function Bookshow({
  movieId,
  onDateSelect,
  onShowtimeSelect,
}: {
  movieId: string
  onDateSelect: (date: Date) => void
  onShowtimeSelect: (showtime: ShowtimeForBooking) => void
}
) {

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const [selectedCityId, setSelectedCityId] = useState<string | null>(null)
  const [searchText, setSearchText] = useState('')
  const [selectedScreenType, setSelectedScreenType] = useState<string | null>(null)
  const [selectedBrandId, setSelectedBrandId] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState<SortOption | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date)
    onDateSelect(date)
  }

  return (
    <div className='mt-6 pl-8 md:pl-0'>
      <div>
        <h1 className='text-4xl font-bold sm:mb-4.5 text-shade-900'>TIMETABLE</h1>
        <p className='text-gray-600 text-[16px] font-normal'>Select the cinema schedule you want to watch</p>
      </div>

      <div>
        <DateSelector onDateSelect={handleDateSelect} />
        <hr className="mt-5.5 text-[#C4C4C4]" />
      </div>

      <div>
        <LocationFilter
          selectedCityId={selectedCityId}
          onCitySelect={setSelectedCityId}
        />

        <div className="flex flex-col sm:flex-row  md:flex-col lg:flex-row lg:items-center gap-5 lg:gap-10 mt-4 md:mt-8">
          <div>
            <SearchFilter
              value={searchText}
              onChange={setSearchText}
            />
          </div>
          <div className="flex items-center gap-1">
            <div>
              <ScreenFilter
                selectedScreenType={selectedScreenType}
                onSelect={setSelectedScreenType}
              />
            </div>
            <div>
              <SortFilter
                sortBy={sortBy}
                onSelect={setSortBy}
                onLocationFetched={setUserLocation}
              />
            </div>
            <div>
              <CinemaFilter
                selectedBrandId={selectedBrandId}
                onSelect={setSelectedBrandId}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <ShowtimeSection
          movieId={movieId}
          selectedDate={selectedDate}
          onShowtimeSelect={onShowtimeSelect}

          cityId={selectedCityId}
          searchText={searchText}
          screenType={selectedScreenType}
          brandId={selectedBrandId}
          sortBy={sortBy}
          userLocation={userLocation}
        />
      </div>
    </div>
  )
}
