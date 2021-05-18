export interface StoreItem {
  id: number
  name: string
  modified_at?: any
  created_at: number
  is_active: number
}

export interface OrderItem {
  id: number
  code: string
  name: string
  note: string
  first_discount: number
  second_discount: number
  staff_id: number
  customer_id: number
  store_id: number
  goods_price: number
  total_price: number
  paid_price: number
  debt: number
  sale_type: number
  payment_type: number
  modified_at?: any
  created_at: number
  is_active: number
  agent_id: number
  store_name: string
  staff_name: string
  customer_name: string
  products: Product[]
}

export interface Product {
  id: number
  product: Product2
  order_id: number
  amount: number
  price: number
  discount: number
  modified_at?: any
  created_at: number
  is_active: number
  agent_id: number
}

export interface Product2 {
  code: string
  name: string
  amount: number
  store_id: number
  is_active: number
  created_at: number
  last_price: number
  modified_at: number
  import_price: number
  product_code: string
  product_name: string
  product_unit: string
  product_category: string
  unit_name: string
}

export interface InvoiceType {
  id: number
  name: string
  voucher_type: number
  modified_at?: any
  created_at: number
  is_active: number
  agent_id: number
}

export interface InvoiceItem {
  id: number
  voucher_type: number
  invoice_type_id: number
  invoice_type_name?: string
  code: string
  reason: string
  staff_id: number
  customer_id: number
  supplier_id?: any
  amount: number
  modified_at?: any
  created_at: number
  is_active: number
  agent_id: number
  staff_name: string
  customer_name: string
  supplier_name?: any
}
