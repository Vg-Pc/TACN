import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Row,
  Spin,
  Popconfirm,
} from 'antd'
import { getAccounts } from 'features/account/AccountApi'
import { DeleteFilled, EditOutlined, FileAddOutlined } from '@ant-design/icons'
import {
  getCustomers,
  requestGetListProvider,
} from 'features/customer/CustomerApi'
import moment from 'moment'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import isEqual from 'react-fast-compare'
import reactotron from 'ReactotronConfig'
import { INVOICE_OBJECT_TYPE, VOUCHER_TYPE } from 'utils/constants'
import { jsonToArray } from 'utils/funcHelper'
import R from 'utils/R'
import {
  CreateInvoicePayload,
  UpdateInvoicePayload,
  DeleteInvoicePayload,
} from './InvoiceApi'
import { requestGetListInvoiceType } from './InvoiceTypeApi'
import { InvoiceItem } from './Model'

interface AddEditInvoiceProps {
  visible: boolean
  invoice: InvoiceItem | null | undefined
  onCancel: () => void
  onCreateInvoice?: (body: CreateInvoicePayload) => void
  onEditInvoice?: (body: UpdateInvoicePayload) => void
  onDeleteInvoice?: (body: DeleteInvoicePayload) => void
}

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

function convertDataToFrom(data: any) {
  if (!data) {
    return {
      voucher_type: VOUCHER_TYPE.PAYMENT.id,
      invoice_type_id: null,
      amount: null,
      staff_id: null,
      customer_id: null,
      supplier_id: null,
      reason: '',
      object_type: INVOICE_OBJECT_TYPE.CUSTOMER.id,
    }
  } else {
    return {
      ...data,
      id: data.id,
      object_type: data.customer_id
        ? INVOICE_OBJECT_TYPE.CUSTOMER.id
        : INVOICE_OBJECT_TYPE.PROVIDER.id,
    }
  }
}

const AddEditInvoice = memo(
  ({
    invoice,
    onCreateInvoice,
    onEditInvoice,
    onDeleteInvoice,
    visible,
    onCancel,
  }: AddEditInvoiceProps) => {
    const [form] = Form.useForm()
    const [listUser, setListUser] = useState([])
    const [listInvoiceType, setListInvoiceType] = useState([])
    const [listObject, setListObject] = useState([])
    const [isLoading, setLoading] = useState(false)

    const getListUser = async (search = '') => {
      try {
        const res = await getAccounts({
          search,
          page: 0,
        })
        setListUser(res.data)
      } catch (error) {}
    }

    const getListInvoiceType = async (search = '') => {
      try {
        const res = await requestGetListInvoiceType({
          search,
          page: 0,
          voucher_type: form.getFieldValue('voucher_type') || '',
        })
        setListInvoiceType(res.data)
      } catch (error) {}
    }

    const getListObject = async (search = '') => {
      try {
        var res = null
        if (
          form.getFieldValue('object_type') == INVOICE_OBJECT_TYPE.CUSTOMER.id
        ) {
          res = await getCustomers({
            search,
            page: 0,
          })
        } else
          res = await requestGetListProvider({
            search,
          })
        setListObject(res.data)
      } catch (error) {}
    }

    useEffect(() => {
      getListUser()
      getListInvoiceType()
      getListObject()
    }, [])

    const onFinish = async (values: any) => {
      setLoading(true)
      if (!invoice) {
        //create Invoice
        if (onCreateInvoice) onCreateInvoice(values)
      } else {
        if (onEditInvoice)
          onEditInvoice({
            ...values,
            invoice_id: invoice.id,
          })
      }
      setLoading(false)
    }

    const initialValues = useMemo(() => {
      return convertDataToFrom(invoice)
    }, [])

    const getTypeObject = () => {
      return form.getFieldValue('object_type') ==
        INVOICE_OBJECT_TYPE.CUSTOMER.id
        ? 'customer_id'
        : 'supplier_id'
    }

    const getNameTypeObject = () => {
      return {
        label:
          form.getFieldValue('object_type') == INVOICE_OBJECT_TYPE.CUSTOMER.id
            ? 'Khách hàng'
            : 'Nhà cung cấp',
        placeHolder:
          form.getFieldValue('object_type') == INVOICE_OBJECT_TYPE.CUSTOMER.id
            ? 'Vui lòng chọn khách hàng'
            : 'Vui lòng chọn nhà cung cấp',
      }
    }

    return (
      <Modal
        visible={visible}
        title={!invoice ? 'Tạo phiếu thu' : 'Sửa phiếu thu'}
        maskClosable={false}
        footer={null}
        onCancel={onCancel}
      >
        <Spin spinning={isLoading}>
          <Form
            {...formItemLayout}
            form={form}
            name="create"
            onFinish={onFinish}
            initialValues={initialValues}
          >
            <Form.Item
              name="voucher_type"
              label="Loại phiếu"
              rules={[
                {
                  required: true,
                  message: R.strings().please_select_voucher_type,
                },
              ]}
            >
              <Select
                onChange={(val: any) => {
                  getListInvoiceType()
                  form.setFieldsValue({
                    invoice_type_id: '',
                  })
                }}
                defaultValue={invoice?.voucher_type || VOUCHER_TYPE.PAYMENT.id}
              >
                {jsonToArray(VOUCHER_TYPE).map(val => (
                  <Select.Option value={val.id}>{val.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="reason"
              label="Lý do"
              rules={[
                {
                  required: true,
                  message: R.strings().please_enter_reason,
                },
              ]}
            >
              <Input placeholder={R.strings().please_enter_reason} />
            </Form.Item>
            <Form.Item
              name="staff_id"
              label={R.strings().invoice_staff}
              rules={[
                {
                  required: true,
                  message: R.strings().please_enter_reason,
                },
              ]}
            >
              <Select
                // defaultValue={invoice?.staff_name}
                placeholder="Vui lòng chọn nhân viên"
                showSearch
                allowClear
                optionFilterProp="children"
                onSearch={keySearch => {
                  getListUser(keySearch)
                }}
              >
                {listUser.map((user: any) => (
                  <Select.Option value={user.id}>{user.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              name="amount"
              label={'Số tiền'}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng nhập số tiền',
                  type: 'number',
                },
              ]}
            >
              <InputNumber
                placeholder={'Vui lòng nhập số tiền'}
                style={{ flex: 'auto', width: '100%' }}
                formatter={value =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value: string | undefined) => {
                  if (!value) return ''
                  return value.replace(/\$\s?|(,*)/g, '')
                }}
              />
            </Form.Item>

            <Form.Item
              name="invoice_type_id"
              label={'Loại phiếu thu'}
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn loại phiếu thu',
                },
              ]}
            >
              <Select
                placeholder="Vui lòng chọn loại phiếu thu"
                showSearch
                allowClear
                optionFilterProp="children"
                onSearch={keySearch => {
                  getListInvoiceType(keySearch)
                }}
              >
                {listInvoiceType.map((invoice: any) => (
                  <Select.Option value={invoice.id}>
                    {invoice.name}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item name="object_type" label="Đối tượng">
              <Select
                placeholder="Vui lòng chọn đối tượng"
                optionFilterProp="children"
                onChange={(val: any) => {
                  getListObject()
                  form.setFieldsValue({
                    customer_id: '',
                    supplier_id: '',
                  })
                }}
              >
                {jsonToArray(INVOICE_OBJECT_TYPE).map((type: any) => (
                  <Select.Option value={type.id}>{type.name}</Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              name={getTypeObject()}
              label={getNameTypeObject().label}
              rules={[
                {
                  required: true,
                  message: getNameTypeObject().placeHolder,
                },
              ]}
            >
              <Select
                placeholder={getNameTypeObject().placeHolder}
                optionFilterProp="children"
              >
                {listObject.map((object: any) => (
                  <Select.Option value={object.id}>{object.name}</Select.Option>
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
                {onCreateInvoice && (
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
                      children={R.strings().product_create}
                    />
                  </Form.Item>
                )}
                {onEditInvoice && (
                  <Form.Item style={{ width: '50%' }}>
                    <Button
                      style={{
                        width: '150%',
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
                {onDeleteInvoice && invoice && (
                  <Popconfirm
                    title={'Bạn chắc chắn muốn xóa?'}
                    okText={R.strings().action_remove}
                    cancelText={R.strings().action_back}
                    okButtonProps={{
                      type: 'primary',
                      danger: true,
                    }}
                    onConfirm={() => {
                      setLoading(true)
                      onDeleteInvoice({ id: invoice.id })
                      setLoading(false)
                    }}
                  >
                    <Form.Item style={{ width: '50%' }}>
                      <Button
                        style={{ width: '150%', color: '#cc0000' }}
                        type="text"
                        size="large"
                        icon={<DeleteFilled />}
                        children={R.strings().action_remove}
                      />
                    </Form.Item>
                  </Popconfirm>
                )}
              </Row>
            </Row>
          </Form>
        </Spin>
      </Modal>
    )
  },
  isEqual
)
export default AddEditInvoice
