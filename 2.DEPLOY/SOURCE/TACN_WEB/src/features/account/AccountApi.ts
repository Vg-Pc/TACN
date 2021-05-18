import { ApiClient } from 'services/ApiService'

export const getAccounts = (payload: any) => ApiClient.get('/users', payload)
export const createAccount = (payload: any) => ApiClient.post('/users', payload)
export const updateAccount = (payload: any) => ApiClient.put('/users', payload)
export const resetPassword = (payload: any) =>
  ApiClient.put('/users/reset-password', payload)
export const deleteAccount = (payload: any) =>
  ApiClient.delete('/users', payload)
