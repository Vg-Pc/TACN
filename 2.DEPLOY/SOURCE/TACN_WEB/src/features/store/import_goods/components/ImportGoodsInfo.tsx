import React, { useState, useEffect, useRef } from 'react'
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
  Form,
  Input,
  Col,
  AutoComplete,
} from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'
import R from 'utils/R'
const { Panel } = Collapse
type Props = {
  data?: any
  handleOnChange?: any
}

export const ImportGoodsInfo = ({ handleOnChange, data }: Props) => {
  const [valueAutocomplete, setValueAutocomplete] = useState('')
  const staffRef = useRef<any>(null)

  const [optionsAutocomplete, setOptionsAutocomplete] = useState([
    { value: 'tiendv', label: 'tiendv', code: '1' },
  ])

  const getListStaff = (search: string) => {
    try {
    } catch (error) {
      console.log(error)
    }
  }

  const getListProvider = (search: string) => {
    try {
    } catch (error) {
      console.log(error)
    }
  }

  const onSelect = (value: string) => {
    console.log(value, 'value1')
  }

  const onChange = (value: string) => {
    console.log(value, 'value2')
    setValueAutocomplete(value)
  }

  const onChangeDate = (value: any) => {
    console.log(value, 'value2')
    // setValueAutocomplete(value)
  }

  const onSearch = (searchText: string) => {
    if (staffRef.current) {
      clearTimeout(staffRef.current)
    }

    staffRef.current = setTimeout(() => {
      getListStaff(searchText)
    }, 300)
  }

  return (
    <div style={{ backgroundColor: 'white', padding: '10px' }}>
      <h6>
        <p
          style={{
            fontSize: '1.3rem',
          }}
        >
          Thông tin nhập hàng
        </p>
      </h6>
      <Form.Item
        label="Mã phiếu nhập"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>
      {/* </Col> */}

      {/* <Col span={4}> */}
      {/* <PlusCircleOutlined
              style={{ fontSize: 28, marginTop: 5, cursor: 'pointer' }}
            />
          </Col> */}
      {/* </Row> */}

      <Row gutter={24} align="middle">
        <Col span={20}>
          <Form.Item
            label="Nhân viên"
            name="staff"
            rules={[{ required: true, message: 'Please input your staff!' }]}
          >
            <AutoComplete
              value={valueAutocomplete}
              options={optionsAutocomplete}
              onSelect={onSelect}
              onSearch={onSearch}
              onChange={onChange}
              placeholder="Nhân viên"
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <PlusCircleOutlined
            style={{ fontSize: 28, marginTop: 7, cursor: 'pointer' }}
          />
        </Col>
      </Row>

      <Row gutter={24} align="middle">
        <Col span={20}>
          <Form.Item
            label="Nhà cung cấp"
            name="provider"
            rules={[{ required: true, message: 'Please input your staff!' }]}
          >
            <AutoComplete
              value={valueAutocomplete}
              options={optionsAutocomplete}
              onSelect={onSelect}
              onSearch={onSearch}
              onChange={onChange}
              placeholder="Nhà cung cấp"
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <PlusCircleOutlined
            style={{ fontSize: 28, marginTop: 7, cursor: 'pointer' }}
          />
        </Col>
      </Row>

      <Row gutter={24} align="middle">
        <Col span={20}>
          <Form.Item
            label="Kho nhập"
            name="store"
            rules={[{ required: true, message: 'Please input your provider!' }]}
          >
            <AutoComplete
              value={valueAutocomplete}
              options={optionsAutocomplete}
              onSelect={onSelect}
              onSearch={onSearch}
              onChange={onChange}
              placeholder="Kho nhập"
            />
          </Form.Item>
        </Col>
        <Col span={4}>
          <PlusCircleOutlined
            style={{ fontSize: 28, marginTop: 7, cursor: 'pointer' }}
          />
        </Col>
      </Row>

      <Form.Item
        label="Hạn sử dụng"
        name="expired_date"
        rules={[{ required: true, message: 'Please input your provider!' }]}
      >
        <DatePicker onChange={onChangeDate} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="Ghi chú"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input.TextArea rows={5} />
      </Form.Item>
    </div>
  )
}
