import {
  Affix,
  Collapse,
  PageHeader,
  Radio,
  Row,
  Select,
  Table,
  message,
} from 'antd'
import { MinusCircleTwoTone, PlusCircleTwoTone } from '@ant-design/icons'
import Icon from '@ant-design/icons'
import Container from 'common/container/Container'
import 'moment/locale/vi'
import React, { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import reactotron from 'ReactotronConfig'
import styled from 'styled-components'
import { PROVINCES } from 'utils/constants'
import R from 'utils/R'
import { convertTimeStampSecondToString } from 'utils/TimerHelper'
import { getInventorys } from './InventoryApi'
import { getStores } from '../store_list/StoreApi'
import { Header } from './components/Header'
import { InventoryModel } from './Model'
import { formatPrice } from 'utils/ruleForm'

//

const { Panel } = Collapse

const StyledPanel = styled(Panel)`
  .ant-collapse-content-box {
    /* padding: 0; */
  }
`

const Inventory = () => {
  const [accounts, setAccounts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [stores, setStores] = useState([])

  const [params, setParams] = useState({
    search: '',
    page: 1,
    role_id: '',
    status: '',
    province_id: '',
    store_id: '',
  })

  const [paging, setPaging] = useState({
    total: 0,
    current: 1,
    pageSize: 0,
  })

  const getData = async () => {
    setIsLoading(true)
    try {
      const res = await getInventorys(params)
      const tableData = res.data.map((item: InventoryModel, index: number) => {
        return { ...item, key: index }
      })
      const formattedPaging = {
        total: res.paging.totalItemCount,
        current: res.paging.page,
        pageSize: res.paging.limit,
      }
      setAccounts(tableData)
      setPaging(formattedPaging)
      setIsLoading(false)
    } catch (error) {
      message.error(`Đã có lỗi xảy ra, vui lòng thử lại`)
    }
  }

  const getAllStore = async () => {
    try {
      const res = await getStores({
        search: '',
        page: 1,
        province_id: '',
      })

      let allStore = res.data
      allStore.unshift({
        id: '',
        name: 'Tất cả',
      })
      setStores(allStore)
      setIsLoading(false)
    } catch (error) {
      message.error(`Đã có lỗi xảy ra, vui lòng thử lại`)
    }
  }

  useEffect(() => {
    getAllStore()
    getData()
  }, [params])

  function FilterView() {
    const { t } = useTranslation()
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }
    function callback(key: any) {
      console.log(key)
    }
    return (
      <div
        style={{
          marginRight: '0.5rem',
        }}
      >
        <PageHeader title={R.strings().account} />
        <Collapse defaultActiveKey={['1']} onChange={callback}>
          <StyledPanel header="Chọn kho" key="1">
            <Radio.Group
              onChange={e => {
                setParams({ ...params, store_id: e.target.value })
              }}
            >
              {stores.map((store: any) => (
                <Radio style={radioStyle} value={store.id}>
                  {store.name}
                </Radio>
              ))}
            </Radio.Group>
          </StyledPanel>
        </Collapse>

        <Collapse
          style={{
            marginTop: '10px',
          }}
          defaultActiveKey={['1']}
          onChange={callback}
        >
          <StyledPanel header="Tỉnh thành" key="1">
            <Select
              allowClear
              showSearch
              placeholder="Chọn tỉnh thành"
              onChange={(e: any) => {
                setParams({ ...params, province_id: e })
              }}
              style={{ width: '100%' }}
              filterOption={(input, option) =>
                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {PROVINCES.map(province => (
                <Select.Option value={province.id}>
                  {province.name}
                </Select.Option>
              ))}
            </Select>
          </StyledPanel>
        </Collapse>
      </div>
    )
  }

  const contentView = () => {
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
        title: 'Tên sản phẩm',
        dataIndex: 'product_name',
        key: 'product_name',
      },
      { title: 'Mã sản phẩm', dataIndex: 'product_code', key: 'product_code' },
      { title: 'Đơn vị tính', dataIndex: 'product_unit', key: 'product_unit' },
      {
        title: 'Nhóm mặt hàng',
        dataIndex: 'product_category',
        key: 'product_category',
      },
      {
        title: 'Kho hàng',
        dataIndex: 'store_name',
        key: 'store_name',
      },

      {
        title: 'Giá nhập',
        dataIndex: 'import_price',
        key: 'import_price',
        render: (price: number) => <td>{formatPrice(price)}</td>,
      },
      {
        title: 'Giá bán',
        dataIndex: 'price',
        key: 'price',
        render: (price: number) => <td>{formatPrice(price)}</td>,
      },
      {
        title: 'Tồn kho',
        dataIndex: 'amount',
        key: 'amount',
        render: (price: number) => <td>{formatPrice(price)}</td>,
      },
    ]

    return (
      <div
        style={{
          margin: '2px 5px 2px 5px',
        }}
      >
        <Affix>
          <Row>
            <Header
              setIsCreate={() => {}}
              onSearchSubmit={(searchKey: string) => {
                setParams({ ...params, search: searchKey, page: 1 })
              }}
            />
          </Row>
        </Affix>
        <Table
          scroll={{ x: 800, scrollToFirstRowOnChange: true }}
          bordered
          dataSource={accounts}
          loading={isLoading}
          columns={columns}
          pagination={{
            ...paging,
            onChange: async (page, pageSize) => {
              setParams({ ...params, page })
            },
          }}
        />
      </div>
    )
  }

  return (
    <Container filterComponent={FilterView} contentComponent={contentView} />
  )
}

export default Inventory
