import { EditOutlined } from '@ant-design/icons'
import { Col, Row, Typography } from 'antd'
import AddEditItemFilter from 'common/components/AddEditItemFilter'
import { ColIcon, ListItem } from 'features/product/styles'
import React, { useState } from 'react'
import AddEditInvoiceType from './AddEditInvoiceType'
import { InvoiceType } from './Model'
import { DeleteInvoiceTypePayload } from './InvoiceTypeApi'

export default function ItemInvoiceType({
  invoiceType,
  onSubmitEdit,
  onSubmitDelete,
}: {
  invoiceType: InvoiceType
  onSubmitEdit?: (item: {
    id: number
    name: string
    voucher_type: number
  }) => void
  onSubmitDelete?: (body: DeleteInvoiceTypePayload) => void
}) {
  const [isVisible, setVisible] = useState(false)

  const toggleModal = () => setVisible(prevState => !prevState)
  const renderBtnEdit = (item: any) => (
    <EditOutlined
      onClick={event => {
        toggleModal()
        event.stopPropagation()
      }}
    />
  )
  return (
    <div>
      <ListItem
        style={{
          marginLeft: 0,
          marginRight: 0,
        }}
      >
        {isVisible && (
          <AddEditInvoiceType
            item={invoiceType}
            visible={isVisible}
            toggleModal={toggleModal}
            titleSubmit="Sửa loại phiếu"
            onSubmitEdit={onSubmitEdit}
            onSubmitDelete={onSubmitDelete}
          />
        )}
        <div>
          <Row wrap={false}>
            <Col flex="none">
              <Typography.Text>{invoiceType.name}</Typography.Text>
            </Col>
            <ColIcon flex="auto">{renderBtnEdit(invoiceType)}</ColIcon>
          </Row>
        </div>
      </ListItem>
    </div>
  )
}
