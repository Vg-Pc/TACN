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
import { importReceipt, deleteGoods } from './ImportGoodsApi'
import { getStores } from '../store_list/StoreApi'
import { Header } from './components/ImportReceiptHeader'
import { ImportReceiptModel } from './Model'
import { formatPrice } from 'utils/ruleForm'
import ImportReceiptDetail from './components/ImportReceiptDetail'

//

const { Panel } = Collapse

const StyledPanel = styled(Panel)`
  .ant-collapse-content-box {
    /* padding: 0; */
  }
`

const ImportReceipts = () => {
  const [listImportGoods, setListImportGoods] = useState<Array<any>>([])
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
      const res = await importReceipt(params)
      const tableData = res.data.map(
        (item: ImportReceiptModel, index: number) => {
          return { ...item, key: index }
        }
      )
      const formattedPaging = {
        total: res.paging.totalItemCount,
        current: res.paging.page,
        pageSize: res.paging.limit,
      }
      setListImportGoods(tableData)
      setPaging(formattedPaging)
      setIsLoading(false)
    } catch (error) {
      message.error(`???? c?? l???i x???y ra, vui l??ng th??? l???i`)
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
        name: 'T???t c???',
      })
      setStores(allStore)
      setIsLoading(false)
    } catch (error) {
      message.error(`???? c?? l???i x???y ra, vui l??ng th??? l???i`)
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
        <PageHeader title={R.strings().title_header_import_receipt} />
        <Collapse defaultActiveKey={['1']} onChange={callback}>
          <StyledPanel header="Ch???n kho" key="1">
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
          <StyledPanel header="T???nh th??nh" key="1">
            <Select
              allowClear
              showSearch
              placeholder="Ch???n t???nh th??nh"
              style={{ width: '100%' }}
              onChange={(e: any) => {
                setParams({ ...params, province_id: e })
              }}
              optionFilterProp="children"
              filterOption={(input, option) =>
                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {PROVINCES.map((province: any) => (
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
        title: 'M?? nh???p h??ng',
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: 'Nh?? cung c???p',
        dataIndex: 'supplier_name',
        key: 'supplier_name',
      },
      {
        title: 'Ng??y t???o',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (date: number) => (
          <td>{convertTimeStampSecondToString(date)}</td>
        ),
      },
      {
        title: 'Kho h??ng',
        dataIndex: 'store_name',
        key: 'store_name',
      },
      {
        title: 'Ghi ch??',
        dataIndex: 'note',
        key: 'note',
        // render: (price: number) => <td>{formatPrice(price)}</td>,
      },

      {
        title: 'T???ng ti???n h??ng',
        dataIndex: 'total_price',
        key: 'total_price',
        render: (price: number) => <td>{formatPrice(price)}</td>,
      },

      {
        title: 'C???n tr??? NCC',
        dataIndex: 'debt',
        key: 'debt',
        render: (price: number) => <td>{formatPrice(price)}</td>,
      },
    ]

    const onDelete = async (id: number) => {
      try {
        const res = await deleteGoods({ goods_receipt_id: id })
        if (res.status === 1) {
          message.success('X??a phi???u nh???p th??nh c??ng')
          let tempListImportGood = [...listImportGoods]
          let index = tempListImportGood.findIndex(o => {
            return o.id === id
          })
          if (index !== -1) tempListImportGood.splice(index, 1)
          setListImportGoods(tempListImportGood)
        }
      } catch (err) {
        console.log(err)
      }
    }

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
          dataSource={listImportGoods}
          loading={isLoading}
          columns={columns}
          expandRowByClick={true}
          expandable={{
            expandedRowRender: (record: any) => (
              <ImportReceiptDetail
                data={record}
                onDelete={onDelete}
                onUpdate={() => {}}
              />
            ),
            rowExpandable: record => true,
          }}
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

export default ImportReceipts
