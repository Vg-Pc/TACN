export const isStrongPassword = (pass: string) => {
  // if (!pass || typeof pass != 'string') return false;
  return /^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W])(?!.*['"]).{8,}$/.test(
    pass
  )
}
export function formatPrice(num: any) {
  if (
    num === null ||
    num === undefined ||
    num === 0 ||
    Number.isNaN(parseFloat(num))
  )
    return 0
  var result = num.toString().replace(/,/g, '')
  return result.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

export const parseFloatComas = (value: number) => {
  if (!value) return 0
  return parseFloat(value.toString().replace(/,/g, ''))
}

export const parseIntComas = (value: number) => {
  if (!value) return 0
  return parseInt(value.toString().replace(/,/g, ''))
}
export const maxLength = (maxLength: number, msg: string) => (
  value: string | undefined | null
) => (value && value.length > maxLength ? msg : undefined)

export const minLength4 = (value: string | undefined | null) =>
  value && value.length < 4 ? 'Must be' : undefined

export const minValue = (min: number) => (value: number) =>
  value && value < min ? `Must be at least ${min}` : undefined

export const number = (msg: string) => (value: string | undefined | null) =>
  value && isNaN(Number(value)) ? msg : undefined

export const isEmail = (value: string | undefined | null) => {
  if (!value) return false
  return !/^[a-z][a-z0-9%_\.]{3,32}@[a-z0-9]{3,}(\.[a-z]{3,4}){1,2}$/i.test(
    value
  )
}

export const strongPassword = (value: string | undefined | null) =>
  value &&
  !/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[\W])(?!.*['"]).{8,}$/.test(value)
    ? 'Must like Abc@1234'
    : undefined

export const normalizePhone = (value: string | undefined | null) => {
  if (!value) {
    return value
  }

  const onlyNumber = value.replace(/[^\d]/g, '')
  if (onlyNumber.length <= 3) {
    return onlyNumber
  }
  if (onlyNumber.length <= 7) {
    return `${onlyNumber.slice(0, 4)}-${onlyNumber.slice(4)}`
  }
  return `${onlyNumber.slice(0, 4)}-${onlyNumber.slice(
    4,
    7
  )}-${onlyNumber.slice(7, 11)}`
}
