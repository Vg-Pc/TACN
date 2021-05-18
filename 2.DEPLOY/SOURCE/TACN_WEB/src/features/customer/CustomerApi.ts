import { ApiClient } from 'services/ApiService'

export const getCustomers = (payload: any) =>
  ApiClient.get('/customer', payload)
export const createCustomer = (payload: any) =>
  ApiClient.post('/customer', payload)
export const requestGetListProvider = (payload: any) =>
  ApiClient.get('/supplier', payload)
export const requestTransactions = (payload: any) =>
  ApiClient.get('/report/transaction?', payload)
export const updateCustomer = (payload: any) =>
  ApiClient.put('/customer', payload)
export const deleteCustomer = (payload: any) =>
  ApiClient.delete('/customer', payload)
export const purchaseHistory = (payload: any) =>
  ApiClient.get('/report/history?', payload)
