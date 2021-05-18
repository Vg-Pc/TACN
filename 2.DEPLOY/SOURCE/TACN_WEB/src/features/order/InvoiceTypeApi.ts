import { ApiClient } from 'services/ApiService'

interface GetListInvoiceTypePayload {
  page: number
  search: string
  voucher_type?: any
}

interface UpdateInvoiceTypePayload {
  id: number
  name: string
  voucher_type: number
}
interface CreateInvoiceTypePayload {
  name: string
  voucher_type: number
}

export interface DeleteInvoiceTypePayload {
  id: Array<number>
}

export const requestGetListInvoiceType = (payload: GetListInvoiceTypePayload) =>
  ApiClient.get('/invoice-type', payload)
export const requestUpdateInvoiceType = (payload: UpdateInvoiceTypePayload) =>
  ApiClient.put('/invoice-type', payload)
export const requestCreateInvoiceType = (payload: CreateInvoiceTypePayload) =>
  ApiClient.post('/invoice-type', payload)
export const requestDeleteInvoiceType = (payload: DeleteInvoiceTypePayload) =>
  ApiClient.delete('/invoice-type', payload)
