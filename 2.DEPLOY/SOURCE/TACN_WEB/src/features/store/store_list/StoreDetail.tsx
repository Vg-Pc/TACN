import React, { useState } from 'react'
import {
  Card,
  Avatar,
  Button,
  Popconfirm,
  Form,
  Input,
  Row,
  Col,
  Typography,
} from 'antd'
import {
  EditOutlined,
  EllipsisOutlined,
  SearchOutlined,
  UndoOutlined,
  DeleteFilled,
} from '@ant-design/icons'
import { deleteStore } from './StoreApi'
// import { AddEditStore } from './components/AddEditStore'
const { Title, Paragraph, Text, Link } = Typography

const { Meta } = Card
const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

type Props = {
  data: any
  getData: any
}

function StoreDetail(props: Props) {
  const [isEdit, setIsEdit] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const initialValues = props.data
  // backgroundColor: '#eff4ff'
  return (
    <div>
      {/* <AddEditStore
        data={props.data}
        visible={isEdit}
        isEdit={isEdit}
        onCancel={() => {
          setIsEdit(false)
          props.getData()
        }}
      /> */}
      <Card
        style={{ width: '100%' }}
        actions={[
          <Button
            onClick={() => {
              // props.updateAccount(props.data)
              setIsEdit(true)
            }}
            type="text"
            size="large"
            icon={<EditOutlined color="red" />}
          >
            Chỉnh sửa
          </Button>,

          <Popconfirm
            title={'Bạn chắc chắn muốn xoá kho này'}
            onConfirm={async () => {
              // alert('Delete')
              try {
                setIsLoading(true)
                await deleteStore({
                  id: [props.data.id],
                })
                props.getData()
              } catch (error) {
                setIsLoading(false)
              } finally {
              }
            }}
            okText="Xoá"
            cancelText="Quay lại"
            okButtonProps={{
              danger: true,
              type: 'primary',
              loading: isLoading,
            }}
          >
            <Button
              type="text"
              size="large"
              icon={<DeleteFilled />}
            >
              Xoá kho
            </Button>
          </Popconfirm>,
        ]}
      >
        {/* <Meta
          avatar={
            <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
          }
          title={props.data.name}
          description={() => {
            return <div>{JSON.stringify(props.data)}</div>
          }}
        /> */}
        <Form {...layout} initialValues={initialValues}>
          <Row>
            <Col xs={12}>
              <Form.Item name="name" label="Tên kho">
                <Text strong>{props.data.name}</Text>
              </Form.Item>
            </Col>
            <Col xs={12}>
              <Form.Item name="phone_number" label="Trạng thái">
                <Text>{props.data.is_active}</Text>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Card>
    </div>
  )
}

export default StoreDetail
