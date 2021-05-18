import { ROUTER_PATH } from 'common/config'
import Accounts from 'features/account/Accounts'
import DashBoard from 'features/dashboard'
import OrderList from 'features/order'
import ProductList from 'features/product'
import Suppliers from 'features/supplier/Suppliers'
import StoreList from 'features/store/store_list/Stores'
import InventoryList from 'features/store/inventory/Inventory'
import ImportGoodsList from 'features/store/import_goods/ImportGoods'
import AddEditOrder from 'features/order/AddEditOrder'
import AddEditOrderReturn from 'features/order/AddEditOrderReturn'
import SpendingInvoice from 'features/order/SpendingInvoice'
import Customers from 'features/customer/Customers'
import ImportReceipts from 'features/store/import_goods/ImportReceipts'
import Profile from 'features/profile'
import FinancialReport from 'features/report'
import FundsReport from 'features/report/FundsReport'
import SellingReport from 'features/report/SellingReport'
import StoreReport from 'features/report/StoreReport'

interface RouterProps {
  path: string
  component: React.FC | any
  param?: any
}

const screenRouter: Array<RouterProps> = [
  {
    path: ROUTER_PATH.HOME,
    component: DashBoard,
  },
  {
    path: ROUTER_PATH.DASH_BOARD,
    component: DashBoard,
  },
  {
    path: ROUTER_PATH.PRODUCT_LIST,
    component: ProductList,
  },
  {
    path: ROUTER_PATH.STORE_LIST,
    component: StoreList,
  },
  {
    path: ROUTER_PATH.ORDER_LIST,
    component: OrderList,
  },
  {
    path: ROUTER_PATH.CUSTOMER_LIST,
    component: Customers,
  },
  {
    path: ROUTER_PATH.SUPPLIER_LIST,
    component: Suppliers,
  },
  {
    path: ROUTER_PATH.ACCOUNTS,
    component: Accounts,
  },
  {
    path: ROUTER_PATH.INVENTORY_LIST,
    component: InventoryList,
  },
  {
    path: ROUTER_PATH.IMPORT_GOODS,
    component: ImportGoodsList,
  },
  {
    path: ROUTER_PATH.IMPORT_RECEIPT,
    component: ImportReceipts,
  },
  {
    path: ROUTER_PATH.ADD_EDIT_ORDER,
    component: AddEditOrder,
  },
  {
    path: ROUTER_PATH.ADD_EDIT_ORDER_RETURN,
    component: AddEditOrderReturn,
  },
  {
    path: ROUTER_PATH.SPENDING,
    component: SpendingInvoice,
  },
  {
    path: ROUTER_PATH.CUSTOMER,
    component: Customers,
  },
  {
    path: ROUTER_PATH.PROFILE,
    component: Profile,
  },
  {
    path: ROUTER_PATH.FINANCIAL_REPORT,
    component: FinancialReport,
  },
  {
    path: ROUTER_PATH.SELLING_REPORT,
    component: SellingReport,
  },
  {
    path: ROUTER_PATH.FUND_REPORT,
    component: FundsReport,
  },
  {
    path: ROUTER_PATH.STORE_REPORT,
    component: StoreReport,
  },
]
export default screenRouter
