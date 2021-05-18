import { Button, Form, Input, Modal, Select, Row, Popconfirm } from 'antd'
import { DeleteFilled, EditOutlined, FileAddOutlined } from '@ant-design/icons'
import React from 'react'
import reactotron from 'ReactotronConfig'
import { VOUCHER_TYPE } from 'utils/constants'
import { jsonToArray } from 'utils/funcHelper'
import R from 'utils/R'
import { DeleteInvoiceTypePayload } from './InvoiceTypeApi'

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

export default function AddEditInvoiceType({
  item,
  visible,
  toggleModal,
  onSubmitCreate,
  onSubmitEdit,
  onSubmitDelete,
  titleSubmit,
}: {
  item: any
  visible: boolean
  toggleModal: () => void
  onSubmitCreate?: (name: string, voucher_type: number) => void
  onSubmitEdit?: (item: {
    id: number
    name: string
    voucher_type: number
  }) => void
  onSubmitDelete?: (body: DeleteInvoiceTypePayload) => void
  titleSubmit: string
}) {
  const [form] = Form.useForm()
  const onFinish = (values: any) => {
    if (onSubmitEdit)
      onSubmitEdit({
        id: item.id,
        name: values.categoryName,
        voucher_type: values.voucher_type,
      })
    if (onSubmitCreate) {
      onSubmitCreate(values.categoryName, values.voucher_type)
      form.resetFields()
    }
    toggleModal()
  }
  return (
    <Modal
      title={titleSubmit}
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
        initialValues={{
          categoryName: item?.name,
          voucher_type: item?.voucher_type || VOUCHER_TYPE.PAYMENT.id,
        }}
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

        <Form.Item name="voucher_type" label="Loại phiếu">
          <Select defaultValue={item?.voucher_type || VOUCHER_TYPE.PAYMENT.id}>
            {jsonToArray(VOUCHER_TYPE).map(val => (
              <Select.Option value={val.id}>{val.name}</Select.Option>
            ))}
          </Select>
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
            {onSubmitCreate && (
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
                  children={titleSubmit}
                />
              </Form.Item>
            )}
            {onSubmitEdit && (
              <Form.Item style={{ width: '50%' }}>
                <Button
                  style={{
                    width: '133.5%',
                    color: '#008900',
                  }}
                  type="text"
                  size="large"
                  htmlType="submit"
                  icon={<EditOutlined />}
                  children={R.strings().action_update}
                />
              </Form.Item>
            )}
            {onSubmitDelete && (
              <Popconfirm
                title={'Bạn chắc chắn muốn xóa?'}
                okText={R.strings().action_remove}
                cancelText={R.strings().action_back}
                okButtonProps={{
                  type: 'primary',
                  danger: true,
                }}
                onConfirm={() => {
                  onSubmitDelete({ id: [item.id] })
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
