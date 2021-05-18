import { EditOutlined } from '@ant-design/icons'
import { Col, Row, Typography, Checkbox, Input } from 'antd'
import React, { useState } from 'react'
import AddEditItemFilter from './AddEditItemFilter'
import { ColIcon, ListItem } from '../../features/product/styles'

interface ItemFilterProps {
  item: any
  onSubmitEdit: (item: any) => void
  onSubmitDelete: (item: any) => void
  hasCheckbox?: boolean
  titleEdit: string
  titleDelete: string
}
export default function ItemFilter({
  item,
  onSubmitEdit,
  onSubmitDelete,
  hasCheckbox,
  titleEdit,
  titleDelete,
}: ItemFilterProps) {
  const [visibleModal, setIsVisible] = useState(false)
  const toggleModal = () => setIsVisible(prevState => !prevState)

  const renderBtnEdit = (item: any) => (
    <EditOutlined
      onClick={event => {
        toggleModal()
        event.stopPropagation()
      }}
    />
  )
  return (
    <>
      {visibleModal && (
        <AddEditItemFilter
          visible={visibleModal}
          item={item}
          toggleModal={toggleModal}
          onSubmitEdit={onSubmitEdit}
          onSubmitDelete={onSubmitDelete}
          titleEdit={titleEdit}
          titleDelete={titleDelete}
        />
      )}
      <ListItem
        style={{
          marginLeft: 0,
          marginRight: 0,
          maxWidth: '94%',
        }}
        className="elem-contain"
      >
        <div>
          <Row wrap={false}>
            <Col flex="none">
              {/** the feature at bellow will be develope in future, please dont delete it */}
              {/* {hasCheckbox ? (
                <Checkbox onChange={() => console.log(item)}>
                  <Typography.Text>{item.name}</Typography.Text>
                </Checkbox>
              ) : (
                <Typography.Text>{item.name}</Typography.Text>
              )} */}
              {/** if the feature at above developed, please delete the component bellow */}
              <Typography.Text style={{ paddingLeft: 5 }}>
                {item.name}
              </Typography.Text>
            </Col>
            <ColIcon flex="auto" style={{ paddingRight: 5 }}>
              {renderBtnEdit(item)}
            </ColIcon>
          </Row>
        </div>
      </ListItem>
    </>
  )
}
