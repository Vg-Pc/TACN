import { ApiClient } from 'services/ApiService'

export interface GetOrderPayload {
  search: string
  page: number
  from_date: string
  to_date: string
  store_id: string | number
  sale_type: string | number
  staff_id: string | number
}

export interface DeleteOrderPayload {
  order_id: number
}

export interface EditOrderPayload {
  order_id: number
  note: string
  first_discount: number
  second_discount: number
  paid_price: number
  customer_id: number
  store_id: number
  sale_type: number
  payment_type: number
  products: Array<any>
}

export const requestGetListOrder = (payload: GetOrderPayload) =>
  ApiClient.get('/order', payload)
export const createOrder = (payload: any) => ApiClient.post('/order', payload)
export const editOrder = (payload: any) => ApiClient.put('/order', payload)
export const deleteOrder = (payload: DeleteOrderPayload) =>
  ApiClient.delete('/order', payload)
export const requestGetOrderDetail = (id: number) =>
  ApiClient.get(`/order/${id}`)
