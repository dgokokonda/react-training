import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "@/types";
import {CategoriesObject} from '@/types'

interface UserState {
  value: User | null;
  categories: CategoriesObject | [],
  status: string,
  error: string | undefined
}

const initialState: UserState = {
  value: null,
  categories: [],
  status: 'idle', // idle | loading | fulfilled | failed
  error: ''
};

export const fetchCategories = createAsyncThunk(
  'user/fetchCategories',
  async () => {
    console.log('fetch')
    const response = await fetch('https://restapi.dns-shop.ru/v1/get-actual-offer-selection')
    const data = await response.json()
    console.log('d',data)
    return data
  }
)

// reducer
export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state: UserState, action: PayloadAction<User>) => {
      state.value = action.payload;
    },
    removeUser: (state: UserState) => {
      state.value = null
    },
    setStatus: (state: UserState, action:PayloadAction<CategoriesObject>) => {
      state.status = action.payload?.data ? 'fulfilled' : 'failed'
    }
    // fetchTodo: create.asyncThunk(
    //   async (id: string, thunkApi) => {
    //     const res = await fetch(`myApi/todos?id=${id}`)
    //     return (await res.json()) as Item
    //   },
    //   {
    //     pending: (state) => {
    //       state.loading = true
    //     },
    //     rejected: (state, action) => {
    //       state.loading = false
    //     },
    //     fulfilled: (state, action) => {
    //       state.loading = false
    //       state.todos.push(action.payload)
    //     },
    //   },
    // ),
  },
  selectors: {
    getUser: state => state.value,
    getCategories: state => state.categories
    // getTodo: (state, key) => state.find(current => current.key === key)
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'fulfilled'
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.error.message
      })
  }
});

export const { setUser, removeUser, setStatus } = userSlice.actions;


export default userSlice.reducer;
