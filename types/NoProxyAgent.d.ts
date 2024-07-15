/** @typedef {import('./types').NoProxyAgentOptions} NoProxyAgentOptions */
export class NoProxyAgent extends Dispatcher {
    /**
     * @param {NoProxyAgentOptions|string} [opts]
     */
    constructor(opts?: string | import("./types").NoProxyAgentOptions | undefined);
    close(): Promise<void>;
    [kAgent]: Agent;
    [kProxy]: {
        proxyUri?: string;
        protocol?: string;
        noProxy?: string | string[];
    } | undefined;
    [kMatcher]: (hostname: string) => boolean;
}
export type NoProxyAgentOptions = import("./types").NoProxyAgentOptions;
import { Dispatcher } from 'undici';
declare const kAgent: unique symbol;
import { Agent } from 'undici';
declare const kProxy: unique symbol;
declare const kMatcher: unique symbol;
export {};
