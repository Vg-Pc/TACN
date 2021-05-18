import { ApiClient } from 'services/ApiService'

interface ListProductsPayload {
  search: string
  page: number
}

export interface UpdateProductPayload {
  id: number
  name: string
  unit_id: number
  product_category_id: number
  retail_price: number
  wholesale_price: number
  import_price: number
  images?: any
  image_delete?: Array<any>
}
export interface CreateProductPayload {
  code: string
  name: string
  unit_id: number
  product_category_id: number
  retail_price: number
  wholesale_price: number
  import_price: number
  images?: string[]
}
export interface DeleteProductPayload {
  id: [number]
}

export const requestGetListProduct = (payload: ListProductsPayload) =>
  ApiClient.get('/product', payload)
export const requestGetProductDetail = (id: number) =>
  ApiClient.get(`/product/${id}`)
export const requestUpdateProduct = (payload: UpdateProductPayload) =>
  ApiClient.put('/product', payload)
export const requestUploadImageProduct = (payload: any) =>
  ApiClient.post('/image', payload)
export const requestCreateProduct = (payload: CreateProductPayload) =>
  ApiClient.post('/product', payload)
export const requestDeleteProduct = (payload: DeleteProductPayload) =>
  ApiClient.delete('/product', payload)
