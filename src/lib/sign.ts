import md5 from 'crypto-js/md5'
import { fullUrl, isArray, isObject } from './utils'
import { IUrl } from '../interface'

export const APP_KEY = 'CB3141D6-FE9E-46DF-ABD9-8434AC8DBD59'

export interface ISignParam {
  url: string
  clientChannel?: string
  clientType?: string
  clientVersion?: string
  device?: string
  body: { [key: string]: any | Array<any> }
}

export function sign(signParam: ISignParam) {
  const timestamp = Date.now().toString()
  const {
    url,
    clientChannel = '',
    clientType = '',
    clientVersion = '',
    device = '',
  } = signParam
  const urlMeta = fullUrl(url)
  const api = getApiField(urlMeta)
  const query = getQueryField(urlMeta)
  const body = getBodyField(signParam.body)

  const signObj: Array<[string, string]> = [
    ['api', api],
    ['client-channel', clientChannel],
    ['client-type', clientType],
    ['client-version', clientVersion],
    ['device', device],
    ['timestamp', timestamp],
  ]
  const sign =
    `${APP_KEY}:` +
    [
      ...signObj.map(([key, value]) => {
        return `${key}=${value}`
      }),
      query,
      body,
    ].join('&')

  return {
    sign: sign,
    timestamp,
    md5: md5(sign),
  }
}

function getApiField(urlMeta: IUrl) {
  return urlMeta.pathname
}

function sortStr(a: string, b: string) {
  const aStart = a[0]
  const bStart = b[0]
  if (aStart < bStart) return -1
  if (aStart > bStart) return 1
  return 0
}

function objectFormat() {
  return ''
}

function arrayFormat(array: Array<any>) {
  return array
    .filter(x => x && !isObject(x))
    .map(x => {
      if (isFinite(x)) {
        return parseInt(x, 10)
      }
      return `${x}`
    })
    .filter(Boolean)
    .join(',')
}

function getQueryField(urlMeta: IUrl) {
  return urlMeta.search
    .replace('?', '')
    .split('&')
    .sort(sortStr)
    .join('&')
}

function getBodyField(body: Array<any> | { [key: string]: any }) {
  if (isArray(body)) {
    return arrayFormat(body)
  }
  return Object.keys(body)
    .sort(sortStr)
    .map(key => {
      let val = body[key]
      if (isArray(val)) {
        val = arrayFormat(val)
      } else if (isObject(val)) {
        val = objectFormat()
      } else if (typeof val === 'boolean') {
        val = `${val}`
      } else if (isFinite(val)) {
        val = parseInt(val, 10)
      }

      return val !== '' ? `${key}=${val}` : ''
    })
    .filter(Boolean)
    .join('&')
}
