import { ApiClient } from 'services/ApiService'

export const getInventorys = (payload: any) =>
  ApiClient.get('/goods/product-of-store', payload)
