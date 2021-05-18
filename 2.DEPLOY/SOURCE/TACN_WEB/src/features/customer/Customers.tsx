import {
  Affix,
  Collapse,
  message,
  PageHeader,
  Row,
  Select,
  Table,
  Tabs,
} from 'antd'
import Container from 'common/container/Container'
import 'moment/locale/vi'
import React, { useEffect, useState } from 'react'
import reactotron from 'ReactotronConfig'
import { PROVINCES } from 'utils/constants'
import R from 'utils/R'
import { formatPrice } from 'utils/ruleForm'
import { convertTimeStampSecondToString } from 'utils/TimerHelper'
import { AddEditForm } from './components/AddEditForm'
import CustomerInfo from './components/CustomerInfo'
import DebtInfo from './components/DebtInfo'
import { Header } from './components/Header'
import PurchaseHistory from './components/PurchaseHistory'
import { TableProps } from 'antd/lib/table'
import {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
} from './CustomerApi'
import styled from 'styled-components'

const { TabPane } = Tabs

const { Panel } = Collapse

export interface StyledTableProps extends TableProps<any> {
  isExpanded?: boolean
}

const ExpandTable = styled((props: StyledTableProps) => <Table {...props} />)`
  .ant-table-row {
    padding: 0px 1px 0px 1px;
    /* background: ${props => (props.isExpanded ? 'red' : 'white')}; */
  }
`

export default function Customers() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showEditCustomer, setShowEditCustomer] = useState(false)
  const [isLoadingModal, setIsLoadingModal] = useState(false)
  const [currentSelected, setCurrentSelected] = useState({ id: -1 })
  const [params, setParams] = useState({
    search: '',
    page: 1,
    role_id: '',
    status: '',
    province_id: '',
  })

  const [paging, setPaging] = useState({
    total: 0,
    current: 1,
    pageSize: 0,
  })

  useEffect(() => {
    getData()
  }, [params])

  const getData = async () => {
    setIsLoading(true)
    try {
      const res = await getCustomers(params)
      const tableData = res.data.map((item: any) => {
        return { ...item, key: item.id }
      })
      const formattedPaging = {
        total: res.paging.totalItemCount,
        current: res.paging.page,
        pageSize: res.paging.limit,
      }
      setData(tableData)
      setPaging(formattedPaging)
      setIsLoading(false)
    } catch (error) {
      message.error(`Đã có lỗi xảy ra, vui lòng thử lại`)
    }
  }

  const createCus = async (data: any, resetFields: any) => {
    setIsLoadingModal(true)
    try {
      const res = await createCustomer(data)
      setShowAddAccount(false)
      reactotron.log!(resetFields)
      resetFields()
    } catch (error) {
      message.error(`Đã có lỗi xảy ra, vui lòng thử lại`)
    } finally {
      setIsLoadingModal(false)
    }

    getData()
  }

  const editCustomer = async (data: any, resetFields: any) => {
    // console.log({ data, resetFields })
    setIsLoadingModal(true)
    try {
      await updateCustomer(data)
      message.success(`Cập nhật thành công`)
      setShowEditCustomer(false)

      resetFields()
    } catch (error) {
      message.error(`Đã có lỗi xảy ra, vui lòng thử lại`)
    } finally {
      setIsLoadingModal(false)
    }
    getData()
  }

  function FilterView() {
    const radioStyle = {
      display: 'block',
      height: '30px',
      lineHeight: '30px',
    }

    return (
      <div
        style={{
          marginRight: '0.5rem',
        }}
      >
        <PageHeader title={R.strings().title_header_customer} />

        <Collapse
          style={{
            marginTop: '10px',
          }}
          defaultActiveKey={['1']}
          onChange={() => {}}
        >
          <Panel header="Tỉnh thành" key="1">
            <Select
              allowClear
              showSearch
              placeholder="Chọn tỉnh thành"
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
          </Panel>
        </Collapse>
      </div>
    )
  }

  function contentView() {
    const { TabPane } = Tabs
    const columns = [
      { title: 'Tên', dataIndex: 'name', key: 'name' },
      { title: 'Mã KH', dataIndex: 'code', key: 'code' },
      {
        title: 'Điện thoại',
        dataIndex: 'phone_number',
        key: 'phone_number',
        render: (text: any) => <a>{text}</a>,
      },
      {
        title: 'Địa chỉ',
        dataIndex: 'province_name',
        key: 'province_name',
      },

      {
        title: 'Ngày tạo',
        dataIndex: 'created_at',
        key: 'created_at',
        render: (timestamps: any) => (
          <td>{convertTimeStampSecondToString(timestamps)}</td>
        ),
        ellipsis: true,
      },
      {
        title: 'Nợ hiện tại',
        dataIndex: 'debt',
        key: 'debt',
        render: (debt: number) => <td>{formatPrice(debt)}</td>,
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
              setIsCreate={setShowAddAccount}
              onSearchSubmit={(searchKey: string) => {
                setParams({ ...params, search: searchKey, page: 1 })
              }}
            />
          </Row>
        </Affix>
        <ExpandTable
          isExpanded={currentSelected.id !== -1}
          scroll={{ x: 800, scrollToFirstRowOnChange: true }}
          bordered
          dataSource={data}
          loading={isLoading}
          columns={columns}
          expandedRowKeys={[currentSelected.id]}
          onRow={r => ({
            onClick: () => {
              if (currentSelected !== r) setCurrentSelected(r)
              else setCurrentSelected({ id: -1 })
              reactotron.log!(r)
            },
          })}
          expandable={{
            expandedRowRender: (record: any) => (
              <div>
                <Tabs
                  style={{ backgroundColor: '#f6f9ff' }}
                  defaultActiveKey="customer_info"
                  // onChange={key => console.log({ key })}
                >
                  <TabPane
                    tab={
                      <span style={{ margin: 10 }}>Thông tin khách hàng</span>
                    }
                    key="customer_info"
                  >
                    <CustomerInfo
                      data={record}
                      onUpdateAccount={getData}
                      onDeleteCustomer={async (id: any) => {
                        try {
                          await deleteCustomer({ id: [id] })
                          message.success(
                            `Đã xoá khách hàng: ${record.name}(${record.phone_number})`
                          )
                          getData()
                        } catch (error) {
                          message.error(`Đã có lỗi xảy ra, vui lòng thử lại`)
                        }
                      }}
                    />
                  </TabPane>
                  <TabPane
                    tab={<span style={{ margin: 10 }}>Lịch sử mua hàng</span>}
                    key="purchase_history"
                  >
                    <PurchaseHistory info={record} />
                  </TabPane>
                  <TabPane
                    tab={<span style={{ margin: 10 }}>Công nợ</span>}
                    key="debt_info"
                  >
                    <DebtInfo info={record} />
                  </TabPane>
                </Tabs>
              </div>
            ),
          }}
          pagination={{
            ...paging,
            onChange: async (page, pageSize) => {
              setParams({ ...params, page })
            },
          }}
        />
        <AddEditForm
          visible={showAddAccount}
          onCancel={() => {
            setShowAddAccount(false)
            getData()
          }}
          onCreateNewAccount={(newData: any, resetFields: any) => {
            createCus(newData, resetFields)
          }}
          isLoading={isLoadingModal}
        />
      </div>
    )
  }

  return (
    <Container filterComponent={FilterView} contentComponent={contentView} />
  )
}
