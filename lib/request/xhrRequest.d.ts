import { IOptions, IXHRSetRequestHeader } from '../interface'
export default class XhrRequest {
  private options
  private xhr
  _requestId: string
  headers: {
    [key: string]: string
  }
  url: string
  method: string
  constructor(
    method: string,
    url: string,
    options: IOptions,
    xhr: XMLHttpRequest
  )
  addHeader(key: string, val: string): void
  sign(body: object | string): void
  private addOptionsHeader
  setRequestHeader(originSetRequestHeader: IXHRSetRequestHeader): void
}
