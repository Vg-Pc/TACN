import { ApiClient } from 'services/ApiService'
import { number } from 'utils/ruleForm'

interface DeleteOrderReturnPayload {
  goods_return_id: number
}
interface EditOrderReturnPayload {
  goods_return_id: number
  note: string
  first_discount: number
  second_discount: number
  staff_id: number
  customer_id: number
  store_id: number
  return_price: number
  products: Array<any>
}

export const createOrderReturn = (payload: any) =>
  ApiClient.post('/goods/return', payload)
export const editOrderReturn = (payload: any) =>
  ApiClient.put('/goods/return', payload)
export const deleteOrderReturn = (payload: DeleteOrderReturnPayload) =>
  ApiClient.delete('/goods/return', payload)
