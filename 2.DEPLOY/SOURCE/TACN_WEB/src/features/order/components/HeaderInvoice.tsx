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

export default function HeaderInvoice({
  onSearchSubmit,
  toggleModalCreate,
  onExportData,
}: {
  onSearchSubmit: (text: string) => void
  toggleModalCreate?: () => void
  onExportData?: () => void
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
            addonAfter={
              <Icon
                type="close-circle-o"
                onClick={() => {
                  onSearchSubmit('')
                }}
              />
            }
            onKeyDown={e => {
              if (e.keyCode == 13) {
                onSearchSubmit(searchKey)
              }
            }}
            size="large"
            onSearch={(value, event) => {
              // onSearchSubmit(value)
            }}
            placeholder={R.strings().search_spending}
            onChange={e => {
              setSearchKey(e.target.value)
            }}
          />
        </Col>
        <Col xs={8}>
          <Space size="small">
            <Button
              type="primary"
              onClick={() => {
                onExportData && onExportData()
              }}
            >
              {R.strings().action_export}
            </Button>
            <Button
              type="primary"
              onClick={() => {
                //   props.setIsCreate(true)
              }}
            >
              {R.strings().action_import}
            </Button>
            <Button type="primary" onClick={toggleModalCreate}>
              {R.strings().action_create}
            </Button>
          </Space>
        </Col>
      </Row>
    </Container>
  )
}
