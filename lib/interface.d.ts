export declare type IHttpMethod =
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'CONNECT'
  | 'OPTIONS'
  | 'TRACE'
  | 'PATCH'
export interface IOptions {
  appId: string
  headers: Array<[string, string]>
  signature: boolean
  overrideFetch: boolean
  overrideXhr: boolean
}
export interface IUrl {
  protocol: string
  search: string
  host: string
  hash: string
  pathname: string
}
export declare type IFetchFunction = (
  input: RequestInfo,
  init?: RequestInit
) => Promise<Response>
export declare type IXHRSend =
  | ((body?: Document | BodyInit | null) => void)
  | ((data: Blob) => void)
  | ((data: ArrayBufferView) => void)
  | ((data: ArrayBuffer) => void)
  | ((data: string | ArrayBufferLike | Blob | ArrayBufferView) => void)
  | ((data: string) => void)
export declare type IXHROpen =
  | ((method: string, url: string) => void)
  | ((
      method: string,
      url: string,
      async: boolean,
      username?: string,
      password?: string
    ) => void)
export declare type IXHRSetRequestHeader = (name: string, value: string) => void
