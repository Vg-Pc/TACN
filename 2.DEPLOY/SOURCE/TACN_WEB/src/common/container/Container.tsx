import { Col, Row } from 'antd'
import React from 'react'
import { StyledContainer } from './StyledContainer'
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons'

type Props = {
  children?: any
  filterComponent?: any
  contentComponent: any
  header?: any
  footer?: any
  rightComponent?: any
}

const Container = ({
  children,
  filterComponent,
  contentComponent,
  header = () => {},
  rightComponent,
}: Props) => {
  return (
    <StyledContainer style={{ paddingBottom: '10px' }}>
      {/* {header!()} */}
      {/* <Spin size="large" spinning={false}> */}
      <Row>
        {filterComponent && (
          <Col style={{}} lg={6} md={5} xs={0}>
            {typeof filterComponent == 'function'
              ? filterComponent!()
              : filterComponent}
          </Col>
        )}
        <Col
          style={{
            backgroundColor: 'white',
            minHeight: '100px',
          }}
          lg={18}
          md={19}
          xs={24}
        >
          {typeof contentComponent == 'function'
            ? contentComponent!()
            : contentComponent}
        </Col>

        {rightComponent && (
          <Col style={{}} lg={6} md={7} xs={0}>
            {typeof rightComponent == 'function'
              ? rightComponent!()
              : rightComponent}
          </Col>
        )}
      </Row>

      {/* </Spin> */}
    </StyledContainer>
  )
}
export default Container
