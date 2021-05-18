import { Card, Spin, Table, Pagination, DatePicker, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import reactotron from 'ReactotronConfig'
import styled from 'styled-components'
import R from 'utils/R'
import { formatPrice } from 'utils/ruleForm'
import { requestTransactions } from '../SupplierApi'
import {
  convertStringToTimeStamp,
  convertTimeStampSecondToString,
} from 'utils/TimerHelper'
import { DEBT_OBJECT } from 'utils/constants'
import { transactionType } from 'utils/funcHelper'

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
    title: 'Ngày nhập',
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
    title: 'Tiền trả NCC',
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
  // const [orderDetail, setOrder] = useState(info)
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [paging, setPaging] = useState({
    total: 0,
    current: 1,
    pageSize: 0,
  })
  const [page, setPage] = useState<number>(1)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  const getDebtList = async () => {
    try {
      if (!isLoading) setIsLoading(true)
      const res = await requestTransactions({
        object: DEBT_OBJECT.SUPPLIER,
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

      // console.table(convertedArr)

      setData(convertedArr)
      setPaging(formattedPaging)
      reactotron.log!(res.data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    getDebtList()
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
          <MyTable
            bordered
            pagination={false}
            dataSource={data}
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
        </Card>
      </Spin>
    </div>
  )
}
