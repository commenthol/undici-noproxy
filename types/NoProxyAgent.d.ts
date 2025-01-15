/** @typedef {import('./types.d.ts').NoProxyAgentOptions} NoProxyAgentOptions */
export class NoProxyAgent extends Dispatcher {
    /**
     * @param {NoProxyAgentOptions|string} [opts]
     */
    constructor(opts?: NoProxyAgentOptions | string);
    close(): Promise<void>;
    [kAgent]: Agent;
    [kProxy]: {
        proxyUri?: string;
        protocol?: string;
        noProxy?: string | string[];
    } | undefined;
    [kMatcher]: any;
}
export type NoProxyAgentOptions = import("./types.d.ts").NoProxyAgentOptions;
import { Dispatcher } from 'undici';
declare const kAgent: unique symbol;
import { Agent } from 'undici';
declare const kProxy: unique symbol;
declare const kMatcher: unique symbol;
export {};
