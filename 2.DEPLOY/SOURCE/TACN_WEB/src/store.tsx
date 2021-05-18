import { configureStore, getDefaultMiddleware } from '@reduxjs/toolkit'
import RootReducer from 'features/rootReducer'
import Reactotron from './ReactotronConfig'

const reduxEnhancer = Reactotron.createEnhancer!()

export default configureStore({
  reducer: RootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware(),
  enhancers: [reduxEnhancer],
})
