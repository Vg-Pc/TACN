import {
  Card,
  Descriptions,
  Spin,
  Table,
  Pagination,
  DatePicker,
  Space,
} from 'antd'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import reactotron from 'ReactotronConfig'
import { getSaleTypeByStatus, transactionType } from 'utils/funcHelper'
import R from 'utils/R'
import { formatPrice } from 'utils/ruleForm'
import {
  convertDateTimeToString,
  convertTimeStampToString,
  convertTimeStampSecondToString,
  convertStringToTimeStamp,
} from 'utils/TimerHelper'
import { requestTransactions } from '../CustomerApi'
import styled from 'styled-components'
import { DEBT_OBJECT } from 'utils/constants'

const { RangePicker } = DatePicker

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
        padding: 5px;
        text-align: right;
      }
    }
  }
  .ant-table-cell-ellipsis {
    text-align: center;
  }
`

const columns = [
  {
    title: 'Mã phiếu',
    dataIndex: 'id',
    key: 'id',
    render: (value: any) => {
      return <td>{value}</td>
    },
  },
  {
    title: 'Loại phiếu',
    dataIndex: 'type',
    key: 'type',
    render: (value: any) => {
      return <td>{transactionType(value)}</td>
    },
  },
  {
    title: 'Ngày tạo',
    dataIndex: 'created_at',
    key: 'created_at',
    render: (value: any) => {
      return <td>{value}</td>
    },
  },
  {
    title: 'Ghi chú',
    dataIndex: 'note',
    key: 'note',
    render: (value: any) => {
      return <td>{value}</td>
    },
  },
  {
    title: 'Số tiền',
    dataIndex: 'amount',
    key: 'amount',
    render: (value: any) => {
      return <div style={{ paddingRight: '5px' }}>{value}</div>
    },
  },
  {
    title: 'Công nợ',
    dataIndex: 'debt',
    key: 'debt',
    render: (value: any) => {
      return <div style={{ paddingRight: '5px' }}>{value}</div>
    },
  },
]

const FilterField = ({
  onChangeFromDate,
  onChangeToDate,
}: {
  onChangeFromDate: any
  onChangeToDate: any
}) => {
  return (
    <Space style={{ marginBottom: 10 }} size={15}>
      <RangePicker
        onChange={(dates: any, dateStrings: any) => {
          onChangeFromDate(dateStrings[0])
          onChangeToDate(dateStrings[1])
        }}
      />
    </Space>
  )
}

export default function DebtInfo({ info }: any) {
  const [customerDebt, setCustomerDebt] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState<number>(1)
  const [paging, setPaging] = useState({
    total: 0,
    current: 1,
    pageSize: 0,
  })
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const getCustomerDebt = async () => {
    try {
      if (!isLoading) setIsLoading(true)
      const res = await requestTransactions({
        object: DEBT_OBJECT.CUSTOMER,
        id: info.id,
        page: page,
        from_date: convertStringToTimeStamp(fromDate),
        to_date: convertStringToTimeStamp(toDate),
      })

      const formattedPaging = {
        total: res.paging.totalItemCount,
        current: res.paging.page,
        pageSize: res.paging.limit,
      }

      const convertedArr = res.data.map((item: any) => {
        return {
          ...item,
          created_at: convertTimeStampSecondToString(item.created_at),
          amount: formatPrice(item.amount),
          debt: formatPrice(item.debt),
        }
      })

      setCustomerDebt(convertedArr)
      setPaging(formattedPaging)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const RenderInfoOrder = () => {
    return (
      <div>
        {/* <Descriptions size="default" column={3}>
          <Descriptions.Item label={R.strings().order_code}>
            {info.code}
          </Descriptions.Item>
          <Descriptions.Item label={R.strings().order_customer}>
            {info.customer_name}
          </Descriptions.Item>
          <Descriptions.Item label={R.strings().order_store}>
            {info.store_name}
          </Descriptions.Item>
          <Descriptions.Item label={R.strings().order_created_at}>
            {convertDateTimeToString(info.created_at * 1000).dateTimeStr}
          </Descriptions.Item>
          <Descriptions.Item label={'Người bán'}>
            {info.staff_name}
          </Descriptions.Item>
        </Descriptions> */}
        <RenderListProduct />
      </div>
    )
  }

  const RenderListProduct = () => {
    return (
      <>
        <MyTable
          bordered
          pagination={false}
          dataSource={customerDebt}
          columns={columns}
          scroll={{ scrollToFirstRowOnChange: true }}
        />
        <Pagination
          style={{ marginTop: '10px', fontSize: '12px' }}
          {...paging}
          onChange={async (page, pageSize) => {
            setPage(page)
          }}
          size="small"
          showTotal={total => `Tổng ${total} phiếu`}
        />
      </>
    )
  }

  useEffect(() => {
    getCustomerDebt()
  }, [page, fromDate, toDate])

  const getFromDate = (value: any) => {
    setFromDate(value)
  }

  const getToDate = (value: any) => {
    setToDate(value)
  }

  return (
    <div>
      <Spin spinning={isLoading}>
        <Card style={{ width: '100%', backgroundColor: 'white' }}>
          <FilterField
            onChangeFromDate={getFromDate}
            onChangeToDate={getToDate}
          />
          <RenderInfoOrder />
        </Card>
      </Spin>
    </div>
  )
}
