import {
  Card,
  Descriptions,
  Spin,
  Table,
  Pagination,
  Input,
  Select,
  DatePicker,
  Row,
  Col,
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
import { purchaseHistory } from '../CustomerApi'
import styled from 'styled-components'
import { DEBT_OBJECT, PURCHASE_OBJECT } from 'utils/constants'

const { RangePicker } = DatePicker
const { Search } = Input
const { Option } = Select

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
  // {
  //   title: 'Công nợ',
  //   dataIndex: 'debt',
  //   key: 'debt',
  //   render: (value: any) => {
  //     return <div style={{ paddingRight: '5px' }}>{value}</div>
  //   },
  // },
]

const invoiceTypes = [
  { value: 1, label: 'Phiếu nhập' },
  { value: 2, label: 'Phiếu bán buôn' },
  { value: 3, label: 'Phiếu bán lẻ' },
  { value: 4, label: 'Phiếu trả hàng' },
  { value: 5, label: 'Phiếu thu' },
  { value: 6, label: 'Phiếu chi' },
  { value: 7, label: 'Phiếu thanh toán' },
  { value: 8, label: 'Xóa phiếu nhập' },
  { value: 9, label: 'Xóa phiếu trả hàng' },
  { value: 10, label: 'Xóa phiếu bán buôn' },
  { value: 11, label: 'Xóa phiếu bán lẻ' },
]

const FilterField = ({
  onChangeInvoiceType,
  onChangeFromDate,
  onChangeToDate,
}: {
  onChangeInvoiceType: any
  onChangeFromDate: any
  onChangeToDate: any
}) => {
  return (
    <Space style={{ marginBottom: 10 }} size={15}>
      <Select
        allowClear
        placeholder="Loại phiếu"
        style={{ width: 200 }}
        onChange={onChangeInvoiceType}
      >
        {invoiceTypes.map((item: any) => {
          return (
            <Option key={item.value} value={item.value}>
              {item.label}
            </Option>
          )
        })}
      </Select>
      {/* <Select
        showSearch
        allowClear
        style={{ width: 250 }}
        placeholder="Kho hàng"
        optionFilterProp="children"
        // onChange={(value: any) => console.log(value, 'store')}
        // onFocus={onFocus}
        // onBlur={onBlur}
        // onSearch={onSearch}
        filterOption={({ input, option }: any) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        <Option value={1}>Hà Nội</Option>
        <Option value={2}>Sài Gòn</Option>
        <Option value={3}>Đà Nẵng</Option>
      </Select> */}
      <RangePicker
        onChange={(dates: any, dateStrings: any) => {
          onChangeFromDate(dateStrings[0])
          onChangeToDate(dateStrings[1])
        }}
      />
    </Space>
  )
}

function PurchaseHistory({ info }: any) {
  const [purchaseData, setPurchaseData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [page, setPage] = useState<number>(1)
  const [paging, setPaging] = useState({
    total: 0,
    current: 1,
    pageSize: 0,
  })
  const [invoiceType, setInvoiceType] = useState(0)
  const [store, setStore] = useState(0)
  const [fromDate, setFromDate] = useState('')
  const [toDate, setToDate] = useState('')

  useEffect(() => {
    getPurchaseHistory()
  }, [page, invoiceType, fromDate, toDate])

  const PurchaseList = () => {
    return (
      <>
        <MyTable
          bordered
          pagination={false}
          // pagination={{
          //   ...paging,
          //   onChange: async (page, pageSize) => {
          //     setPage(page)
          //   },
          //   size: 'small',
          //   showTotal: total => `Tổng ${total} phiếu`,
          // }}
          dataSource={purchaseData}
          columns={columns}
          scroll={{ scrollToFirstRowOnChange: true }}
        />
        <Pagination
          style={{ marginTop: '10px', fontSize: '12px' }}
          {...paging}
          onChange={async (page: any, pageSize: any) => {
            setPage(page)
          }}
          size="small"
          showTotal={(total: any) => `Tổng ${total} phiếu`}
        />
      </>
    )
  }

  const getPurchaseHistory = async () => {
    try {
      // if (!isLoading) setIsLoading(true)
      const res = await purchaseHistory({
        object: PURCHASE_OBJECT.CUSTOMER,
        id: info.id,
        page: page,
        search: '',
        from_date: convertStringToTimeStamp(fromDate),
        to_date: convertStringToTimeStamp(toDate),
        type: invoiceType,
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

      setPurchaseData(convertedArr)
      setPaging(formattedPaging)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const getInvoiceType = (value: any) => {
    setInvoiceType(value)
  }

  const getFromDate = (value: any) => {
    setFromDate(value)
  }

  const getToDate = (value: any) => {
    setToDate(value)
  }

  return (
    <Spin spinning={isLoading}>
      <Card
        style={{
          width: '100%',
          backgroundColor: 'white',
        }}
      >
        <FilterField
          onChangeInvoiceType={getInvoiceType}
          onChangeFromDate={getFromDate}
          onChangeToDate={getToDate}
        />
        <PurchaseList />
      </Card>
    </Spin>
  )
}

export default PurchaseHistory
