import { PlusOutlined } from '@ant-design/icons'
import {
  Button,
  Card,
  Col,
  ConfigProvider,
  Divider,
  Form,
  Input,
  InputNumber,
  message,
  Radio,
  Row,
  Select,
  Table,
  Typography,
  Popover,
} from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Container from 'common/container/Container'
import { getCustomers } from 'features/customer/CustomerApi'
import AutoCompleteProduct from 'features/store/import_goods/components/AutocompleteProduct'
import React, {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useReducer,
  useRef,
  useState,
  EffectCallback,
} from 'react'
import reactotron from 'ReactotronConfig'

import styled from 'styled-components'
import { PAYMENT_TYPE, SALE_TYPE } from 'utils/constants'
import { jsonToArray } from 'utils/funcHelper'
import history from 'utils/history'
import { formatPrice } from 'utils/ruleForm'
import { createOrder, editOrder } from './OrderApi'
import { requestGetListStore } from './StoreApi'
import { requestGetProductDetail } from 'features/product/ProductApi'
const saleTypes = JSON.parse(JSON.stringify(SALE_TYPE))
delete saleTypes.RETURN

const CardInfo = styled(Card)`
  text-align: right;
  .ant-card-body {
    padding: 10px;
  }
`
const RightInputNumber = styled(InputNumber)`
  border-bottom: 1px solid gray;
  text-align: right !important;
`

const StyledTable = styled(Table)`
  height: calc(100vh - 10%);
  overflow: hidden;
`

const formItemLayout = {
  labelCol: { span: 9 },
  wrapperCol: { span: 15 },
}

function reducer(state: any, action: any) {
  switch (action.type) {
    case 'product': {
      var result = {
        ...state,
        products: Array.isArray(action.payload)
          ? action.payload
          : [action.payload],
      }
      return result
    }
    default:
      return state
  }
}

interface DataForm {
  products: Array<any>[]
  infoOrder: {
    sale_type: number
    staff_id: number | null
    store_id: number | null
    note: string
    first_discount: number | string
    second_discount: number | string
    paid_price: number
    payment_type: number
  }
  store_id: number | null
}

const initialValuesForm = {
  sale_type: SALE_TYPE.RETAIL.id,
  staff_id: null,
  store_id: null,
  customer_id: null,
  note: '',
  first_discount: 0,
  second_discount: 0,
  paid_price: 0,
  payment_type: PAYMENT_TYPE.CASH.id,
}

const initialState = { products: [], infoOrder: initialValuesForm }

const ContentComponent = React.forwardRef(
  (
    {
      getDataForm,
      state,
      dispatch,
      propsOrder,
    }: {
      getDataForm: () => DataForm
      state: any
      dispatch: any
      propsOrder?: any
    },
    ref
  ) => {
    const [data, setData] = useState<any[]>([])
    const [listStore, setListStore] = useState<any[]>([])
    // const [searchStore, setSearchStore] = useState('')
    const [currentStore, setCurrentStore] = useState<any>(null)
    useEffect(() => {
      if (
        propsOrder &&
        propsOrder.products &&
        propsOrder.products instanceof Array
      ) {
        let listProducts: Array<any> = propsOrder.products.map((item: any) => {
          let product = item.product
          return {
            ...product,
            ...item,
            name: product.product_name || product.name,
            unit_name: product.product_unit || product.unit_name,
            code: product.product_code || product.code,
          }
        })
        setData(listProducts)
        dispatch({ type: 'product', payload: listProducts })
      }
    }, [])
    useImperativeHandle(ref, () => ({
      getListProducts() {
        return {
          listProducts: data,
          store_id: currentStore?.id,
        }
      },
      reset() {
        return setData([])
      },
    }))

    const getListStore = useCallback(async () => {
      try {
        const res = await requestGetListStore({ search: '', page: 0 })
        setListStore(res.data)
        if (res.data.length > 0) {
          if (propsOrder) {
            const store = res.data.find(
              (item: any) => item.id === propsOrder.store_id
            )
            setCurrentStore(store)
          } else {
            setCurrentStore(res.data[0])
          }
        }
      } catch (error) {}
    }, [])

    useEffect(() => {
      getListStore()
    }, [])

    const columns = useMemo(() => {
      return [
        {
          width: 70,
          title: 'STT',
          dataIndex: 'index',
          align: 'center' as 'center',
          key: 'index',
          render: (text: any, record: any, index: any) => index + 1,
        },
        { title: 'Mã SP', dataIndex: 'code', key: 'code' },
        { title: 'Tên', dataIndex: 'name', key: 'name' },
        { title: 'DVT', dataIndex: 'unit_name', key: 'unit_name' },
        {
          title: 'Số lượng',
          dataIndex: 'amount',
          key: 'amount',
          render: (amount: number, record: any) => (
            <InputNumber
              style={{ maxWidth: '100%' }}
              value={amount}
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
              max={999999}
              min={0}
              // value={formatPrice(amount)}
              onChange={input => {
                updateAmount(record, input)
              }}
            />
          ),
        },
        {
          title: 'Đơn giá',
          dataIndex: 'price',
          key: 'price',
          align: 'center' as 'center',
          render: (price: number, record: any) => (
            // <Input style={{ maxWidth: '100px' }} value={formatPrice(debt)} />
            <InputNumber
              style={{ width: '100%' }}
              value={price}
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
              max={999999999}
              min={0}
              onChange={input => {
                updatePrice(record, input)
              }}
            />
          ),
        },
        {
          title: 'Thành tiền',
          dataIndex: 'price',
          key: 'total',
          align: 'center' as 'center',
          render: (_: any, record: any) => (
            <Popover
              placement="bottom"
              content={
                <div>{formatPrice(record.price * record.amount)} VND</div>
              }
            >
              <p
                style={{
                  width: '100%',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {formatPrice(record.price * record.amount)}
              </p>
            </Popover>
          ),
        },
        {
          title: '',
          key: 'action',
          width: 70,
          render: (text: any, record: any) => (
            <a
              onClick={() => {
                removeItem(record)
              }}
            >
              Xoá
            </a>
          ),
        },
      ]
    }, [data])

    const updateAmount = (record: any, value: any) => {
      if (value <= 0) {
        removeItem(record)
        return
      }
      const foundIndex = data.findIndex(
        item => item.product_code === record.code || item.code === record.code
      )
      if (foundIndex !== -1) {
        let newData = [...data]
        newData[foundIndex].amount = value
        setData(newData)
        dispatch({ type: 'product', payload: newData })
      }
    }

    const removeItem = (record: any) => {
      const foundIndex = data.findIndex(item => item.id === record.id)
      let newData = [...data]
      newData.splice(foundIndex, 1)
      setData(newData)
      dispatch({ type: 'product', payload: newData })
    }

    const updatePrice = (record: any, value: any) => {
      if (value <= 0) {
        removeItem(record)
        return
      }
      const foundIndex = data.findIndex(item => item.id === record.id)
      let newData = [...data]
      newData[foundIndex].price = value
      setData(newData)
      dispatch({ type: 'product', payload: newData })
    }

    return (
      // delete backgroundColor
      <div>
        <Row>
          <Col span={12}>
            <AutoCompleteProduct
              xsNumber={24}
              store_id={currentStore?.id}
              onSelected={(product: any) => {
                const dataForm = getDataForm()
                if (dataForm.infoOrder.sale_type === SALE_TYPE.RETAIL.id) {
                  product.price = product.retail_price
                } else {
                  product.price = product.wholesale_price
                }
                const foundIndex = data.findIndex(
                  (item: any) => item.product_code === product.code
                )
                if (foundIndex !== -1) {
                  updateAmount(product, data[foundIndex].amount + 1)
                } else {
                  product.amount = 1
                  var newArray = [...data, product]
                  setData(newArray)
                  dispatch({ type: 'product', payload: newArray })
                }
              }}
            />
          </Col>

          <Col span={6}>
            <Row style={{ marginTop: 12 }}>
              <Col span={20}>
                <Select
                  allowClear
                  onChange={(value: any) => {
                    const store = listStore.find(item => item.id === value)
                    setCurrentStore(store)
                  }}
                  style={{ width: '100%' }}
                  placeholder="Vui lòng chọn kho hàng"
                  optionFilterProp="children"
                  value={currentStore?.name}
                >
                  {listStore.map((customer: any) => (
                    <Select.Option value={customer.id}>
                      {customer.name}
                    </Select.Option>
                  ))}
                </Select>
              </Col>
              {/* <Col span={4}>
                <Button
                  onClick={() => {
                    alert('123')
                  }}
                  style={{ marginLeft: 5, marginTop: 5 }}
                  // type="primary"
                  shape="circle"
                  block={false}
                  type="text"
                  icon={<PlusOutlined />}
                  size={'small'}
                />
              </Col> */}
            </Row>
          </Col>
        </Row>
        <StyledTable
          scroll={{
            y: 'calc(100vh - 230px)',
            x: 800,
          }}
          bordered
          dataSource={data}
          loading={false}
          columns={columns}
          pagination={false}
        />
      </div>
    )
  }
)

const RightComponent = React.forwardRef(
  (
    {
      reset,
      getDataForm,
      state,
      dispatch,
      propsOrder,
    }: {
      reset: any
      getDataForm: () => DataForm
      state: any
      dispatch: any
      propsOrder?: any
    },
    ref
  ) => {
    const [saleType, setSaleType] = useState(SALE_TYPE.WHOLE.id)
    const [lisCustomer, setListCustomer] = useState([])
    const [customerDetail, setCustomerDetail] = useState<any>(null)
    const [searchCustomer, setSearchCustomer] = useState('')
    const [form] = useForm()

    useImperativeHandle(ref, () => ({
      getValuesForm() {
        return form.getFieldsValue()
      },
    }))

    const getListCustomer = useCallback(async () => {
      try {
        const res = await getCustomers({ search: searchCustomer || '' })
        setListCustomer(res.data)
      } catch (error) {}
    }, [searchCustomer])

    useEffect(() => {
      reactotron.log!('render')
      getListCustomer()
    }, [searchCustomer])

    const calculatePrice = useMemo(() => {
      reactotron.log!('calculatePrice')
      var totalPrice = state.products.reduce(
        (a: any, b: any) => a + b['price'] * b['amount'],
        0
      )
      var priceAfterDiscount = totalPrice
      if (
        form.getFieldValue('first_discount') &&
        form.getFieldValue('second_discount')
      ) {
        priceAfterDiscount =
          totalPrice - (totalPrice * form.getFieldValue('first_discount')) / 100
        priceAfterDiscount =
          priceAfterDiscount -
          (priceAfterDiscount * form.getFieldValue('second_discount')) / 100
      } else if (form.getFieldValue('first_discount')) {
        priceAfterDiscount =
          totalPrice - (totalPrice * form.getFieldValue('first_discount')) / 100
      } else if (form.getFieldValue('second_discount')) {
        priceAfterDiscount =
          totalPrice -
          (totalPrice * form.getFieldValue('second_discount')) / 100
      }
      return {
        totalPrice: totalPrice,
        priceAfterDiscount: priceAfterDiscount,
      }
    }, [state])

    const onFinish = (values: any) => {
      if (propsOrder) {
        onEdit(values)
      } else {
        onCreate(values)
      }
    }
    const onEdit = async (values: any) => {
      let listProduct = getDataForm().products.map((item: any) => ({
        code: item.code,
        price: item.price,
        amount: item.amount,
        discount: 0,
      }))
      let storeId = getDataForm()
      if (!listProduct || !listProduct.length) {
        message.error('Vui lòng chọn sản phẩm')
        return
      }
      if (!storeId) {
        message.error('Vui lòng chọn kho hàng')
        return
      }
      const orderInfo = getDataForm().infoOrder
      const params = {
        ...orderInfo,
        products: listProduct,
        store_id: getDataForm().store_id
          ? getDataForm().store_id
          : propsOrder.store_id,
        order_id: propsOrder.id,
      }
      reactotron.log!(params)
      try {
        await editOrder(params)
        message.success('Sửa đơn hàng thành công')
        form.resetFields()
        reset()
        history.goBack()
      } catch (error) {
        message.error('Sửa đơn hàng thất bại')
        console.log(error)
      }
    }
    const onCreate = async (values: any) => {
      let listProduct = getDataForm().products.map((item: any) => ({
        code: item.code,
        price: item.price,
        amount: item.amount,
        discount: 0,
      }))
      let storeId = getDataForm()
      if (!listProduct || !listProduct.length) {
        message.error('Vui lòng chọn sản phẩm')
        return
      }
      if (!storeId) {
        message.error('Vui lòng chọn kho hàng')
        return
      }
      const orderInfo = getDataForm().infoOrder
      const params = {
        ...orderInfo,
        products: listProduct,
        store_id: getDataForm().store_id,
      }
      reactotron.log!(params)
      try {
        await createOrder(params)
        message.success('Thêm đơn hàng thành công')
        // reset
        form.resetFields()
        reset()
        dispatch({ type: 'product', payload: initialState.products })
      } catch (error) {
        console.log(error)
      }
    }

    const renderInfo = () => {
      return (
        <CardInfo
          style={{
            width: '100%',
          }}
        >
          <Typography.Text
            strong
            children={
              propsOrder ? `Đơn hàng ${propsOrder.code}` : 'Thông tin bán hàng'
            }
          />

          <Divider />
          <Form.Item name="sale_type" label="HT bán hàng" labelAlign="left">
            <Radio.Group
              style={{}}
              value={saleType}
              onChange={e => {
                setSaleType(e.target.value)
              }}
            >
              <Radio
                style={{
                  fontSize: 12,
                }}
                value={SALE_TYPE.WHOLE.id}
                children="Bán sỉ"
              />
              <Radio
                style={{
                  fontSize: 12,
                }}
                value={SALE_TYPE.RETAIL.id}
                children="Bán lẻ"
              />
            </Radio.Group>
          </Form.Item>

          <Row>
            <Col span={23}>
              <Form.Item
                name="customer_id"
                label="Khách hàng"
                labelAlign="left"
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng chọn khách hàng',
                  },
                ]}
              >
                <Select
                  allowClear
                  onChange={(value: string) => {
                    setSearchCustomer(value)
                    var customer = lisCustomer.find(
                      (cus: any) => cus.id === value
                    )
                    setCustomerDetail(customer)
                  }}
                  showSearch
                  style={{ width: '100%', marginLeft: 10, marginTop: 5 }}
                  placeholder="Vui lòng chọn khách hàng"
                  optionFilterProp="children"
                  onSearch={val => {
                    setSearchCustomer(val)
                  }}
                >
                  {lisCustomer.map((customer: any) => (
                    <Select.Option value={customer.id}>
                      {customer.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            {/* <Col span={2}>
              <Button
                onClick={() => {
                  alert('123')
                }}
                style={{ marginLeft: 10 }}
                // type="primary"
                shape="circle"
                block={false}
                type="text"
                icon={<PlusOutlined />}
                size={'small'}
              />
            </Col> */}
          </Row>

          <Form.Item name="note" label="Ghi chú" labelAlign="left">
            <Input.TextArea />
          </Form.Item>
        </CardInfo>
      )
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

    const renderInfoPayment = () => {
      var price = calculatePrice
      return (
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'white',
            marginLeft: '2px',
          }}
        >
          <Form.Item label="Tổng tiền hàng" labelAlign="left">
            <Col span={24}>
              <div
                style={{
                  width: '100%',
                  textAlign: 'right',
                }}
              >
                <Typography.Text
                  children={`${formatPrice(price.totalPrice)} VND`}
                />
              </div>
            </Col>
          </Form.Item>

          <Form.Item
            name="first_discount"
            label="Chiết khấu 1(%)"
            labelAlign="left"
          >
            <RightInputNumber
              bordered={false}
              onChange={() => {
                dispatch({ type: 'product', payload: state.products })
              }}
              min={0}
              max={100}
              formatter={value => `${value}%`}
              parser={(value: any) => value.replace('%', '')}
              style={{
                textAlign: 'right',
                width: '100%',
              }}
            />
          </Form.Item>
          <Form.Item
            name="second_discount"
            label="Chiết khấu 2(%)"
            labelAlign="left"
          >
            <RightInputNumber
              bordered={false}
              onChange={() => {
                dispatch({ type: 'product', payload: state.products })
              }}
              min={0}
              max={100}
              formatter={value => `${value}%`}
              parser={(value: any) => value.replace('%', '')}
              style={{
                textAlign: 'right',
                width: '100%',
              }}
            />
          </Form.Item>

          <Form.Item label="Tổng tiền" labelAlign="left">
            <Col span={24}>
              <div
                style={{
                  width: '100%',
                  textAlign: 'right',
                }}
              >
                <Typography.Text
                  children={`${formatPrice(price.priceAfterDiscount)} VND`}
                />
              </div>
            </Col>
          </Form.Item>

          <Form.Item
            name="paid_price"
            label="Thanh toán"
            labelAlign="left"
            rules={[
              {
                required: true,
                message: 'Vui lòng nhập tiền thanh toán',
              },
            ]}
          >
            {/* <ConfigProvider direction="rtl"> */}
            <InputNumber
              placeholder="Thanh toán"
              onChange={() => {
                dispatch({ type: 'product', payload: state.products })
              }}
              style={{
                width: '100%',
                textAlign: 'right',
              }}
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value: string | undefined) => {
                if (!value) return ''
                return value.replace(/\$\s?|(,*)/g, '')
              }}
            />
            {/* </ConfigProvider> */}
          </Form.Item>

          {customerDetail && customerDetail.debt && (
            <Form.Item label="Khách hàng nợ">
              <div
                style={{
                  width: '100%',
                  textAlign: 'right',
                }}
              >
                <Typography.Text
                  children={`${formatPrice(customerDetail.debt)} VND`}
                />
              </div>
            </Form.Item>
          )}

          <Form.Item
            label="HT thanh toán"
            name="payment_type"
            labelAlign="left"
          >
            <Select>
              {jsonToArray(PAYMENT_TYPE).map(type => (
                <Select.Option value={type.id}>{type.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            {...tailFormItemLayout}
            style={{
              marginTop: '2rem',
            }}
          >
            <Button
              size="large"
              loading={false}
              type="primary"
              htmlType="submit"
              style={{ fontWeight: 'bold' }}
            >
              {propsOrder ? 'Sửa hóa đơn' : 'Thanh toán'}
            </Button>
          </Form.Item>
        </div>
      )
    }

    function convertDataToForm(data: any) {
      if (!data) {
        return {
          ...initialValuesForm,
          // customer_id: customerDetail?.id,
        }
      } else {
        return {
          sale_type: data.sale_type,
          staff_id: data.staff_id,
          store_id: data.store_id,
          customer_id: data.customer_id,
          note: data.note,
          first_discount: data.first_discount,
          second_discount: data.second_discount,
          paid_price: data.paid_price,
          payment_type: data.payment_type,
        }
      }
    }
    // reactotron.log!(initialValues)
    const initialValues = convertDataToForm(propsOrder)
    return (
      <div>
        <Form
          {...formItemLayout}
          form={form}
          name="create"
          onFinish={onFinish}
          initialValues={initialValues}
        >
          {renderInfo()}
          {renderInfoPayment()}
        </Form>
      </div>
    )
  }
)

export default function AddEditOrder(props: any) {
  const refProducts = useRef<any>(null)
  const refInfo = useRef<any>(null)
  const [state, dispatch] = useReducer(reducer, initialState)
  reactotron.log!({ state })
  const getDataForm = () => {
    return {
      products: refProducts.current
        ? refProducts.current?.getListProducts().listProducts
        : [],
      infoOrder: refInfo.current
        ? refInfo.current.getValuesForm()
        : initialValuesForm,
      store_id: refProducts.current?.getListProducts().store_id,
    }
  }
  let input: any = null
  if (props.location.state) {
    input = props.location.state.inputData
  }
  return (
    <Container
      contentComponent={
        <ContentComponent
          ref={refProducts}
          state={state}
          getDataForm={getDataForm}
          dispatch={dispatch}
          propsOrder={input}
        />
      }
      rightComponent={
        <RightComponent
          ref={refInfo}
          getDataForm={getDataForm}
          state={state}
          dispatch={dispatch}
          reset={refProducts.current ? refProducts.current.reset : () => {}}
          propsOrder={input}
        />
      }
    />
  )
}
