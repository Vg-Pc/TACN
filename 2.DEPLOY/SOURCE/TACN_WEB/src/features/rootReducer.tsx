import AccountReducer from './account/AccountSlice'
import StoreReducer from './store/store_list/StoreSlice'
import AuthReducer from './auth/AuthSlice'

const rootReducer = {
  accountReducer: AccountReducer,
  authReducer: AuthReducer,
  storeReducer: StoreReducer,
}

export default rootReducer
