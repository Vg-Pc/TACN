import Header from 'common/components/Header'
import { SESSION_ID } from 'common/config'
import LoginScreen from 'features/auth/Login'
import React from 'react'
import { Route, Router, Switch } from 'react-router-dom'
import history from 'utils/history'
import Nav from './Nav'
import PrivateRoute from './PrivateRoute'
import Cookie from 'js-cookie'
import { useDispatch } from 'react-redux'
import { getUserInfoAction } from 'features/auth/AuthSlice'

export default function AppNavigator() {
  const cookie = Cookie.get(SESSION_ID)
  const dispatch = useDispatch()
  if (cookie) dispatch(getUserInfoAction())
  return (
    <Router history={history}>
      <Switch>
        <Route path={'/login'} exact component={LoginScreen} />
        <PrivateRoute path="/" component={MainNavigator} />
      </Switch>
    </Router>
  )
}

const MainNavigator = () => (
  <>
    <Header />
    <Nav />
  </>
)
