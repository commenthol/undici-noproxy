# undici-noproxy

> no_proxy ProxyAgent for undici

An [undici ProxyAgent](https://undici.nodejs.org/#/docs/api/ProxyAgent) which considers `http(s)_proxy` and `no_proxy` env-vars or settings. 

# usage

```
npm i undici-noproxy
```

## proxy settings in code

```js
import { request } from 'undici'
import { NoProxyAgent } from 'undici-noproxy'

const proxyAgent = new NoProxyAgent({
  uri: 'http://my-http.proxy',
  protocol: 'http',
  noProxy: 'localhost,.my.domain'
})

const res = await request('https://httpbin.org/anything', { dispatcher: proxyAgent })
const json = await res.body.json()
proxyAgent.close()
```

## proxy settings via env vars

```
http_proxy=http://my-http.proxy
no_proxy=localhost,.my.domain
```

`NoProxyAgent` considers the settings from the given env-vars...

```js
import { request } from 'undici'
import { NoProxyAgent } from 'undici-noproxy'

const proxyAgent = new NoProxyAgent()

const res = await request('https://httpbin.org/anything', { dispatcher: proxyAgent })
const json = await res.body.json()
proxyAgent.close()
```

## with global dispatcher

```js
import { fetch, setGlobalDispatcher } from 'undici'
import { NoProxyAgent } from 'undici-noproxy'
const proxyAgent = new NoProxyAgent()

setGlobalDispatcher(proxyAgent)

const res = await fetch(url)
const json = await res.json()
```


# license

MIT licensed
