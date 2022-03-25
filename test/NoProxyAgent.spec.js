import assert from 'assert'
import { request, fetch, setGlobalDispatcher, Agent } from 'undici'
import { NoProxyAgent } from '../src/index.js'
import { buildProxy } from './support/proxy.js'

const itEnv = (envvar) => envvar ? it : it.skip
itEnv.only = (envvar) => envvar ? it.only : it.skip
itEnv.skip = () => it.skip

const {
  http_proxy: HTTP_PROXY,
  no_proxy: NO_PROXY
} = process.env

describe('proxy', function () {
  this.timeout(5000)
  let proxyServer
  let uri
  const url = 'http://httpbin.org/anything'

  before(async function () {
    proxyServer = await buildProxy(process.env.PORT)
    uri = `http://localhost:${proxyServer.address().port}`
  })
  after(function () {
    proxyServer.close()
  })

  it('shall proxy request', async function () {
    const proxyAgent = new NoProxyAgent({
      uri,
      protocol: 'http'
    })
    const res = await request(url, { dispatcher: proxyAgent })
    const json = await res.body.json()
    proxyAgent.close()
    assert.ok(/127\.0\.0\.1/.test(json.origin), json)
  })

  it('shall proxy request using a string as proxy-uri', async function () {
    const proxyAgent = new NoProxyAgent(uri)
    const res = await request(url, { dispatcher: proxyAgent })
    const json = await res.body.json()
    proxyAgent.close()
    assert.ok(/127\.0\.0\.1/.test(json.origin), json)
  })

  it('shall not proxy request', async function () {
    const proxyAgent = new NoProxyAgent({
      uri,
      noProxy: 'httpbin.org,localhost',
      protocol: 'http'
    })
    const res = await request(url, { dispatcher: proxyAgent })
    const json = await res.body.json()
    proxyAgent.close()
    assert.ok(!/127\.0\.0\.1/.test(json.origin), json)
  })

  itEnv(HTTP_PROXY && !NO_PROXY)('shall proxy request from http_proxy env var', async function () {
    const proxyAgent = new NoProxyAgent()
    const res = await request(url, { dispatcher: proxyAgent })
    const json = await res.body.json()
    proxyAgent.close()
    assert.ok(/127\.0\.0\.1/.test(json.origin), json)
  })

  itEnv(HTTP_PROXY && NO_PROXY)('shall not proxy request from http_proxy and no_proxy env var', async function () {
    const proxyAgent = new NoProxyAgent()
    const res = await request(url, { dispatcher: proxyAgent })
    const json = await res.body.json()
    proxyAgent.close()
    assert.ok(!/127\.0\.0\.1/.test(json.origin), json)
  })

  describe('fetch', function () {
    it('with global dispatcher', async function () {
      const proxyAgent = new NoProxyAgent(uri)
      setGlobalDispatcher(proxyAgent)
      const res = await fetch(url)
      const json = await res.json()
      proxyAgent.close()
      assert.ok(/127\.0\.0\.1/.test(json.origin), json)
    })

    it('without global dispatcher', async function () {
      const agent = new Agent()
      setGlobalDispatcher(agent)
      const res = await fetch(url)
      const json = await res.json()
      agent.close()
      assert.ok(!/127\.0\.0\.1/.test(json.origin), json)
    })
  })
})
