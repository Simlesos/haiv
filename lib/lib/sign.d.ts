export declare const APP_KEY = 'CB3141D6-FE9E-46DF-ABD9-8434AC8DBD59'
export interface ISignParam {
  url: string
  clientChannel?: string
  clientType?: string
  clientVersion?: string
  device?: string
  body: {
    [key: string]: any | Array<any>
  }
}
export declare function sign(
  signParam: ISignParam
): {
  sign: string
  timestamp: string
  md5: any
}
