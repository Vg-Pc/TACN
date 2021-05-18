import { ApiClient } from 'services/ApiService'

export const getSupplier = (payload: any) => ApiClient.get('/supplier', payload)
export const createSupplier = (payload: any) =>
  ApiClient.post('/supplier', payload)
export const requestTransactions = (payload: any) =>
  ApiClient.get('/report/transaction?', payload)
export const updateSupplier = (payload: any) =>
  ApiClient.put('/supplier', payload)
export const deleteSupplier = (payload: any) =>
  ApiClient.delete('/supplier', payload)
export const transactionHistory = (payload: any) =>
  ApiClient.get('/report/history?', payload)
