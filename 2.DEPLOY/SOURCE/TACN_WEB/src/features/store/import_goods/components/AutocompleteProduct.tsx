import React, { useState, useEffect, useRef, memo } from 'react'
import { Input, Row, Button, Col, AutoComplete } from 'antd'
import Icon, { SearchOutlined } from '@ant-design/icons'
import { requestGetListProduct } from 'features/product/ProductApi'
import { getInventorys } from 'features/store/inventory/InventoryApi'
import { ProductItem } from 'features/product/Model'
import styled from 'styled-components'
import reactotron from 'ReactotronConfig'
const { Option } = AutoComplete

const Container = styled.div`
  width: 100%;
  padding: 0.5rem;
  background-color: white;
  border-bottom: 1px solid #dddd;
`
type HeaderProps = {
  onSelected: any
  xsNumber?: any
  store_id?: any
  // onSearchSubmit: any
}

const AutoCompleteProduct = (props: HeaderProps) => {
  const [searchKey, setSearchKey] = useState('')
  const [searchData, setSearchData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isTyping, setIsTyping] = useState(false)
  const [params, setParams] = useState({
    search: '',
    page: 1,
    store_id: props.store_id,
  })

  const timeOut = useRef<any>(null)

  const searchProduct = async () => {
    try {
      setIsLoading(true)
      let arrProduct
      if (props.store_id) {
        const res = await getInventorys({ ...params, store_id: props.store_id })
        arrProduct = res.data.map((product: ProductItem) => {
          return { ...product, key: product.id }
        })
      } else {
        const res = await requestGetListProduct(params)
        arrProduct = res.data.map((product: ProductItem) => {
          return { ...product, key: product.id }
        })
      }

      setSearchData(arrProduct)
    } catch (err) {
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (params.search.trim().length > 0 && !isTyping) searchProduct()
    else {
      setSearchData([])
    }
  }, [params, isTyping])

  function renderOption(item: ProductItem) {
    return (
      <Option key={item.id} value={item.id}>
        <div className="global-search-item">
          <a>{item.name}</a>
        </div>
      </Option>
    )
  }

  return (
    <Container>
      <Row
        style={{
          width: '100%',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Col xs={props.xsNumber || 12}>
          <AutoComplete
            className="global-search"
            size="large"
            value={searchKey}
            style={{ width: '100%' }}
            dataSource={searchData.map(renderOption)}
            onSelect={(value: any, options: any) => {
              setSearchKey('')
              setParams({ ...params, search: '' })
              const product: any = searchData.find((x: any) => x.id === value)

              props.onSelected({ ...product, expired_at: null, amount: 1 })
            }}
            onSearch={(value: any) => {
              setIsTyping(true)
              if (timeOut.current) {
                clearTimeout(timeOut.current)
              }
              timeOut.current = setTimeout(() => {
                setIsTyping(false)
              }, 200)
              setParams({ ...params, search: value })
            }}
          >
            <Input.Search
              loading={isLoading}
              allowClear
              addonAfter={
                <Icon
                  type="close-circle-o"
                  onClick={() => {
                    // props.onSearchSubmit('')
                  }}
                />
              }
              onKeyDown={e => {
                if (e.keyCode == 13) {
                  // props.onSearchSubmit(searchKey)
                }
              }}
              size="large"
              onSearch={(value, event) => {
                // props.onSearchSubmit(value)
              }}
              placeholder="Tìm kiếm theo mã hoặc tên"
              onChange={e => {
                setSearchKey(e.target.value)
              }}
            />
          </AutoComplete>
        </Col>
      </Row>
    </Container>
  )
}

export default memo(AutoCompleteProduct)
// export default AddEditProduct

// export  memo(AutoCompleteProduct)
