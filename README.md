<h1 align="center">Welcome to Haiv 👋</h1>
<p>
  <img alt="Version" src="https://img.shields.io/badge/version-1.0.0-blue.svg?cacheSeconds=2592000" />
</p>

> XHR & Fetch API 拦截器

## Install

```sh
npm install --save haiv
```

## Run tests

```sh
npm run test
```

## How to use
```
import Network from 'haiv'
const request = new Network({
    appId: string
    header: Array<[string, string]>
    signature: boolean
    overrideFetch: boolean
    overrideXhr: boolean
})
```

## Author

👤 **zhiqiang@guanghe.tv**


## Show your support

Give a ⭐️ if this project helped you!

***
_This README was generated with ❤️ by [readme-md-generator](https://github.com/kefranabg/readme-md-generator)_
