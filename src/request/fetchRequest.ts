import { IFetchFunction, IOptions } from '../interface'
import { guid, isArray } from '../lib/utils'
import { APP_KEY, sign } from '../lib/sign'

export default class FetchRequest {
  _requestId: string

  constructor(
    private options: IOptions,
    private input: RequestInfo,
    private init?: RequestInit
  ) {
    this._requestId = `Req:${guid()}`
  }

  setSign(url: string, body: any) {
    let signBody = {}
    if (typeof body === 'object') {
      // @ts-ignore
      signBody = body
      let signVal = sign({ url, body: signBody })
      this.options.headers.push(
        ['sign', signVal.md5],
        ['timestamp', signVal.timestamp],
        ['originsign', signVal.sign],
        ['appid', APP_KEY]
      )
    }
  }

  needSign(headers: string[][] | Headers | Record<string, string> | undefined) {
    if (!headers) return false
    const optionHas = this.options.headers.some(
      ([key, val]) => key === 'needSign' && val === 'y'
    )
    let headersHas = false
    if (headers instanceof Headers) {
      headersHas = headers.get('needSing') === 'y'
    } else if (isArray(headers)) {
      headersHas = headers.some(
        ([key, val]) => key === 'needSign' && val === 'y'
      )
    } else {
      headersHas = headers['needSign'] === 'y'
    }
    return optionHas || headersHas
  }

  private genRequestByObject(input: Request) {
    const { url, ...options } = input

    if (this.needSign(options.headers)) {
      this.setSign(url, options.body)
    }

    this.options.headers.forEach(([key, val]) => {
      options.headers.set(key, val)
    })

    return new Request(url, options)
  }

  private genRequestByString(input: string, init: RequestInit = {}) {
    const { ...options } = init

    if (this.needSign(options.headers)) {
      this.setSign(input, options.body)
    }

    this.options.headers.forEach(([key, val]) => {
      if (options.headers instanceof Headers) {
        options.headers.set(key, val)
      } else if (isArray(options.headers)) {
        options.headers = [...options.headers, [key, val]]
      } else {
        options.headers = { ...options.headers, [key]: val }
      }
    })
    return new Request(input, options)
  }

  request(originFetch: IFetchFunction): Promise<Response> {
    let request: Request
    if (this.input instanceof Request) {
      request = this.genRequestByObject(this.input)
    } else {
      request = this.genRequestByString(this.input, this.init)
    }

    return originFetch(request)
  }
}
