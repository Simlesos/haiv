import { IUrl } from '../interface'
export declare function guid(): string
export declare function isArray<T>(value: any): value is T[]
export declare function isObject(value: any): boolean
export declare function isFunction(value: any): value is Function
export declare function isNil(v: any): boolean
export declare function isFinite(numStr: string): boolean
export declare function toBoolean(value: any): boolean
export declare function isPlainObject(value: any): boolean
export declare function fullUrl(url: string): IUrl
export declare function toSrc(fn: any): string
export declare function isNative(val: any): boolean
export declare function qsStringify(obj: { [key: string]: any }): string
