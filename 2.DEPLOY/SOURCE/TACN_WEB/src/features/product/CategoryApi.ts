import { ApiClient } from 'services/ApiService'
interface ListCategoryPayload {
  search: string
  page: number
  province_id?: string
}

interface CreateCategoryPayload {
  name: string
}

interface UpdateCategoryPayload {
  id: number
  name: string
}

interface DeleteCategoryPayload {
  id: Array<number>
}

interface GetListUnitPayload {
  search: string
  page: number
}

export const requestGetListCategory = (payload: ListCategoryPayload) =>
  ApiClient.get('/product-category', payload)
export const requestCreateCategory = (payload: CreateCategoryPayload) =>
  ApiClient.post('/product-category', payload)
export const requestUpdateCategory = (payload: UpdateCategoryPayload) =>
  ApiClient.put('/product-category', payload)
export const requestDeleteCategory = (payload: DeleteCategoryPayload) =>
  ApiClient.delete('/product-category', payload)
export const requestGetListUnit = (payload: GetListUnitPayload) =>
  ApiClient.get('unit', payload)
export const requestCreateUnit = (payload: CreateCategoryPayload) =>
  ApiClient.post('/unit', payload)
export const requestUpdateUnit = (payload: UpdateCategoryPayload) =>
  ApiClient.put('/unit', payload)
export const requestDeleteUnit = (payload: DeleteCategoryPayload) =>
  ApiClient.delete('/unit', payload)
