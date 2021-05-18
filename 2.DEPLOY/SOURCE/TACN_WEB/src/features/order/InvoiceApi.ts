import { ApiClient } from 'services/ApiService'

export interface GetListInvoicePayload {
  search: string
  page: number
  invoice_type_id: number | string
  voucher_type: number | string
  staff_id: number | string
  invoice_object: number | string
}

export interface CreateInvoicePayload {
  voucher_type: number
  invoice_type_id: number
  amount: number
  staff_id: number
  customer_id: number
  supplier_id: number
  reason: string
}
export interface UpdateInvoicePayload {
  id: number
  voucher_type: number
  invoice_type_id: number
  amount: number
  staff_id: number
  customer_id: number
  supplier_id: number
  reason: string
}

export interface DeleteInvoicePayload {
  id: number
}

export const requestGetListInvoice = (payload: GetListInvoicePayload) =>
  ApiClient.get('/invoice', payload)
export const requestGetDetailInvoice = (id: number) =>
  ApiClient.get(`/invoice/${id}`)
export const requestCreateInvoice = (payload: CreateInvoicePayload) =>
  ApiClient.post('/invoice', payload)
export const requestUpdateInvoice = (payload: UpdateInvoicePayload) =>
  ApiClient.put('/invoice', payload)
export const requestDeleteInvoice = (payload: DeleteInvoicePayload) =>
  ApiClient.delete('/invoice', payload)
