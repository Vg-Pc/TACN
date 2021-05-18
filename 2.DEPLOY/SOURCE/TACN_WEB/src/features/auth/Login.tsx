import { LockOutlined, UserOutlined } from '@ant-design/icons'
import { Button, Checkbox, Form, Input } from 'antd'
import LoadingProgress from 'common/components/LoadingProgress'
import { SESSION_ID } from 'common/config'
import Cookie from 'js-cookie'
import React, { useState } from 'react'
import { REG_PHONE } from 'utils/constants'
import R from 'utils/R'
import './authStyle.css'
import { requestLogin } from './AuthApi'
import { getUserInfoAction } from 'features/auth/AuthSlice'
import { useDispatch } from 'react-redux'
import history from 'utils/history'

const layout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 20 },
}
const tailLayout = {
  wrapperCol: { span: 16 },
}

function Login(props: any) {
  const [isLoading, setLoading] = useState(false)
  const [form] = Form.useForm()
  const dispatch = useDispatch()
  const onFinish = async (values: any) => {
    // console.log('Received values of form: ', values)
    try {
      setLoading(true)
      const resLogin = await requestLogin({
        phone_number: values.username,
        password: values.password,
      })
      Cookie.set(SESSION_ID, resLogin.data.token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      dispatch(getUserInfoAction())
      history.replace('/')
    } catch (error) {
      console.log(error)
      setLoading(false)
    }
  }

  return (
    <div className="login">
      <div className="login_image">
        <img
          src={R.images.img_background}
          alt="logo"
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'blur(10px)',
          }}
        />
      </div>

      <div className="container_login">
        <img
          alt=""
          src={R.images.img_logo}
          style={{
            width: '80%',
            height: 'auto',
          }}
        />
        <Form
          form={form}
          name="normal_login"
          className="login-form"
          initialValues={{ remember: true, username: null, password: null }}
          onFinish={onFinish}
        >
          <Form.Item
            name="username"
            rules={[
              { required: true, message: R.strings().please_enter_account },
              { pattern: REG_PHONE, message: 'Số điện thoại không hợp lệ' },
            ]}
          >
            <Input
              prefix={<UserOutlined className="site-form-item-icon" />}
              placeholder={R.strings().account}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: R.strings().please_enter_pass }]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              placeholder={R.strings().password}
            />
          </Form.Item>
          <Form.Item
            style={{
              textAlign: 'right',
            }}
          >
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>{R.strings().remember_password}</Checkbox>
            </Form.Item>
          </Form.Item>

          <Form.Item
            style={{
              textAlign: 'center',
            }}
          >
            <Button
              type="primary"
              htmlType="submit"
              className=" login-form-button"
              style={{
                maxWidth: 200,
                minWidth: 150,
              }}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </div>
      {isLoading && <LoadingProgress />}
    </div>
  )
}

export default Login
