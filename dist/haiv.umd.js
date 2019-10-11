(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = global || self, factory(global.Network = {}));
}(this, function (exports) { 'use strict';

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
  function toBoolean(value) {
      return value != null && `${value}` !== 'false';
  }
  function isPlainObject(value) {
      return toBoolean(value) && value.constructor.name === 'Object';
  }
  function fullUrl(url) {
      let link = document.createElement('a');
      link.href = url;
      return {
          protocol: link.protocol,
          host: link.host,
          pathname: link.pathname,
          search: link.search,
          hash: link.hash,
      };
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

  const APP_KEY = '54F89FB7-8E80-47A3-AD1A-9C60F17327FB';
  function sign(signParam) {
      const timestamp = Date.now().toString();
      const { url, clientChannel = '', clientType = '', clientVersion = '', device = '', } = signParam;
      const urlMeta = fullUrl(url);
      const api = getApiField(urlMeta);
      const query = getQueryField(urlMeta);
      const body = getBodyField(signParam.body);
      const signObj = [
          ['api', api],
          ['client-channel', clientChannel],
          ['client-type', clientType],
          ['client-version', clientVersion],
          ['device', device],
          ['timestamp', timestamp],
      ];
      return (`${APP_KEY}:` +
          [
              ...signObj.map(([key, value]) => {
                  return `${key}=${value}`;
              }),
              query,
              body,
          ].join('&'));
  }
  function getApiField(urlMeta) {
      return urlMeta.pathname;
  }
  function sortStr(a, b) {
      const aStart = a[0];
      const bStart = b[0];
      if (aStart < bStart)
          return -1;
      if (aStart > bStart)
          return 1;
      return 0;
  }
  function objectFormat() {
      return '';
  }
  function arrayFormat(array) {
      return array
          .filter(x => x && !isObject(x))
          .map(x => {
          if (isFinite(x)) {
              return parseInt(x, 10);
          }
          return `${x}`;
      })
          .filter(Boolean)
          .join(',');
  }
  function getQueryField(urlMeta) {
      return urlMeta.search
          .replace('?', '')
          .split('&')
          .sort(sortStr)
          .join('&');
  }
  function getBodyField(body) {
      if (isArray(body)) {
          return arrayFormat(body);
      }
      return Object.keys(body)
          .sort(sortStr)
          .map(key => {
          let val = body[key];
          if (isArray(val)) {
              val = arrayFormat(val);
          }
          else if (isObject(val)) {
              val = objectFormat();
          }
          else if (typeof val === 'boolean') {
              val = `${val}`;
          }
          else if (isFinite(val)) {
              val = parseInt(val, 10);
          }
          return val !== '' ? `${key}=${val}` : '';
      })
          .filter(Boolean)
          .join('&');
  }

  class FetchRequest {
      constructor(options, input, init) {
          this.options = options;
          this.input = input;
          this.init = init;
          this._requestId = `Req:${guid()}`;
      }
      setSign(url, body) {
          let signBody = {};
          if (typeof body === 'object') {
              signBody = body;
              let signVal = sign({ url, body: signBody });
              console.log('sign', signVal);
              this.options.headers.push(['sign', signVal]);
          }
      }
      needSign(headers) {
          if (!headers)
              return false;
          const optionHas = this.options.headers.some(([key, val]) => key === 'needSign' && val === 'y');
          let headersHas = false;
          if (headers instanceof Headers) {
              headersHas = headers.get('needSing') === 'y';
          }
          else if (isArray(headers)) {
              headersHas = headers.some(([key, val]) => key === 'needSign' && val === 'y');
          }
          else {
              headersHas = headers['needSign'] === 'y';
          }
          return optionHas || headersHas;
      }
      genRequestByObject(input) {
          const { url } = input, options = __rest(input, ["url"]);
          if (this.needSign(options.headers)) {
              this.setSign(url, options.body);
          }
          this.options.headers.forEach(([key, val]) => {
              options.headers.set(key, val);
          });
          return new Request(url, options);
      }
      genRequestByString(input, init = {}) {
          const options = __rest(init, []);
          if (this.needSign(options.headers)) {
              this.setSign(input, options.body);
          }
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
          console.log('fetchBody3', request.body);
          return originFetch(request);
      }
  }

  class XhrRequest {
      constructor(method, url, options, xhr) {
          this.options = options;
          this.xhr = xhr;
          this._requestId = `Xhr:${guid()}`;
          this.method = method;
          this.url = url;
          this.headers = {};
          this.addOptionsHeader();
      }
      addHeader(key, val) {
          this.headers[key] = val;
      }
      sign(body) {
          if (typeof body === 'string') {
              body = JSON.parse(body);
          }
          if (this.headers['needSign'] === 'y') {
              this.headers['sign'] = sign({ url: this.url, body });
              console.log('sign:', this.headers['sign']);
          }
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
          this.headers = {};
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
          winXhrProto.open = function (method, url) {
              const xhr = this;
              xhr.addEventListener('readystatechange', function () {
              });
              originOpen.apply(this, arguments);
              xhrRequest = new XhrRequest(method, url, self.options, this);
          };
          winXhrProto.setRequestHeader = function (name, value) {
              xhrRequest.addHeader(name, value);
          };
          winXhrProto.send = function (body) {
              if (typeof body === 'string' || isPlainObject(body)) {
                  xhrRequest.sign(body);
              }
              xhrRequest.setRequestHeader(originSetRequestHeader);
              originSend.call(this, body);
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

  const VERSION = '1.1.3';

  exports.VERSION = VERSION;
  exports.default = Network;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=haiv.umd.js.map
