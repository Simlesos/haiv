import { guid } from '../lib/utils'
import { IOptions, IXHRSetRequestHeader } from '../interface'

export default class XhrRequest {
  _requestId: string
  headers: { [key: string]: string }
  constructor(private options: IOptions, private xhr: XMLHttpRequest) {
    this._requestId = `Xhr:${guid()}`
    this.headers = {}
    this.addOptionsHeader()
  }

  addHeader(key: string, val: string) {
    this.headers[key] = val
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
