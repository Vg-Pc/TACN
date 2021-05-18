import { EditOutlined, PlusCircleOutlined } from '@ant-design/icons'
import {
  Affix,
  Checkbox,
  Col,
  Collapse,
  DatePicker,
  Input,
  List,
  message,
  PageHeader,
  Row,
  Select,
  Spin,
  Table,
  Typography,
} from 'antd'
import Container from 'common/container/Container'
import { getAccounts } from 'features/account/AccountApi'
import { ColIcon, ListItem } from 'features/product/styles'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import isEqual from 'react-fast-compare'
import reactotron from 'ReactotronConfig'
import R from 'utils/R'
import AddEditInvoiceType from './AddEditInvoiceType'
import {
  DeleteInvoiceTypePayload,
  requestCreateInvoiceType,
  requestGetListInvoiceType,
  requestUpdateInvoiceType,
  requestDeleteInvoiceType,
} from './InvoiceTypeApi'
import viVN from 'antd/es/date-picker/locale/vi_VN'
import ItemInvoiceType from './ItemInvoiceType'
import {
  GetListInvoicePayload,
  requestCreateInvoice,
  requestGetListInvoice,
  requestUpdateInvoice,
  requestDeleteInvoice,
} from './InvoiceApi'
import { InvoiceItem } from './Model'
import HeaderInvoice from './components/HeaderInvoice'
import { convertTimeStampToString } from 'utils/TimerHelper'
import { formatPrice } from 'utils/ruleForm'
import AddEditInvoice from './AddEditInvoice'
import InvoiceDetail from './InvoiceDetail'
import exportFromJSON from 'export-from-json'

const ContentComponent = memo(
  ({
    listInvoice,
    paging,
    isLoading,
    setParamsInvoice,
    paramsInvoice,
  }: {
    listInvoice: Array<InvoiceItem>
    paramsInvoice: GetListInvoicePayload
    paging: any
    setParamsInvoice: any
    isLoading: boolean
  }) => {
    const [isVisibleCreate, setVisibleCreate] = useState(false)
    const [dialogLoading, setDialogLoading] = useState(false)
    const [editingKey, setEditingKey] = useState('')
    const columns = useMemo(() => {
      return [
        {
          title: 'STT',
          dataIndex: 'index',
          key: 'index',
          ellipsis: true,
          width: 70,
        },
        {
          title: R.strings().invoice_code,
          dataIndex: 'code',
          key: 'code',
          ellipsis: false,
        },
        {
          title: R.strings().invoice_created_at,
          dataIndex: 'created_at',
          key: 'created_at',
          ellipsis: true,
          render: (date: number) => (
            <td>{convertTimeStampToString(date * 1000)}</td>
          ),
        },
        {
          title: R.strings().invoice_staff,
          dataIndex: 'staff_name',
          key: 'staff_name',
          ellipsis: true,
        },
        {
          title: R.strings().invoice_reason,
          dataIndex: 'reason',
          key: 'reason',
          ellipsis: true,
        },
        {
          title: R.strings().invoice_amount,
          dataIndex: 'amount',
          key: 'amount',
          ellipsis: true,
          render: (price: number) => <td>{`${formatPrice(price)} VND`}</td>,
        },
        {
          title: 'Loại phiếu thu',
          dataIndex: 'invoice_type_name',
          key: 'invoice_type_name',
          ellipsis: true,
        },
        {
          title: 'Hành động',
          dataIndex: 'operation',
          render: (_: any, record: any) => {
            const isEdit = isEditing(record)
            return (
              <div>
                {isEdit && (
                  <AddEditInvoice
                    visible={true}
                    invoice={record}
                    onCancel={() => setEditingKey('')}
                    onEditInvoice={onEditInvoice}
                    onDeleteInvoice={onDeleteInvoice}
                  />
                )}
                <a
                  onClick={() => {
                    setEditingKey(record.id)
                  }}
                >
                  Cập nhật
                </a>
              </div>
            )
          },
        },
      ]
    }, [editingKey])

    const isEditing = (record: any) => record.id === editingKey

    const toggleModalCreate = () => setVisibleCreate(prevState => !prevState)

    const onCreateInvoice = useCallback(async values => {
      try {
        const body = { ...values }
        if (!body.customer_id) body.customer_id = null
        if (!body.supplier_id) body.supplier_id = null
        // body.amount = values.price
        setDialogLoading(true)
        await requestCreateInvoice(body)
        setParamsInvoice({
          search: '',
          page: 0,
        })
        toggleModalCreate()
        setDialogLoading(false)
      } catch (error) {
        setDialogLoading(false)
      }
    }, [])

    const onEditInvoice = useCallback(async values => {
      try {
        setDialogLoading(true)
        const body = { ...values }
        if (!body.customer_id) body.customer_id = null
        if (!body.supplier_id) body.supplier_id = null
        await requestUpdateInvoice(body)
        setParamsInvoice({
          search: '',
          page: 0,
        })
        setEditingKey('')
        setDialogLoading(false)
      } catch (error) {
        setDialogLoading(false)
      }
    }, [])
    const onDeleteInvoice = useCallback(async (values: any) => {
      try {
        setDialogLoading(true)
        const body = { ...values }
        const res: any = await requestDeleteInvoice(body)
        console.log('res', res)
        if (res.status === 1) {
          message.success('Xóa phiếu thu chi thành công')
          setParamsInvoice({
            search: '',
            page: 0,
          })
          setEditingKey('')
        }
        setDialogLoading(false)
      } catch (error) {
        setDialogLoading(false)
      }
    }, [])
    const onExportDataToExcel = async () => {
      let dataExport = listInvoice.map((o, i) => {
        return {
          STT: i + 1,
          'Mã đơn hàng': o.code,
          'Ngày tạo': convertTimeStampToString(o.created_at * 1000),
          'Nhân viên': o.staff_name,
          'Lý do': o.reason,
          'Số tiền(VND)': o.amount,
          'Loại phiếu thu': o.invoice_type_name,
        }
      })
      let data: any = JSON.parse(JSON.stringify(dataExport))
      let fileName: string = 'Danh sách thu chi'
      let exportType: any = 'csv'
      let fields: any = {}
      exportFromJSON({ data, fileName, exportType, fields })
    }

    return (
      <div>
        <Affix>
          <Row>
            <HeaderInvoice
              toggleModalCreate={toggleModalCreate}
              onSearchSubmit={searchKey => {
                // onSearchOrder({
                //   ...params,
                //   search: searchKey,
                // })
              }}
              onExportData={onExportDataToExcel}
            />
            {isVisibleCreate && (
              <AddEditInvoice
                invoice={null}
                visible={isVisibleCreate}
                onCancel={toggleModalCreate}
                onCreateInvoice={onCreateInvoice}
              />
            )}
          </Row>
        </Affix>

        <Table
          bordered
          dataSource={listInvoice}
          loading={isLoading || dialogLoading}
          columns={columns}
          // expandable={{
          //   expandRowByClick: true,
          //   expandedRowRender: (record: any) => (
          //     <InvoiceDetail invoice={record} onEditInvoice={onEditInvoice} />
          //   ),
          //   rowExpandable: record => true,
          // }}
          scroll={{ x: 800, scrollToFirstRowOnChange: true }}
          pagination={{
            ...paging,
            onChange: (page, pageSize) => {},
          }}
        />
      </div>
    )
  },
  isEqual
)

const FilterInvoiceType = memo(
  ({ callback }: { callback: (key: any) => void }) => {
    const [listInvoiceType, setListInvoiceType] = useState([])
    const [isLoading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [visibleModal, setVisibleModal] = useState(false)

    const toggleModal = () => setVisibleModal(prevState => !prevState)

    const onSubmitEdit = async (item: {
      id: number
      name: string
      voucher_type: number
    }) => {
      try {
        setLoading(true)
        const res = await requestUpdateInvoiceType(item)
        if (res.status === 1) {
          message.success('Sửa loại giao dịch thành công')
          await getListInvoiceType()
        } else {
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
      }
    }

    const onSubmitCreate = async (name: string, voucher_type: number) => {
      try {
        setLoading(true)
        const res = await requestCreateInvoiceType({ name, voucher_type })
        if (res.status === 1) {
          message.success('Tạo loại giao dịch thành công')
          await getListInvoiceType()
        } else {
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
      }
    }
    const onSubmitDelete = async (body: DeleteInvoiceTypePayload) => {
      try {
        setLoading(true)
        const res = await requestDeleteInvoiceType(body)
        if (res.status === 1) {
          message.success('Xóa loại giao dịch thành công')
          await getListInvoiceType()
        } else {
          setLoading(false)
        }
      } catch (error) {
        setLoading(false)
      }
    }

    const getListInvoiceType = async (
      body = {
        search: '',
        page: 0,
      }
    ) => {
      try {
        if (!isLoading) setLoading(true)
        const res = await requestGetListInvoiceType(body)
        setListInvoiceType(res.data)
        setLoading(false)
      } catch (error) {
        setLoading(false)
      }
    }

    useEffect(() => {
      getListInvoiceType()
    }, [])

    const genExtra = () => (
      <PlusCircleOutlined
        onClick={event => {
          toggleModal()
          event.stopPropagation()
        }}
      />
    )

    return (
      <Collapse
        defaultActiveKey={['1', '2', '3']}
        onChange={callback}
        style={{
          marginTop: '10px',
        }}
      >
        {visibleModal && (
          <AddEditInvoiceType
            item={null}
            visible={visibleModal}
            toggleModal={toggleModal}
            titleSubmit="Tạo loại phiếu thu"
            onSubmitCreate={onSubmitCreate}
          />
        )}
        <Collapse.Panel header={'Loại phiếu'} key="3" extra={genExtra()}>
          <Input.Search
            size="large"
            allowClear
            placeholder={'Tìm kiếm loại phiếu'}
            onKeyDown={e => {
              if (e.keyCode == 13) {
                getListInvoiceType({
                  search: search,
                  page: 0,
                })
              }
            }}
            onChange={e => {
              setSearch(e.target.value)
            }}
            onSearch={(value, event) => {
              getListInvoiceType({
                search: value,
                page: 0,
              })
            }}
          />
          <Spin spinning={isLoading}>
            <List
              dataSource={listInvoiceType}
              itemLayout="vertical"
              split
              style={{
                marginTop: 10,
                maxHeight: 300,
                overflow: 'auto',
              }}
              renderItem={item => (
                <ItemInvoiceType
                  invoiceType={item}
                  onSubmitEdit={onSubmitEdit}
                  onSubmitDelete={onSubmitDelete}
                />
              )}
            />
          </Spin>
        </Collapse.Panel>
      </Collapse>
    )
  },
  isEqual
)

const FilterComponent = memo(
  ({
    setParamsInvoice,
    paramsInvoice,
  }: {
    setParamsInvoice: (data: any) => void
    paramsInvoice: any
  }) => {
    const [listAccount, setListAccount] = useState([])
    const [search, setSearch] = useState('')
    const callback = (key: any) => {}

    const onChangeChk = (checkedValues: any) => {
      reactotron.log!('checkedValues', checkedValues)
    }

    const getListAccount = async () => {
      try {
        const res = await getAccounts({
          search: search || '',
          page: 0,
        })
        setListAccount(res.data)
      } catch (error) {}
    }

    useEffect(() => {
      getListAccount()
    }, [search])

    return (
      <div
        style={{
          marginRight: '0.5em',
        }}
      >
        <PageHeader title={R.strings().invoice_title} />
        <Collapse
          defaultActiveKey={['1', '2', '3']}
          onChange={callback}
          style={{
            backgroundColor: 'white',
          }}
        >
          <Collapse.Panel
            header={R.strings().invoice_object}
            key="1"
            style={{
              paddingLeft: 0,
              paddingRight: 0,
            }}
          >
            <Select
              allowClear
              onChange={() => {}}
              showSearch
              style={{ width: '100%' }}
              placeholder="Vui lòng chọn đối tượng"
              optionFilterProp="children"
            >
              {/* {listStore.map(store => (
                <Select.Option value={store.id}>{store.name}</Select.Option>
              ))} */}
            </Select>

            <Checkbox.Group
              onChange={onChangeChk}
              style={{
                width: '100%',
                marginTop: '10px',
              }}
              children={
                <Row>
                  <Col span={12}>
                    <Checkbox
                      style={{
                        fontSize: 12,
                      }}
                      value={1}
                      children="Phiếu thu"
                      // onChange = {(checkedValues:any) => {
                      //   reactotron.log!(checkedValues)
                      // }}
                    />
                  </Col>
                  <Col span={12}>
                    <Checkbox
                      value={2}
                      style={{
                        fontSize: 12,
                      }}
                      children="Phiếu chi"
                    />
                  </Col>
                </Row>
              }
            />
          </Collapse.Panel>
        </Collapse>
        <FilterInvoiceType callback={callback} />
        <Collapse
          defaultActiveKey={['1']}
          onChange={callback}
          style={{
            backgroundColor: 'white',
            marginTop: 10,
          }}
        >
          <Collapse.Panel header={'Người tạo'} key="1">
            <Select
              allowClear
              onChange={(value: string) => setSearch(value)}
              showSearch
              style={{ width: '100%' }}
              placeholder="Vui lòng chọn kho"
              optionFilterProp="children"
              onSearch={val => setSearch(val)}
            >
              {listAccount.map((user: any) => (
                <Select.Option value={user.name}>{user.name}</Select.Option>
              ))}
            </Select>
          </Collapse.Panel>
        </Collapse>

        <Collapse
          style={{
            marginTop: '10px',
          }}
          defaultActiveKey={['1', '2', '3']}
          onChange={callback}
        >
          <Collapse.Panel header="Ngày tạo" key="2">
            <DatePicker.RangePicker
              style={{ width: '100%' }}
              locale={viVN}
              format="DD-MM-YYYY"
              onChange={(dates, dateStrings) => {
                //call api
              }}
            />
          </Collapse.Panel>
        </Collapse>
      </div>
    )
  },
  isEqual
)

export default function SpendingInvoice() {
  const [isLoading, setLoading] = useState(true)
  const [listInvoice, setListInvoice] = useState([])
  const [paging, setPaging] = useState({
    total: 0,
    current: 1,
    pageSize: 0,
  })
  const [paramsInvoice, setParamsInvoice] = useState({
    search: '',
    page: 0,
    invoice_type_id: '',
    voucher_type: '',
    staff_id: '',
    invoice_object: '',
  })

  const getListInvoice = async () => {
    try {
      if (!isLoading) setLoading(true)
      const res = await requestGetListInvoice(paramsInvoice)
      const arrInvoice = res.data.map((invoice: InvoiceItem, index: number) => {
        return { ...invoice, key: invoice.id, index: index + 1 }
      })
      const formattedPaging = {
        total: res.paging.totalItemCount,
        current: res.paging.page,
        pageSize: res.paging.limit,
      }
      setListInvoice(arrInvoice)
      setPaging(formattedPaging)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  useEffect(() => {
    getListInvoice()
  }, [paramsInvoice])

  return (
    <Container
      contentComponent={
        <ContentComponent
          listInvoice={listInvoice}
          paramsInvoice={paramsInvoice}
          paging={paging}
          isLoading={isLoading}
          setParamsInvoice={setParamsInvoice}
        />
      }
      filterComponent={
        <FilterComponent
          setParamsInvoice={setParamsInvoice}
          paramsInvoice={paramsInvoice}
        />
      }
    />
  )
}
