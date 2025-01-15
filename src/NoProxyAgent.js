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

/** @typedef {import('./types.d.ts').NoProxyAgentOptions} NoProxyAgentOptions */

export class NoProxyAgent extends Dispatcher {
  /**
   * @param {NoProxyAgentOptions|string} [opts]
   */
  constructor(opts) {
    // @ts-ignore
    super(opts)
    // @ts-ignore
    this[kAgent] = new Agent(opts)
    this[kProxy] = buildProxyOptions(opts)
    // @ts-ignore
    this[kMatcher] = shouldProxy(this[kProxy])
  }

  /**
   * @param {Dispatcher.DispatchOptions} opts
   * @param {Dispatcher.DispatchHandler} handler
   * @returns
   */
  dispatch(opts, handler) {
    const { hostname, host } = new URL(opts.origin || '')

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

    return this[kAgent].dispatch(proxyOpts, handler)
  }

  async close() {
    await this[kAgent].close()
  }
}

/**
 * @param {object} opts
 * @returns {{proxyUri?: string, protocol?: string, noProxy?: string|string[]}|undefined}
 */
function buildProxyOptions(opts) {
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
