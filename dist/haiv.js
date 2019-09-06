'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function guid() {
    return 'xxxxxx4xyx'.replace(/[xy]/g, c => {
        const r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
    });
}
function isArray(value) {
    return Array.isArray(value);
}
function isObject(value) {
    const type = typeof value;
    return value != null && (type == 'object' || type == 'function');
}
function isFunction(value) {
    return typeof value === 'function';
}
function isNil(v) {
    return v === null || v === undefined;
}
function toSrc(fn) {
    const fnToStr = Function.prototype.toString;
    if (isNil(fn))
        return '';
    try {
        return fnToStr.call(fn);
    }
    catch (e) { }
    try {
        return fn + '';
    }
    catch (e) { }
    return '';
}
function isNative(val) {
    const hasOwnProperty = Object.prototype.hasOwnProperty;
    const regIsNative = new RegExp('^' +
        toSrc(hasOwnProperty)
            .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
            .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\])/g, '$1.*?') +
        '$');
    const regIsHostCtor = /^\[object .+?Constructor]$/;
    if (!isObject(val))
        return false;
    if (isFunction(val))
        return regIsNative.test(toSrc(val));
    return regIsHostCtor.test(toSrc(val));
}

class Emitter {
    constructor() {
        this.events = {};
    }
    on(eventKey, listener) {
        const activeListeners = this.events[eventKey];
        this.events[eventKey] = [...activeListeners, listener];
    }
    off(eventKey, listener) {
        let activeListeners = [...this.events[eventKey]];
        if (isArray(activeListeners)) {
            activeListeners.splice(activeListeners.indexOf(listener), 1);
            this.events[eventKey] = activeListeners;
        }
    }
    once(eventKey, listener) {
        this.on(eventKey, (data) => {
            listener(data);
            this.off(eventKey, listener);
        });
    }
    emit(eventKey, payload) {
        this.events[eventKey].forEach(callback => callback(payload));
    }
}

/*! *****************************************************************************
Copyright (c) Microsoft Corporation. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

class FetchRequest {
    constructor(options, input, init) {
        this.options = options;
        this.input = input;
        this.init = init;
        this._requestId = `Req:${guid()}`;
    }
    genRequestByObject(input) {
        const { url } = input, options = __rest(input, ["url"]);
        this.options.headers.forEach(([key, val]) => {
            options.headers.set(key, val);
        });
        return new Request(url, options);
    }
    genRequestByString(input, init = {}) {
        const options = __rest(init, []);
        this.options.headers.forEach(([key, val]) => {
            if (options.headers instanceof Headers) {
                options.headers.set(key, val);
            }
            else if (isArray(options.headers)) {
                options.headers = [...options.headers, [key, val]];
            }
            else {
                options.headers = Object.assign(Object.assign({}, options.headers), { [key]: val });
            }
        });
        return new Request(input, options);
    }
    request(originFetch) {
        let request;
        if (this.input instanceof Request) {
            request = this.genRequestByObject(this.input);
        }
        else {
            request = this.genRequestByString(this.input, this.init);
        }
        return originFetch(request);
    }
}

class XhrRequest {
    constructor(options, xhr) {
        this.options = options;
        this.xhr = xhr;
        this._requestId = `Xhr:${guid()}`;
        this.headers = {};
        this.addOptionsHeader();
    }
    addHeader(key, val) {
        this.headers[key] = val;
    }
    addOptionsHeader() {
        this.options.headers.forEach(([key, val]) => {
            this.addHeader(key, val);
        });
    }
    setRequestHeader(originSetRequestHeader) {
        Object.keys(this.headers).forEach(key => {
            const val = this.headers[key];
            originSetRequestHeader.apply(this.xhr, [key, val]);
        });
    }
}

let CONFIG;
const DEFAULT_APP_ID = '$$default';
let DEFAULT_CONFIG = {
    appId: DEFAULT_APP_ID,
    headers: [],
    signature: false,
    overrideXhr: true,
    overrideFetch: true,
};
function setConfig(config) {
    CONFIG = Object.assign(Object.assign({}, DEFAULT_CONFIG), config);
    CONFIG.headers.push(['Cache-Control', 'no-cache']);
}
function getConfig() {
    return CONFIG;
}

class Network extends Emitter {
    constructor(config) {
        super();
        setConfig(config);
        this.options = getConfig();
        if (this.options.appId === DEFAULT_APP_ID) {
            throw new Error(`appId must be required`);
        }
        this._isFetchSupported = false;
        if (window.__YCNETWORK__) {
            throw new Error(`Network global initialization only once`);
        }
        if (window.fetch)
            this._isFetchSupported = isNative(window.fetch);
        if (this.options.overrideFetch)
            this.overrideFetch();
        if (this.options.overrideXhr)
            this.overrideXhr();
        window.__YCNETWORK__ = this;
    }
    overrideXhr() {
        const winXhrProto = window.XMLHttpRequest.prototype;
        const originOpen = (this._originOpen = winXhrProto.open);
        const originSend = (this._originSend = winXhrProto.send);
        const originSetRequestHeader = (this._originSetRequestHeader =
            winXhrProto.setRequestHeader);
        const self = this;
        let xhrRequest;
        winXhrProto.open = function () {
            const xhr = this;
            xhr.addEventListener('readystatechange', function () {
            });
            originOpen.apply(this, arguments);
            xhrRequest = new XhrRequest(self.options, this);
        };
        winXhrProto.setRequestHeader = function (name, value) {
            xhrRequest.addHeader(name, value);
        };
        winXhrProto.send = function () {
            xhrRequest.setRequestHeader(originSetRequestHeader);
            originSend.apply(this, arguments);
        };
    }
    overrideFetch() {
        if (!this._isFetchSupported)
            return;
        const originFetch = (this._originFetch = window.fetch);
        const self = this;
        window.fetch = function (input, init) {
            const req = new FetchRequest(self.options, input, init);
            return req.request(originFetch);
        };
    }
    restoreFetch() {
        if (!this._isFetchSupported)
            return;
        if (this._originFetch)
            window.fetch = this._originFetch;
    }
    restoreXhr() {
        const winXhrProto = window.XMLHttpRequest.prototype;
        if (this._originOpen) {
            winXhrProto.open = this._originOpen;
        }
        if (this._originSend)
            winXhrProto.send = this._originSend;
        if (this._originSetRequestHeader) {
            winXhrProto.setRequestHeader = this._originSetRequestHeader;
        }
    }
}

const VERSION = '1.0.1';

exports.VERSION = VERSION;
exports.default = Network;
//# sourceMappingURL=haiv.js.map
