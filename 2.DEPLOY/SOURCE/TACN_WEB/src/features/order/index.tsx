import {
  Affix,
  Collapse,
  DatePicker,
  message,
  PageHeader,
  Row,
  Select,
  Table,
} from 'antd'
import Container from 'common/container/Container'
import React, { memo, useEffect, useMemo, useState } from 'react'
import isEqual from 'react-fast-compare'
import R from 'utils/R'
import viVN from 'antd/es/date-picker/locale/vi_VN'
import { requestGetListStore } from './StoreApi'
import { getAccounts } from 'features/account/AccountApi'
import { OrderItem, StoreItem } from './Model'
import { AccountModel } from 'features/account/Model'
import { requestGetListOrder, deleteOrder } from './OrderApi'
import { deleteOrderReturn } from './OrderReturnApi'
import Header from './components/Header'
import { formatPrice } from 'utils/ruleForm'
import { convertTimeStampToString } from 'utils/TimerHelper'
import OrderDetail from './OrderDetail'
import { getSaleTypeByStatus, jsonToArray } from 'utils/funcHelper'
import reactotron from 'ReactotronConfig'
import { SALE_TYPE } from 'utils/constants'
import moment from 'moment'
import exportFromJSON from 'export-from-json'

const { Panel } = Collapse

interface FilterOrderProps {
  listStore: Array<StoreItem>
  listUser: Array<AccountModel>
  onSearchStore: (data: any) => void
  onSearchUser: (data: any) => void
  params: any
  setParamsOrder: any
}

interface ContentOrderProps {
  listOrder: Array<OrderItem>
  actionSetListOrder: (data: any) => void
  getListOrder: (payload: any) => void
  isLoading: boolean
  paging: any
  params: any
  setParamsOrder: any
}

const FilterOrder = memo(
  ({
    listStore,
    listUser,
    onSearchStore,
    onSearchUser,
    params,
    setParamsOrder,
  }: FilterOrderProps) => {
    const callback = (key: any) => {}
    const handleChangeStore = (value: number) => {
      setParamsOrder({
        ...params,
        store_id: value,
      })
    }
    const handleChangeUser = (value: number) => {
      setParamsOrder({
        ...params,
        staff_id: value,
      })
    }
    const handleChangeSaleType = (value: number) => {
      setParamsOrder({
        ...params,
        sale_type: value,
      })
    }
    return (
      <div
        style={{
          marginRight: '0.5em',
        }}
      >
        <PageHeader title={R.strings().title_header_order_list} />
        <Collapse defaultActiveKey={['1', '2', '3']} onChange={callback}>
          <Panel
            header={R.strings().product_category}
            key="1"
            style={{
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <Select
              allowClear
              onChange={handleChangeStore}
              showSearch
              style={{ width: '100%' }}
              placeholder="Vui lòng chọn kho"
              optionFilterProp="children"
              onSearch={val => {
                onSearchStore({
                  page: 0,
                  search: val,
                })
              }}
            >
              {listStore.map(store => (
                <Select.Option value={store.id}>{store.name}</Select.Option>
              ))}
            </Select>
          </Panel>
        </Collapse>
        <Collapse
          style={{
            marginTop: '10px',
          }}
          defaultActiveKey={['1', '2', '3']}
          onChange={callback}
        >
          <Panel header="Ngày tạo" key="2">
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              locale={viVN}
              format="DD-MM-YYYY"
              onChange={(dates, dateStrings) => {
                if (dates?.[0] && dates?.[1]) {
                  setParamsOrder({
                    ...params,
                    from_date: dates?.[0].format('X'),
                    to_date: dates?.[1].format('X'),
                  })
                } else {
                  setParamsOrder({
                    ...params,
                    from_date: '',
                    to_date: '',
                  })
                }
              }}
            />
          </Panel>
        </Collapse>

        <Collapse
          defaultActiveKey={['1', '2', '3']}
          onChange={callback}
          style={{
            marginTop: '10px',
          }}
        >
          <Panel header={'Người tạo'} key="3">
            <Select
              allowClear
              onChange={handleChangeUser}
              showSearch
              style={{ width: '100%' }}
              placeholder="Vui lòng chọn người tạo"
              optionFilterProp="children"
              onSearch={val => {
                onSearchUser({
                  page: 0,
                  search: val,
                })
              }}
            >
              {listUser.map(user => (
                <Select.Option value={user.id}>{user.name}</Select.Option>
              ))}
            </Select>
          </Panel>
        </Collapse>
        <Collapse
          defaultActiveKey={['1', '2', '3']}
          onChange={callback}
          style={{
            marginTop: '10px',
          }}
        >
          <Panel header={'Loại hóa đơn'} key="3">
            <Select
              allowClear
              onChange={handleChangeSaleType}
              showSearch
              style={{ width: '100%' }}
              placeholder="Vui lòng chọn loại hóa đơn"
              optionFilterProp="children"
              onSearch={val => {
                onSearchUser({
                  page: 0,
                  search: val,
                })
              }}
            >
              {jsonToArray(SALE_TYPE).map(sale => (
                <Select.Option value={sale.id}>{sale.name}</Select.Option>
              ))}
            </Select>
          </Panel>
        </Collapse>
      </div>
    )
  },
  isEqual
)

const ContentOrder = memo(
  ({
    listOrder,
    actionSetListOrder,
    getListOrder,
    isLoading,
    paging,
    params,
    setParamsOrder,
  }: ContentOrderProps) => {
    const columns = useMemo(() => {
      return [
        {
          title: R.strings().order_code,
          dataIndex: 'code',
          key: 'code',
          ellipsis: true,
        },
        {
          title: R.strings().order_type,
          dataIndex: 'sale_type',
          key: 'sale_type',
          ellipsis: true,
          render: (type: number) => {
            const typeSale: any = getSaleTypeByStatus(type)
            return <td>{typeSale.name}</td>
          },
        },
        {
          title: R.strings().created_at,
          dataIndex: 'created_at',
          key: 'created_at',
          ellipsis: true,
          render: (timestamps: any) => (
            <td>{convertTimeStampToString(timestamps * 1000)}</td>
          ),
        },
        {
          title: R.strings().order_customer,
          dataIndex: 'customer_name',
          key: 'customer_name',
          ellipsis: true,
        },
        {
          title: R.strings().order_store,
          dataIndex: 'store_name',
          key: 'store_name',
          ellipsis: true,
        },
        {
          title: R.strings().order_total_price,
          dataIndex: 'total_price',
          key: 'total_price',
          ellipsis: true,
          render: (price: number) => <td>{formatPrice(price)} VND</td>,
        },
        {
          title: 'Chiết khấu 1',
          dataIndex: 'first_discount',
          key: 'first_discount',
          ellipsis: true,
          render: (discount: number) => <td>{discount} %</td>,
        },
        {
          title: 'Chiết khấu 2',
          dataIndex: 'second_discount',
          key: 'second_discount',
          ellipsis: true,
          render: (discount: number) => <td>{discount} %</td>,
        },
        {
          title: R.strings().import_price,
          dataIndex: 'goods_price',
          key: 'goods_price',
          ellipsis: true,
          render: (price: any) => <td>{formatPrice(price)} VND</td>,
        },
      ]
    }, [])
    const [expandedRowKeys, setExpandedRowKeys] = useState<any>('-1')
    const onExportDataToExcel = () => {
      let dataExport = listOrder.map((o, i) => {
        const typeSale: any = getSaleTypeByStatus(o.sale_type)
        return {
          STT: i + 1,
          'Mã đơn hàng': o.code,
          'Loại đơn': typeSale.name,
          'Ngày tạo': convertTimeStampToString(o.created_at * 1000),
          'Khách hàng': o.customer_name,
          'Kho hàng': o.store_name,
          'Tổng tiền(VND)': o.total_price,
          'Chiết khấu(%) 1': o.first_discount,
          'Chiết khấu(%) 2': o.second_discount,
          'Giá nhập(VND)': o.goods_price,
        }
      })
      let data: any = JSON.parse(JSON.stringify(dataExport))
      let fileName: string = 'Danh sách đơn hàng'
      let exportType: any = 'csv'
      let fields: any = {}
      exportFromJSON({ data, fileName, exportType, fields })
    }
    const onDeleteOrder = async (id: number, sale_type: number) => {
      try {
        let res: any = {}
        if (sale_type !== SALE_TYPE.RETURN.id) {
          res = await deleteOrder({ order_id: id })
        } else {
          res = await deleteOrderReturn({ goods_return_id: id })
        }
        if (res.status === 1) {
          message.success('Xóa hóa đơn thành công')
          let tempListOrders = [...listOrder]
          let index = tempListOrders.findIndex(o => {
            return o.id === id
          })
          if (index !== -1) tempListOrders.splice(index, 1)
          actionSetListOrder(tempListOrders)
        }
      } catch (err) {
        console.log(err)
      }
    }

    return (
      <div>
        <Affix>
          <Row>
            <Header
              onExportDataToExcel={onExportDataToExcel}
              onSearchSubmit={searchKey => {
                setParamsOrder({
                  ...params,
                  search: searchKey,
                })
              }}
            />
          </Row>
        </Affix>

        <Table
          expandedRowKeys={expandedRowKeys}
          onExpand={(expanded, record) => {
            let keys: any = []
            if (expanded) {
              keys.push(record.id)
            }
            setExpandedRowKeys(keys)
          }}
          bordered
          dataSource={listOrder}
          loading={isLoading}
          columns={columns}
          // expandedRowKeys={selected}
          expandable={{
            expandRowByClick: true,
            expandedRowRender: (record: OrderItem) => (
              <OrderDetail order={record} onDelete={onDeleteOrder} />
            ),
            rowExpandable: record => true,
          }}
          scroll={{ x: 800, scrollToFirstRowOnChange: true }}
          pagination={{
            ...paging,
            showSizeChanger: false,
            onChange: async (page, pageSize) => {
              setParamsOrder({ ...params, page })
            },
          }}
        />
      </div>
    )
  },
  isEqual
)

export default function OrderList() {
  const [isLoading, setLoading] = useState(true)
  const [listStore, setListStore] = useState([])
  const [listUser, setListUser] = useState([])
  const [listOrder, setListOrder] = useState<Array<any>>([])
  const [paging, setPaging] = useState({
    total: 0,
    current: 1,
    pageSize: 0,
  })
  const [paramsStore, setParamsStore] = useState({
    page: 0,
    search: '',
  })
  const [paramsAccount, setParamsAccount] = useState({
    search: '',
  })
  const [paramsOrder, setParamsOrder] = useState({
    search: '',
    page: 0,
    from_date: '',
    to_date: '',
    store_id: '',
    sale_type: '',
    staff_id: '',
  })

  const getListStore = async () => {
    try {
      if (!isLoading) setLoading(true)
      const res = await requestGetListStore(paramsStore)
      setListStore(res.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const getListAccount = async () => {
    try {
      if (!isLoading) setLoading(true)
      const res = await getAccounts(paramsAccount)
      setListUser(res.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const getListOrder = async () => {
    try {
      if (!isLoading) setLoading(true)
      const res = await requestGetListOrder(paramsOrder)
      const arrOrder = res.data.map((order: OrderItem) => {
        return { ...order, key: order.id }
      })
      const formattedPaging = {
        total: res.paging.totalItemCount,
        current: res.paging.page,
        pageSize: res.paging.limit,
      }
      setListOrder(arrOrder)
      setPaging(formattedPaging)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListOrder()
  }, [paramsOrder])

  useEffect(() => {
    getListStore()
  }, [paramsStore])

  useEffect(() => {
    getListAccount()
  }, [paramsAccount])
  const actionSetListOrder = (data: Array<any>) => {
    setListOrder(data)
  }

  return (
    <Container
      filterComponent={
        <FilterOrder
          listUser={listUser}
          listStore={listStore}
          onSearchStore={setParamsStore}
          onSearchUser={setParamsAccount}
          params={paramsOrder}
          setParamsOrder={setParamsOrder}
        />
      }
      contentComponent={
        <ContentOrder
          listOrder={listOrder}
          actionSetListOrder={actionSetListOrder}
          getListOrder={getListOrder}
          isLoading={isLoading}
          paging={paging}
          params={paramsOrder}
          setParamsOrder={setParamsOrder}
        />
      }
    />
  )
}
