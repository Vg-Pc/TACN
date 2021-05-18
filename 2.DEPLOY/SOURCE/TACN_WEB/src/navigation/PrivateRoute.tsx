import { SESSION_ID } from 'common/config'
import Cookie from 'js-cookie'
import React from 'react'
import { Redirect, Route } from 'react-router-dom'

interface PrivateRouteProps {
  path: string
  component: any
  exact?: boolean
}

export default function PrivateRoute({
  path,
  component,
  exact,
}: PrivateRouteProps) {
  const cookie = Cookie.get(SESSION_ID)
  const Component = component
  return (
    <Route
      path={path}
      exact={exact}
      render={props =>
        cookie ? <Component {...props} /> : <Redirect to={'/login'} />
      }
    />
  )
}
