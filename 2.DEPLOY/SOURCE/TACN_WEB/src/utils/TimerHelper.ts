/**
 *
 * @param {*} timeStamp
 * DD/MM/YYYY
 */

import R from './R'

export function convertTimeStampToString(
  timeStamp: string | number | Date
): string {
  var MyDate = new Date(timeStamp)
  return (
    ('0' + MyDate.getDate()).slice(-2) +
    '/' +
    ('0' + (MyDate.getMonth() + 1)).slice(-2) +
    '/' +
    MyDate.getFullYear()
  )
}

export function convertTimeStampSecondToString(timeStamp: number): string {
  var MyDate = new Date(timeStamp * 1000)
  return (
    ('0' + MyDate.getDate()).slice(-2) +
    '/' +
    ('0' + (MyDate.getMonth() + 1)).slice(-2) +
    '/' +
    MyDate.getFullYear()
  )
}

export function convertTimeStampToString2(timeStamp: string | number | Date) {
  var MyDate = new Date(timeStamp)
  return (
    MyDate.getFullYear() +
    '/' +
    ('0' + (MyDate.getMonth() + 1)).slice(-2) +
    '/' +
    ('0' + MyDate.getDate()).slice(-2)
  )
}

export function convertDateTimeToString(timeStamp: string | number | Date) {
  const d = new Date(timeStamp)
  const date =
    ('0' + d.getDate()).slice(-2) +
    '/' +
    ('0' + (d.getMonth() + 1)).slice(-2) +
    '/' +
    d.getFullYear()
  const time = d.getHours() + ':' + ('0' + d.getMinutes()).slice(-2)
  const year = d.getFullYear()
  return {
    date: date,
    time: time,
    year: year,
    dateTimeStr: `${time} ${date}`,
  }
}

export function convertStringToTimeStamp(date: string) {
  if (!date) return ''
  const arr = date.split('/')
  const newDate = arr[2] + '/' + arr[1] + '/' + arr[0]
  return new Date(newDate).getTime() / 1000
}

export function getMinusTime(date: string | number | Date) {
  date = `${date}`
  var date1 = new Date(date).getTime()
  var currentDate = new Date().getTime()
  var difference = Math.abs(date1 - currentDate)
  var daysDifference = Math.floor(difference / 1000 / 60 / 60 / 24)
  difference -= daysDifference * 1000 * 60 * 60 * 24

  var hoursDifference = Math.floor(difference / 1000 / 60 / 60)
  difference -= hoursDifference * 1000 * 60 * 60

  var minutesDifference = Math.floor(difference / 1000 / 60)
  difference -= minutesDifference * 1000 * 60

  var secondsDifference = Math.floor(difference / 1000)
  if (daysDifference > 0 && daysDifference < 32)
    return `${daysDifference} ${R.strings().time_minus_day_ago}`
  else if (daysDifference > 31) {
    var newDate = new Date(date1)
    var year = newDate.getFullYear()
    var month = newDate.getMonth() + 1
    var day = newDate.getDate()
    return `${day}/${month}/${year}`
  } else if (hoursDifference > 0)
    return `${hoursDifference} ${R.strings().time_minus_hour_ago}`
  else if (minutesDifference)
    return `${minutesDifference} ${R.strings().time_minus_minute_ago}`
  return R.strings().time_minus_just_now
}
