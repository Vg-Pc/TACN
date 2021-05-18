import R from './R'

export const RESTART_ON_REMOUNT = '@saga-injector/restart-on-remount'

export const API_STATUS = {
  RE_LOGIN: 403,
  NOT_FOUND: 404,
}

export const ACCOUNT_R0LE = {
  ALL: 0,
  ADMIN: 1,
  STAFF: 2,
  AGENT: 3,
}

export const GENDER = {
  MALE: 0,
  FEMALE: 1,
}

export const VOUCHER_TYPE = {
  RECEIPT: {
    id: 1,
    name: 'Phiếu thu',
  },
  PAYMENT: {
    id: 2,
    name: 'Phiếu chi',
  },
}

export const REG_PHONE = /(84|0[3|5|7|8|9])+([0-9]{8})\b/

export const PROVINCES = [
  {
    id: 201,
    name: 'Hà Nội',
    code: '4',
  },
  {
    id: 202,
    name: 'Hồ Chí Minh',
    code: '8',
  },
  {
    id: 203,
    name: 'Đà Nẵng',
    code: '511',
  },
  {
    id: 204,
    name: 'Đồng Nai',
    code: '61',
  },
  {
    id: 205,
    name: 'Bình Dương',
    code: '065',
  },
  {
    id: 206,
    name: 'Bà Rịa - Vũng Tàu',
    code: '64',
  },
  {
    id: 207,
    name: 'Gia Lai',
    code: '59',
  },
  {
    id: 208,
    name: 'Khánh Hòa',
    code: '58',
  },
  {
    id: 209,
    name: 'Lâm Đồng',
    code: '63',
  },
  {
    id: 210,
    name: 'Đắk Lắk',
    code: '500',
  },
  {
    id: 211,
    name: 'Long An',
    code: '72',
  },
  {
    id: 212,
    name: 'Tiền Giang',
    code: '73',
  },
  {
    id: 213,
    name: 'Bến Tre',
    code: '75',
  },
  {
    id: 214,
    name: 'Trà Vinh',
    code: '74',
  },
  {
    id: 215,
    name: 'Vĩnh Long',
    code: '70',
  },
  {
    id: 216,
    name: 'Đồng Tháp',
    code: '67',
  },
  {
    id: 217,
    name: 'An Giang',
    code: '76',
  },
  {
    id: 218,
    name: 'Sóc Trăng',
    code: '79',
  },
  {
    id: 219,
    name: 'Kiên Giang',
    code: '77',
  },
  {
    id: 220,
    name: 'Cần Thơ',
    code: '710',
  },
  {
    id: 221,
    name: 'Vĩnh Phúc',
    code: '211',
  },
  {
    id: 223,
    name: 'Thừa Thiên - Huế',
    code: '54',
  },
  {
    id: 224,
    name: 'Hải Phòng',
    code: '31',
  },
  {
    id: 225,
    name: 'Hải Dương',
    code: '320',
  },
  {
    id: 226,
    name: 'Thái Bình',
    code: '36',
  },
  {
    id: 227,
    name: 'Hà Giang',
    code: '219',
  },
  {
    id: 228,
    name: 'Tuyên Quang',
    code: '27',
  },
  {
    id: 229,
    name: 'Phú Thọ',
    code: '210',
  },
  {
    id: 230,
    name: 'Quảng Ninh',
    code: '33',
  },
  {
    id: 231,
    name: 'Nam Định',
    code: '350',
  },
  {
    id: 232,
    name: 'Hà Nam',
    code: '351',
  },
  {
    id: 233,
    name: 'Ninh Bình',
    code: '30',
  },
  {
    id: 234,
    name: 'Thanh Hóa',
    code: '37',
  },
  {
    id: 235,
    name: 'Nghệ An',
    code: '38',
  },
  {
    id: 236,
    name: 'Hà Tĩnh',
    code: '39',
  },
  {
    id: 237,
    name: 'Quảng Bình',
    code: '52',
  },
  {
    id: 238,
    name: 'Quảng Trị',
    code: '53',
  },
  {
    id: 239,
    name: 'Bình Phước',
    code: '651',
  },
  {
    id: 240,
    name: 'Tây Ninh',
    code: '66',
  },
  {
    id: 241,
    name: 'Đắk Nông',
    code: '501',
  },
  {
    id: 242,
    name: 'Quảng Ngãi',
    code: '55',
  },
  {
    id: 243,
    name: 'Quảng Nam',
    code: '510',
  },
  {
    id: 244,
    name: 'Thái Nguyên',
    code: '280',
  },
  {
    id: 245,
    name: 'Bắc Kạn',
    code: '281',
  },
  {
    id: 246,
    name: 'Cao Bằng',
    code: '26',
  },
  {
    id: 247,
    name: 'Lạng Sơn',
    code: '25',
  },
  {
    id: 248,
    name: 'Bắc Giang',
    code: '240',
  },
  {
    id: 249,
    name: 'Bắc Ninh',
    code: '241',
  },
  {
    id: 250,
    name: 'Hậu Giang',
    code: '711',
  },
  {
    id: 252,
    name: 'Cà Mau',
    code: '780',
  },
  {
    id: 253,
    name: 'Bạc Liêu',
    code: '781',
  },
  {
    id: 258,
    name: 'Bình Thuận',
    code: '62',
  },
  {
    id: 259,
    name: 'Kon Tum',
    code: '60',
  },
  {
    id: 260,
    name: 'Phú Yên',
    code: '57',
  },
  {
    id: 261,
    name: 'Ninh Thuận',
    code: '68',
  },
  {
    id: 262,
    name: 'Bình Định',
    code: '56',
  },
  {
    id: 263,
    name: 'Yên Bái',
    code: '29',
  },
  {
    id: 264,
    name: 'Lai Châu',
    code: '231',
  },
  {
    id: 265,
    name: 'Điện Biên',
    code: '230',
  },
  {
    id: 266,
    name: 'Sơn La',
    code: '22',
  },
  {
    id: 267,
    name: 'Hòa Bình',
    code: '218',
  },
  {
    id: 268,
    name: 'Hưng Yên',
    code: '321',
  },
  {
    id: 269,
    name: 'Lào Cai',
    code: '20',
  },
]

export const SALE_TYPE = {
  WHOLE: {
    id: 1,
    name: R.strings().sale_type_whole,
  },
  RETAIL: {
    id: 2,
    name: R.strings().sale_type_retail,
  },
  RETURN: {
    id: 3,
    name: R.strings().sale_type_return,
  },
}

export const INVOICE_TYPE = {
  PAYMENT: {
    id: 2,
    name: 'Phiếu chi',
  },
  RECEIPT: {
    id: 1,
    name: 'Phiếu chi',
  },
}

export const PURCHASE_OBJECT = {
  CUSTOMER: 1,
  SUPPLIER: 2,
}

export const DEBT_OBJECT = {
  CUSTOMER: 1,
  SUPPLIER: 2,
}

export const TRANSACTION_OBJECT = {
  CUSTOMER: 1,
  SUPPLIER: 2,
}

export const INVOICE_OBJECT_TYPE = {
  CUSTOMER: {
    id: 1,
    name: R.strings().order_customer,
  },
  PROVIDER: {
    id: 2,
    name: 'Nhà cung cấp',
  },
}

export const PAYMENT_TYPE = {
  ONLINE: {
    id: 1,
    name: 'Chuyển khoản',
  },
  CASH: {
    id: 2,
    name: 'Tiền mặt',
  },
}
