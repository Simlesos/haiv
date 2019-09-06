import { IOptions } from '../interface'

let CONFIG: IOptions

export const DEFAULT_APP_ID = '$$default'

let DEFAULT_CONFIG: IOptions = {
  appId: DEFAULT_APP_ID,
  headers: [],
  signature: false,
  overrideXhr: true,
  overrideFetch: true,
}

export function setConfig(config: Partial<IOptions>) {
  CONFIG = { ...DEFAULT_CONFIG, ...config }
  CONFIG.headers.push(['Cache-Control', 'no-cache'])
}

export function getConfig(): IOptions {
  return CONFIG
}
