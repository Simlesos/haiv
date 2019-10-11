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
export declare function sign(signParam: ISignParam): string
