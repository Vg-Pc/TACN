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
        title: 'Số lượng',
        dataIndex: 'amount',
        key: 'amount',
        ellipsis: true,
        render: (amount: number) => <td>{amount}</td>,
      },
      {
        title: 'Giá bán',
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
        title: 'Thành tiền',
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
            Chỉnh sửa
          </Button>,

          <Popconfirm
            title={
              sale_type !== SALE_TYPE.RETURN.id
                ? `Bạn chắc chắn muốn xoá phiếu bán hàng này không?`
                : `Bạn chắc chắn muốn xoá phiếu trả hàng này không?`
            }
            onConfirm={async () => {
              onDelete(orderDetail.id, sale_type)
            }}
            okText="Xoá"
            cancelText="Quay lại"
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
                ? `Xoá phiếu bán hàng`
                : `Xoá phiếu trả hàng`}
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
                : 'Mã đơn trả'
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
                : 'Ngày trả'
            }
          >
            {convertDateTimeToString(order.created_at * 1000).dateTimeStr}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              sale_type !== SALE_TYPE.RETURN.id ? 'Người bán' : 'Người trả'
            }
            style={{ maxWidth: 150 }}
          >
            {orderDetail.staff_name}
          </Descriptions.Item>
          <Descriptions.Item label={'Ghi chú'} style={{ maxWidth: 150 }}>
            {orderDetail.note}
          </Descriptions.Item>
          <Descriptions.Item
            label={
              sale_type !== SALE_TYPE.RETURN.id
                ? 'Chiết khấu 1'
                : 'Chiết khấu 1'
            }
            style={{ maxWidth: 150 }}
          >
            {orderDetail?.first_discount} %
          </Descriptions.Item>
          <Descriptions.Item
            label={
              sale_type !== SALE_TYPE.RETURN.id
                ? 'Chiết khấu 2'
                : 'Chiết khấu 2'
            }
            style={{ maxWidth: 150 }}
          >
            {orderDetail?.second_discount} %
          </Descriptions.Item>
          <Descriptions.Item
            label={
              sale_type !== SALE_TYPE.RETURN.id
                ? 'Số tiền thu khách'
                : 'Số tiền trả khách'
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
