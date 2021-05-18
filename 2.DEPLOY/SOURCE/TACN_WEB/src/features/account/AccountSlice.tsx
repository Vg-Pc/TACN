import { createSlice } from '@reduxjs/toolkit'

let initialState: any = {
  isLoading: true,
}

// export const

export const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setLoading: (state, action) => {},
    setData: (state, action) => {},
    setError: (state, action) => {},
  },
})

export const selectCount = (state: any) => state.account

export default accountSlice.reducer
