import { Agent, Dispatcher  } from 'undici';

interface EventEmitterOptions {
  /**
   * Enables automatic capturing of promise rejection.
   */
  captureRejections?: boolean | undefined;
}

export interface NoProxyAgentOptions extends EventEmitterOptions, Agent.Options {
  /** proxy uri */
  uri: string;
  /** used proxy protocol */
  protocol: 'https'|'http';
  /** no proxy domains or networks */
  noProxy?: string|string[];
}
