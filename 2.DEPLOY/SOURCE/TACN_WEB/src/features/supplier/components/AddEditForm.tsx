import { Button, DatePicker, Form, Input, Modal, Select } from 'antd'
import viVN from 'antd/es/date-picker/locale/vi_VN'
import moment from 'moment'
import React from 'react'
import reactotron from 'ReactotronConfig'
import { ACCOUNT_R0LE, PROVINCES, GENDER } from 'utils/constants'

type Props = {
  visible: boolean
  onCancel?: any
  data?: any
  onCreateNewAccount?: any
  onUpdateAccount?: any
  isLoading: boolean
}

function convertDataToForm(data: any) {
  if (!data) {
    return {
      name: null,
      phone_number: null,
      address: null,
      tax_code: '',
      email: null,
      province_id: null,
      code: null,
    }
  } else {
    return {
      ...data,
      date_of_birth: moment.unix(data.date_of_birth),
    }
  }
}

export const AddEditForm = ({
  visible,
  onCancel,
  data,
  onCreateNewAccount,
  onUpdateAccount,
  isLoading,
}: Props) => {
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

  const initialValues = convertDataToForm(data)

  function ProvinceList() {
    return (
      <Select placeholder="Chọn tỉnh thành" defaultValue={data?.province_id}>
        {PROVINCES.map(province => (
          <Select.Option value={province.id}>{province.name}</Select.Option>
        ))}
      </Select>
    )
  }

  const onFinish = async (values: any, onCancel: any) => {
    let newData = {
      ...values,
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
      title={data ? 'Cập nhật nhà cung cấp' : 'Tạo nhà cung cấp'}
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
          label="Tên nhà cung cấp"
          rules={[
            {
              type: 'string',
              message: 'Nhập tên nhà cung cấp',
            },
            {
              required: true,
              message: 'Vui lòng nhập tên nhà cung cấp!',
            },
            {
              min: 3,
              max: 50,
              message: 'Vui lòng nhập từ 5 đến 50 ký tự!',
            },
          ]}
        >
          <Input placeholder="Nhập tên nhà cung cấp" />
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
          name="code"
          label="Mã nhà cung cấp"
          rules={[
            {
              type: 'string',
              message: 'Nhập mã nhà cung cấp',
            },
            // {
            //   required: true,
            //   message: 'Vui lòng nhập mã nhà cung cấp!',
            // },
            // {
            //   min: 3,
            //   max: 50,
            //   message: 'Vui lòng nhập từ 5 đến 50 ký tự!',
            // },
          ]}
        >
          <Input placeholder="Nhập mã nhà cung cấp" />
        </Form.Item>

        <Form.Item
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'Định dạng email không hợp lệ!',
            },
            // {
            //   required: true,
            //   message: 'Vui lòng nhập email!',
            // },
            {
              min: 3,
              max: 50,
              message: 'Vui lòng nhập từ 3 đến 50 ký tự!',
            },
          ]}
        >
          <Input placeholder="Nhập email" />
        </Form.Item>

        <Form.Item
          name="address"
          label="Địa chỉ"
          rules={[
            // {
            //   required: true,
            //   message: 'Vui lòng nhập địa chỉ!',
            // },
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
          name="tax_code"
          label="Mã số thuế"
          rules={[
            // {
            //   required: true,
            //   message: 'Vui lòng nhập mã số thuế!',
            // },
            {
              min: 3,
              max: 50,
              message: 'Vui lòng nhập từ 3 đến 50 ký tự!',
            },
          ]}
        >
          <Input placeholder="Nhập mã số thuế" />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button loading={isLoading} type="primary" htmlType="submit">
            {data ? 'Cập nhật' : 'Tạo nhà cung cấp'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
