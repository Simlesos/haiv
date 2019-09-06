import { IOptions } from '../interface'
import Emitter from '../lib/emitter'
export default class Network extends Emitter {
  private readonly _isFetchSupported
  private _originFetch
  private _originSend
  private _originOpen
  private _originSetRequestHeader
  private options
  constructor(config: Partial<IOptions>)
  private overrideXhr
  private overrideFetch
  restoreFetch(): void
  restoreXhr(): void
}
