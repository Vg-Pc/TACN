import {
  Affix,
  Collapse,
  PageHeader,
  Radio,
  Row,
  Select,
  DatePicker,
  Table,
  message,
} from 'antd'
import { MinusCircleTwoTone, PlusCircleTwoTone } from '@ant-design/icons'
import viVN from 'antd/es/date-picker/locale/vi_VN'
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
import {} from './SupplierApi'
import { Header } from './components/Header'
import { getAccounts } from 'features/account/AccountApi'
import {
  getSupplier,
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from './SupplierApi'
import { AddEditForm } from './components/AddEditForm'
import { formatPrice } from 'utils/ruleForm'
import { Tabs } from 'antd'
import SupplierInfo from './components/SupplierInfo'
import TransactionHistory from './components/TransactionHistory'
import DebtInfo from './components/DebtInfo'
import { get } from 'node:https'

const { TabPane } = Tabs

const { Panel } = Collapse

export default function Customers() {
  const [data, setData] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showEditSupplier, setShowEditSupplier] = useState(false)
  const [isLoadingModal, setIsLoadingModal] = useState(false)
  const [currentSelected, setCurrentSelected] = useState({ id: -1 })
  const [listUser, setListUser] = useState([])
  const [paramsAccount, setParamsAccount] = useState({
    search: '',
  })
  const [params, setParams] = useState({
    search: '',
    page: 1,
    role_id: '',
    status: '',
    province_id: '',
    fromDate: '',
    toDate: '',
  })

  const [paging, setPaging] = useState({
    total: 0,
    current: 1,
    pageSize: 0,
  })

  useEffect(() => {
    getData()
    getListAccount()
  }, [params])

  const getData = async () => {
    setIsLoading(true)
    try {
      const res = await getSupplier(params)
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

  const getListAccount = async () => {
    try {
      if (!isLoading) setIsLoading(true)
      const res = await getAccounts(paramsAccount)
      setListUser(res.data)
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  const createCus = async (data: any, resetFields: any) => {
    setIsLoadingModal(true)
    try {
      const res = await createSupplier(data)
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

  const editSupplier = async (data: any, resetFields: any) => {
    console.log(data, 'data update')
    setIsLoadingModal(true)
    try {
      await updateSupplier(data)
      message.success(`Cập nhật thành công`)
      setShowEditSupplier(false)

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
        <PageHeader title={R.strings().title_header_supplier} />
        <Collapse defaultActiveKey={['1']} onChange={() => {}}>
          <Panel header="Người tạo" key="1">
            <Select
              allowClear
              // onChange={handleChangeUser}
              showSearch
              style={{ width: '100%' }}
              placeholder="Vui lòng chọn người tạo"
              optionFilterProp="children"
              // onSearch={val => {
              //   onSearchUser({
              //     page: 0,
              //     search: val,
              //   })
              // }}
            >
              {listUser.map((user: any) => (
                <Select.Option value={user.id}>{user.name}</Select.Option>
              ))}
            </Select>
          </Panel>
        </Collapse>

        <Collapse
          style={{
            marginTop: '10px',
          }}
          defaultActiveKey={['1']}
          onChange={() => {}}
        >
          <Panel header="Ngày tạo" key="1">
            <DatePicker.RangePicker locale={viVN} />
          </Panel>
        </Collapse>

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
              onChange={(e: any) => {}}
              style={{ width: '100%' }}
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
    const columns = [
      { title: 'Tên', dataIndex: 'name', key: 'name' },
      { title: 'Mã NCC', dataIndex: 'code', key: 'code' },
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
        <Table
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
                  defaultActiveKey="supplier_info"
                  onChange={key => console.log({ key })}
                >
                  <TabPane
                    tab={
                      <span style={{ margin: 10 }}>Thông tin nhà cung cấp</span>
                    }
                    key="supplier_info"
                  >
                    <SupplierInfo
                      data={record}
                      onUpdateSupplier={getData}
                      onDeleteSupplier={async (id: any) => {
                        try {
                          await deleteSupplier({ id: [id] })
                          message.success(
                            `Đã xoá nhà cung cấp: ${record.name}(${record.phone_number})`
                          )
                          getData()
                        } catch (error) {
                          message.error(`Đã có lỗi xảy ra, vui lòng thử lại`)
                        }
                      }}
                      // isShowEditSupplier={showEditSupplier}
                      // setShowEditSupplier={(isShow: any) => {
                      //   setShowEditSupplier(isShow)
                      // }}
                    />
                  </TabPane>
                  <TabPane
                    tab={<span style={{ margin: 10 }}>Lịch sử giao dịch</span>}
                    key="transaction_history"
                  >
                    <TransactionHistory info={record} />
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
