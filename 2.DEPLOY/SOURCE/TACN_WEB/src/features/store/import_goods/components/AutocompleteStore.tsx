import { AutoComplete, Empty, Form, Select, Spin } from 'antd'
import { ProductItem } from 'features/product/Model'
import { getStores } from 'features/store/store_list/StoreApi'
import React, { memo, useEffect, useRef, useState } from 'react'
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
type HeaderProps = {
  current: any
  // onSearchSubmit: any
}

const AutocompleteStore = (props: HeaderProps) => {
  const defaultValue = props.current ? [props.current] : []
  const [searchKey, setSearchKey] = useState('')
  const [searchData, setSearchData] = useState<any[]>(defaultValue)
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
      const res = await getStores(params)
      const arrStore = res.data.map((store: any) => {
        return { value: store.id, label: store.name, key: store.id }
      })
      setSearchData(arrStore)
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!isTyping && searchKey.length > 0) searchProduct()
    else {
      setSearchData([])
    }
  }, [params, isTyping, searchKey])

  return (
    <Form.Item
      name="store_id"
      label="Chọn kho"
      rules={[
        // {
        //   type: 'string',
        //   message: 'Nhập tên khách hàng',
        // },
        {
          required: true,
          message: 'Vui lòng chọn kho!',
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
        {...props}
        options={searchData}
      />
    </Form.Item>
  )
}

export default memo(AutocompleteStore, isEqual)
