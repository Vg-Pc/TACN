import Container from 'common/container/Container'
import React, { useEffect, useState } from 'react'
import * as StoreApi from './StoreApi'
import 'moment/locale/vi'
import { DeleteFilled, EditOutlined, UndoOutlined } from '@ant-design/icons'
import viVN from 'antd/es/date-picker/locale/vi_VN'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { StoreModel } from './Model'
import R from 'utils/R'
import { convertTimeStampToString } from 'utils/TimerHelper'
import { createStore, updateStore, deleteStore } from './StoreApi'
import {
  Collapse,
  Radio,
  DatePicker,
  PageHeader,
  Table,
  Row,
  Spin,
  Affix,
  Button,
  Select,
  Space,
  Popconfirm,
} from 'antd'
import reactotron from 'ReactotronConfig'
import AddEditStore from './components/AddEditStore'
import { Header } from './components/Header'
import StoreDetail from './StoreDetail'
import pagination from 'antd/lib/pagination'
const { Option } = Select
//

const { Panel } = Collapse

const StyledPanel = styled(Panel)`
  .ant-collapse-content-box {
    /* padding: 0; */
  }
`

const Stores = () => {
  const [stores, setStores] = useState([])
  const [listProvince, setListProvince] = useState([{ id: '', name: '' }])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddEdit, setShowAddEdit] = useState(false)

  const [paging, setPaging] = useState({
    total: 0,
    current: 1,
    pageSize: 0,
  })

  const [isLoadingModal, setIsLoadingModal] = useState(false)
  const [isEdit, setIsEdit] = useState(false)
  const [dataEdit, setDataEdit] = useState('')
  const [selected, setSelected] = useState([])

  useEffect(() => {
    getListProvince()
    getData()
  }, [])

  const getData = async (search = '', page = 0, province_id = '') => {
    setIsLoading(true)

    const res = await StoreApi.getStores({
      search,
      page,
      province_id,
    })

    const tableData = res.data.map((item: StoreModel) => {
      const create_date: string = item.created_at
      const date = parseInt(create_date) * 1000
      return {
        ...item,
        key: item.id,
        is_active: item.is_active ? 'Đang hoạt động' : 'Ngừng hoạt động',
        created_at: convertTimeStampToString(date),
      }
    })

    const formattedPaging = {
      total: res.paging.totalItemCount,
      current: res.paging.page,
      pageSize: res.paging.limit,
    }

    setStores(tableData)
    setPaging(formattedPaging)
    setIsLoading(false)
  }

  const createStoreFunc = async (data: any, resetFields: any) => {
    setIsLoadingModal(true)
    try {
      await createStore(data)
      setShowAddEdit(false)
      reactotron.log!(resetFields)
      resetFields()
      setIsLoadingModal(false)
    } catch (error) {
    } finally {
      setIsLoadingModal(false)
    }
    getData()
  }

  const updateStoreFunc = async (data: any, resetFields: any) => {
    setIsLoadingModal(true)
    try {
      await updateStore(data)
      reactotron.log!(resetFields)
      resetFields()
      setIsLoadingModal(false)
      setDataEdit('')
      setIsEdit(false)
    } catch (error) {
    } finally {
      setIsLoadingModal(false)
    }
    getData()
  }

  const handleDeleteStore = async (id: any) => {
    setIsLoadingModal(true)
    try {
      await deleteStore({ id: [id] })
      setIsLoadingModal(false)
    } catch (error) {
    } finally {
      setIsLoadingModal(false)
    }
    getData()
  }

  const getListProvince = async () => {
    try {
      const res = await StoreApi.getListProvince()
      setListProvince(res.data)
    } catch (error) {
      console.log(error)
    }
  }

  function FilterView() {
    const { t } = useTranslation()

    function callback(key: any) {
      console.log(key)
    }

    function handleSelectChange(value: any) {
      try {
        const province_id = value
        getData(province_id)
      } catch (error) {
        console.log(error)
      }
    }

    return (
      <div
        style={{
          marginRight: '0.5rem',
        }}
      >
        <PageHeader title={R.strings().store} />
        <Collapse defaultActiveKey={['1', '2', '3']} onChange={callback}>
          <StyledPanel header="Tỉnh/ thành phố" key="1">
            <Select
              showSearch
              style={{ width: '100%' }}
              placeholder="Chọn tỉnh/ thành phố"
              optionFilterProp="children"
              onChange={handleSelectChange}
              // onFocus={onFocus}
              // onBlur={onBlur}
              // onSearch={onSearch}
              allowClear={true}
              filterOption={(input, option) =>
                option?.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
            >
              {listProvince?.map(province => (
                <Option value={province?.id}>{province?.name}</Option>
              ))}
              {/* <Option value="lucy">Lucy</Option>
                <Option value="tom">Tom</Option> */}
            </Select>
          </StyledPanel>
        </Collapse>
        <Collapse
          style={{
            marginTop: '10px',
          }}
          defaultActiveKey={['1', '2', '3']}
          onChange={callback}
        >
          <StyledPanel header="Ngày tạo" key="2">
            <DatePicker.RangePicker style={{ width: '100%' }} locale={viVN} />
          </StyledPanel>
        </Collapse>
      </div>
    )
  }

  const contentView = () => {
    const columns = [
      { title: 'Tên kho', dataIndex: 'name', key: 'name', ellipsis: true },
      {
        title: 'Ngày tạo',
        dataIndex: 'created_at',
        key: 'created_at',
        ellipsis: true,
      },
      {
        title: 'Trạng thái',
        dataIndex: 'is_active',
        key: 'is_active',
        ellipsis: true,
      },
      {
        title: 'Hành động',
        key: 'action',
        render: (text: any, record: any) => (
          <Space size="middle">
            <Button
              type="primary"
              icon={<EditOutlined color="red" />}
              onClick={() => {
                setDataEdit(record)
                setIsEdit(true)
              }}
            >
              Sửa
            </Button>
            <Popconfirm
              title={'Bạn chắc chắn muốn xoá tài khoản này'}
              onConfirm={() => handleDeleteStore(record.id)}
              okText="Xoá"
              cancelText="Quay lại"
              okButtonProps={{
                danger: true,
                type: 'primary',
                loading: isLoading,
              }}
            >
              <Button type="primary" danger icon={<DeleteFilled />}>
                Xóa
              </Button>
            </Popconfirm>
          </Space>
        ),
      },
    ]

    return (
      <div
        style={{
          margin: '2px 5px 2px 5px',
        }}
      >
        <AddEditStore
          visible={showAddEdit || isEdit}
          isEdit={isEdit}
          onCreateNewStore={(newData: any, resetFields: any) => {
            createStoreFunc(newData, resetFields)
          }}
          onUpdateStore={(newData: any, resetFields: any) => {
            updateStoreFunc(newData, resetFields)
          }}
          onCancel={() => {
            if (showAddEdit) {
              setShowAddEdit(false)
            }
            if (isEdit) {
              setIsEdit(false)
              setDataEdit('')
            }
          }}
          data={dataEdit}
          isLoading={isLoadingModal}
        />
        <Affix>
          <Row>
            <Header setIsCreate={setShowAddEdit} onSearchSubmit={getData} />
          </Row>
        </Affix>
        <Table
          dataSource={stores}
          loading={isLoading}
          columns={columns}
          expandedRowKeys={selected}
          // expandable={{
          //   expandRowByClick: true,
          //   expandedRowRender: record => (
          //     <StoreDetail data={record} getData={getData} />
          //   ),
          //   rowExpandable: record => true,
          // }}
          scroll={{
            scrollToFirstRowOnChange: true,
          }}
          // pagination={false}
          // pagination={(paging, { position = 'top' })}
          pagination={{
            ...paging,
            onChange: (page, pageSize) => getData('', page),
          }}
        />
      </div>
    )
  }

  return (
    <Container filterComponent={FilterView} contentComponent={contentView} />
  )
}

export default Stores
