import React, { useState, useEffect, useCallback } from 'react'
import Container from 'common/container/Container'
import {
  DatePicker,
  Affix,
  Collapse,
  PageHeader,
  Radio,
  Row,
  Select,
  Table,
  message,
} from 'antd'
import {
  ContainerView,
  SelectAntStyled,
} from './components/FinancialReportComponent'
import { SALE_TYPE } from 'utils/constants'
import viVN from 'antd/es/date-picker/locale/vi_VN'
import { getSaleTypeByStatus, jsonToArray } from 'utils/funcHelper'
import { getStores } from 'features/store/store_list/StoreApi'
import { getCustomers } from 'features/customer/CustomerApi'

const { Panel } = Collapse
const { RangePicker } = DatePicker

export default function FinancialReport() {
  const [dataFilter, setDataFilter] = useState<any>({
    from_date: '',
    to_date: '',
    store_id: '',
    invoice_type_id: '',
    customer_id: '',
  })
  const [searchCustomer, setSearchCustomer] = useState<any>('')
  const [listCustomer, setListCustomer] = useState<Array<any>>([])

  const [searchStore, setSearchStore] = useState<any>('')
  const [listStore, setListStore] = useState<Array<any>>([])

  const {
    from_date,
    to_date,
    store_id,
    invoice_type_id,
    customer_id,
  } = dataFilter

  const getListCustomer = useCallback(async () => {
    try {
      const res = await getCustomers({ search: searchCustomer || '' })
      setListCustomer(res.data)
    } catch (error) {}
  }, [searchCustomer])

  const getListStore = useCallback(async () => {
    try {
      const res = await getStores({ search: searchStore || '' })
      let allStore = res.data
      allStore.unshift({
        id: '',
        name: 'Tất cả',
      })
      setListStore(allStore)
    } catch (error) {}
  }, [searchStore])

  useEffect(() => {
    getListCustomer()
  }, [searchCustomer])

  useEffect(() => {
    getListStore()
  }, [searchStore])

  useEffect(() => {
    console.log(dataFilter)
  }, [dataFilter])
  function FilterView() {
    return (
      <ContainerView>
        <PageHeader title={'Báo cáo tài chính'} />

        <Collapse defaultActiveKey={['1']}>
          <Panel header="Kho hàng" key="1">
            <Select
              allowClear
              showSearch
              optionFilterProp="children"
              style={{ width: '100%' }}
              defaultValue={''}
              placeholder="Chọn kho..."
              onSearch={(value: any) => {
                setSearchStore(value)
              }}
              onChange={(value: any) => {
                setSearchStore(value)
                setDataFilter({ ...dataFilter, store_id: value })
              }}
            >
              {listStore.map(item => (
                <Select.Option value={item.id}>{item.name}</Select.Option>
              ))}
            </Select>
          </Panel>
        </Collapse>

        <Collapse style={{ marginTop: 10 }} defaultActiveKey={['1']}>
          <Panel header="Thời gian" key="1">
            <RangePicker
              allowClear
              style={{
                width: '100%',
                fontWeight: 'bold',
              }}
              id="date-picker"
              locale={viVN}
              format="DD-MM-YYYY"
              onChange={(dates: any, dateStrings: any) => {
                if (dates?.[0] && dates?.[1]) {
                  setDataFilter({
                    ...dataFilter,
                    from_date: dates?.[0].format('X'),
                    to_date: dates?.[1].format('X'),
                  })
                } else {
                  setDataFilter({
                    ...dataFilter,
                    from_date: '',
                    to_date: '',
                  })
                }
              }}
            />
          </Panel>
        </Collapse>

        <Collapse style={{ marginTop: 10 }} defaultActiveKey={['1']}>
          <Panel header="Đối tượng" key="1">
            <Select
              style={{ width: '100%' }}
              allowClear
              showSearch
              placeholder="Vui lòng chọn khách hàng"
              optionFilterProp="children"
              onSearch={val => {
                setSearchCustomer(val)
              }}
              onChange={(value: string) => {
                setSearchCustomer(value)
                setDataFilter({ ...dataFilter, customer_id: value })
              }}
            >
              {listCustomer.map((customer: any) => (
                <Select.Option value={customer.id}>
                  {customer.name}
                </Select.Option>
              ))}
            </Select>
          </Panel>
        </Collapse>

        <Collapse defaultActiveKey={['1']} style={{ marginTop: '10px' }}>
          <Panel header={'Loại hóa đơn'} key="1">
            <Select
              allowClear
              onChange={(value: any) => {
                setDataFilter({ ...dataFilter, invoice_type_id: value })
              }}
              style={{ width: '100%' }}
              placeholder="Vui lòng chọn loại hóa đơn"
              optionFilterProp="children"
            >
              {jsonToArray(SALE_TYPE).map(sale => (
                <Select.Option value={sale.id}>{sale.name}</Select.Option>
              ))}
            </Select>
          </Panel>
        </Collapse>
      </ContainerView>
    )
  }

  function contentView() {
    return <div>bbb</div>
  }

  return (
    <Container filterComponent={FilterView} contentComponent={contentView} />
  )
}
