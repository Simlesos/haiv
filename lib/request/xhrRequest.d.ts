import { IOptions } from '../interface'
export default class XhrRequest {
  private options
  private xhr
  _requestId: string
  constructor(options: IOptions, xhr: XMLHttpRequest)
  addHeader(): void
}
