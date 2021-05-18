import { DeleteFilled, EditOutlined, UndoOutlined } from '@ant-design/icons'

import {
  Button,
  Card,
  Col,
  Form,
  Descriptions,
  Popconfirm,
  Row,
  Typography,
  message,
} from 'antd'
import { colors } from 'common/theme'

import React, { useState } from 'react'
import { convertTimeStampSecondToString } from 'utils/TimerHelper'
import { AddEditAccount } from './components/AddEditAccount'
import { updateAccount } from './AccountApi'

type Props = {
  data: any
  onUpdateAccount: any
  onDeleteAccount: any
  onResetPassword: any
  isShowEditAccount: boolean
  setShowEditAccount: any
}

const ContentView = (data: any) => {
  console.log(data)
  return (
    <Descriptions size="default" column={3}>
      <Descriptions.Item label="Họ và tên">{data.name}</Descriptions.Item>
      <Descriptions.Item label="Mã người dùng">{data.id}</Descriptions.Item>
      <Descriptions.Item label="Số điện thoại">
        <a>{data.phone_number}</a>
      </Descriptions.Item>
      <Descriptions.Item label="Email">{data.email}</Descriptions.Item>
      <Descriptions.Item label="Ngày sinh">
        {convertTimeStampSecondToString(data.date_of_birth)}
      </Descriptions.Item>
      <Descriptions.Item label="Địa chỉ">{data.address}</Descriptions.Item>
      <Descriptions.Item label="Tỉnh thành">
        {data.province_name}
      </Descriptions.Item>
      <Descriptions.Item label="Loại tài khoản">{data.role}</Descriptions.Item>
      <Descriptions.Item label="Giới tính">
        {data.gender ? 'Nữ' : 'Nam'}
      </Descriptions.Item>
      <Descriptions.Item label="Ngày tạo">
        {convertTimeStampSecondToString(data.created_at)}
      </Descriptions.Item>
      <Descriptions.Item label="Ngày hết hạn">
        {' '}
        {convertTimeStampSecondToString(data.expired_at)}
      </Descriptions.Item>
      {data.role_id === 3 ? (
        <Descriptions.Item label="Tên đại lý">
          {data.agent_name || ''}
        </Descriptions.Item>
      ) : (
        <></>
      )}
    </Descriptions>
  )
}

function AccountDetail({
  data,
  onUpdateAccount,
  onDeleteAccount,
  onResetPassword,
}: Props) {
  const [isShowEditAccount, setShowEditAccount] = useState(false)

  const updateAcc = async (data: any, resetFields: any) => {
    // setIsLoadingModal(true)
    try {
      await updateAccount(data)
      message.success(`Cập nhật thành công`)
      resetFields()
      setShowEditAccount(false)
      onUpdateAccount()
    } catch (error) {
      message.error(`Đã có lỗi xảy ra, vui lòng thử lại`)
    } finally {
    }
  }
  return (
    <div>
      {isShowEditAccount && (
        <AddEditAccount
          data={data}
          visible={isShowEditAccount}
          onCancel={() => {
            setShowEditAccount(false)
          }}
          onUpdateAccount={(newData: any, resetFields: any) => {
            updateAcc(newData, resetFields)
          }}
          isLoading={false}
        />
      )}
      <Card
        style={{ width: '100%', backgroundColor: '#f6f9ff' }}
        actions={[
          <Button
            onClick={() => {
              // props.updateAccount(data)
              setShowEditAccount(true)
            }}
            type="text"
            size="large"
            style={{ color: '#0090ff' }}
            icon={<EditOutlined color="red" />}
          >
            Chỉnh sửa
          </Button>,
          <Popconfirm
            title={'Bạn chắc chắn muốn đặt lại mật khẩu tài khoản này'}
            onConfirm={async () => {
              // alert('Delete')
              try {
                onResetPassword(data.id)
              } catch (error) {
              } finally {
              }
            }}
            okText="Đặt lại mật khẩu"
            cancelText="Quay lại"
            okButtonProps={{
              type: 'primary',
            }}
          >
            <Button
              type="text"
              size="large"
              style={{ color: '#9B870C' }}
              icon={<UndoOutlined />}
            >
              Đặt lại mật khẩu
            </Button>
          </Popconfirm>,
          <Popconfirm
            title={'Bạn chắc chắn muốn xoá tài khoản này'}
            onConfirm={async () => {
              // alert('Delete')
              try {
                onDeleteAccount(data.id)
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
              Xoá tài khoản
            </Button>
          </Popconfirm>,
        ]}
      >
        {ContentView(data)}
      </Card>
    </div>
  )
}

export default AccountDetail
