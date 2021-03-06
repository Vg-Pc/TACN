import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { StyledContainer } from 'common/container/StyledContainer'
import { Row, Col, Card, Modal, Input, Popconfirm, Button, message } from 'antd'
import {
  EyeInvisibleOutlined,
  EyeTwoTone,
  DeleteFilled,
} from '@ant-design/icons'
import { useSelector } from 'react-redux'
import { requestChangePassword } from './ProfileApi'
import moment from 'moment'

const ContentComponent = styled.div`
  margin-top: 10px;
  width: 100%;
  background-color: white;
  border-radius: 10px;
  padding-bottom: 10px;
`
const Header = styled.div`
  margin-left: 3%;
  width: 95%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const TitleHeader = styled.div`
  max-width: 70%;
`

const LinkStyled = styled.a``

const LineUnderText = styled.hr`
  background-color: #0094da;
  border: none;
  height: 3px;
  width: 250px;
  max-width: 100%;
  margin-top: -10%;
  margin-left: 0%;
  border-radius: 10px;
`
const CardStyled = styled(Card)`
  width: 98%;
  margin-left: 1%;
`
const ColStyled = styled(Col)`
  margin: auto;
  width: 50%;
`
const Col_6 = styled.div`
  float: left;
  width: 50%;
  padding: 15px;
`
const Col_12 = styled.div`
  width: 100%;
`

const RowItem = styled.div`
  padding: 10px;
  display: flex;
  flex-flow: row wrap;
`

const LabelStyled = styled.label`
  font-size: large;
  display: inline-block;
  width: 150px;
  font-weight: bold;
`

const PStyled = styled.p`
  font-size: large;
  display: inline-block;
`

const LabelInputStyled = styled.label`
  font-size: large;
  display: inline-block;
  width: 40%;
  font-weight: bold;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`
const InputPassword = styled(Input.Password)`
  width: 60%;
`

export default function Profile() {
  const [isShowModal, setShowModal] = useState(false)
  const [dataChangePassword, setDataChangePassword] = useState({
    old_password: '',
    new_password: '',
    renew_password: '',
  })
  const { old_password, new_password, renew_password } = dataChangePassword
  const { userInfo } = useSelector((state: any) => state.authReducer)
  const cleanDataPassword = () => {
    setDataChangePassword({
      old_password: '',
      new_password: '',
      renew_password: '',
    })
  }
  const changePassword = async () => {
    console.log('dataChangePassword', dataChangePassword)
    try {
      if (!old_password || !new_password || !renew_password) {
        message.error('Kh??ng ???????c ????? tr???ng tr?????ng n??o!')
      } else if (new_password.length < 3 || new_password.length > 20) {
        message.error('????? d??i c???a m???t kh???u ph???i t??? 3-20 k?? t???!')
      } else if (new_password !== renew_password) {
        message.error('Hai m???t kh???u m???i kh??ng tr??ng nhau, vui l??ng nh???p l???i!')
        setDataChangePassword({
          ...dataChangePassword,
          new_password: '',
          renew_password: '',
        })
      } else {
        const res = await requestChangePassword({ old_password, new_password })
        console.log('res', res)
        if (res.status === 1) {
          message.success('?????i m???t kh???u m???i th??nh c??ng!')
          cleanDataPassword()
          setShowModal(false)
        }
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <StyledContainer>
      <ContentComponent>
        <Header>
          <TitleHeader>
            <p
              style={{
                fontSize: 'x-large',
                fontWeight: 700,
                lineHeight: 2,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {'Th??ng tin t??i kho???n'}
            </p>
            <LineUnderText />
          </TitleHeader>
          <LinkStyled
            onClick={() => {
              setShowModal(!isShowModal)
            }}
          >
            ?????i m???t kh???u
          </LinkStyled>
        </Header>
        <CardStyled>
          <Row style={{ width: '100%', display: 'flex' }}>
            <Col xs={22} xl={12}>
              <RowItem>
                <LabelStyled>T??n nh??n vi??n:</LabelStyled>
                <PStyled>{userInfo?.name}</PStyled>
              </RowItem>
              <RowItem>
                <LabelStyled>S??? ??i???n tho???i:</LabelStyled>
                <PStyled>{userInfo?.phone_number}</PStyled>
              </RowItem>
              <RowItem>
                <LabelStyled>Email:</LabelStyled>
                <PStyled>{userInfo?.email}</PStyled>
              </RowItem>
              <RowItem>
                <LabelStyled>Ng??y sinh:</LabelStyled>
                <PStyled>
                  {moment(userInfo?.date_of_birth).format('DD-MM-YYYY')}
                </PStyled>
              </RowItem>
              <RowItem>
                <LabelStyled>Gi???i t??nh:</LabelStyled>
                <PStyled>{userInfo?.gender === 0 ? 'Nam' : 'N???'}</PStyled>
              </RowItem>
            </Col>
            <Col xs={22} xl={12}>
              <RowItem>
                <LabelStyled>T???nh/Th??nh ph???:</LabelStyled>
                <PStyled>{userInfo?.province_name}</PStyled>
              </RowItem>
              <RowItem>
                <LabelStyled>?????a ch??? c??? th???:</LabelStyled>
                <PStyled>{userInfo?.address}</PStyled>
              </RowItem>
              <RowItem>
                <LabelStyled>Lo???i T??i kho???n:</LabelStyled>
                <PStyled>{userInfo?.role}</PStyled>
              </RowItem>
              <RowItem>
                <LabelStyled>Ng??y h???t h???n:</LabelStyled>
                <PStyled>
                  {moment(userInfo?.expired_at).format('DD-MM-YYYY')}
                </PStyled>
              </RowItem>
              <RowItem>
                <LabelStyled>Tr???ng th??i:</LabelStyled>
                <PStyled>
                  {userInfo?.status === 1
                    ? '??ang ho???t ?????ng'
                    : 'Ng???ng ho???t ?????ng'}
                </PStyled>
              </RowItem>
            </Col>
          </Row>
        </CardStyled>
      </ContentComponent>
      <Modal
        title={<strong>?????i m???t kh???u</strong>}
        style={{ top: 50 }}
        visible={isShowModal}
        maskClosable={false}
        onOk={changePassword}
        onCancel={() => {
          setShowModal(false)
          cleanDataPassword()
        }}
        cancelText="H???y"
        footer={[
          <Button
            size="large"
            type="primary"
            children={'H???y'}
            onClick={() => {
              setShowModal(false)
              cleanDataPassword()
            }}
          />,
          <Popconfirm
            title={'B???n ch???c ch???n mu???n ?????i m???t kh???u?'}
            okText={'OK'}
            cancelText={'H???y'}
            okButtonProps={{
              type: 'primary',
            }}
            onConfirm={() => {
              changePassword()
            }}
          >
            <Button size="large" type="primary" children={'?????i m???t kh???u'} />
          </Popconfirm>,
        ]}
      >
        <RowItem>
          <LabelInputStyled>M???t kh???u c??:</LabelInputStyled>
          <InputPassword
            id="old_password"
            value={old_password}
            placeholder="Nh???p..."
            iconRender={visible =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={(e: any) => {
              setDataChangePassword({
                ...dataChangePassword,
                old_password: e.target.value,
              })
            }}
          />
        </RowItem>
        <RowItem>
          <LabelInputStyled>M???t kh???u m???i:</LabelInputStyled>
          <InputPassword
            id="new_password"
            value={new_password}
            placeholder="Nh???p..."
            iconRender={visible =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={(e: any) => {
              setDataChangePassword({
                ...dataChangePassword,
                new_password: e.target.value,
              })
            }}
          />
        </RowItem>
        <RowItem>
          <LabelInputStyled>Nh???p l???i m???t kh???u:</LabelInputStyled>
          <InputPassword
            id="renew_password"
            value={renew_password}
            placeholder="Nh???p..."
            iconRender={visible =>
              visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
            }
            onChange={(e: any) => {
              setDataChangePassword({
                ...dataChangePassword,
                renew_password: e.target.value,
              })
            }}
          />
        </RowItem>
      </Modal>
    </StyledContainer>
  )
}
