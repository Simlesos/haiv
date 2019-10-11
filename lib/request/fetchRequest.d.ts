import { IFetchFunction, IOptions } from '../interface'
export default class FetchRequest {
  private options
  private input
  private init?
  _requestId: string
  constructor(
    options: IOptions,
    input: RequestInfo,
    init?: RequestInit | undefined
  )
  setSign(url: string, body: any): void
  needSign(
    headers: string[][] | Headers | Record<string, string> | undefined
  ): boolean
  private genRequestByObject
  private genRequestByString
  request(originFetch: IFetchFunction): Promise<Response>
}
