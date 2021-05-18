import { ConsoleSqlOutlined } from '@ant-design/icons'
import { AutoComplete, Empty, Form, Select, Spin } from 'antd'
import { ProductItem } from 'features/product/Model'
import { getSupplier } from 'features/supplier/SupplierApi'
import React, { useEffect, useRef, useState, memo } from 'react'
import isEqual from 'react-fast-compare'
import reactotron from 'ReactotronConfig'
import styled from 'styled-components'
const { Option } = AutoComplete

const Container = styled.div`
  width: 100%;
  padding: 0.5rem;
  background-color: white;
  border-bottom: 1px solid #dddd;
`

const AutocompleteSupplier = (props: any) => {
  const defaultValue = props.current ? [props.current] : []
  const [searchKey, setSearchKey] = useState('')
  const [searchData, setSearchData] = useState(defaultValue)
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [params, setParams] = useState({
    search: '',
    page: 1,
  })
  const timeOut = useRef<any>(null)

  const searchProduct = async () => {
    try {
      setIsLoading(true)
      const res = await getSupplier(params)
      const arrProduct = res.data.map((product: ProductItem) => {
        return { value: product.id, label: product.name, key: product.id }
      })
      setSearchData(arrProduct)
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  // useEffect(() => {
  //   if (!isTyping) searchProduct()
  //   else {
  //     setSearchData([])
  //   }
  // }, [params, isTyping])

  useEffect(() => {
    // if (!isTyping) searchProduct()
    // else {
    //   setSearchData([])
    // }
    reactotron.log!('render')
  }, [])

  return (
    <Form.Item
      name="supplier_id"
      label="Nhà cung cấp"
      rules={[
        // {
        //   type: 'string',
        //   message: 'Nhập tên khách hàng',
        // },
        {
          required: true,
          message: 'Vui lòng chọn nhà cung cấp!',
        },
      ]}
    >
      <Select
        allowClear
        showSearch
        onChange={() => {}}
        // labelInValue
        filterOption={false}
        onSearch={(value: any) => {
          reactotron.log!(value)
          setSearchKey(value)
          setIsTyping(true)
          if (timeOut.current) {
            clearTimeout(timeOut.current)
          }
          timeOut.current = setTimeout(() => {
            setIsTyping(false)
            searchProduct()
          }, 300)
          setParams({ ...params, search: value })
        }}
        placeholder="Select users"
        notFoundContent={
          isLoading ? (
            <Spin size="small" />
          ) : searchKey.length > 0 ? (
            <Empty description="Không tìm thấy nhà cung cấp" />
          ) : null
        }
        options={searchData}
      />
    </Form.Item>
  )
}
export default memo(AutocompleteSupplier, isEqual)
