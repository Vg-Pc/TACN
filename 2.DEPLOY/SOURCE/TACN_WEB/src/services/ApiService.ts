import Cookie from 'js-cookie'
import { create } from 'apisauce'
// import { BASE_URL_DEV } from './Constant';

import { API_STATUS } from 'utils/constants'
import reactotron from 'ReactotronConfig'
import queryString from 'query-string'
import swal from 'sweetalert'
import R from 'utils/R'
import { SESSION_ID } from 'common/config'
import { message } from 'antd'
import history from 'utils/history'
const BASE_URL_DEV = 'http://3.1.13.10:8700'
// const BASE_URL_DEV = 'http://localhost:8700'
const createAPI = () => {
  const APIInstant = create({
    baseURL: BASE_URL_DEV,
    timeout: 20000,
    headers: { 'Content-Type': 'application/json' },
  })
  reactotron.log!('createAPI')
  APIInstant.addMonitor((reactotron as any).apisauce)

  // if (localStorage.getItem('token')) {
  APIInstant.setHeader('token', Cookie.get(SESSION_ID) || '')
  // }
  APIInstant.axiosInstance.interceptors.request.use(
    async config => {
      config.headers.token = Cookie.get(SESSION_ID)
      return config
    },
    error => Promise.reject(error)
  )
  APIInstant.axiosInstance.interceptors.response.use(response => {
    const data = response.data
    if (
      (data && data.code === API_STATUS.RE_LOGIN) ||
      data.code === API_STATUS.NOT_FOUND
    ) {
      Cookie.set(SESSION_ID, '')
      localStorage.setItem('token', '')
      history.push('logout')
      // const store = require('../redux/store').default
      //   store.dispatch({ type: LOGOUT })
      //   NavigationUtil.navigate(SCREEN_ROUTER_APP.HOME)
      //   showMessages(R.strings().notification, R.strings().re_login)
      // }
    } else if (data && data.status !== 1) {
      swal({
        title: R.strings().fail_request,
        text: data?.msg || R.strings().error_network,
        icon: 'error',
      })
    }
    //   showMessages(R.strings().notification, data.msg)
    return response
  })
  return APIInstant
}
const axiosInstance = createAPI()

/* Support function */
function handleResult(api: any) {
  return api.then((res: { data: { status: number; code: number } }) => {
    if (res?.data?.status !== 1) {
      message.error(`Đã có lỗi xảy ra, vui lòng thử lại`)
      return Promise.reject(res?.data)
    }
    return Promise.resolve(res?.data)
  })
}

function parseUrl(url: string, query: any) {
  return queryString.stringifyUrl({ url: url, query })
}

export const ApiClient = {
  get: (url: string, payload?: any) =>
    handleResult(axiosInstance.get(parseUrl(url, payload))),
  post: (url: string, payload: any) =>
    handleResult(axiosInstance.post(url, payload)),
  put: (url: string, payload?: any) =>
    handleResult(axiosInstance.put(url, payload)),
  path: (url: string, payload: any) =>
    handleResult(axiosInstance.patch(url, payload)),
  delete: (url: string, payload: any) =>
    handleResult(axiosInstance.delete(url, {}, { data: payload })),
}

export default axiosInstance
