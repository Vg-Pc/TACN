import Icon, { PlusCircleOutlined } from '@ant-design/icons'
import {
  Affix,
  Collapse,
  DatePicker,
  PageHeader,
  Row,
  Table,
  Select,
  Typography,
  Button,
  message,
} from 'antd'
import viVN from 'antd/es/date-picker/locale/vi_VN'
import Container from 'common/container/Container'
import 'moment/locale/vi'
import React, { useEffect, useMemo, useState } from 'react'
import reactotron from 'ReactotronConfig'
import styled from 'styled-components'
import R from 'utils/R'
import { formatPrice } from 'utils/ruleForm'
import { convertTimeStampToString } from 'utils/TimerHelper'
import Header from './components/Header'
import { CategoryItem, ProductItem, UnitItem } from './Model'
import {
  CreateProductPayload,
  requestCreateProduct,
  requestGetListProduct,
} from './ProductApi'
import {
  requestCreateCategory,
  requestCreateUnit,
  requestGetListCategory,
  requestGetListUnit,
  requestUpdateCategory,
  requestUpdateUnit,
  requestDeleteCategory,
  requestDeleteUnit,
} from './CategoryApi'
import ProductDetail from './ProductDetail'
import AddEditProduct from './AddEditProduct'
import ListCategoryUnit from './ListCategoryUnit'
import exportFromJSON from 'export-from-json'

const { Panel } = Collapse

const statusList: Array<{ id: number; status: string }> = [
  { id: 1, status: 'Hoạt động' },
  { id: 2, status: 'Ngừng hoạt động' },
]

interface FilterProductProps {
  listCategory: Array<CategoryItem>
  listUnit: Array<CategoryItem>
  getListCate: (search: string, page: number) => void
  getListUnit: (search: string, page: number) => void
  getStatus: (value: any) => void
  getFromDate: (value: any) => void
  getToDate: (value: any) => void
  getSelectedCategory?: (value: any) => void
}

const FilterProduct = ({
  listCategory,
  getListCate,
  listUnit,
  getListUnit,
  getStatus,
  getFromDate,
  getToDate,
  getSelectedCategory,
}: FilterProductProps) => {
  const [dialogLoading, setLoading] = useState(false)

  const callback = (key: any) => {}

  const onSubmitCreateCategory = async (name: string) => {
    try {
      setLoading(true)
      const res = await requestCreateCategory({
        name,
      })
      if (res.status === 1) {
        message.success('Tạo danh mục thành công')
        getListCate('', 0)
      } else {
        message.error('Tạo danh mục thất bại, vui lòng thử lại')
      }
      getListCate('', 0)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onSubmitEditCategory = async (item: { id: number; name: string }) => {
    try {
      setLoading(true)
      const res: any = await requestUpdateCategory({
        id: item.id,
        name: item.name,
      })
      if (res.status === 1) {
        message.success('Sửa danh mục thành công')
        getListCate('', 0)
      } else {
        message.error('Sửa danh mục thất bại, vui lòng thử lại')
      }
      getListCate('', 0)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onSubmitDelCategory = async (id: number) => {
    try {
      setLoading(true)
      const res = await requestDeleteCategory({
        id: [id],
      })
      if (res.status === 1) {
        message.success('Xóa danh mục thành công')
        getListCate('', 0)
      } else {
        message.error('Xóa danh mục thất bại, vui lòng thử lại')
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onSubmitCreateUnit = async (name: string) => {
    try {
      setLoading(true)
      let res: any = await requestCreateUnit({ name })
      if (res.status === 1) {
        message.success('Thêm Đơn vị tính thành công')
        getListCate('', 0)
      } else {
        message.error('Thêm Đơn vị tính thất bại, vui lòng thử lại')
      }
      getListUnit('', 0)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onSubmitEditUnit = async (item: { id: number; name: string }) => {
    try {
      setLoading(true)
      let res: any = await requestUpdateUnit({
        id: item.id,
        name: item.name,
      })
      if (res.status === 1) {
        message.success('Sửa Đơn vị tính thành công')
        getListCate('', 0)
      } else {
        message.error('Sửa Đơn vị tính thất bại, vui lòng thử lại')
      }
      getListUnit('', 0)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const onSubmitDelUnit = async (id: number) => {
    try {
      setLoading(true)
      const res = await requestDeleteUnit({
        id: [id],
      })
      if (res.status === 1) {
        message.success('Xóa đơn vị tính thành công')
        getListUnit('', 0)
      } else {
        message.error('Xóa đơn vị tính thất bại, vui lòng thử lại')
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  return (
    <div
      style={{
        marginRight: '0.5em',
      }}
    >
      <PageHeader title={R.strings().title_header_product} />
      {/** the feature at bellow will be develope in future, please dont delete it */}
      {/* <Collapse defaultActiveKey={['1', '2', '3']} onChange={callback}>
        <Panel header="Trạng thái" key="2">
          <Select
            allowClear
            onChange={(value: any) => {
              getStatus(value)
            }}
            // showSearch
            style={{ width: '100%' }}
            placeholder="Chọn trạng thái"
            optionFilterProp="children"
            // onSearch={val => {
            //   onSearchUser({
            //     page: 0,
            //     search: val,
            //   })
            // }}
          >
            {statusList.map((item: any) => (
              <Select.Option value={item.id}>{item.status}</Select.Option>
            ))}
          </Select>
        </Panel>
      </Collapse> */}

      <ListCategoryUnit
        callback={callback}
        onSubmitCreate={onSubmitCreateCategory}
        onSubmitEdit={onSubmitEditCategory}
        onSubmitDelete={onSubmitDelCategory}
        getData={getListCate}
        dialogLoading={dialogLoading}
        data={listCategory}
        title={R.strings().product_category}
        titleCreate={R.strings().create_category}
        titleDelete={R.strings().delete_category}
        titleEdit={R.strings().edit_category}
        hasCheckBox={true}
        // getSelectedCategory={getSelectedCategory}
      />

      <ListCategoryUnit
        title="Danh sách đơn vị tính"
        callback={callback}
        onSubmitCreate={onSubmitCreateUnit}
        onSubmitEdit={onSubmitEditUnit}
        onSubmitDelete={onSubmitDelUnit}
        getData={getListUnit}
        dialogLoading={dialogLoading}
        data={listUnit}
        titleCreate={'Thêm đơn vị tính'}
        titleDelete={'Xóa đơn vị tính'}
        titleEdit={'Sửa đơn vị tính'}
      />

      {/** the feature bellow will be develope in future, please dont delete it */}
      {/* <Collapse
        style={{
          marginTop: '10px',
        }}
        defaultActiveKey={['1', '2', '3']}
        onChange={callback}
      >
        <Panel header="Ngày tạo" key="2">
          <DatePicker.RangePicker
            locale={viVN}
            onChange={(dates: any, dateStrings: any) => {
              getFromDate(dateStrings[0])
              getToDate(dateStrings[1])
            }}
          />
        </Panel>
      </Collapse> */}
    </div>
  )
}

const ContentProduct = ({
  listCategory,
  listUnit,
  status,
  fromDate,
  toDate,
  categoryId,
}: {
  listCategory: Array<CategoryItem>
  listUnit: Array<UnitItem>
  status: any
  fromDate: any
  toDate: any
  categoryId: any
}) => {
  const columns = useMemo(() => {
    return [
      {
        title: 'STT',
        dataIndex: 'index',
        key: 'index',
        render: (text: any, record: any, index: any) => (
          <div style={{ textAlign: 'center' }}>{index + 1}</div>
        ),
      },
      {
        title: R.strings().product_code,
        dataIndex: 'code',
        key: 'code',
      },
      {
        title: R.strings().product_name,
        dataIndex: 'name',
        key: 'name',
      },
      {
        title: R.strings().product_unit,
        dataIndex: 'unit_name',
        key: 'unit',
      },
      {
        title: R.strings().product_group,
        dataIndex: 'product_category_name',
        key: 'group',
      },
      {
        title: R.strings().retail_price,
        dataIndex: 'retail_price',
        key: 'retail',

        render: (price: number) => <td>{formatPrice(price)}</td>,
      },
      {
        title: R.strings().wholesale_price,
        dataIndex: 'wholesale_price',
        key: 'wholesale',

        render: (price: number) => <td>{formatPrice(price)}</td>,
      },
      {
        title: R.strings().import_price,
        dataIndex: 'import_price',
        key: 'import',

        render: (price: number) => <td>{formatPrice(price)}</td>,
      },
      {
        title: R.strings().status,
        dataIndex: 'is_active',
        key: 'status',

        render: (is_active: number) => (
          <a>{is_active == 1 ? R.strings().active : R.strings().un_active}</a>
        ),
      },
      {
        title: R.strings().created_at,
        dataIndex: 'created_at',
        key: 'created_at',

        render: (timestamps: any) => (
          <td>{convertTimeStampToString(timestamps)}</td>
        ),
      },
    ]
  }, [])
  const [listProduct, setListProduct] = useState<Array<ProductItem>>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState(null)
  const [paging, setPaging] = useState({
    total: 0,
    current: 1,
    pageSize: 0,
  })
  const [visible, setVisible] = useState(false)
  const [expandedRowKeys, setExpandedRowKeys] = useState<any>('-1')

  const toggleModal = () => setVisible(prevState => !prevState)

  const getListProduct = async (search = '', page = 0) => {
    try {
      const res = await requestGetListProduct({
        search,
        page,
      })
      const arrProduct = res.data.map((product: ProductItem) => {
        return { ...product, key: product.id }
      })
      const formattedPaging = {
        total: res.paging.totalItemCount,
        current: res.paging.page,
        pageSize: res.paging.limit,
      }
      if (error) setError(null)
      setListProduct(arrProduct)
      setPaging(formattedPaging)
      setIsLoading(false)
    } catch (error) {
      setError(error)
      setIsLoading(false)
    }
  }

  const onCreateProduct = async (payload: CreateProductPayload) => {
    try {
      setIsLoading(true)
      await requestCreateProduct(payload)
      getListProduct()
      setIsLoading(false)
    } catch (error) {
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   getListProduct()
  // }, [])

  useEffect(() => {
    // console.log({ status, fromDate, toDate, categoryId }, 'status to search')
    getListProduct()
  }, [status, fromDate, toDate, categoryId])

  const onExportDataToExcel = () => {
    let dataExport = listProduct.map((o, i) => {
      return {
        STT: i + 1,
        'Mã sản phẩm': o.code,
        'Tên sản phẩm': o.name,
        'Đơn vị tính': o.unit_name,
        'Nhóm mặt hàng': o.product_category_name,
        'Giá bán lẻ(VND)': o.retail_price,
        'Giá sỉ(VND)': o.wholesale_price,
        'Giá nhập(VND)': o.import_price,
        'Trạng thái':
          o.is_active == 1 ? R.strings().active : R.strings().un_active,
        'Ngày tạo': convertTimeStampToString(o.created_at),
      }
    })
    let data: any = JSON.parse(JSON.stringify(dataExport))
    let fileName: string = 'Danh sách sản phẩm'
    let exportType: any = 'csv'
    let fields: any = {}
    exportFromJSON({ data, fileName, exportType, fields })
  }

  const listenEventEditProduct = (data: any, eventType: string) => {
    let tempListProduct: Array<any> = []
    if (eventType == 'edit') {
      // eventType = 'edit', param data is a object of a product
      tempListProduct = listProduct.map((item, index) => {
        if (item.id === data.id) {
          item = { ...data, key: data.id }
        }
        return item
      })
    } else {
      // eventType = 'delete', param data is id of product deleted
      tempListProduct = [...listProduct]
      let index = tempListProduct.findIndex(o => {
        return o.id === data
      })
      if (index !== -1) tempListProduct.splice(index, 1)
    }
    setListProduct(tempListProduct)
  }
  return (
    <div>
      {visible && (
        <AddEditProduct
          product={null}
          visible={visible}
          onCancel={toggleModal}
          listCategory={listCategory}
          listUnit={listUnit}
          onCreateProduct={onCreateProduct}
        />
      )}
      <Affix>
        <Row>
          <Header
            onExportDataToExcel={onExportDataToExcel}
            onSearchSubmit={(search: string) => {
              getListProduct(search, 1)
            }}
            toggleModal={toggleModal}
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
        dataSource={listProduct}
        loading={isLoading}
        columns={columns}
        // expandedRowKeys={selected}
        expandable={{
          expandRowByClick: true,
          expandedRowRender: (record: ProductItem) => (
            <ProductDetail
              product={record}
              listCategory={listCategory}
              listUnit={listUnit}
              listenEventEditProduct={listenEventEditProduct}
            />
          ),
          rowExpandable: record => true,
        }}
        scroll={{
          scrollToFirstRowOnChange: true,
        }}
        pagination={{
          ...paging,
          onChange: (page, pageSize) => getListProduct('', page),
        }}
      />
    </div>
  )
}

export default function ProductList() {
  const [listCategory, setListCategory] = useState([])
  const [listUnit, setListUnit] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [status, setStatus] = useState<any>(undefined)
  const [fromDate, setFromDate] = useState<any>('')
  const [toDate, setToDate] = useState<any>('')
  const [selectedCategory, setSelectedCategory] = useState<any>(1)

  const getListCategory = async (search = '', page = 0) => {
    try {
      if (!isLoading) setLoading(true)
      const resCategory = await requestGetListCategory({
        search,
        page,
      })
      let newArr: any = [...resCategory.data]
      // newArr.unshift({ id: 1, name: 'Tất cả' })
      setListCategory(newArr)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }

  const getListUnit = async (search = '', page = 0) => {
    try {
      const resListUnit = await requestGetListUnit({
        search,
        page,
      })
      setListUnit(resListUnit.data)
    } catch (error) {}
  }

  useEffect(() => {
    getListCategory()
    getListUnit()
  }, [])

  return (
    <Container
      filterComponent={
        <FilterProduct
          listCategory={listCategory}
          getListCate={getListCategory}
          listUnit={listUnit}
          getListUnit={getListUnit}
          getStatus={setStatus}
          getFromDate={setFromDate}
          getToDate={setToDate}
          getSelectedCategory={setSelectedCategory}
        />
      }
      contentComponent={
        <ContentProduct
          listCategory={listCategory}
          listUnit={listUnit}
          status={status}
          fromDate={fromDate}
          toDate={toDate}
          categoryId={selectedCategory}
        />
      }
    />
  )
}

const IconEdit = styled.image`
  display: none;
`
