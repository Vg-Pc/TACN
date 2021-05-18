import {
  AppstoreOutlined,
  IdcardOutlined,
  PieChartOutlined,
  LineChartOutlined,
  LogoutOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons'
import { Divider, Menu, Row, Spin, Typography } from 'antd'
import { ROUTER_PATH } from 'common/config'
import { logoutAction } from 'features/auth/AuthSlice'
import { useDispatch, useSelector } from 'react-redux'
import { ACCOUNT_R0LE } from 'utils/constants'
import history from 'utils/history'
import R from 'utils/R'

const { SubMenu } = Menu

export default function Header(props: any) {
  const dispatch = useDispatch()
  const authState = useSelector((state: any) => state.authReducer)
  const { userInfo } = authState
  const role_id =
    userInfo && userInfo.role_id ? userInfo.role_id : ACCOUNT_R0LE.STAFF
  function handleClick(e: any) {
    if (e.key == 'logout') {
      //handle logout
      //call api logout, reset reducer
      dispatch(logoutAction())
    } else history.push(e.key)
  }

  function handleGetCurrentRouter() {
    return window.location.pathname
  }

  const userState = useSelector((state: any) => state.authReducer)?.userInfo

  return (
    <Spin spinning={authState.dialogLoading}>
      <div>
        <Row
          style={{
            backgroundColor: 'white',
            paddingTop: 5,
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <img
            src={R.images.img_logo_without_title}
            style={{
              width: 45,
              height: 45,
            }}
            alt="user-icon"
          />
          <Typography.Title
            children="KOKORA"
            style={{ margin: 0, fontSize: '20px', marginTop: 8 }}
          />
          {userState?.role_id === ACCOUNT_R0LE.AGENT && (
            <div
              style={{
                marginLeft: 10,
                // display: 'flex',
                marginTop: 10,
                // alignItems: 'center',
              }}
            >
              <b style={{ borderLeft: 'solid 1px grey', paddingLeft: 10 }}>
                {userState.agent_name}
              </b>
            </div>
          )}

          <div
            style={{
              flex: 1,
            }}
          >
            <Menu
              key="MenuHeader"
              style={{
                textAlign: 'end',
                lineHeight: '28px',
                borderBottom: 0,
                marginTop: 5,
              }}
              triggerSubMenuAction="click"
              onClick={handleClick}
              mode="horizontal"
              selectedKeys={[handleGetCurrentRouter()]}
            >
              <SubMenu
                key="sub15"
                icon={<UserOutlined />}
                title={userState ? userState.name : 'Quản lý đơn hàng'}
              >
                <Menu.Item key={'profile'} icon={<UserOutlined />}>
                  Thông tin cá nhân
                </Menu.Item>
                <Menu.Item key={'logout'} icon={<LogoutOutlined />}>
                  Đăng xuất
                </Menu.Item>
              </SubMenu>
            </Menu>
          </div>
        </Row>
        <Divider
          style={{
            margin: 0,
          }}
        />
        <Menu
          triggerSubMenuAction="click"
          onClick={handleClick}
          style={{ width: '100%' }}
          mode="horizontal"
          selectedKeys={[handleGetCurrentRouter()]}
        >
          <Menu.Item
            key={ROUTER_PATH.DASH_BOARD}
            icon={<PieChartOutlined />}
            children={R.strings().title_header_dashboard}
          />
          <Menu.Item key={ROUTER_PATH.PRODUCT_LIST} icon={<AppstoreOutlined />}>
            {R.strings().title_header_product}
          </Menu.Item>
          <SubMenu
            key="sub4"
            icon={<ShopOutlined />}
            title={R.strings().title_header_store}
          >
            <Menu.Item key={ROUTER_PATH.STORE_LIST}>
              {R.strings().title_header_store_list}
            </Menu.Item>
            {/* <Menu.Item key={ROUTER_PATH.IMPORT_RECEIPT}> */}
            <Menu.Item key={ROUTER_PATH.IMPORT_RECEIPT}>
              {R.strings().title_header_import_goods}
            </Menu.Item>
            <Menu.Item key={ROUTER_PATH.INVENTORY_LIST}>
              {R.strings().title_header_inventory}
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub5"
            icon={<ShoppingCartOutlined />}
            title={R.strings().title_header_trade}
          >
            <Menu.Item key={ROUTER_PATH.ADD_EDIT_ORDER}>
              {R.strings().title_header_sell}
            </Menu.Item>
            <Menu.Item key={ROUTER_PATH.ADD_EDIT_ORDER_RETURN}>
              Trả lại hàng
            </Menu.Item>
            <Menu.Item key={ROUTER_PATH.ORDER_LIST}>
              {R.strings().title_header_order_list}
            </Menu.Item>
            <Menu.Item key={ROUTER_PATH.SPENDING}>
              {R.strings().invoice_title}
            </Menu.Item>
          </SubMenu>
          <SubMenu
            key="sub6"
            icon={<TeamOutlined />}
            title={R.strings().title_header_partner}
          >
            <Menu.Item
              key={ROUTER_PATH.CUSTOMER}
              children={R.strings().title_header_customer}
            />
            <Menu.Item
              key={ROUTER_PATH.SUPPLIER_LIST}
              children={R.strings().title_header_supplier}
            />
          </SubMenu>
          <SubMenu
            key="sub7"
            icon={<LineChartOutlined />}
            title={R.strings().title_header_report}
          >
            <Menu.Item
              key={ROUTER_PATH.FINANCIAL_REPORT}
              children={R.strings().title_header_financial_report}
            />
            <Menu.Item
              key={ROUTER_PATH.SELLING_REPORT}
              children={R.strings().title_header_selling_report}
            />
            <Menu.Item
              key={ROUTER_PATH.STORE_REPORT}
              children={R.strings().title_header_store_report}
            />
            <Menu.Item
              key={ROUTER_PATH.FUND_REPORT}
              children={R.strings().title_header_fund_report}
            />
          </SubMenu>

          {role_id !== ACCOUNT_R0LE.STAFF ? (
            <Menu.Item
              key={ROUTER_PATH.ACCOUNTS}
              icon={<IdcardOutlined />}
              children={R.strings().title_header_account}
            />
          ) : (
            <></>
          )}
        </Menu>
      </div>
    </Spin>
  )
  //
}
