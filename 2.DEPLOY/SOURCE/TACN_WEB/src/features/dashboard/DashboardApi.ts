import { ApiClient } from 'services/ApiService'

export const requestGetStatistic = (
  from_date: any,
  to_date: any,
  store_id: any
) =>
  ApiClient.get(
    `/statistic?from_date=${from_date}&to_date=${to_date}&store_id=${store_id}`
  )
