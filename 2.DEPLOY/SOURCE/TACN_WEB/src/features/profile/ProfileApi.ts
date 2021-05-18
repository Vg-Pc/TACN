import { ApiClient } from 'services/ApiService'

interface ChangePasswordPayload {
  old_password: string
  new_password: string
}

export const requestChangePassword = (payload: ChangePasswordPayload) =>
  ApiClient.put(`/users/update-password`, payload)
