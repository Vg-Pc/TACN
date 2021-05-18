import React from 'react'
import './App.css'
import 'antd/dist/antd.css'
import GlobalStyles from 'global-styles'
import AppNavigator from 'navigation'

function App() {
  return (
    <React.Fragment>
      <AppNavigator />
      <GlobalStyles />
    </React.Fragment>
  )
}

export default App
