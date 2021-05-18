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
import { TableProps } from 'antd/lib/table'
import {
  createAccount,
  getAccounts,
  updateAccount,
  deleteAccount,
  resetPassword,
} from './AccountApi'
import AccountDetail from './AccountDetail'
import { AddEditAccount } from './components/AddEditAccount'
import { Header } from './components/Header'
import { AccountModel } from './Model'
import { useSelector } from 'react-redux'

//

const { Panel } = Collapse

const StyledPanel = styled(Panel)`
  .ant-collapse-content-box {
    /* padding: 0; */
  }
`
export interface StyledTableProps extends TableProps<any> {
  isExpanded?: boolean
}

const ExpandTable = styled((props: StyledTableProps) => <Table {...props} />)`
  .ant-table-row {
    padding: 0px 1px 0px 1px;
    /* background: ${props => (props.isExpanded ? 'red' : 'white')}; */
  }
`

const Accounts = () => {
  const [accounts, setAccounts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [showEditAccount, setShowEditAccount] = useState(false)
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

  const getData = async () => {
    setIsLoading(true)
    try {
      const res = await getAccounts(params)
      const tableData = res.data.map((item: AccountModel) => {
        return { ...item, key: item.id }
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

  const updateAcc = async (data: any, resetFields: any) => {
    setIsLoadingModal(true)
    try {
      await updateAccount(data)
      message.success(`Cập nhật thành công`)
      setShowEditAccount(false)

      resetFields()
    } catch (error) {
      message.error(`Đã có lỗi xảy ra, vui lòng thử lại`)
    } finally {
      setIsLoadingModal(false)
    }
    getData()
  }

  const createAcc = async (data: any, resetFields: any) => {
    setIsLoadingModal(true)
    try {
      const res = await createAccount(data)
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

  useEffect(() => {
    getData()
  }, [params])

  function FilterView() {
    const { t } = useTranslation()
    const userState = useSelector((state: any) => state.authReducer)?.userInfo
    console.log({ userState })
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
        {userState?.role_id === 1 ? (
          <Collapse defaultActiveKey={['1']} onChange={callback}>
            <StyledPanel header="Loại tài khoản" key="1">
              <Radio.Group
                onChange={e => {
                  setParams({ ...params, role_id: e.target.value })
                }}
              >
                <Radio style={radioStyle} value={''}>
                  Tất cả
                </Radio>
                <Radio style={radioStyle} value={1}>
                  Quản trị
                </Radio>
                <Radio style={radioStyle} value={2}>
                  Nhân viên
                </Radio>
                <Radio style={radioStyle} value={3}>
                  Đại lý
                </Radio>
              </Radio.Group>
            </StyledPanel>
          </Collapse>
        ) : (
          <></>
        )}

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
              style={{ width: '100%' }}
              placeholder="Chọn tỉnh thành"
              optionFilterProp="children"
              onChange={(e: any) => {
                setParams({ ...params, province_id: e })
              }}
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
      { title: 'Người dùng', dataIndex: 'name', key: 'name' },
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
      { title: 'Loại', dataIndex: 'role', key: 'role', ellipsis: true },
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
        title: 'Ngày hết hạn',
        dataIndex: 'expired_at',
        key: 'expired_at',
        render: (timestamps: any) => (
          <td>{convertTimeStampSecondToString(timestamps)}</td>
        ),
        ellipsis: true,
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
          dataSource={accounts}
          loading={isLoading}
          columns={columns}
          expandedRowKeys={[currentSelected.id]}
          onRow={(r: any) => ({
            onClick: () => {
              if (currentSelected !== r) setCurrentSelected(r)
              else setCurrentSelected({ id: -1 })
              reactotron.log!(r)
            },
          })}
          expandable={{
            expandedRowRender: (record: any) => (
              <AccountDetail
                onUpdateAccount={getData}
                onDeleteAccount={async (id: any) => {
                  try {
                    await deleteAccount({ id: [id] })
                    message.success(
                      `Đã xoá người dùng: ${record.name}(${record.phone_number})`
                    )
                    getData()
                  } catch (error) {
                    message.error(`Đã có lỗi xảy ra, vui lòng thử lại`)
                  }
                }}
                onResetPassword={async (id: any) => {
                  try {
                    await resetPassword({ id })
                    message.success(`Mật khẩu mới là: ${record.phone_number}`)
                    getData()
                  } catch (error) {
                    message.error(`Đã có lỗi xảy ra, vui lòng thử lại`)
                  }
                }}
                isShowEditAccount={showEditAccount}
                setShowEditAccount={(isShow: any) => {
                  setShowEditAccount(isShow)
                }}
                data={record}
              />
            ),
            onExpand: (status: any, r: any) => {
              if (currentSelected !== r) setCurrentSelected(r)
              else setCurrentSelected({ id: -1 })
              reactotron.log!(r)
            },
          }}
          pagination={{
            ...paging,
            showSizeChanger: false,
            onChange: async (page, pageSize) => {
              setParams({ ...params, page })
            },
          }}
        />
        <AddEditAccount
          visible={showAddAccount}
          onCancel={() => {
            setShowAddAccount(false)
            getData()
          }}
          onCreateNewAccount={(newData: any, resetFields: any) => {
            createAcc(newData, resetFields)
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

export default Accounts
