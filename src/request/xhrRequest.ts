import { guid } from '../lib/utils'
import { IOptions } from '../interface'

export default class XhrRequest {
  _requestId: string
  constructor(private options: IOptions, private xhr: XMLHttpRequest) {
    this._requestId = `Xhr:${guid()}`
  }

  addHeader() {
    this.options.headers.forEach(([key, val]) => {
      this.xhr.setRequestHeader(key, val)
    })
  }
}
