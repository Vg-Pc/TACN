import { Button, Card, Image, Spin, Descriptions, Popconfirm } from 'antd'
import { colors } from 'common/theme'
import React, { memo, useCallback, useEffect, useState } from 'react'
import isEqual from 'react-fast-compare'
import reactotron from 'ReactotronConfig'
import { CategoryItem, ProductItem, UnitItem } from './Model'
import {
  requestGetProductDetail,
  requestUpdateProduct,
  UpdateProductPayload,
} from './ProductApi'
import { DeleteFilled, EditOutlined } from '@ant-design/icons'
import R from 'utils/R'
import { formatPrice } from 'utils/ruleForm'
import AddEditProduct from './AddEditProduct'
import { requestDeleteProduct } from './ProductApi'
import swal from 'sweetalert'
import { TextTable } from './styles'
const IMAGE_WIDTH = 150

interface ProductDetailProps {
  product: ProductItem
  listCategory: Array<CategoryItem>
  listUnit: Array<UnitItem>
  listenEventEditProduct: (data: any, eventType: string) => void
}

const layout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
}

function ProductDetailComponent({
  product,
  listCategory,
  listUnit,
  listenEventEditProduct,
}: ProductDetailProps) {
  const [productDetail, setProduct] = useState(product)
  const [isLoading, setLoading] = useState(true)
  const [visibleModal, setVisibleModal] = useState(false)
  const [error, setError] = useState(null)
  const getProductDetail = async () => {
    try {
      const resProduct = await requestGetProductDetail(product.id)
      setProduct(resProduct.data)
      setLoading(false)
    } catch (error) {
      reactotron.log!(error)
      setLoading(false)
    }
  }

  useEffect(() => {
    getProductDetail()
  }, [])

  const handlePressRemoveProduct = async () => {
    try {
      setLoading(true)
      let res = requestDeleteProduct({ id: [productDetail.id] })
      setLoading(false)
      swal({
        title: R.strings().notification,
        text: `${
          R.strings().action_remove
        } ${R.strings().success.toLocaleLowerCase()}`,
        icon: 'success',
      })
      listenEventEditProduct(productDetail.id, 'delete')
    } catch (error) {
      setLoading(false)
    }
  }

  const toggleModal = () => setVisibleModal(prevState => !prevState)

  const renderInfoProduct = useCallback(() => {
    return (
      <>
        <Descriptions size="default" column={3} bordered>
          <Descriptions.Item label={R.strings().product_code}>
            {productDetail?.code}
          </Descriptions.Item>
          <Descriptions.Item label={R.strings().product_name}>
            {productDetail?.name}
          </Descriptions.Item>
          <Descriptions.Item label={R.strings().product_unit}>
            {productDetail?.unit_name}
          </Descriptions.Item>
          <Descriptions.Item label={R.strings().product_group}>
            {productDetail?.product_category_name}
          </Descriptions.Item>
          <Descriptions.Item label={R.strings().retail_price}>{`${formatPrice(
            productDetail?.retail_price
          )} VND`}</Descriptions.Item>
          <Descriptions.Item
            label={R.strings().wholesale_price}
          >{`${formatPrice(
            productDetail?.wholesale_price
          )} VND`}</Descriptions.Item>
          <Descriptions.Item label={R.strings().import_price}>{`${formatPrice(
            productDetail?.import_price
          )} VND`}</Descriptions.Item>
        </Descriptions>
      </>
    )
  }, [productDetail])

  const renderImageProduct = () => {
    if (!Array.isArray(productDetail?.product_images)) return <div />
    return (
      <div style={{ marginTop: 10 }}>
        <Image.PreviewGroup>
          {productDetail?.product_images.map((image: any) => (
            <Image
              width={IMAGE_WIDTH}
              placeholder={
                <Image preview={false} src={image.url} width={IMAGE_WIDTH} />
              }
              src={image.url}
            />
          ))}
        </Image.PreviewGroup>
      </div>
    )
  }
  // add on this
  const onSubmitEditProduct = async (item: UpdateProductPayload) => {
    try {
      setLoading(true)
      const res = await requestUpdateProduct(item)
      getProductDetail()
      setLoading(false)
      if (res.code === 1) {
        listenEventEditProduct(res.data, 'edit')
      }
    } catch (error) {
      console.log('error', error)
      setLoading(false)
    }
  }

  return (
    <div>
      <Spin spinning={isLoading}>
        {visibleModal && (
          <AddEditProduct
            visible={visibleModal}
            product={productDetail}
            onCancel={toggleModal}
            listCategory={listCategory}
            onUpdateProduct={onSubmitEditProduct}
            listUnit={listUnit}
          />
        )}
        <Card
          style={{ width: '100%', backgroundColor: '#f6f9ff' }}
          actions={[
            <Button
              onClick={toggleModal}
              type="text"
              size="large"
              style={{ color: '#0090ff' }}
              icon={<EditOutlined color="red" />}
              children={R.strings().action_edit}
            />,
            <Popconfirm
              title={R.strings().remove_product}
              onConfirm={handlePressRemoveProduct}
              okText={R.strings().action_remove}
              cancelText={R.strings().action_back}
              okButtonProps={{
                danger: true,
                type: 'primary',
                loading: isLoading,
              }}
            >
              <Button
                type="text"
                size="large"
                style={{ color: '#cc0000' }}
                icon={<DeleteFilled color="red" />}
                children={R.strings().action_remove}
              />
            </Popconfirm>,
          ]}
        >
          {renderInfoProduct()}
          {productDetail?.product_images &&
            !!productDetail.product_images.length && (
              <div style={{ marginTop: 10 }}>
                <TextTable children={`${R.strings().product_image}:`} />
              </div>
            )}
          {renderImageProduct()}
        </Card>
      </Spin>
    </div>
  )
}

const ProductDetail = memo(ProductDetailComponent, isEqual)
export default ProductDetail
