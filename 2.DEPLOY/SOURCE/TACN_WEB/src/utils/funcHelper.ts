import reactotron from 'ReactotronConfig'
import { SALE_TYPE } from './constants'
import R from './R'

export function jsonToArray(jsonData: any) {
  var result = []
  for (var i in jsonData) result.push(jsonData[i])
  return result
}
export function calculatorDistance(
  lat1: number | undefined,
  lon1: number | undefined,
  lat2: number | undefined,
  lon2: number | undefined,
  unit = 'K'
) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0
  if (lat1 == lat2 && lon1 == lon2) {
    return 0
  } else {
    var radLat1 = (Math.PI * lat1) / 180
    var radLat2 = (Math.PI * lat2) / 180
    var theta = lon1 - lon2
    var radTheta = (Math.PI * theta) / 180
    var dist =
      Math.sin(radLat1) * Math.sin(radLat2) +
      Math.cos(radLat1) * Math.cos(radLat2) * Math.cos(radTheta)
    if (dist > 1) {
      dist = 1
    }
    dist = Math.acos(dist)
    dist = (dist * 180) / Math.PI
    dist = dist * 60 * 1.1515
    if (unit == 'K') {
      dist = dist * 1.609344
    }
    if (unit == 'N') {
      dist = dist * 0.8684
    }
    // return Math.round((dist + Number.EPSILON) * 100) / 100;
    return dist.toFixed(2)
  }
}

export function sortArrayByDistance(array: any) {
  let result = [...array]
  result.sort((a, b) => {
    return parseFloat(a.distance) - parseFloat(b.distance)
  })
  return result
}

export const replaceSpecialCharacter = (inputString: string) => {
  if (inputString === null || inputString === undefined) return inputString
  return inputString
    .replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a')
    .replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e')
    .replace(/ì|í|ị|ỉ|ĩ/g, 'i')
    .replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o')
    .replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u')
    .replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A')
    .replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E')
    .replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I')
    .replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O')
    .replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U')
    .replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y')
    .replace(/Đ/g, 'D')
    .replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, '')
    .replace(/\u02C6|\u0306|\u031B/g, '')
    .replace(/\u02C6|\u0306|\u031B/g, '')
    .trim()
    .replace(
      /!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g,
      ' '
    )
}

export const getPlaceHolder = (label: string) => {
  return `${R.strings().enter} ${label.toLocaleLowerCase()}`
}

interface ISomeObject {
  [key: string]: any
}

export function getSaleTypeByStatus(id: number) {
  var types: ISomeObject = { ...SALE_TYPE }
  var key: string | undefined = Object.keys(types).find(
    (val: any) => types[val].id === id
  )
  if (!key) key = 'RETAIL'
  var result: object = types[key]

  return result
}

export const transactionType = (id: any) => {
  switch (parseInt(id)) {
    case 1:
      return 'Phiếu nhập'
      break
    case 2:
      return 'Phiếu bán buôn'
      break
    case 3:
      return 'Phiếu bán lẻ'
      break
    case 4:
      return 'Phiếu trả hàng'
      break
    case 5:
      return 'Phiếu thu'
      break
    case 6:
      return 'Phiếu chi'
      break
    case 7:
      return 'Phiếu thanh toán'
      break
    case 8:
      return 'Xóa phiếu nhập'
      break
    case 9:
      return 'Xóa phiếu trả hàng'
      break
    case 10:
      return 'Xóa phiếu bán buôn'
      break
    case 11:
      return 'Xóa phiếu bán lẻ'
      break
    default:
      return ''
      break
  }
}
