import { ApiClient } from 'services/ApiService'

export const getStores = (payload: any) => ApiClient.get('/store', payload)
export const getStoreDetail = (payload: any) => ApiClient.get('/store', payload)
export const createStore = (payload: any) => ApiClient.post('/store', payload)
export const updateStore = (payload: any) => ApiClient.put('/store', payload)
export const deleteStore = (payload: any) => ApiClient.delete('/store', payload)
export const getListProvince = () => ApiClient.get('/province', { search: '' })
