import { Button, DatePicker, Form, Input, Modal, Select } from 'antd'
import viVN from 'antd/es/date-picker/locale/vi_VN'
import moment from 'moment'
import React, { useState, useEffect, useMemo } from 'react'
import reactotron from 'ReactotronConfig'
import { useSelector } from 'react-redux'
import { ACCOUNT_R0LE, PROVINCES, GENDER } from 'utils/constants'

type Props = {
  visible: boolean
  onCancel?: any
  data?: any
  onCreateNewAccount?: any
  onUpdateAccount?: any
  isLoading: boolean
}

function convertDataToFrom(data: any) {
  // reactotron.log!(data)
  if (!data) {
    return {
      name: null,
      phone_number: null,
      address: null,
      password: null,
      date_of_birth: null,
      expired_at: null,
      gender: null,
      email: null,
      role_id: null,
      province_id: null,
    }
  } else {
    return {
      ...data,
      name: data.name,
      date_of_birth: moment.unix(1616620499),
      expired_at: moment.unix(data.expired_at),
    }
  }
}

export const AddEditAccount = ({
  visible,
  onCancel,
  data,
  onCreateNewAccount,
  onUpdateAccount,
  isLoading,
}: Props) => {
  const { userInfo } = useSelector((state: any) => state.authReducer)
  const role_id = userInfo?.role_id

  const option_role: Array<any> =
    role_id === ACCOUNT_R0LE.ADMIN
      ? [
          <Select.Option value={ACCOUNT_R0LE.ADMIN}>Quản trị</Select.Option>,
          <Select.Option value={ACCOUNT_R0LE.AGENT}>Đại lý</Select.Option>,
        ]
      : [<Select.Option value={ACCOUNT_R0LE.STAFF}>Nhân viên</Select.Option>]
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 8 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 },
    },
  }
  const tailFormItemLayout = {
    wrapperCol: {
      xs: {
        span: 24,
        offset: 0,
      },
      sm: {
        span: 16,
        offset: 8,
      },
    },
  }

  const [form] = Form.useForm()
  const initialValues = convertDataToFrom(data)

  function ProvinceList() {
    return (
      <Select
        showSearch
        allowClear
        placeholder="Chọn tỉnh thành"
        defaultValue={data?.province_id}
        optionFilterProp="children"
        filterOption={(input, option) =>
          option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {PROVINCES.map((province: any) => (
          <Select.Option value={province.id}>{province.name}</Select.Option>
        ))}
      </Select>
    )
  }

  const onFinish = async (values: any, onCancel: any) => {
    let newData = {
      ...values,
      created_at: moment(values.created_at).unix(),
      expired_at: moment(values.expired_at).unix(),
      date_of_birth: moment(values.date_of_birth).unix(),
    }
    if (!data) {
      onCreateNewAccount(newData, form.resetFields)
    } else {
      newData = { ...newData, id: data.id }
      onUpdateAccount(newData, form.resetFields)
    }
  }

  return (
    <Modal
      onCancel={() => {
        form.resetFields()
        onCancel()
      }}
      maskClosable={false}
      footer={[]}
      title={data ? 'Cập nhật' : 'Tạo tài khoản'}
      visible={visible}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="register"
        onFinish={(values: any) => onFinish(values, onCancel)}
        initialValues={initialValues}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="Tài khoản"
          rules={[
            {
              type: 'string',
              message: 'Nhập tài khoản',
            },
            {
              required: true,
              message: 'Vui lòng nhập tài khoản!',
            },
            {
              min: 3,
              max: 50,
              message: 'Vui lòng nhập từ 3 đến 50 ký tự!',
            },
          ]}
        >
          <Input placeholder="Nhập tài khoản" />
        </Form.Item>
        <Form.Item
          name="phone_number"
          label="Số điện thoại"
          rules={[
            {
              // type: 'number',
              message: 'Nhập số điện thoại',
            },
            {
              required: true,
              message: 'Vui lòng nhập số điện thoại!',
            },
            {
              min: 9,
              max: 10,
              message: 'Vui lòng nhập từ 9 đến 10 số!',
            },
          ]}
        >
          <Input disabled={data} placeholder="Nhập số điện thoại" />
        </Form.Item>
        <Form.Item
          name="date_of_birth"
          label="Ngày sinh"
          rules={[
            {
              type: 'date',
              message: 'Vui lòng chọn ngày sinh',
            },
            {
              required: true,
              message: 'Vui lòng chọn ngày sinh!',
            },
          ]}
        >
          <DatePicker
            style={{ width: '100%' }}
            locale={viVN}
            onChange={date => {
              // alert(date?.valueOf())
            }}
          />
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập địa chỉ!',
            },
            {
              min: 3,
              max: 50,
              message: 'Vui lòng nhập từ 3 đến 50 ký tự!',
            },
          ]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>
        <Form.Item
          label="Chọn tỉnh thành"
          name="province_id"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn tỉnh thành!',
            },
          ]}
        >
          {ProvinceList()}
        </Form.Item>
        <Form.Item
          label="Loại tài khoản"
          name="role_id"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn loại tài khoản!',
            },
          ]}
        >
          <Select
            placeholder="Chọn loại tài khoản"
            defaultValue={data?.role_id}
          >
            {option_role}
          </Select>
        </Form.Item>
        <Form.Item
          label="Giới tính"
          name="gender"
          rules={[
            {
              required: true,
              message: 'Vui lòng chọn giới tính!',
            },
          ]}
        >
          <Select placeholder="Chọn giới tính" defaultValue={data?.gender}>
            <Select.Option value={GENDER.MALE}>Nam</Select.Option>
            <Select.Option value={GENDER.FEMALE}>Nữ</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="expired_at"
          label="Ngày hết hạn"
          rules={[
            {
              type: 'date',
              message: 'Vui lòng chọn ngày hết hạn',
            },
            {
              required: true,
              message: 'Vui lòng chọn ngày hết hạn!',
            },
          ]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'Định dạng email không hợp lệ!',
            },
            {
              required: true,
              message: 'Vui lòng nhập email!',
            },
            {
              min: 3,
              max: 50,
              message: 'Vui lòng nhập từ 3 đến 50 ký tự!',
            },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>
        {!data && (
          <Form.Item
            name="password"
            label="Password"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập mật khẩu!',
              },
              {
                min: 3,
                max: 20,
                message: 'Vui lòng nhập từ 3 đến 20 ký tự!',
              },
            ]}
            hasFeedback
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              autoComplete="new-password"
            />
          </Form.Item>
        )}
        {!data && (
          <Form.Item
            name="confirm"
            label="Confirm Password"
            dependencies={['password']}
            hasFeedback
            rules={[
              {
                required: true,
                message: 'Nhập lại mật khẩu!',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve()
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp!'))
                },
              }),
            ]}
          >
            <Input.Password placeholder="Nhập lại mật khẩu" />
          </Form.Item>
        )}
        <Form.Item {...tailFormItemLayout}>
          <Button loading={isLoading} type="primary" htmlType="submit">
            {data ? 'Cập nhật' : 'Tạo tài khoản'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
