import { ApiClient } from 'services/ApiService'

export const importGoods = (payload: any) =>
  ApiClient.post('/goods/receive', payload)
export const updateGoods = (payload: any) =>
  ApiClient.put('/goods/receive', payload)
export const deleteGoods = (payload: any) =>
  ApiClient.delete('/goods/receive', payload)
export const importReceipt = (payload: any) =>
  ApiClient.get('/goods/product-receipt', payload)
