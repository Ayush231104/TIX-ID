import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { MovieStatus, GenreType } from '@/types/index';

interface MoviesState {
  searchQuery: string;
  selectedGenres: GenreType[];
  selectedStatus: MovieStatus | null;
  selectedCityId: string | null;
}

const initialState: MoviesState = {
  searchQuery: '',
  selectedGenres: [],
  selectedStatus: null,
  selectedCityId: null,
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleGenre: (state, action: PayloadAction<GenreType>) => {
      const genre = action.payload;
      if (state.selectedGenres.includes(genre)) {
        state.selectedGenres = state.selectedGenres.filter((g) => g !== genre);
      } else {
        state.selectedGenres.push(genre);
      }
    },
    setStatus: (state, action: PayloadAction<MovieStatus | null>) => {
      state.selectedStatus = action.payload;
    },
    setCity: (state, action: PayloadAction<string | null>) => {
      state.selectedCityId = action.payload;
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedGenres = [];
      state.selectedStatus = null;
      state.selectedCityId = null;
    },
  },
});

export const { setSearchQuery, toggleGenre, setStatus, setCity, resetFilters } = moviesSlice.actions;
export default moviesSlice.reducer;