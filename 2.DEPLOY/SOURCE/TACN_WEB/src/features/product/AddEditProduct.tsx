import {
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Upload,
  message,
  Spin,
} from 'antd'
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react'
import isEqual from 'react-fast-compare'
import R from 'utils/R'
import { CategoryItem, ProductImage, ProductItem, UnitItem } from './Model'
import moment from 'moment'
import { getPlaceHolder } from 'utils/funcHelper'
import {
  UpdateProductPayload,
  CreateProductPayload,
  requestUploadImageProduct,
} from './ProductApi'
import { PlusOutlined } from '@ant-design/icons'
import createFormDataImage from 'utils/createFormDataImage'
interface AddEditProductProps {
  product: ProductItem | null | undefined
  visible: boolean
  onCancel: () => void
  listCategory: Array<CategoryItem>
  listUnit: Array<UnitItem>
  isLoading?: boolean
  onUpdateProduct?: (item: UpdateProductPayload) => void
  onCreateProduct?: (item: CreateProductPayload) => void
}

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 8 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 16 },
  },
}
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 16,
      offset: 8,
    },
  },
}
function convertDataToFrom(data: any) {
  if (!data) {
    return {
      name: null,
      unit_id: null,
      product_category_id: null,
      retail_price: null,
      wholesale_price: null,
      import_price: null,
      images: [],
    }
  } else {
    return {
      ...data,
      images: data.product_images,
      expired_at: moment.unix(data.expired_at),
    }
  }
}

const convertArrImage = (arrProduct: any) => {
  let result = arrProduct.map((imgProduct: ProductImage, index: number) => {
    return {
      url: imgProduct.url,
      uid: ((index + 1) * -1).toString(),
      name: `imgProduct${index}.png`,
      type: 'image/jpeg',
      size: 1000,
      // status: 'done',
    }
  })
  // console.log({ result })
  return [...result]
}

const validProductCode = (code: string) => {
  if (code !== '') {
    if (code.length < 3) {
      message.error('Mã sản phẩm ít nhất 3 kí tự, hoặc phải bỏ trắng')
      return false
    } else if (/\s/.test(code)) {
      message.error('Mã sản phẩm không được chứa khoảng trắng')
      return false
    }
  }
  return true
}

function AddEditProductComponent({
  product,
  onCancel,
  visible,
  listCategory,
  isLoading = false,
  onUpdateProduct,
  listUnit,
  onCreateProduct,
}: AddEditProductProps) {
  const [form] = Form.useForm()
  const [arrImage, setArrImage] = useState(
    product && product.product_images
      ? convertArrImage(product.product_images)
      : []
  )
  const [arrUnit, setArrUnit] = useState(listUnit)
  const [dialogLoading, setDialogLoading] = useState(false)
  const onClose = useCallback(() => {
    form.resetFields()
    onCancel()
  }, [])
  const [isPreviewVisible, setIsPreviewVisible] = useState<boolean>(false)
  const [previewImage, setPreviewImage] = useState<string>('')
  const [previewTitle, setPreviewTitle] = useState<string>('')

  const onFinish = async (values: any) => {
    const code = values?.code ? values.code : ''
    if (!validProductCode(code)) return
    //handle upload image
    var images = arrImage
      .map((val: any) => {
        var obj = { ...val }
        delete obj.error
        obj.status = 'done'
        return obj
      })
      .filter((image: any) => {
        if (!image.url) return image
      })
    const list_image_before = product?.product_images
    if (onUpdateProduct && product) {
      //update product
      setDialogLoading(true)
      try {
        var resUploadImage = []
        if (!!images.length) {
          //new images => push images to server
          const dataImage = await createFormDataImage(images)
          resUploadImage = await requestUploadImageProduct(dataImage)
        }
        var urlImagesUpdate: string[] = arrImage
          .filter((image: any) => {
            if (image.url) return image
          })
          .map((image: any) => image.url)
        let new_images_update: Array<any> = []
        if (!!resUploadImage?.data?.length) {
          urlImagesUpdate = urlImagesUpdate.concat(resUploadImage.data)
          new_images_update = resUploadImage.data
        }
        const tmp_image_delete: Array<any> = []
        list_image_before?.forEach((item: any) => {
          if (!urlImagesUpdate?.includes(item?.url))
            tmp_image_delete.push(item?.id)
        })
        onUpdateProduct({
          id: product.id,
          name: values.name,
          unit_id: values.unit_id,
          product_category_id: values.product_category_id,
          retail_price: values.retail_price,
          wholesale_price: values.wholesale_price,
          import_price: values.import_price,
          images: new_images_update?.length !== 0 ? new_images_update : null,
          image_delete: tmp_image_delete,
        })
      } catch (error) {
        console.log(error)
      }
    } else {
      setDialogLoading(true)
      try {
        let resUploadImage: any = null
        if (!!images.length) {
          //new images => push images to server
          const dataImage = await createFormDataImage(images)
          resUploadImage = await requestUploadImageProduct(dataImage)
        }
        if (onCreateProduct) {
          onCreateProduct({
            name: values.name,
            code: code,
            unit_id: values.unit_id,
            product_category_id: values.product_category_id,
            retail_price: values.retail_price,
            wholesale_price: values.wholesale_price,
            import_price: values.import_price,
            images: resUploadImage?.data ? resUploadImage?.data : null,
          })
          form.resetFields()
          setArrImage([])
        }
      } catch (error) {
        console.log(error)
      }
    }
    onCancel()
  }

  useEffect(() => {
    var result = listUnit.filter(val => val.is_active == 1)
    setArrUnit(result)
  }, [listUnit])

  const initialValues = useMemo(() => {
    return convertDataToFrom(product)
  }, [])

  const getBase64 = (file: any) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = error => reject(error)
    })
  }

  const handlePreview = async (file: any) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }

    // console.log(file.url, file.preview)

    setPreviewImage(file.url || file.preview)
    setIsPreviewVisible(true)
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf('/') + 1)
    )
  }

  const handleChange = ({ fileList }: { fileList: any }) => {
    // console.log({ fileList })
    const newFileList = fileList.map((item: any) => {
      if (item.status === 'error') {
        delete item.error
        item.status = 'done'
      }

      return {
        ...item,
      }
    })
    setArrImage(newFileList)
  }

  // const uploadImageToServer = (file: any) => {
  //   console.log({ file })
  //   // setUploading(true);
  //   try {
  //     let newFileList = [...arrImage]
  //     newFileList.push(file.file)
  //     setArrImage(newFileList)
  //     file.onSuccess()
  //   } catch (error) {
  //     console.log(error)
  //     file.onError()
  //   } finally {
  //     // setUploading(false)
  //   }
  // }

  const handleCancel = () => {
    setIsPreviewVisible(false)
  }

  const uploadButton = (
    <div>
      <PlusOutlined />
    </div>
  )

  console.table(arrImage)

  return (
    <Modal
      onCancel={onClose}
      maskClosable={false}
      footer={[]}
      title={product ? R.strings().product_update : R.strings().product_create}
      visible={visible}
    >
      <Spin spinning={dialogLoading}>
        <Form
          {...formItemLayout}
          form={form}
          name="create"
          onFinish={onFinish}
          initialValues={initialValues}
        >
          <Form.Item name="code" label={R.strings().product_code}>
            <Input
              placeholder={R.strings().product_auto_generate_code}
              disabled={product ? true : false}
            />
          </Form.Item>
          <Form.Item
            name="name"
            label={R.strings().product_name}
            rules={[
              {
                required: true,
                message: R.strings().please_enter_product_name,
              },
            ]}
          >
            <Input placeholder={getPlaceHolder(R.strings().product_name)} />
          </Form.Item>
          <Form.Item
            name="unit_id"
            label={R.strings().product_unit}
            rules={[
              {
                required: true,
                message: R.strings().please_enter_product_unit,
              },
            ]}
          >
            <Select
              defaultValue={product?.unit_name || ''}
              placeholder={R.strings().please_enter_product_unit}
            >
              {arrUnit.map(unit => (
                <Select.Option value={unit.id}>{unit.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="product_category_id"
            label={R.strings().product_group}
            rules={[
              {
                required: true,
                message: R.strings().please_select_category_name,
              },
            ]}
          >
            <Select
              defaultValue={product?.product_category_id || ''}
              placeholder={R.strings().please_select_category_name}
            >
              {listCategory.map(cate => (
                <Select.Option value={cate.id}>{cate.name}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={R.strings().retail_price}
            name="retail_price"
            rules={[
              {
                required: true,
                message: R.strings().please_enter_retail_price,
                type: 'number',
              },
            ]}
          >
            <InputNumber
              placeholder={getPlaceHolder(R.strings().retail_price)}
              style={{ flex: 'auto', width: '100%' }}
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value: string | undefined) => {
                if (!value) return ''
                return value.replace(/\$\s?|(,*)/g, '')
              }}
            />
          </Form.Item>
          <Form.Item
            label={R.strings().wholesale_price}
            name="wholesale_price"
            rules={[
              {
                required: true,
                message: R.strings().please_enter_whole_price,
                type: 'number',
              },
            ]}
          >
            <InputNumber
              placeholder={getPlaceHolder(R.strings().wholesale_price)}
              style={{ flex: 'auto', width: '100%' }}
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value: string | undefined) => {
                if (!value) return ''
                return value.replace(/\$\s?|(,*)/g, '')
              }}
            />
          </Form.Item>
          <Form.Item
            label={R.strings().receive_price}
            name="import_price"
            rules={[
              {
                required: true,
                message: R.strings().please_enter_receive_price,
                type: 'number',
              },
            ]}
          >
            <InputNumber
              placeholder={getPlaceHolder(R.strings().receive_price)}
              style={{ flex: 'auto', width: '100%' }}
              formatter={value =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')
              }
              parser={(value: string | undefined) => {
                if (!value) return ''
                return value.replace(/\$\s?|(,*)/g, '')
              }}
            />
          </Form.Item>

          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            accept="image/jpeg,image/png,image/jpg"
            fileList={arrImage}
            // customRequest={uploadImageToServer}
            onPreview={handlePreview}
            onChange={handleChange}
          >
            {arrImage.length > 5 ? null : uploadButton}
          </Upload>
          <Modal
            visible={isPreviewVisible}
            title={previewTitle}
            footer={null}
            onCancel={handleCancel}
          >
            <img alt="example" style={{ width: '100%' }} src={previewImage} />
          </Modal>
          <Form.Item {...tailFormItemLayout}>
            <Button loading={isLoading} type="primary" htmlType="submit">
              {product ? R.strings().action_update : R.strings().product_create}
            </Button>
          </Form.Item>
        </Form>
      </Spin>
    </Modal>
  )
}

const AddEditProduct = memo(AddEditProductComponent, isEqual)
export default AddEditProduct
