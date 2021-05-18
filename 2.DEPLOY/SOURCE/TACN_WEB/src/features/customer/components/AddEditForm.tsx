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
      date_of_birth: null,
      representative: '',
      position: '',
      email: null,
      province_id: null,
      gender: null,
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
      title={data ? 'Cập nhật khách hàng' : 'Tạo khách hàng'}
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
          label="Tên khách hàng"
          rules={[
            {
              type: 'string',
              message: 'Nhập tên khách hàng',
            },
            {
              required: true,
              message: 'Vui lòng nhập tên khách hàng!',
            },
            {
              min: 3,
              max: 50,
              message: 'Vui lòng nhập từ 5 đến 50 ký tự!',
            },
          ]}
        >
          <Input placeholder="Nhập tên khách hàng" />
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
          name="email"
          label="E-mail"
          rules={[
            {
              type: 'email',
              message: 'Định dạng email không hợp lệ!',
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

        <Form.Item
          name="date_of_birth"
          label="Ngày sinh"
          rules={[
            {
              type: 'date',
              message: 'Vui lòng chọn ngày sinh',
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
          label="Giới tính"
          name="gender"
          // rules={[
          //   {
          //     required: true,
          //     message: 'Vui lòng chọn giới tính!',
          //   },
          // ]}
        >
          <Select placeholder="Chọn giới tính" defaultValue={data?.gender}>
            <Select.Option value={GENDER.MALE}>Nam</Select.Option>
            <Select.Option value={GENDER.FEMALE}>Nữ</Select.Option>
          </Select>
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa chỉ"
          // rules={[

          //   {
          //     min: 3,
          //     max: 50,
          //     message: 'Vui lòng nhập từ 3 đến 50 ký tự!',
          //   },
          // ]}
        >
          <Input placeholder="Nhập địa chỉ" />
        </Form.Item>

        <Form.Item
          name="tax_code"
          label="Mã số thuế"
          // rules={[
          //   // {
          //   //   required: true,
          //   //   message: 'Vui lòng nhập mã số thuế!',
          //   // },
          //   {
          //     min: 3,
          //     max: 50,
          //     message: 'Vui lòng nhập từ 3 đến 50 ký tự!',
          //   },
          // ]}
        >
          <Input placeholder="Nhập mã số thuế" />
        </Form.Item>
        <Form.Item
          name="representative"
          label="Người đại diện"
          // rules={[
          //   {
          //     required: true,
          //     message: 'Vui lòng nhập người đại diện!',
          //   },
          //   {
          //     min: 3,
          //     max: 50,
          //     message: 'Vui lòng nhập từ 3 đến 50 ký tự!',
          //   },
          // ]}
        >
          <Input placeholder="Nhập người đại diện" />
        </Form.Item>
        <Form.Item
          name="position"
          label="Chức vụ"
          // rules={[
          //   {
          //     required: true,
          //     message: 'Vui lòng nhập chức vụ!',
          //   },
          //   {
          //     min: 3,
          //     max: 50,
          //     message: 'Vui lòng nhập từ 3 đến 50 ký tự!',
          //   },
          // ]}
        >
          <Input placeholder="Nhập chức vụ" />
        </Form.Item>

        <Form.Item {...tailFormItemLayout}>
          <Button loading={isLoading} type="primary" htmlType="submit">
            {data ? 'Cập nhật' : 'Tạo khách hàng'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
