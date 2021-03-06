import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { Card, Descriptions, Spin, Table, Button, Popconfirm } from 'antd'
import { DeleteFilled, EditOutlined, UndoOutlined } from '@ant-design/icons'
import reactotron from 'ReactotronConfig'
import { getSaleTypeByStatus } from 'utils/funcHelper'
import R from 'utils/R'
import { formatPrice } from 'utils/ruleForm'
import history from 'utils/history'
import { ROUTER_PATH } from 'common/config'
import {
  convertDateTimeToString,
  convertTimeStampToString,
} from 'utils/TimerHelper'
import { OrderItem, Product2 } from './Model'
import { requestGetOrderDetail } from './OrderApi'
import styled from 'styled-components'
import { SALE_TYPE } from 'utils/constants'

const MyTable = styled(Table)`
  thead {
    tr {
      th {
        height: 35px;
        text-align: center;
      }
    }
  }
  tbody {
    tr {
      td {
        padding: 8px;
      }
    }
  }
  .ant-table-cell-ellipsis {
    text-align: center;
  }
`

interface OrderDetailProps {
  order: OrderItem
  onDelete: (id: number, sale_type: number) => void
}

export default function OrderDetail({ order, onDelete }: OrderDetailProps) {
  const [orderDetail, setOrder] = useState(order)
  const [isLoading, setIsLoading] = useState(true)
  const sumDiscount: number =
    0 + orderDetail?.first_discount + orderDetail?.second_discount

  const columns = useMemo(() => {
    return [
      {
        title: R.strings().product_code,
        dataIndex: 'product',
        key: 'code',
        ellipsis: true,
        render: (product: Product2) => {
          return <td>{product.product_code || product.code}</td>
        },
        width: 150,
      },
      {
        title: R.strings().product_name,
        dataIndex: 'product',
        key: 'name',
        ellipsis: true,
        render: (product: Product2) => {
          return <td>{product.product_name || product.name}</td>
        },
      },
      {
        title: R.strings().product_unit,
        dataIndex: 'product',
        key: 'unit',
        ellipsis: true,
        render: (product: Product2) => (
          <td>{product.product_unit || product.unit_name}</td>
        ),
      },
      {
        title: 'S??? l?????ng',
        dataIndex: 'amount',
        key: 'amount',
        ellipsis: true,
        render: (amount: number) => <td>{amount}</td>,
      },
      {
        title: 'Gi?? b??n',
        dataIndex: 'price',
        key: 'price',
        ellipsis: true,
        render: (price: number) => <td>{formatPrice(price)} VND</td>,
      },
      {
        title: R.strings().order_discount,
        dataIndex: 'discount',
        key: 'discount',
        ellipsis: true,
        render: (discount: number) => <td>{sumDiscount} %</td>,
      },
      {
        title: 'Th??nh ti???n',
        key: 'good_price',
        ellipsis: true,
        render: (product: any) => (
          <td>
            {formatPrice(
              product?.amount * product?.price -
                ((product?.amount * product?.price) / 100) * sumDiscount
            )}{' '}
            VND
          </td>
        ),
      },
    ]
  }, [])
  const getOrderDetail = async () => {
    try {
      if (!isLoading) setIsLoading(true)
      const res = await requestGetOrderDetail(orderDetail.id)
      if (res.data) {
        setOrder(res.data)
      }
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const { sale_type } = order
  const ActionView = () => {
    return (
      <Card
        style={{ width: '100%', backgroundColor: '#f6f9ff' }}
        actions={[
          <Button
            onClick={() => {
              if (sale_type !== SALE_TYPE.RETURN.id) {
                history.push(ROUTER_PATH.ADD_EDIT_ORDER, {
                  inputData: { ...orderDetail },
                })
              } else {
                history.push(ROUTER_PATH.ADD_EDIT_ORDER_RETURN, {
                  inputData: { ...orderDetail },
                })
              }
            }}
            type="text"
            size="large"
            style={{ color: '#0090ff' }}
            icon={<EditOutlined color="red" />}
          >
            Ch???nh s???a
          </Button>,

          <Popconfirm
            title={
              sale_type !== SALE_TYPE.RETURN.id
                ? `B???n ch???c ch???n mu???n xo?? phi???u b??n h??ng n??y kh??ng?`
                : `B???n ch???c ch???n mu???n xo?? phi???u tr??? h??ng n??y kh??ng?`
            }
            onConfirm={async () => {
              onDelete(orderDetail.id, sale_type)
            }}
            okText="Xo??"
            cancelText="Quay l???i"
            okButtonProps={{
              danger: true,
              type: 'primary',
            }}
          >
            <Button
              type="text"
              size="large"
              style={{ color: '#cc0000' }}
              icon={<DeleteFilled />}
            >
              {sale_type !== SALE_TYPE.RETURN.id
                ? `Xo?? phi???u b??n h??ng`
                : `Xo?? phi???u tr??? h??ng`}
            </Button>
          </Popconfirm>,
        ]}
      ></Card>
    )
  }
  const renderInfoOrder = useCallback(() => {
    return (
      <div>
        <Descriptions size="default" column={3}>
          <Descriptions.Item
            label={
              sale_type !== SALE_TYPE.RETURN.id
                ? R.strings().order_code
                : 'M?? ????n tr???'
            }
            style={{ maxWidth: 150 }}
          >
            {order.code}
          </Descriptions.Item>
          <Descriptions.Item
            label={R.strings().order_customer}
            style={{ maxWidth: 150 }}
          >
            {order.customer_name}
          </Descriptions.Item>
          <Descriptions.Item
            label={R.strings().order_store}
            style={{ maxWidth: 150 }}
          >
            {order.store_name}
          </Descriptions.Item>
          <Descriptions.Item
            style={{ maxWidth: 150 }}
            label={
              sale_type !== SALE_TYPE.RETURN.id
                ? R.strings().order_created_at
                : 'Ng??y tr???'
            }
          >
            {convertDateTimeToString(order.created_at * 1000).dateTimeStr}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              sale_type !== SALE_TYPE.RETURN.id ? 'Ng?????i b??n' : 'Ng?????i tr???'
            }
            style={{ maxWidth: 150 }}
          >
            {orderDetail.staff_name}
          </Descriptions.Item>
          <Descriptions.Item label={'Ghi ch??'} style={{ maxWidth: 150 }}>
            {orderDetail.note}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              sale_type !== SALE_TYPE.RETURN.id
                ? 'Chi???t kh???u 1'
                : 'Chi???t kh???u 1'
            }
            style={{ maxWidth: 150 }}
          >
            {orderDetail?.first_discount} %
          </Descriptions.Item>
          <Descriptions.Item
            label={
              sale_type !== SALE_TYPE.RETURN.id
                ? 'Chi???t kh???u 2'
                : 'Chi???t kh???u 2'
            }
            style={{ maxWidth: 150 }}
          >
            {orderDetail?.second_discount} %
          </Descriptions.Item>
          <Descriptions.Item
            label={
              sale_type !== SALE_TYPE.RETURN.id
                ? 'S??? ti???n thu kh??ch'
                : 'S??? ti???n tr??? kh??ch'
            }
            style={{ maxWidth: 150 }}
          >
            {formatPrice(orderDetail?.paid_price)} VND
          </Descriptions.Item>
        </Descriptions>
        {renderListProduct()}
        {ActionView()}
      </div>
    )
  }, [orderDetail])

  const renderListProduct = () => {
    return (
      <MyTable
        bordered
        pagination={false}
        dataSource={orderDetail.products}
        columns={columns}
        scroll={{ scrollToFirstRowOnChange: true }}
      />
    )
  }

  useEffect(() => {
    getOrderDetail()
  }, [])
  return (
    <div>
      <Spin spinning={isLoading}>
        <Card style={{ width: '100%', backgroundColor: 'white' }}>
          {renderInfoOrder()}
        </Card>
      </Spin>
    </div>
  )
}
