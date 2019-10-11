import { guid } from '../lib/utils'
import { IOptions, IXHRSetRequestHeader } from '../interface'
import { APP_KEY, sign } from '../lib/sign'

export default class XhrRequest {
  _requestId: string
  headers: { [key: string]: string }
  url: string
  method: string
  constructor(
    method: string,
    url: string,
    private options: IOptions,
    private xhr: XMLHttpRequest
  ) {
    this._requestId = `Xhr:${guid()}`
    this.method = method
    this.url = url
    this.headers = {}
    this.addOptionsHeader()
  }

  addHeader(key: string, val: string) {
    this.headers[key] = val
  }

  sign(body: object | string) {
    if (typeof body === 'string') {
      body = JSON.parse(body) as object
    }
    if (this.headers['needSign'] === 'y') {
      const signVal = sign({ url: this.url, body })
      this.headers['sign'] = signVal.md5
      this.headers['timestamp'] = signVal.timestamp
      this.headers['appid'] = APP_KEY
    }
  }

  private addOptionsHeader() {
    this.options.headers.forEach(([key, val]) => {
      this.addHeader(key, val)
    })
  }

  setRequestHeader(originSetRequestHeader: IXHRSetRequestHeader) {
    Object.keys(this.headers).forEach(key => {
      const val = this.headers[key]
      originSetRequestHeader.apply(this.xhr, [key, val])
    })
    this.headers = {}
  }
}
