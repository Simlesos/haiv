import { isNative, isPlainObject } from '../lib/utils'
import {
  IFetchFunction,
  IOptions,
  IXHROpen,
  IXHRSend,
  IXHRSetRequestHeader,
} from '../interface'
import Emitter from '../lib/emitter'
import FetchRequest from './fetchRequest'
import XhrRequest from './xhrRequest'
import { getConfig, setConfig, DEFAULT_APP_ID } from '../lib/config'

export default class Network extends Emitter {
  private readonly _isFetchSupported: boolean
  private _originFetch: IFetchFunction | undefined
  private _originSend: IXHRSend | undefined
  private _originOpen: IXHROpen | undefined
  private _originSetRequestHeader: IXHRSetRequestHeader | undefined
  private options: IOptions

  constructor(config: Partial<IOptions>) {
    super()
    setConfig(config)
    this.options = getConfig()

    if (this.options.appId === DEFAULT_APP_ID) {
      throw new Error(`appId must be required`)
    }
    this._isFetchSupported = false
    if (window.__YCNETWORK__) {
      throw new Error(`Network global initialization only once`)
    }
    if (window.fetch) this._isFetchSupported = isNative(window.fetch)
    if (this.options.overrideFetch) this.overrideFetch()
    if (this.options.overrideXhr) this.overrideXhr()
    window.__YCNETWORK__ = this
  }

  private overrideXhr() {
    const winXhrProto = window.XMLHttpRequest.prototype
    const originOpen = (this._originOpen = winXhrProto.open)
    const originSend = (this._originSend = winXhrProto.send)
    const originSetRequestHeader = (this._originSetRequestHeader =
      winXhrProto.setRequestHeader)

    const self = this

    let xhrRequest: XhrRequest

    winXhrProto.open = function(method: string, url: string) {
      const xhr = this
      xhr.addEventListener('readystatechange', function() {
        // TODO: 可以做一些日志
      })

      // @ts-ignore
      originOpen.apply(this, arguments)
      xhrRequest = new XhrRequest(method, url, self.options, this)
    }

    winXhrProto.setRequestHeader = function(name: string, value: string) {
      xhrRequest.addHeader(name, value)
    }

    winXhrProto.send = function(body) {
      if (typeof body === 'string' || isPlainObject(body)) {
        // @ts-ignore
        xhrRequest.sign(body)
      }
      xhrRequest.setRequestHeader(originSetRequestHeader)
      originSend.call(this, body)
    }
  }

  private overrideFetch() {
    if (!this._isFetchSupported) return
    const originFetch = (this._originFetch = window.fetch)
    const self = this
    window.fetch = function(input: RequestInfo, init?: RequestInit) {
      const req = new FetchRequest(self.options, input, init)
      return req.request(originFetch)
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
