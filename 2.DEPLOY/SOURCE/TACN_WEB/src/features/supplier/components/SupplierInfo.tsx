import React, { useState } from 'react'
import { Descriptions, Card, Button, Popconfirm, message } from 'antd'
import { convertTimeStampSecondToString } from 'utils/TimerHelper'
import { DeleteFilled, EditOutlined } from '@ant-design/icons'
import { AddEditForm } from '../components/AddEditForm'
import { updateSupplier } from '../SupplierApi'

interface SupplierProps {
  data: any
  onUpdateSupplier: any
  onDeleteSupplier: any
  // isShowEditSupplier: boolean
  // setShowEditSupplier: any
}

interface ContentProps {
  content: any
}

const ContentView = ({ content }: ContentProps) => {
  console.log({ content })
  return (
    <Descriptions size="default" column={3}>
      <Descriptions.Item label="Tên nhà cung cấp">
        {content.name}
      </Descriptions.Item>
      <Descriptions.Item label="Số điện thoại">
        <a>{content.phone_number}</a>
      </Descriptions.Item>
      <Descriptions.Item label="Email">{content.email}</Descriptions.Item>
      <Descriptions.Item label="Tỉnh/Thành phố">
        {content.province_name}
      </Descriptions.Item>
      <Descriptions.Item label="Người tạo">{'--'}</Descriptions.Item>
      <Descriptions.Item label="Ngày tạo">
        {convertTimeStampSecondToString(content.created_at)}
      </Descriptions.Item>
      <Descriptions.Item label="Mã số thuế">
        {content.tax_code}
      </Descriptions.Item>
    </Descriptions>
  )
}

function SupplierInfo({
  data,
  onUpdateSupplier,
  // isShowEditSupplier,
  // setShowEditSupplier,
  onDeleteSupplier,
}: SupplierProps) {
  const [isShowEditSupplier, setIsShowEditSupplier] = useState(false)

  const editSupplier = async (data: any, resetFields: any) => {
    console.log(data, 'data update')
  }

  return (
    <>
      {isShowEditSupplier && (
        <AddEditForm
          data={data}
          visible={isShowEditSupplier}
          onCancel={() => {
            setIsShowEditSupplier(false)
          }}
          onUpdateAccount={async (newData: any, resetFields: any) => {
            try {
              await updateSupplier(newData)
              message.success(`Cập nhật thành công`)
              setIsShowEditSupplier(false)

              resetFields()
              onUpdateSupplier()
            } catch (error) {
              message.error(`Đã có lỗi xảy ra, vui lòng thử lại`)
            } finally {
            }
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
              setIsShowEditSupplier(true)
            }}
            type="text"
            size="large"
            style={{ color: '#0090ff' }}
            icon={<EditOutlined color="red" />}
          >
            Chỉnh sửa
          </Button>,
          <Popconfirm
            title={'Bạn chắc chắn muốn xoá nhà cung cấp này'}
            onConfirm={async () => {
              // alert('Delete')
              try {
                onDeleteSupplier(data.id)
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
              Xoá nhà cung cấp
            </Button>
          </Popconfirm>,
        ]}
      >
        <ContentView content={data} />
      </Card>
    </>
  )
}

export default SupplierInfo
