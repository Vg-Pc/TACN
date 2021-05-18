import { Button, Form, Input, Modal, Row, Popconfirm, Spin } from 'antd'
import React, { useState } from 'react'
import reactotron from 'ReactotronConfig'
import R from 'utils/R'
import { DeleteFilled, EditOutlined, FileAddOutlined } from '@ant-design/icons'

const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 8,
    },
    sm: {
      span: 24,
      offset: 8,
    },
  },
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 4 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
}

const AddEditItemFilter = ({
  item,
  visible,
  toggleModal,
  onSubmitEdit,
  onSubmitCreate,
  onSubmitDelete,
  titleCreate,
  titleEdit,
  titleDelete,
}: {
  item: any
  visible: boolean
  toggleModal: () => void
  onSubmitEdit?: (item: { id: number; name: string }) => void
  onSubmitCreate?: (name: string) => void
  onSubmitDelete?: (id: string) => void
  titleEdit?: string
  titleCreate?: string
  titleDelete?: string
}) => {
  const [form] = Form.useForm()
  const onFinish = (values: any) => {
    if (onSubmitEdit)
      onSubmitEdit({
        id: item.id,
        name: values.categoryName,
      })
    if (onSubmitCreate) {
      onSubmitCreate(values.categoryName)
      form.resetFields()
    }
    toggleModal()
  }

  return (
    <Modal
      title={onSubmitCreate ? titleCreate : titleEdit}
      style={{ top: 20, maxWidth: '60%' }}
      visible={visible}
      onCancel={() => {
        toggleModal()
      }}
      footer={null}
      maskClosable={false}
    >
      <Form
        {...formItemLayout}
        name="create"
        style={{ flex: 'auto' }}
        onFinish={onFinish}
        initialValues={{ categoryName: item?.name }}
      >
        <Form.Item
          label={R.strings().category_name}
          name="categoryName"
          rules={[
            {
              required: true,
              message: R.strings().please_enter_category_name,
            },
          ]}
        >
          <Input placeholder={R.strings().please_enter_category_name} />
        </Form.Item>
        <Row
          align="middle"
          justify="center"
          style={{
            height: 60,
            border: 'solid 1px #f1f1f1',
          }}
        >
          <Row
            justify="center"
            style={{
              width: '100%',
              height: 40,
            }}
          >
            {onSubmitCreate && titleCreate && (
              <Form.Item style={{ width: '50%' }}>
                <Button
                  style={{
                    width: '133.5%',
                    color: '#0090ff',
                  }}
                  type="text"
                  size="large"
                  htmlType="submit"
                  icon={<FileAddOutlined />}
                  children={titleCreate}
                />
              </Form.Item>
            )}
            {onSubmitEdit && titleEdit && (
              <Form.Item style={{ width: '50%' }}>
                <Button
                  style={{
                    width: '133.5%',
                    color: '#0090ff',
                  }}
                  type="text"
                  size="large"
                  htmlType="submit"
                  icon={<EditOutlined />}
                  children={R.strings().action_update}
                />
              </Form.Item>
            )}
            {onSubmitDelete && titleDelete && (
              <Popconfirm
                title={'Bạn chắc chắn muốn xóa?'}
                okText={R.strings().action_remove}
                cancelText={R.strings().action_back}
                okButtonProps={{
                  type: 'primary',
                  danger: true,
                }}
                onConfirm={() => {
                  onSubmitDelete(item.id)
                  form.resetFields()
                  toggleModal()
                }}
              >
                <Form.Item style={{ width: '50%' }}>
                  <Button
                    style={{ width: '133.5%', color: '#cc0000' }}
                    type="text"
                    size="large"
                    icon={<DeleteFilled color="red" />}
                    children={R.strings().action_remove}
                  />
                </Form.Item>
              </Popconfirm>
            )}
          </Row>
        </Row>
      </Form>
    </Modal>
  )
}
export default AddEditItemFilter
