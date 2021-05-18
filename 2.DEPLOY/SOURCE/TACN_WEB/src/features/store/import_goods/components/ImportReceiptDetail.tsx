import {
  Descriptions,
  Divider,
  Table,
  Typography,
  Card,
  Button,
  Popconfirm,
  Spin,
} from 'antd'
import React from 'react'
import { formatPrice } from 'utils/ruleForm'
import { convertTimeStampSecondToString } from 'utils/TimerHelper'
import { DeleteFilled, EditOutlined, UndoOutlined } from '@ant-design/icons'
import history from 'utils/history'
import { ROUTER_PATH } from 'common/config'
import styled from 'styled-components'

const { Text, Link } = Typography
type Props = {
  data: any
  onDelete: any
  onUpdate: any
}

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

const ImportReceiptDetail = ({ data, onUpdate, onDelete }: Props) => {
  const tableData = data.product_receipt.map((item: any) => ({
    code: item.product.code,
    name: item.product.name,
    amount: item.amount,
    price: item.price,
  }))

  const ActionView = () => {
    return (
      <Card
        style={{ width: '100%', backgroundColor: '#f6f9ff' }}
        actions={[
          <Button
            onClick={() => {
              history.push(ROUTER_PATH.IMPORT_GOODS, { inputData: data })
            }}
            type="text"
            size="large"
            style={{ color: '#0090ff' }}
            icon={<EditOutlined color="red" />}
          >
            Chỉnh sửa
          </Button>,

          <Popconfirm
            title={'Bạn chắc chắn muốn xoá phiếu nhập này không?'}
            onConfirm={async () => {
              onDelete(data?.id)
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
              style={{ color: '#cc0000' }}
              size="large"
              icon={<DeleteFilled />}
            >
              Xoá phiếu nhập
            </Button>
          </Popconfirm>,
        ]}
      ></Card>
    )
  }

  const RecieptInfo = () => (
    <Descriptions size="default" column={3}>
      <Descriptions.Item label="Nhà cung cấp">
        {data.supplier_name}
      </Descriptions.Item>
      <Descriptions.Item label="Số lượng">
        {formatPrice(data.amount)}
      </Descriptions.Item>
      <Descriptions.Item label="Tổng tiền">
        {formatPrice(data.total_price)}
      </Descriptions.Item>
      <Descriptions.Item label="Đã trả NCC">
        {formatPrice(data.paid_price)}
      </Descriptions.Item>
      <Descriptions.Item label="Ngày tạo">
        {convertTimeStampSecondToString(data.created_at)}
      </Descriptions.Item>
    </Descriptions>
  )
  const columns = [
    {
      title: 'STT',
      dataIndex: 'index',
      key: 'index',
      render: (text: any, record: any, index: any) => (
        <div style={{ textAlign: 'center' }}>{index + 1}</div>
      ),
    },
    {
      title: 'Mã hàng',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Tên hàng',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượng',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => <td>{formatPrice(amount)}</td>,
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => <td>{formatPrice(price)}</td>,
    },
    {
      title: 'Thành tiền',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (price: number, record: any) => (
        <td>{formatPrice(record.price * record.amount)}</td>
      ),
    },
  ]

  return (
    <div>
      {/* {RecieptInfo()}

      <Divider orientation="left" plain>
        Chi tiết
      </Divider>
      <MyTable
        bordered
        dataSource={tableData}
        columns={columns}
        pagination={false}
      />

      <ActionView />
    </div> */}
      {/* <div> */}
      <Spin spinning={false}>
        <Card style={{ width: '100%', backgroundColor: 'white' }}>
          {RecieptInfo()}
          {/* <Divider orientation="left" plain>
            Chi tiết
          </Divider> */}
          <MyTable
            bordered
            dataSource={tableData}
            columns={columns}
            pagination={false}
          />

          <ActionView />
        </Card>
      </Spin>
    </div>
  )
}

export default ImportReceiptDetail
