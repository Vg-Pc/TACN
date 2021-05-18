import React, { useState } from 'react'
import { Input, Row, Button, Col } from 'antd'
import Icon, { SearchOutlined } from '@ant-design/icons'
import styled from 'styled-components'

const Container = styled.div`
  width: 100%;
  padding: 0.5rem;
  background-color: white;
  border-bottom: 1px solid #dddd;
`
type HeaderProps = {
  setIsCreate: any
  onSearchSubmit: any
}

export const Header = (props: HeaderProps) => {
  const [searchKey, setSearchKey] = useState('')

  return (
    <Container>
      <Row
        // justify="space-around"
        style={{
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Col xs={14}>
          <Input.Search
            // loading={true}
            allowClear
            addonAfter={
              <Icon
                type="close-circle-o"
                onClick={() => {
                  props.onSearchSubmit('')
                }}
              />
            }
            onKeyDown={e => {
              if (e.keyCode == 13) {
                props.onSearchSubmit(searchKey)
              }
            }}
            size="large"
            onSearch={(value, event) => {
              props.onSearchSubmit(value)
            }}
            placeholder="Tìm kiếm tên"
            onChange={e => {
              setSearchKey(e.target.value)
            }}
          />
        </Col>
        {/* <Col xs={8}>
          <Button
            type="primary"
            onClick={() => {
              props.setIsCreate(true)
            }}
          >
            Nhập hàng
          </Button>
        </Col> */}
      </Row>
    </Container>
  )
}
