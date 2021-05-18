import { EditOutlined } from '@ant-design/icons'
import { Button, Card, Descriptions, Spin } from 'antd'
import { colors } from 'common/theme'
import React, { useEffect, useState } from 'react'
import { formatPrice } from 'utils/ruleForm'
import AddEditInvoice from './AddEditInvoice'
import { requestGetDetailInvoice } from './InvoiceApi'

export default function InvoiceDetail({
  invoice,
  onEditInvoice,
}: {
  invoice: any
  onEditInvoice?: (values: any) => void
}) {
  const [invoiceDetail, setInvoiceDetail] = useState(invoice)
  const [isLoading, setLoading] = useState(true)
  const [visibleModal, setVisibleModal] = useState(false)
  const getInvoiceDetail = async () => {
    try {
      if (!isLoading) setLoading(true)
      const res = await requestGetDetailInvoice(invoiceDetail.id)
      setInvoiceDetail(res.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  const toggleModal = () => setVisibleModal(prevState => !prevState)
  useEffect(() => {
    getInvoiceDetail()
  }, [invoice])
  return (
    <div>
      {visibleModal && (
        <AddEditInvoice
          visible={visibleModal}
          invoice={invoiceDetail}
          onCancel={toggleModal}
          onEditInvoice={values => {
            if (onEditInvoice) onEditInvoice(values)
            toggleModal()
          }}
        />
      )}
      <Spin spinning={isLoading}>
        <Card
          style={{ width: '100%', backgroundColor: colors.white }}
          actions={[
            <Button
              onClick={toggleModal}
              type="text"
              size="large"
              icon={<EditOutlined color="red" />}
              children="Chỉnh sửa"
            />,
          ]}
        >
          <Descriptions size="default" column={3} bordered>
            <Descriptions.Item label="Mã phiếu">
              {invoiceDetail.code}
            </Descriptions.Item>
            <Descriptions.Item label="Lý do">
              {invoiceDetail.reason}
            </Descriptions.Item>
            <Descriptions.Item label="Nhân viên">
              {invoiceDetail.staff_name}
            </Descriptions.Item>
            <Descriptions.Item label="Loại phiếu thu">
              {invoiceDetail.invoice_type_name}
            </Descriptions.Item>
            <Descriptions.Item
              label={invoiceDetail.customer_id ? 'Khách hàng' : 'Đối tác'}
            >
              {invoiceDetail.customer_name || invoiceDetail.supplier_name}
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền">
              {`${formatPrice(invoiceDetail.amount)} VND`}
            </Descriptions.Item>
          </Descriptions>
        </Card>
      </Spin>
    </div>
  )
}
