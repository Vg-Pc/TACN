import React, { useState } from 'react'
import { Descriptions, Card, Button, Popconfirm, message } from 'antd'
import { convertTimeStampSecondToString } from 'utils/TimerHelper'
import { DeleteFilled, EditOutlined } from '@ant-design/icons'
import { AddEditForm } from '../components/AddEditForm'
import { updateCustomer } from '../CustomerApi'
interface CustomerProps {
  data: any
  // isShowEditCustomer: boolean
  // setShowEditCustomer: any
  onUpdateAccount: any
  onDeleteCustomer: any
}

interface ContentProps {
  content: any
}

const ContentView = ({ content }: ContentProps) => {
  return (
    <Descriptions size="default" column={3}>
      <Descriptions.Item label="Họ và tên">{content.name}</Descriptions.Item>
      <Descriptions.Item label="Số điện thoại">
        <a>{content.phone_number}</a>
      </Descriptions.Item>
      <Descriptions.Item label="Email">{content.email}</Descriptions.Item>
      <Descriptions.Item label="Tỉnh/Thành phố">
        {content.province_name}
      </Descriptions.Item>
      <Descriptions.Item label="Ngày sinh">
        {convertTimeStampSecondToString(content.date_of_birth)}
      </Descriptions.Item>
      <Descriptions.Item label="Giới tính">
        {content.gender ? 'Nữ' : 'Nam'}
      </Descriptions.Item>
      <Descriptions.Item label="Người tạo">{'--'}</Descriptions.Item>
      <Descriptions.Item label="Ngày tạo">
        {convertTimeStampSecondToString(content.created_at)}
      </Descriptions.Item>
    </Descriptions>
  )
}

function CustomerInfo({
  data,
  // isShowEditCustomer,
  // setShowEditCustomer,
  onUpdateAccount,
  onDeleteCustomer,
}: CustomerProps) {
  const [isShowEditCustomer, setShowEditCustomer] = useState(false)
  const editCustomer = async (data: any, resetFields: any) => {
    try {
      await updateCustomer(data)
      message.success(`Cập nhật thành công`)
      onUpdateAccount()
      resetFields()
      setShowEditCustomer(false)
    } catch (error) {
      message.error(`Đã có lỗi xảy ra, vui lòng thử lại`)
    } finally {
    }
  }
  return (
    <>
      {isShowEditCustomer && (
        <AddEditForm
          data={data}
          visible={isShowEditCustomer}
          onCancel={() => {
            setShowEditCustomer(false)
          }}
          onUpdateAccount={(newData: any, resetFields: any) => {
            editCustomer(newData, resetFields)
          }}
          isLoading={false}
        />
      )}
      <Card
        style={{
          width: '100%',
          backgroundColor: '#f6f9ff',
          border: 'none',
        }}
        actions={[
          <Button
            onClick={() => {
              // props.updateAccount(data)
              setShowEditCustomer(true)
            }}
            type="text"
            size="large"
            style={{ color: '#0090ff' }}
            icon={<EditOutlined color="red" />}
          >
            Chỉnh sửa
          </Button>,
          <Popconfirm
            title={'Bạn chắc chắn muốn xoá khách hàng này'}
            onConfirm={async () => {
              try {
                onDeleteCustomer(data.id)
              } catch (error) {
              } finally {
              }
            }}
            okText="Xoá"
            cancelText="Quay lại"
            okButtonProps={{
              danger: true,
              type: 'primary',
              // loading: isShowDeleteConfirm,
            }}
          >
            <Button
              type="text"
              style={{ color: '#cc0000' }}
              size="large"
              icon={<DeleteFilled />}
            >
              Xoá khách hàng
            </Button>
          </Popconfirm>,
        ]}
      >
        <ContentView content={data} />
      </Card>
    </>
  )
}

export default CustomerInfo
