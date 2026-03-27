import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NewsState {
  searchQuery: string;
  selectedCategories: string[];
}

const initialState: NewsState = {
  searchQuery: '',
  selectedCategories: [],
};

const newsSlice = createSlice({
  name: 'news',
  initialState,
  reducers: {
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    toggleCategory: (state, action: PayloadAction<string>) => {
      const category = action.payload;
      if (state.selectedCategories.includes(category)) {
        state.selectedCategories = state.selectedCategories.filter((c) => c !== category);
      } else {
        state.selectedCategories.push(category);
      }
    },
    resetFilters: (state) => {
      state.searchQuery = '';
      state.selectedCategories = [];
    },
  },
});

export const { setSearchQuery, toggleCategory, resetFilters } = newsSlice.actions;
export default newsSlice.reducer;