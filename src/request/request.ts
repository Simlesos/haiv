import { fullUrl, guid, qsStringify } from '../lib/utils'
import { IOptions, IUrl } from '../interface'

export default class Request {
  _id: string
  _urlShape: IUrl

  constructor(url: string, private options: IOptions) {
    this._id = `Req:${guid()}`
    this._urlShape = fullUrl(url)
  }

  signature() {}

  addSearch(): string {
    const { protocol, host, pathname, search, hash } = this._urlShape
    let modifiedSearch = search
    if (this.options.search) {
      const qsString = qsStringify(this.options.search)
      modifiedSearch = search ? `${search}&${qsString}` : `?${qsString}`
    }
    return protocol + '//' + host + pathname + modifiedSearch + hash
  }
}
