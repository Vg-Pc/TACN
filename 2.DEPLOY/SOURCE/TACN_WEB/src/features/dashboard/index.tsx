import React, { useState, useEffect } from 'react'
import { Card, DatePicker, Popover, Select, message } from 'antd'
import { StyledContainer } from 'common/container/StyledContainer'
import Container from 'common/container/Container'
import {
  DollarCircleOutlined,
  FileTextOutlined,
  FileSyncOutlined,
  InboxOutlined,
} from '@ant-design/icons'
import { Line, Bar } from 'react-chartjs-2'
import viVN from 'antd/es/date-picker/locale/vi_VN'
import R from 'utils/R'
import moment from 'moment'
import { requestGetStatistic } from './DashboardApi'
import { requestGetListStore } from 'features/order/StoreApi'

const options_line_chart = {
  title: { display: false },
  responsive: true,
  // maintainAspectRatio: false,
  legend: { display: false },
  scales: {
    xAxes: [
      {
        ticks: { beginAtZero: true },
        gridLines: { display: false },
      },
    ],
    yAxes: [
      {
        ticks: { beginAtZero: true },
      },
    ],
  },
  pan: {
    enabled: true,
    mode: 'x',
    speed: 10,
    threshold: 10,
    rangeMin: {
      x: null,
      y: null,
    },
    rangeMax: {
      x: null,
      y: null,
    },
  },
  animation: {
    duration: 750,
  },
}
const options_bar_chart = {
  // indexAxis: 'y',
  legend: { display: false },
  title: { display: false },
  responsive: true,
}

export default function DashBoard() {
  const [dataStatic, setDataStatic] = useState<any>({
    orders: 0,
    returnGoods: 0,
    revenue: 0,
    productOfStore: 0,
    topSellingProduct: [],
    arrayRevenue: [],
  })
  const [dataLine, setDataLine] = useState<any>([])
  const [dataBar, setDataBar] = useState<any>([])
  const [dataMomentPicker, setDataMomentPicker] = useState<any>({
    f_date: moment().subtract(30, 'd'),
    t_date: moment(),
  })
  const [idStoreSelected, setIdStoreSelected] = useState<any>('')
  const [listStore, setListStore] = useState<any>([])
  const [paramsStore, setParamsStore] = useState({
    page: 0,
    search: '',
  })
  const [isLoading, setLoading] = useState<boolean>(false)
  const { f_date, t_date } = dataMomentPicker
  const {
    orders,
    returnGoods,
    revenue,
    productOfStore,
    topSellingProduct,
  } = dataStatic
  const defaultValueOption: any = ''
  const listOption: any = [
    <Select.Option value={defaultValueOption}>Tất cả</Select.Option>,
  ]
  listStore.forEach((item: any) =>
    listOption.push(<Select.Option value={item.id}>{item.name}</Select.Option>)
  )
  useEffect(() => {
    getListStore()
  }, [])
  useEffect(() => {
    getDataStatistic(f_date.format('X'), t_date.format('X'), idStoreSelected)
  }, [])
  const formatDataTopSellingChart = (data: any[]) => {
    return data.map(item => {
      return {
        // x: `Mã SP: ${item.product_code}\nTên SP: ${item.name}`,
        x: `${
          item.name
            ? item.name
            : item.product_name
            ? item.product_name
            : 'No name'
        }`,
        y: item.top_selling,
      }
    })
  }
  const formatDataSchemaRevenueChart = (data: any[]) => {
    return data.map(item => {
      return {
        x: item.formattedTime,
        y: item.revenues,
      }
    })
  }
  const data_line_chart = {
    datasets: [
      {
        label: 'Tổng thu',
        fill: false,
        backgroundColor: 'rgba(75,192,192,1)',
        borderColor: 'rgba(75,192,192,1)',
        data: dataLine,
      },
    ],
  }
  const data_bar_chart = {
    datasets: [
      {
        label: 'Số sản phẩm đã bán',
        fill: false,
        backgroundColor: '#0094da',
        borderColor: '#0094da',
        data: dataBar,
      },
    ],
  }
  const getDataStatistic = async (
    from_date: any,
    to_date: any,
    store_id: any
  ) => {
    try {
      const res_static = await requestGetStatistic(from_date, to_date, store_id)
      setDataStatic(res_static.data)
      let formatDataSchemaRevenue: any[] = formatDataSchemaRevenueChart(
        res_static.data.arrayRevenue instanceof Array
          ? res_static.data.arrayRevenue
          : []
      )
      setDataLine(formatDataSchemaRevenue)
      let formatDataSelling: any[] = formatDataTopSellingChart(
        res_static.data.topSellingProduct instanceof Array &&
          res_static.data.topSellingProduct[0] !== null
          ? res_static.data.topSellingProduct
          : []
      )
      setDataBar(formatDataSelling)
      console.log('formatDataSelling', formatDataSelling)
    } catch (error) {
      message.error(`Đã có một số lỗi lỗi xảy ra, vui lòng thử lại`)
    }
  }
  const handleChangeSelected = (value: number) => {
    setIdStoreSelected(value)
    getDataStatistic(f_date.format('X'), t_date.format('X'), value)
  }
  const handleChangeDatePiker = (dates: any, dateStrings: any) => {
    if (dates?.[0] && dates?.[1]) {
      setDataMomentPicker({
        ...dataMomentPicker,
        f_date: dates?.[0],
        t_date: dates?.[1],
      })
      getDataStatistic(
        dates?.[0].format('X'),
        dates?.[1].format('X'),
        idStoreSelected
      )
    } else {
      setDataMomentPicker({
        ...dataMomentPicker,
        f_date: moment().subtract(30, 'd'),
        t_date: moment(),
      })
      getDataStatistic(
        moment().subtract(30, 'd').format('X'),
        moment().format('X'),
        idStoreSelected
      )
    }
  }
  const getListStore = async () => {
    try {
      if (!isLoading) setLoading(true)
      const res = await requestGetListStore(paramsStore)
      setListStore(res.data)
      setLoading(false)
    } catch (error) {
      setLoading(false)
    }
  }
  function FilterView() {
    return (
      <div
        style={{
          marginTop: '2%',
        }}
      >
        {/** a block item */}
        <div style={style.block_left_item}>
          {/** header block */}
          <div style={style.header_block_left}>
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
              {R.strings().title_header_dashboard}
            </p>
            <hr style={style.line_under_txt_header_left} />
          </div>
          {/** content block */}
          <div style={style.content_block_left}>
            <label
              htmlFor="date-picker"
              style={{
                display: 'block',
                marginBottom: '3%',
              }}
            >
              Thời gian
            </label>
            <DatePicker.RangePicker
              value={[f_date, t_date]}
              style={{
                width: '100%',
                fontWeight: 'bold',
              }}
              id="date-picker"
              locale={viVN}
              format="DD-MM-YYYY"
              onChange={handleChangeDatePiker}
            />

            <label
              htmlFor="select-store"
              style={{
                display: 'block',
                marginTop: '3%',
                marginBottom: '3%',
              }}
            >
              Chọn kho
            </label>
            <Select
              showSearch
              id="select-store"
              defaultValue={defaultValueOption}
              onChange={handleChangeSelected}
              style={{ width: '100%', fontWeight: 100 }}
              placeholder="Vui lòng chọn kho"
              optionFilterProp="children"
              onSearch={val => {
                setParamsStore({
                  page: 0,
                  search: val,
                })
              }}
            >
              {listOption}
            </Select>
          </div>
        </div>
      </div>
    )
  }
  function contentView() {
    return (
      <div
        style={{
          marginTop: '1%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {/** col Header */}
        <Card size="small" style={style.header_inner_card}>
          <div style={style.col_header_right}>
            {/** row item */}
            <Popover
              placement="bottom"
              content={
                <div>{`Doanh thu : ${new Intl.NumberFormat('de-DE', {
                  style: 'currency',
                  currency: 'VND',
                }).format(revenue)} = Bán sỉ + bán lẻ + phiếu thu`}</div>
              }
            >
              <div style={style.row_item}>
                <DollarCircleOutlined
                  style={{
                    fontSize: 'xx-large',
                    marginRight: '8%',
                    color: 'gold',
                  }}
                />
                <div
                  style={{
                    lineHeight: 0.9,
                    fontSize: 'large',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <p style={{ fontSize: 'large' }}>Doanh thu</p>
                  <strong
                    style={{
                      lineHeight: 0.5,
                      fontSize: 'x-large',
                      color: '#85bb65',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {new Intl.NumberFormat('de-DE', {
                      style: 'currency',
                      currency: 'VND',
                    }).format(revenue)}
                  </strong>
                </div>
              </div>
            </Popover>
            {/** vertical line */}
            <div style={style.line_vertical}></div>
            {/** row item */}
            <Popover
              placement="bottom"
              content={<div>{`Đơn hàng : ${orders}`}</div>}
            >
              <div style={style.row_item}>
                <FileTextOutlined
                  style={{
                    fontSize: 'xx-large',
                    marginRight: '8%',
                    color: '#0094da',
                  }}
                />
                <div
                  style={{
                    lineHeight: 0.9,
                    fontSize: 'large',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <p style={{ fontSize: 'large' }}>Đơn hàng</p>
                  <strong
                    style={{
                      lineHeight: 0.5,
                      fontSize: 'x-large',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: '#696969',
                    }}
                  >
                    {orders}
                  </strong>
                </div>
              </div>
            </Popover>
            {/** vertical line */}
            <div style={style.line_vertical}></div>
            {/** row item */}
            <Popover
              placement="bottom"
              content={<div>{`Trả hàng : ${returnGoods}`}</div>}
            >
              <div style={style.row_item}>
                <FileSyncOutlined
                  style={{
                    fontSize: 'xx-large',
                    marginRight: '8%',
                    color: '#b20000',
                  }}
                />
                <div
                  style={{
                    lineHeight: 0.9,
                    fontSize: 'large',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <p style={{ fontSize: 'large' }}>Trả hàng</p>
                  <strong
                    style={{
                      lineHeight: 0.5,
                      fontSize: 'x-large',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: '#696969',
                    }}
                  >
                    {returnGoods}
                  </strong>
                </div>
              </div>
            </Popover>
            {/** vertical line */}
            <div style={style.line_vertical}></div>
            {/** row item */}
            <Popover
              placement="bottom"
              content={<div>{`Tồn kho : ${productOfStore}`}</div>}
            >
              <div style={style.row_item}>
                <InboxOutlined
                  style={{
                    fontSize: 'xx-large',
                    marginRight: '8%',
                    color: '#696969',
                  }}
                />
                <div
                  style={{
                    lineHeight: 0.9,
                    fontSize: 'large',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  <p style={{ fontSize: 'large' }}>Tồn kho</p>
                  <strong
                    style={{
                      lineHeight: 0.5,
                      fontSize: 'x-large',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      color: '#696969',
                    }}
                  >
                    {productOfStore}
                  </strong>
                </div>
              </div>
            </Popover>
          </div>
        </Card>
        {/** Line chart area */}
        <Card
          type="inner"
          size="small"
          style={style.chart_area}
          title={
            <div style={style.header_chart}>
              <strong>Doanh thu</strong>
              <hr style={style.line_under_chart_header} />
            </div>
          }
        >
          {/** Line chart */}
          <Line
            type="line"
            data={data_line_chart}
            height={150}
            options={options_line_chart}
          />
        </Card>
        {/** Bar chart area */}
        <Card
          type="inner"
          size="small"
          style={style.chart_area}
          title={
            <div style={style.header_chart}>
              <strong>{`Top ${topSellingProduct?.length} sản phẩm bán chạy`}</strong>
              <hr style={style.line_under_chart_header} />
            </div>
          }
        >
          {/** Bar chart */}
          <Bar
            type="bar"
            data={data_bar_chart}
            height={150}
            options={options_bar_chart}
          />
        </Card>
      </div>
    )
  }
  return (
    <Container filterComponent={FilterView} contentComponent={contentView} />
  )
}
const style = {
  block_left_item: {
    backgroundColor: 'white',
    width: '95%',
    height: 240,
  },
  header_block_left: {
    marginLeft: '8%',
  },
  line_under_txt_header_left: {
    backgroundColor: '#0094da',
    border: 'none',
    height: 3,
    width: '40%',
    marginLeft: '0%',
    marginTop: '-7%',
    borderRadius: 10,
  },
  content_block_left: {
    marginTop: '8%',
    marginLeft: '5%',
    width: '90%',
    fontWeight: 700,
  },
  header_inner_card: {
    width: '99%',
  },
  col_header_right: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: 90,
  },
  row_item: {
    width: '25%',
    backgroundColor: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  icon_row_item: {
    fontSize: 'xx-large',
    marginRight: '8%',
    // color: 'gold',
    // color: '#0094da',
    // color: '#e30203',
    // color: '#696969',
  },
  line_vertical: {
    borderLeft: '2px solid #f5f5f5',
    height: '80%',
  },
  chart_area: {
    width: '99%',
    marginTop: 30,
    marginBottom: 30,
    borderRadius: 20,
    borderHeight: 2,
  },
  header_chart: {
    marginLeft: '2%',
  },
  line_under_chart_header: {
    marginLeft: 0,
    width: '9%',
    backgroundColor: '#0094da',
    border: 'none',
    height: 3,
    borderRadius: 10,
  },
}
