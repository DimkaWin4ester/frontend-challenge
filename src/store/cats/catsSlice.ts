import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const { VITE_API_KEY, VITE_BASE_URL } = import.meta.env;

export interface Cat {
  id: string;
  url: string;
  width: number;
  height: number;
  breeds?: string[];
}

export interface CatsState {
  cats: Cat[];
  loading: boolean;
  error: string | null;
  likedCats: string[];
}

const initialState: CatsState = {
  cats: [],
  loading: false,
  error: null,
  likedCats: localStorage.getItem('likedCats')
    ? JSON.parse(localStorage.getItem('likedCats') as string)
    : [],
};

export const fetchCats = createAsyncThunk('cats/fetchCats', async () => {
  try {
    const response = await fetch(`${VITE_BASE_URL}/images/search?limit=15`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': VITE_API_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(`Ошибка: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    throw new Error(`Ошибка:  ${error}`);
  }
});

export const fetchCatsLiked = createAsyncThunk(
  'cats/fetchCatsLiked',
  async () => {
    try {
      const likedIds = JSON.parse(
        localStorage.getItem('likedCats') || '[]'
      ) as string[];

      if (likedIds.length === 0) {
        return [];
      }

      const responses = await Promise.all(
        likedIds.map(async (id) => {
          const response = await fetch(`${VITE_BASE_URL}/images/${id}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'x-api-key': VITE_API_KEY,
            },
          });
  
          if (!response.ok) {
            throw new Error(`Ошибка: ${response.status}`);
          }
  
          return await response.json();
        })
      );

      return responses;
    } catch (error) {
      throw new Error(`Ошибка:  ${error}`);
    }
  }
);

export const catsSlice = createSlice({
  name: 'cats',
  initialState,
  reducers: {
    switchLikeCat: (state, action) => {
      if (state.likedCats.includes(action.payload)) {
        state.likedCats = state.likedCats.filter((id) => id !== action.payload);
      } else {
        state.likedCats = [...state.likedCats, action.payload];
      }
      localStorage.setItem('likedCats', JSON.stringify(state.likedCats));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCats.fulfilled, (state, action) => {
        state.loading = false;
        state.cats = [...state.cats, ...action.payload];
      })
      .addCase(fetchCats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при загрузке котиков';
      })
      .addCase(fetchCatsLiked.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCatsLiked.fulfilled, (state, action) => {
        state.loading = false;
        state.cats = action.payload;
      })
      .addCase(fetchCatsLiked.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Ошибка при загрузке котиков';
      });
  },
});

export const { switchLikeCat } = catsSlice.actions;

export default catsSlice.reducer;
