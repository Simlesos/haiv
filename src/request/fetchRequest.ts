import { IFetchFunction, IOptions } from '../interface'
import { guid, isArray } from '../lib/utils'

export default class FetchRequest {
  _requestId: string

  constructor(
    private options: IOptions,
    private input: RequestInfo,
    private init?: RequestInit
  ) {
    this._requestId = `Req:${guid()}`
  }

  private genRequestByObject(input: Request) {
    const { url, ...options } = input
    this.options.headers.forEach(([key, val]) => {
      options.headers.set(key, val)
    })
    return new Request(url, options)
  }

  private genRequestByString(input: string, init: RequestInit = {}) {
    const { ...options } = init
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
