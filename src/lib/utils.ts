import { IUrl } from '../interface'

/**
 * gen uuid
 */
export function guid() {
  return 'xxxxxx4xyx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0,
      v = c == 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

/**
 * isArray
 * @param value
 */
export function isArray<T>(value: any): value is T[] {
  return Array.isArray(value)
}

export function isObject(value: any) {
  const type = typeof value
  return value != null && (type == 'object' || type == 'function')
}

export function isFunction(value: any): value is Function {
  return typeof value === 'function'
}

export function isNil(v: any) {
  return v === null || v === undefined
}

export function isFinite(numStr: string) {
  if (numStr === '0') return true
  return Number.isFinite(Number(numStr))
}

export function toBoolean(value: any): boolean {
  return value != null && `${value}` !== 'false'
}

export function isPlainObject(value: any) {
  return toBoolean(value) && value.constructor.name === 'Object'
}

export function fullUrl(url: string): IUrl {
  let link = document.createElement('a')
  link.href = url
  return {
    protocol: link.protocol,
    host: link.host,
    pathname: link.pathname,
    search: link.search,
    hash: link.hash,
  }
}

export function toSrc(fn: any) {
  const fnToStr = Function.prototype.toString
  if (isNil(fn)) return ''

  try {
    return fnToStr.call(fn)
  } catch (e) {}

  try {
    return fn + ''
  } catch (e) {}

  return ''
}

export function isNative(val: any) {
  const hasOwnProperty = Object.prototype.hasOwnProperty
  const regIsNative = new RegExp(
    '^' +
      toSrc(hasOwnProperty)
        .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
        .replace(
          /hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\])/g,
          '$1.*?'
        ) +
      '$'
  )
  const regIsHostCtor = /^\[object .+?Constructor]$/
  if (!isObject(val)) return false
  if (isFunction(val)) return regIsNative.test(toSrc(val)) // Detect host constructors (Safari > 4; really typed array specific)

  return regIsHostCtor.test(toSrc(val))
}

export function qsStringify(obj: { [key: string]: any }) {
  return Object.keys(obj)
    .map(key => {
      const val = obj[key]
      return `${key}=${val}`
    })
    .join('&')
}
