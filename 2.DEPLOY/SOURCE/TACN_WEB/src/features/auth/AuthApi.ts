import { ApiClient } from 'services/ApiService'

interface PayloadLogin {
  phone_number: string
  password: string
}

export const requestLogin = (payload: PayloadLogin) =>
  ApiClient.put('/login', payload)
export const requestLogout = () => ApiClient.put('/users/logout')
export const requestGetUserInfo = () => ApiClient.get('/users/info')
