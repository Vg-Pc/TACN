import { PlusCircleOutlined } from '@ant-design/icons'
import { Collapse, Input, List, Spin, Radio, Checkbox, Row, Col } from 'antd'
import React, { useState } from 'react'
import R from 'utils/R'
import AddEditItemFilter from '../../common/components/AddEditItemFilter'
import ItemFilter from '../../common/components/ItemFilter'

interface ListCategoryUnitProps {
  callback: (key: any) => void
  getData: (search: string, page: number) => void
  onSubmitCreate: (name: string) => void
  onSubmitEdit: (item: any) => void
  onSubmitDelete: (id: any) => void
  dialogLoading: boolean
  data: Array<any>
  title?: string
  titleCreate: string
  titleDelete: string
  titleEdit: string
  hasCheckBox?: boolean
  getSelectedCategory?: any
}

export default function ListCategoryUnit({
  callback,
  onSubmitCreate,
  onSubmitEdit,
  onSubmitDelete,
  getData,
  dialogLoading,
  data,
  title,
  titleCreate,
  titleDelete,
  titleEdit,
  hasCheckBox,
  getSelectedCategory,
}: ListCategoryUnitProps) {
  const [search, setSearch] = useState('')
  const [visibleModalCreate, setVisibleModalCreate] = useState(false)

  const toggleModalCreate = () => setVisibleModalCreate(prevState => !prevState)

  const genExtra = () => (
    <PlusCircleOutlined
      onClick={event => {
        toggleModalCreate()
        event.stopPropagation()
      }}
    />
  )

  return (
    <div key={title}>
      <Collapse
        defaultActiveKey={['1', '2', '3']}
        style={{
          marginTop: '10px',
        }}
        onChange={callback}
      >
        <Collapse.Panel
          header={title || R.strings().product_category}
          key="1"
          extra={genExtra()}
          style={{
            paddingLeft: 0,
            paddingRight: 0,
          }}
        >
          {visibleModalCreate && (
            <AddEditItemFilter
              visible={visibleModalCreate}
              toggleModal={toggleModalCreate}
              item={null}
              onSubmitCreate={onSubmitCreate}
              titleCreate={titleCreate}
            />
          )}
          <Input.Search
            size="large"
            allowClear
            placeholder={R.strings().search_category}
            onKeyDown={e => {
              if (e.keyCode == 13) {
                getData(search, 0)
              }
            }}
            onChange={e => {
              setSearch(e.target.value)
            }}
            onSearch={(value, event) => {
              getData(value, 0)
            }}
          />
          <Spin spinning={dialogLoading}>
            <List
              dataSource={data}
              itemLayout="vertical"
              split
              style={{
                marginTop: 10,
                maxHeight: 300,
                overflow: 'auto',
              }}
              renderItem={item => {
                // console.log(item, 'item')
                return (
                  // <Row wrap={false}>
                  //   <Col flex="none" span={4}>
                  //     <Checkbox />
                  //   </Col>
                  //   <Col flex="auto" span={20}>
                  <ItemFilter
                    item={item}
                    hasCheckbox={hasCheckBox}
                    onSubmitEdit={onSubmitEdit}
                    onSubmitDelete={onSubmitDelete}
                    titleEdit={titleEdit}
                    titleDelete={titleDelete}
                  />
                  //   </Col>
                  // </Row>
                )
              }}
            />
          </Spin>
        </Collapse.Panel>
      </Collapse>
    </div>
  )
}
