/**
 * SPDX-License-Identifier: MIT
 * @license MIT
 * @copyright commenthol, Matteo Collina and Undici contributors
 * @see https://github.com/nodejs/undici/blob/main/lib/proxy-agent.js
 */

import { Agent, Dispatcher } from 'undici'
import { usesProxy, shouldProxy } from 'uses-proxy'

const kProxy = Symbol('proxy agent options')
const kAgent = Symbol('proxy agent')
const kMatcher = Symbol('no proxy matcher')

export class NoProxyAgent extends Dispatcher {
  /**
   * @param {object | string} [opts] if string than used as proxyUri
   * @param {string} [opts.uri] proxy Url
   * @param {'http'|'https'} [opts.protocol='https']
   * @param {string|string[]} [opts.noProxy] no_proxy string
   * @param {(origin: URL, opts: Object) => Dispatcher)} [opts.factory]
   * @param {number} [opts.maxRedirections=0]
   */
  constructor (opts) {
    super(opts)
    this[kAgent] = new Agent(opts)
    this[kProxy] = buildProxyOptions(opts)
    this[kMatcher] = shouldProxy(this[kProxy])
  }

  dispatch (opts, handler) {
    const { hostname, host } = new URL(opts.origin)

    const doProxy = this[kMatcher](hostname)

    const proxyOpts = doProxy
      ? {
          ...opts,
          origin: this[kProxy]?.proxyUri,
          path: opts.origin + opts.path,
          headers: {
            ...opts.headers,
            host
          }
        }
      : opts

    return this[kAgent].dispatch(
      proxyOpts,
      handler
    )
  }

  async close () {
    await this[kAgent].close()
  }
}

function buildProxyOptions (opts) {
  if (typeof opts === 'string') {
    opts = { uri: opts }
  }

  if (opts?.uri) {
    return {
      proxyUri: opts.uri,
      protocol: opts.protocol || 'https',
      noProxy: opts.noProxy
    }
  }

  const { proxyUri, protocol, noProxy } = usesProxy()

  if (proxyUri) {
    return {
      proxyUri,
      protocol,
      noProxy
    }
  }
}
