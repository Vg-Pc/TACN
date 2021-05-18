import { createSlice } from '@reduxjs/toolkit'

let initialState: any = {
  isLoading: true,
}

export const InventorySlice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setLoading: (state, action) => {},
    setData: (state, action) => {},
    setError: (state, action) => {},
  },
})

export const selectCount = (state: any) => state.store

export default InventorySlice.reducer
