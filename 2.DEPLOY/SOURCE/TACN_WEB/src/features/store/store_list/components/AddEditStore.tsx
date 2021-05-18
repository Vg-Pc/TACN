import React, { useState } from 'react'
import {
  Form,
  Input,
  Cascader,
  Select,
  Button,
  AutoComplete,
  Modal,
  DatePicker,
} from 'antd'
import viVN from 'antd/es/date-picker/locale/vi_VN'

import { createStore, updateStore } from '../StoreApi'

type Props = {
  visible: boolean
  isEdit: boolean
  onCancel?: any
  data?: any
  isLoading: boolean
  onCreateNewStore?: any
  onUpdateStore?: any
}

const AddEditStore = ({
  visible,
  onCancel,
  data,
  isEdit,
  onUpdateStore,
  onCreateNewStore,
  isLoading,
}: Props) => {
  const { Option } = Select

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

  const [formStore] = Form.useForm()

  if (isEdit && !isLoading) {
    formStore.setFieldsValue({ name: data?.name })
  }

  const onFinish = (values: any, onCancel: any) => {
    // console.log('Received values of form: ', values)
    const newData = {
      id: data?.id,
      name: values.name,
    }
    try {
      if (isEdit) {
        onUpdateStore(newData, formStore.resetFields)
        return
      }
      onCreateNewStore(newData, formStore.resetFields)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <Modal
      onCancel={() => {
        formStore.resetFields()
        onCancel()
      }}
      maskClosable={false}
      footer={[]}
      title={isEdit ? 'Cập nhật kho' : 'Tạo kho'}
      visible={visible}
    >
      <Form
        {...formItemLayout}
        // layout="vertical"
        form={formStore}
        name="register"
        onFinish={(values: any) => onFinish(values, onCancel)}
        // initialValues={initialValues}
        scrollToFirstError
      >
        <Form.Item
          name="name"
          label="Tên kho"
          rules={[
            {
              type: 'string',
              message: 'Nhập tên kho',
            },
            {
              required: true,
              message: 'Vui lòng điền tên kho!',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            {isEdit ? 'Cập nhật' : 'Tạo kho'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
export default React.memo(AddEditStore)
