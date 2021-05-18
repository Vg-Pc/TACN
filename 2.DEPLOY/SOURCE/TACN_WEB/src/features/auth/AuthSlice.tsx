import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import { SESSION_ID } from 'common/config'
import Cookie from 'js-cookie'
import { requestGetUserInfo, requestLogout } from './AuthApi'

let initialState: any = {
  isLoading: true,
  dialogLoading: false,
  userInfo: null,
}

export const getUserInfoAction = createAsyncThunk(
  'auth/info',
  async (payload, thunkApi) => {
    const res = await requestGetUserInfo()
    return res.data
  }
)

export const logoutAction = createAsyncThunk('auth/logout', async () => {
  const res = await requestLogout()
  return res.data
})

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setLoading: (state, action) => {},
    setData: (state, action) => {
      console.log(state, action, 'ahiahhi')
      state.data = action.payload
    },
    setError: (state, action) => {},
  },
  extraReducers: builder => {
    builder.addCase(getUserInfoAction.pending, (state, action) => {
      state.isLoading = true
      return state
    })
    builder.addCase(getUserInfoAction.fulfilled, (state, action) => {
      state.userInfo = action.payload
      state.isLoading = false
      return state
    })
    builder.addCase(getUserInfoAction.rejected, (state, action) => {
      state.isLoading = false
      state.userInfo = null
      return state
    })
    builder.addCase(logoutAction.pending, (state, action) => {
      state.isLoading = true
      return state
    })
    builder.addCase(logoutAction.fulfilled, (state, action) => {
      state = initialState
      Cookie.remove(SESSION_ID)
      window.location.href = '/'
      return state
    })
    builder.addCase(logoutAction.rejected, (state, action) => {
      state.isLoading = false
      return state
    })
  },
})

export const selectCount = (state: any) => state.account
export const { actions, reducer } = authSlice

export default reducer
