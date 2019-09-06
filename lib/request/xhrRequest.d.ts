import { IOptions, IXHRSetRequestHeader } from '../interface'
export default class XhrRequest {
  private options
  private xhr
  _requestId: string
  headers: {
    [key: string]: string
  }
  constructor(options: IOptions, xhr: XMLHttpRequest)
  addHeader(key: string, val: string): void
  private addOptionsHeader
  setRequestHeader(originSetRequestHeader: IXHRSetRequestHeader): void
}
