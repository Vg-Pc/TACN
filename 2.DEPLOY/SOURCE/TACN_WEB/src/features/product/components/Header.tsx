import React, { useState } from 'react'
import styled from 'styled-components'
import { Button, Col, Input, Row, Space } from 'antd'
import Icon from '@ant-design/icons'
import R from 'utils/R'
import reactotron from 'ReactotronConfig'
import exportFromJSON from 'export-from-json'

interface HeaderProps {
  onSearchSubmit: (search: string) => void
  toggleModal: () => void
  onExportDataToExcel: () => void
}

const Container = styled.div`
  width: 100%;
  padding: 0.5rem;
  background-color: white;
  border-bottom: 1px solid #dddd;
`
export default function Header({
  onSearchSubmit,
  toggleModal,
  onExportDataToExcel,
}: HeaderProps) {
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
            // onKeyDown={e => {
            //   if (e.keyCode === 13) {
            //     onSearchSubmit(searchKey)
            //   }
            // }}
            size="large"
            onSearch={(value: any, event: any) => {
              reactotron.log!(value)
              if (event.keyCode === 13) {
                onSearchSubmit(value)
                return
              }
              onSearchSubmit(value)
            }}
            placeholder={R.strings().search_product}
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
                onExportDataToExcel()
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
            <Button type="primary" onClick={toggleModal}>
              {R.strings().action_create}
            </Button>
          </Space>
        </Col>
      </Row>
    </Container>
  )
}
