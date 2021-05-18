import {
  Collapse,
  Select,
  InputNumber,
  DatePicker,
  Input,
  Card,
  Button,
  Form,
  message,
  Radio,
} from 'antd'

import 'moment/locale/vi'
import React, { useEffect, useState, forwardRef, useRef } from 'react'
import styled from 'styled-components'
import { Col, Row, Table } from 'antd'
import AutoCompleteProduct from './components/AutocompleteProduct'
import AutocompleteSupplier from './components/AutocompleteSupplier'
import AutocompleteStore from './components/AutocompleteStore'
import { formatPrice } from 'utils/ruleForm'
import viVN from 'antd/es/date-picker/locale/vi_VN'
import { importGoods, updateGoods } from './ImportGoodsApi'
import moment from 'moment'
import reactotron from 'ReactotronConfig'
import product from 'features/product'
import history from 'utils/history'
import { match } from 'react-router-dom'

const { Option } = Select
//

const { Panel } = Collapse

const Container = styled.div`
  /* height: calc(100vh - 99px); */
  /* background-color: tomato; */
  position: relative;
  width: 100%;

  max-width: 1600px;
  margin-right: auto;
  margin-left: auto;
  overflow: hidden;
  padding: 0 1rem 0 1rem;
`

const StyledTable = styled(Table)`
  /* height: calc(100vh - 250px); */
  overflow: hidden;
`
const StyledCard = styled(Card)`
  .ant-card-body {
    padding: 24px 5px 24px 5px;
  }
`

// type Props = {
//   inputData: any
//   routerMatch: match
// }

const BillInfo = forwardRef(
  (
    {
      currentReceipt,
      data,
      resetTable,
    }: { currentReceipt: any; data: any; resetTable: any },
    ref
  ) => {
    const [excessCash, setExcessCash] = useState<number>(0)
    const [paidPrice, setPaidPrice] = useState<number>(0)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [form] = Form.useForm()

    function convertDataToForm(data: any) {
      if (!data) {
        return {
          store_id: null,
          supplier_id: null,
          note: null,
          payment_type: 1,
          paid_price: 0,
        }
      } else {
        return {
          ...currentReceipt,
          goods_receipt_id: currentReceipt.id,
        }
      }
    }

    const initialValues = convertDataToForm(currentReceipt)
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

    const totalMoney = () => {
      let total = 0
      data.forEach((product: any) => {
        total += product.amount * product.import_price
      })
      return total
    }
    const calcExcessCash = (value: number) => {
      setExcessCash(value - totalMoney())
    }

    const createImportBill = async (values: any) => {
      reactotron.log!(values)
      try {
        setIsLoading(true)
        if (currentReceipt) {
          values.goods_receipt_id = currentReceipt.id
          await updateGoods(values)
        } else {
          await importGoods(values)
        }
        form.resetFields()
        resetTable()
        message.success('Nhập hàng thành công')
        history.goBack()
      } catch (error) {
      } finally {
        setIsLoading(false)
      }
    }

    return (
      <div
        style={{
          width: '100%',
          marginLeft: '0.2rem',
          minHeight: '100px',
          backgroundColor: 'white',
        }}
      >
        <StyledCard title="Thông tin thanh toán">
          <Form
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            layout="horizontal"
            form={form}
            name="billInfo"
            onFinish={(values: any) => {
              reactotron.log!(values)
              // const products = data.map((product: any) => {
              //   return {
              //     ...product,
              //   }
              // })
              values.products = data
              reactotron.log!({ values })
              createImportBill(values)
            }}
            initialValues={initialValues}
            scrollToFirstError
          >
            <AutocompleteStore
              current={
                currentReceipt
                  ? {
                      value: currentReceipt.store_id,
                      label: currentReceipt.store_name,
                      key: currentReceipt.store_id,
                    }
                  : null
              }
            />
            <AutocompleteSupplier
              current={
                currentReceipt
                  ? {
                      value: currentReceipt.supplier_id,
                      label: currentReceipt.supplier_name,
                      key: currentReceipt.supplier_id,
                    }
                  : null
              }
            />
            <Form.Item name="note" label="Ghi chú">
              <Input.TextArea rows={2} placeholder="Nhập ghi chú" />
            </Form.Item>
            <Form.Item name="payment_type" label="Loại" initialValue={1}>
              <Radio.Group defaultValue={1}>
                <Radio value={1}>Tiền mặt</Radio>
                <Radio value={2}>Chuyển khoản</Radio>
              </Radio.Group>
            </Form.Item>
            <Row>
              <Col span={18}>Tổng tiền hàng: </Col>
              <Col span={6}>{<td>{formatPrice(totalMoney())}</td>}</Col>
            </Row>
            <Form.Item name="paid_price" label="Tiền trả NCC">
              <InputNumber
                style={{ width: '100%' }}
                placeholder="Nhập tiền trả khách"
                formatter={value =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
                }
                parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
                max={999999999}
                min={0}
                onChange={(value: any) => {
                  setPaidPrice(value)
                }}
              />
            </Form.Item>
            <Row>
              <Col span={18}>Tính vào công nợ: </Col>
              <Col span={6}>
                {<td>{formatPrice(paidPrice - totalMoney())}</td>}
              </Col>
            </Row>
            <Form.Item {...tailFormItemLayout} style={{ marginTop: '1rem' }}>
              <Button
                disabled={data.length === 0}
                loading={isLoading}
                type="primary"
                htmlType="submit"
              >
                {currentReceipt ? 'Lưu cập nhật' : 'Hoàn thành'}
              </Button>
            </Form.Item>
          </Form>
        </StyledCard>
      </div>
    )
  }
)

const ImportGoods = (props: any) => {
  const [data, setData] = useState<any[]>([])
  const billRef = useRef()
  useEffect(() => {
    if (props.location.state) {
      const input = props.location.state.inputData
      // reactotron.log!(input.)
      const formatedData = input.product_receipt.map((productReceipt: any) => {
        const product = productReceipt.product
        return {
          ...product,
          price: productReceipt.price,
          amount: productReceipt.amount,
          expired_at: null,
        }
      })
      setData(formatedData)
    }
  }, [])

  const updateAmount = (record: any, value: any) => {
    if (value <= 0) {
      removeItem(record)
      return
    }
    const foundIndex = data.findIndex(item => item.id === record.id)
    reactotron.log!({ foundIndex })
    let newData = [...data]
    newData[foundIndex].amount = value
    setData(newData)
  }

  const updatePrice = (record: any, value: any) => {
    if (value <= 0) {
      removeItem(record)
      return
    }
    const foundIndex = data.findIndex(item => item.id === record.id)
    reactotron.log!(foundIndex)
    let newData = [...data]
    newData[foundIndex].import_price = value
    setData(newData)
  }

  const updateExp = (record: any, value: any) => {
    const foundIndex = data.findIndex(item => item.id === record.id)
    reactotron.log!(foundIndex)
    let newData = [...data]
    newData[foundIndex].expire_date = moment(value).unix()
    reactotron.log!(newData)
    setData(newData)
  }

  const removeItem = (record: any) => {
    const foundIndex = data.findIndex(item => item.id === record.id)
    reactotron.log!(foundIndex)
    let newData = [...data]
    newData.splice(foundIndex, 1)
    setData(newData)
  }

  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
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
          style={{ width: '100%' }}
          value={amount}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
      dataIndex: 'import_price',
      key: 'price',
      render: (price: number, record: any) => (
        // <Input style={{ maxWidth: '100px' }} value={formatPrice(debt)} />
        <InputNumber
          style={{ width: '100%' }}
          value={price}
          formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
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
      title: 'HSD',
      dataIndex: 'expire_date',
      key: 'expire_date',

      render: (_: any, record: any) => (
        <DatePicker
          style={{ width: '100%' }}
          locale={viVN}
          onChange={(date: any) => {
            updateExp(record, date)
          }}
        />
      ),
    },
    {
      title: 'Thành tiền',
      dataIndex: 'import_price',
      key: 'total',
      render: (_: any, record: any) => (
        <td>{formatPrice(record.import_price * record.amount)}</td>
      ),
    },
    {
      title: '',
      key: 'action',
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

  function convertDataToForm(data: any) {
    if (!data) {
      return {
        store_id: null,
        supplier_id: null,
        note: null,
        payment_type: 1,
        paid_price: 0,
      }
    } else {
      const inputData = data.inputData
      return {
        ...inputData,
        goods_receipt_id: inputData.id,
      }
    }
  }

  // const BillInfo = React.forwardRef(
  //   ({ currentReceipt }: { currentReceipt: any }, ref) => {

  //    })
  // const [excessCash, setExcessCash] = useState<number>(0)
  // const radioStyle = {
  //   display: 'block',
  //   height: '30px',
  //   lineHeight: '30px',
  // }
  // const formItemLayout = {
  //   labelCol: {
  //     xs: { span: 24 },
  //     sm: { span: 24 },
  //   },
  //   wrapperCol: {
  //     xs: { span: 24 },
  //     sm: { span: 24 },
  //   },
  // }
  // const tailFormItemLayout = {
  //   wrapperCol: {
  //     xs: {
  //       span: 24,
  //       offset: 0,
  //     },
  //     sm: {
  //       span: 16,
  //       offset: 8,
  //     },
  //   },
  // }
  // const initialValues = convertDataToForm(props.location.state)
  // const createImportBill = async (values: any) => {
  //   reactotron.log!(values)
  //   try {
  //     setIsLoading(true)
  //     if (props.location.state) {
  //       values.goods_receipt_id = props.location.state.inputData.id
  //       await updateGoods(values)
  //     } else {
  //       await importGoods(values)
  //     }
  //     form.resetFields()
  //     setData([])
  //     message.success('Nhập hàng thành công')
  //     history.goBack()
  //   } catch (error) {
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }
  // const calcExcessCash = (value: number) => {
  //   setExcessCash(value - totalMoney())
  // }
  // const totalMoney = () => {
  //   let total = 0
  //   data.forEach((product: any) => {
  //     total += product.amount * product.import_price
  //   })
  //   return total
  // }
  // return (
  //   <div
  //     style={{
  //       width: '100%',
  //       marginLeft: '0.2rem',
  //       minHeight: '100px',
  //       backgroundColor: 'white',
  //     }}
  //   >
  //     <StyledCard title="Thông tin thanh toán">
  //       <Form
  //         labelCol={{ span: 8 }}
  //         wrapperCol={{ span: 16 }}
  //         layout="horizontal"
  //         form={form}
  //         name="billInfo"
  //         onFinish={(values: any) => {
  //           reactotron.log!(values)
  //           const products = data.map((product: any) => {
  //             return {
  //               ...product,
  //               price: product.import_price,
  //             }
  //           })
  //           values.products = products
  //           createImportBill(values)
  //         }}
  //         initialValues={initialValues}
  //         scrollToFirstError
  //       >
  //         <AutocompleteStore />
  //         <AutocompleteSupplier />
  //         <Form.Item name="note" label="Ghi chú">
  //           <Input.TextArea rows={2} placeholder="Nhập ghi chú" />
  //         </Form.Item>
  //         <Form.Item name="payment_type" label="Loại" initialValue={1}>
  //           <Radio.Group defaultValue={1}>
  //             <Radio value={1}>Tiền mặt</Radio>
  //             <Radio value={2}>Chuyển khoản</Radio>
  //           </Radio.Group>
  //         </Form.Item>
  //         <Row>
  //           <Col span={18}>Tổng tiền hàng: </Col>
  //           <Col span={6}>
  //             <td>{formatPrice(totalMoney())}</td>
  //           </Col>
  //         </Row>
  //         <Form.Item name="paid_price" label="Tiền trả khách">
  //           <InputNumber
  //             style={{ width: '100%' }}
  //             placeholder="Nhập tiền trả khách"
  //             formatter={value =>
  //               `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  //             }
  //             parser={(value: any) => value.replace(/\$\s?|(,*)/g, '')}
  //             max={999999999}
  //             min={0}
  //             onChange={(value: any) => {
  //               reactotron.log!(value)
  //               calcExcessCash(value)
  //             }}
  //           />
  //         </Form.Item>
  //         <Row>
  //           <Col span={18}>Tính vào công nợ: </Col>
  //           <Col span={6}>
  //             <td>{formatPrice(excessCash)}</td>
  //           </Col>
  //         </Row>
  //         <Form.Item {...tailFormItemLayout} style={{ marginTop: '1rem' }}>
  //           <Button
  //             disabled={data.length === 0}
  //             loading={isLoading}
  //             type="primary"
  //             htmlType="submit"
  //           >
  //             {props.location.state ? 'Lưu cập nhật' : 'Hoàn thành'}
  //           </Button>
  //         </Form.Item>
  //       </Form>
  //     </StyledCard>
  //   </div>
  // )
  //   }
  // )

  return (
    <Container>
      <Row>
        <Col
          style={{
            backgroundColor: 'white',
            // minHeight: '80vh',
            padding: '0 2px 0 2px',
          }}
          lg={19}
          md={24}
          xs={24}
        >
          <AutoCompleteProduct
            onSelected={(product: any) => {
              product.price = product.import_price
              const foundIndex = data.findIndex(item => item.id === product.id)
              if (foundIndex !== -1) {
                updateAmount(product, data[foundIndex].amount + 1)
              } else {
                product.amount = 1
                setData(oldDate => [...data, product])
              }
            }}
          />
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
        </Col>
        <Col lg={5} md={24} xs={24}>
          <BillInfo
            ref={billRef}
            resetTable={() => {
              setData([])
            }}
            currentReceipt={
              props.location.state ? props.location.state.inputData : null
            }
            data={data}
          />
        </Col>
      </Row>
    </Container>
  )
}

export default ImportGoods
