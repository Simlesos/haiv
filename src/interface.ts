export type IHttpMethod =
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

export type IFetchFunction = (
  input: RequestInfo,
  init?: RequestInit
) => Promise<Response>

export type IXHRSend =
  | ((body?: Document | BodyInit | null) => void)
  | ((data: Blob) => void)
  | ((data: ArrayBufferView) => void)
  | ((data: ArrayBuffer) => void)
  | ((data: string | ArrayBufferLike | Blob | ArrayBufferView) => void)
  | ((data: string) => void)

export type IXHROpen =
  | ((method: string, url: string) => void)
  | ((
      method: string,
      url: string,
      async: boolean,
      username?: string,
      password?: string
    ) => void)

export type IXHRSetRequestHeader = (name: string, value: string) => void
