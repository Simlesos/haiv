import { isNative } from '../lib/utils'
import {
  IFetchFunction,
  IOptions,
  IXHROpen,
  IXHRSend,
  IXHRSetRequestHeader,
} from '../interface'
import Emitter from '../lib/emitter'

export type IListenerKey = 'request'

export default class Network extends Emitter {
  private readonly _isFetchSupported: boolean
  private _originFetch: IFetchFunction | undefined
  private _originSend: IXHRSend | undefined
  private _originOpen: IXHROpen | undefined
  private _originSetRequestHeader: IXHRSetRequestHeader | undefined

  constructor(private options: IOptions) {
    super()
    this._isFetchSupported = false
    if (window.__YCNETWORK__) {
      throw new Error(`Network global initialization only once`)
    }
    if (window.fetch) this._isFetchSupported = isNative(window.fetch)
    if (options.overrideFetch) this.overrideFetch()
    if (options.overrideXhr) this.overrideXhr()
    window.__YCNETWORK__ = this
  }

  private overrideXhr() {
    const winXhrProto = window.XMLHttpRequest.prototype
    const originOpen = (this._originOpen = winXhrProto.open)
    const originSend = (this._originSend = winXhrProto.send)
    const originSetRequestHeader = (this._originSetRequestHeader =
      winXhrProto.setRequestHeader)

    winXhrProto.open = function() {
      const xhr = this
      xhr.addEventListener('readystatechange', function() {
        // TODO: 可以做一些事件上报或者日志
      })

      originOpen.apply(this, args)
    }

    winXhrProto.setRequestHeader = function(name: string, value: string) {
      originSetRequestHeader.apply(this, [name, value])
    }

    winXhrProto.send = function() {
      // @ts-ignore
      originSend.apply(this, arguments)
    }
  }

  private overrideFetch() {
    if (!this._isFetchSupported) return
    const originFetch = (this._originFetch = window.fetch)
    window.fetch = function(input: RequestInfo, init?: RequestInit) {
      // 处理参数
      return originFetch(input, init)
    }
  }

  restoreFetch() {
    if (!this._isFetchSupported) return
    if (this._originFetch) window.fetch = this._originFetch
  }

  restoreXhr() {
    const winXhrProto = window.XMLHttpRequest.prototype

    if (this._originOpen) {
      // @ts-ignore
      winXhrProto.open = this._originOpen
    }
    if (this._originSend) winXhrProto.send = this._originSend
    if (this._originSetRequestHeader) {
      winXhrProto.setRequestHeader = this._originSetRequestHeader
    }
  }
}
