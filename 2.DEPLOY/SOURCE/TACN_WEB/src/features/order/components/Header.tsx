import React, { useState } from 'react'
import { Button, Col, Input, Row, Space } from 'antd'
import styled from 'styled-components'
import Icon from '@ant-design/icons'
import R from 'utils/R'
import history from 'utils/history'
import { ROUTER_PATH } from 'common/config'
const Container = styled.div`
  width: 100%;
  padding: 0.5rem;
  background-color: white;
  border-bottom: 1px solid #dddd;
`

export default function Header({
  onSearchSubmit,
  onExportDataToExcel,
}: {
  onSearchSubmit: (search: string) => void
  onExportDataToExcel: () => void
}) {
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
            addonAfter={<Icon type="close-circle-o" />}
            onKeyDown={e => {
              if (e.keyCode == 13) {
                onSearchSubmit(searchKey)
              }
            }}
            size="large"
            onSearch={value => {
              onSearchSubmit(value)
            }}
            placeholder={'Mã đơn hàng'}
            onChange={e => {
              setSearchKey(e.target.value)
            }}
          />
        </Col>
        <Col xs={9.5}>
          <Space size="small">
            <Button
              style={{ fontSize: 'small' }}
              type="primary"
              onClick={() => {
                onExportDataToExcel()
              }}
            >
              {R.strings().action_export}
            </Button>
            <Button
              style={{ fontSize: 'small' }}
              type="primary"
              onClick={() => {}}
            >
              {R.strings().action_import}
            </Button>
            <Button
              style={{ fontSize: 'small' }}
              type="primary"
              onClick={() => {
                history.push(ROUTER_PATH.ADD_EDIT_ORDER)
              }}
            >
              Thêm hóa đơn
            </Button>
            <Button
              style={{ fontSize: 'small' }}
              type="primary"
              onClick={() => {
                history.push(ROUTER_PATH.ADD_EDIT_ORDER_RETURN)
              }}
            >
              Trả lại hàng
            </Button>
          </Space>
        </Col>
      </Row>
    </Container>
  )
}
