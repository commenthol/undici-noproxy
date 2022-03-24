# undici-noproxy

> no_proxy Agent for undici

# usage

```
npm i undici-noproxy
```

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

# license

MIT licensed
