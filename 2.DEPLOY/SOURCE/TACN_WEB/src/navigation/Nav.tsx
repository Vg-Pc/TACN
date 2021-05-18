import React from 'react'
import PrivateRoute from './PrivateRoute'
import screenRouter from './routerType'
import { ROUTER_PATH } from 'common/config'
import { useSelector } from 'react-redux'
import { ACCOUNT_R0LE } from 'utils/constants'

export default function Nav() {
  const { userInfo } = useSelector((state: any) => state.authReducer)
  const role_id = userInfo?.role_id
  return (
    <>
      {screenRouter.map((val, index) => {
        if (
          val.path === ROUTER_PATH.ACCOUNTS &&
          role_id === ACCOUNT_R0LE.STAFF
        ) {
          return <></>
        } else {
          return (
            <PrivateRoute
              path={`${val.path}`}
              component={val.component}
              exact
            />
          )
        }
      })}
    </>
  )
}
