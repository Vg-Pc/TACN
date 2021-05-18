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
  AutoComplete,
} from 'antd'
import R from 'utils/R'
import { PAYMENT_TYPE } from 'utils/constants'
import { jsonToArray } from 'utils/funcHelper'
const { Panel } = Collapse
type Props = {
  data?: any
  handleOnChange?: any
}
const { Option } = Select
export const PaymentInfo = ({ handleOnChange, data }: Props) => {
  return (
    <div
      style={{ backgroundColor: 'white', padding: '10px', marginTop: '20px' }}
    >
      <h6>
        <p
          style={{
            fontSize: '1.3rem',
          }}
        >
          Thông tin thanh toán
        </p>
      </h6>
      <Form.Item
        label="Tồng tiền hàng"
        name="username"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Chiết khấu 1 (%)"
        name="staff"
        rules={[{ required: true, message: 'Please input your staff!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Chiết khấu 2 (%)"
        name="provider"
        rules={[{ required: true, message: 'Please input your staff!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Tổng tiền"
        name="store"
        rules={[{ required: true, message: 'Please input your provider!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Thanh toán"
        name="payment"
        rules={[{ required: true, message: 'Please input your provider!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Nhà cung cấp"
        name="provider"
        rules={[{ required: true, message: 'Please input your provider!' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Chọn hình thức thanh toán"
        name="payment_method"
        rules={[{ required: true, message: 'Please input your username!' }]}
      >
        <Select
          showSearch
          placeholder="Chọn hình thức thanh toán"
          optionFilterProp="children"
          // onChange={onChange}
          // onFocus={onFocus}
          // onBlur={onBlur}
          // onSearch={onSearch}
          // filterOption={(input, option) =>
          //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          // }
        >
          {jsonToArray(PAYMENT_TYPE).map(val => (
            <Option value={val.id}>{val.name}</Option>
          ))}
        </Select>
      </Form.Item>
      <Button type="primary" htmlType="submit" style={{ marginRight: 10 }}>
        Thanh toán
      </Button>
      <Button
        type="primary"
        style={{
          backgroundColor: '#FFCC33',
          border: '1px solid #FFCC33',
        }}
      >
        Thanh toán và in
      </Button>
      <Button
        type="primary"
        style={{
          backgroundColor: '#6c757d',
          border: '1px solid #6c757d',
          marginTop: 10,
        }}
      >
        Hủy phiếu nhập
      </Button>
    </div>
  )
}
