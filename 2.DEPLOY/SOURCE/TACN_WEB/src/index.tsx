import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import store from 'store'
import Reactotron from 'reactotron-react-js'
import { ConfigProvider } from 'antd'
import viVN from 'antd/lib/locale/vi_VN'
import { I18nextProvider } from 'react-i18next'
import i18n from './translation'
import moment from 'moment'
import 'moment/locale/vi'
moment.locale('vi')

Reactotron.configure() // we can use plugins here -- more on this later
  .connect() // let's connect!

ReactDOM.render(
  <Provider store={store}>
    <ConfigProvider locale={viVN}>
      <I18nextProvider i18n={i18n}>
        <App />
      </I18nextProvider>
    </ConfigProvider>
  </Provider>,
  document.getElementById('root')
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
