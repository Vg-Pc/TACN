export interface ProductItem {
  created_at: string
  id: number
  code: string
  name: string
  unit_id: number
  product_category_id: number
  retail_price: number
  wholesale_price: number
  import_price: number
  last_price?: any
  modified_at?: any
  is_active: number | string
  unit_name: string
  product_category_name: string
  product_images: ProductImage[]
}
export interface ProductImage {
  url: string
}

export interface CategoryItem {
  id: number
  name: string
  modified_at?: any
  created_at: number
  is_active: number
}

export interface UnitItem {
  id: number
  name: string
  modified_at?: any
  created_at: number
  is_active: number
}
