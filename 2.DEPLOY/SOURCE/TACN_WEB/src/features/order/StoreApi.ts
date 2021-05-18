import { ApiClient } from 'services/ApiService'

export interface GetListStorePayload {
  search: string
  page: number
  province_id?: number
}

export const requestGetListStore = (payload: GetListStorePayload) =>
  ApiClient.get('/store', payload)
