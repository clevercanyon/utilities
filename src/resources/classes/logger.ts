/**
 * Logger utility class.
 */

import { $app, $class, $dom, $env, $fn, $http, $is, $json, $obj, $obp, $time, $url, $user, type $type } from '#index.ts';

/**
 * Constructor cache.
 */
let Logger: Constructor;

/**
 * Defines types.
 */
export type C9rProps = Partial<{
    endpoint: string;
    endpointToken: string;
    essential: boolean;
    listenForErrors: boolean;
    configMinutia: ConfigMinutia;
}>;
export type Constructor = {
    new (props?: C9rProps | Class): Class;
};
export type Class = $type.Utility & ClassInterface;
export type Interface = Class | WithContextInterface;

declare class ClassInterface {
    public endpoint: string;
    public endpointToken: string;
    public essential: boolean;
    public listenForErrors: boolean;
    public configMinutia: ConfigMinutia;
    public constructor(props?: C9rProps | Class);
    public withContext(context?: object, contextOptions?: WithContextOptions): WithContextInterface;
    public log(message: string, context?: object, level?: string): Promise<boolean>;
    public debug(message: string, context?: object): Promise<boolean>;
    public info(message: string, context?: object): Promise<boolean>;
    public warn(message: string, context?: object): Promise<boolean>;
    public error(message: string, context?: object): Promise<boolean>;
    public flush(): Promise<boolean>; // Flushes log entry queue.
}
type LogEntry = {
    dt: string;
    level: string;
    message: string;
    context: $type.Object;
};
type ConfigMinutia = {
    maxRetries: number;
    maxRetryFailures: number;
    retryAfterMultiplier: number;
    throttledFlushWaitTime: number;
    maxRetryFailuresExpiresAfter: number;
};
type WithContextOptions = Partial<{
    request: $type.Request;
    cfwExecutionContext: $type.cf.ExecutionContext;
    cfpExecutionContext: Parameters<$type.cf.PagesFunction>[0];
}>;
type WithContextInterface = {
    withContext(subcontext?: object, subcontextOptions?: WithContextOptions): WithContextInterface;
    log(message: string, subcontext?: object, level?: string): Promise<boolean>;
    debug(message: string, subcontext?: object): Promise<boolean>;
    info(message: string, subcontext?: object): Promise<boolean>;
    warn(message: string, subcontext?: object): Promise<boolean>;
    error(message: string, subcontext?: object): Promise<boolean>;
    flush(): Promise<boolean>; // Flushes log entry queue.
};

/**
 * Logger class factory.
 *
 * @returns Class constructor.
 */
export const getClass = (): Constructor => {
    if (Logger) return Logger;

    Logger = class extends $class.getUtility() implements Class {
        /**
         * Log endpoint.
         */
        public endpoint: string;

        /**
         * Log endpoint token.
         */
        public endpointToken: string;

        /**
         * Logging is essential?
         */
        public essential: boolean;

        /**
         * Listen for error events?
         */
        public listenForErrors: boolean;

        /**
         * Configuration minutia.
         */
        public configMinutia: ConfigMinutia;

        /**
         * Log entry queue.
         */
        protected queue: LogEntry[];

        /**
         * Retry failure counter.
         */
        protected retryFailures: number;

        /**
         * Max retry failures expiration time.
         */
        protected maxRetryFailuresExpirationTime: number;

        /**
         * Throttled flusher.
         */
        protected throttledFlush: $fn.ThrottledFunction<() => Promise<boolean>>;

        /**
         * Object constructor.
         *
         * @param props Props or instance.
         */
        public constructor(props?: C9rProps | Class) {
            super(); // Parent constructor.

            for (const [key, value] of $obj.keyAndSymbolEntries(props || {})) {
                this[key] = value; // Property assignments.
            }
            this.endpoint ??= $env.isWeb() ? 'https://workers.hop.gdn/utilities/api/logs/v1' : 'https://in.logs.betterstack.com/';
            this.endpointToken ??= $env.get($env.isTest() ? 'APP_TEST_LOGGER_BEARER_TOKEN' : 'APP_DEFAULT_LOGGER_BEARER_TOKEN', { type: 'string', default: '' });
            this.essential ??= this.endpointToken && this.endpointToken === $env.get('APP_CONSENT_LOGGER_BEARER_TOKEN') ? true : false;
            this.listenForErrors ??= this.endpointToken && this.endpointToken === $env.get('APP_AUDIT_LOGGER_BEARER_TOKEN') ? true : false;
            this.configMinutia ??= {
                maxRetries: 3,
                maxRetryFailures: 10,
                retryAfterMultiplier: $time.secondInMilliseconds,
                throttledFlushWaitTime: $time.secondInMilliseconds,
                maxRetryFailuresExpiresAfter: $time.minuteInMilliseconds * 30,
            };
            this.queue = []; // Initialize.
            this.retryFailures = this.maxRetryFailuresExpirationTime = 0; // Initialize.
            this.throttledFlush = $fn.throttle((): Promise<boolean> => this.flush(), { waitTime: this.configMinutia.throttledFlushWaitTime });

            if ($env.isNode()) {
                if (this.listenForErrors) listenForNodeErrors(this);
                flushBeforeNodeExits(this);
                //
            } else if ($env.isWeb()) {
                if (this.listenForErrors) listenForWebErrors(this);
                flushBeforeWebExits(this);
            }
            // {@see withContext()} for Cloudflare workers.
            // It has `waitUntil()` handling baked into it already.
            // Log uncaught errors using try/catch, or via Logpush; {@see https://o5p.me/QKF7MQ}.
        }

        /**
         * Gets `app` context data.
         *
         * @returns `app` context data promise.
         */
        protected async appContext(): Promise<$type.Object> {
            return jsonCloneObjectDeep({
                _: {
                    app: {
                        name: $app.pkgName(),
                        version: $app.pkgVersion(),
                        buildTime: $app.buildTime(),

                        baseURL: $app.hasBaseURL() ? $app.baseURL() : null,
                        brand: $app.hasBrandProps() ? $app.brand() : null,

                        config: $app.config(),
                        etcConfig: $app.etcConfig(),
                    },
                },
            });
        }

        /**
         * Gets `env` context data.
         *
         * @returns `env` context data promise.
         */
        protected async envContext(): Promise<$type.Object> {
            const isNode = $env.isNode(),
                isCFW = $env.isCFW(),
                isSSR = $env.isSSR(),
                isWeb = $env.isWeb();

            return jsonCloneObjectDeep({
                _: {
                    env: {
                        isNode,
                        isCFW,
                        isSSR,
                        isWeb,

                        isC10n: $env.isC10n(),
                        isVite: $env.isVite(),
                        isTest: $env.isTest(),

                        inDebugMode: $env.inDebugMode(),

                        ...(isNode
                            ? {
                                  arch: process.arch,
                                  platform: process.platform,
                                  versions: process.versions,

                                  // Node web servers must use {@see withContext()}.
                                  // At which point additional `env`, `user` context is merged in.
                                  // Be sure to pass the current `request` to {@see withContext()}.
                              }
                            : {}),
                        ...(isCFW
                            ? {
                                  isCFWViaMiniflare: $env.isCFWViaMiniflare(),
                                  // Cloudflare workers must use {@see withContext()}.
                                  // At which point additional `env`, `user` context is merged in.
                                  // Be sure to pass the current `request` to {@see withContext()}.
                              }
                            : {}),
                        ...(isWeb
                            ? {
                                  isLocal: $env.isLocal(),
                                  isLocalVite: $env.isLocalVite(),
                                  isWebViaJSDOM: $env.isWebViaJSDOM(),

                                  url: $url.current(),

                                  screenWidth: screen.width,
                                  screenHeight: screen.height,
                                  windowWidth: window.innerWidth,
                                  windowHeight: window.innerHeight,
                                  devicePixelRatio: window.devicePixelRatio,
                              }
                            : {}),
                    },
                },
            });
        }

        /**
         * Gets `user` context data.
         *
         * @returns `user` context data promise.
         */
        protected async userContext(): Promise<$type.Object> {
            return jsonCloneObjectDeep({
                _: {
                    user: {
                        ...($env.isNode()
                            ? {
                                  consentData: $user.consentData(),
                                  consentState: await $user.consentState(),

                                  // Node web servers must use {@see withContext()}.
                                  // At which point additional `env`, `user` context is merged in.
                                  // Be sure to pass the current `request` to {@see withContext()}.
                              }
                            : {}),
                        // Cloudflare workers must use {@see withContext()}.
                        // At which point additional `env`, `user` context is merged in.
                        // Be sure to pass the current `request` to {@see withContext()}.

                        ...($env.isWeb()
                            ? {
                                  isMajorCrawler: $user.isMajorCrawler(),
                                  hasGlobalPrivacy: $user.hasGlobalPrivacy(),

                                  agent: $user.agent(),
                                  languages: $user.languages(),

                                  consentData: $user.consentData(),
                                  consentState: await $user.consentState(),
                              }
                            : {}),
                    },
                },
            });
        }

        /**
         * Gets `request` context data.
         *
         * @returns `request` context data promise.
         */
        protected async requestContext(request: $type.Request): Promise<$type.Object> {
            return jsonCloneObjectDeep({
                _: {
                    env: {
                        isLocal: $env.isLocal(request),
                        isLocalVite: $env.isLocalVite(request),
                        url: request.url, // Request URL.
                    },
                    user: {
                        isMajorCrawler: $user.isMajorCrawler(request),
                        hasGlobalPrivacy: $user.hasGlobalPrivacy(request),

                        agent: $user.agent(request),
                        languages: $user.languages(request),

                        consentData: $user.consentData(request),
                        consentState: await $user.consentState(request),
                    },
                    request, // Request object properties also.
                },
            });
        }

        /**
         * Generates a with-context logger interface.
         *
         * @param   context        Context object with arbitrary data.
         * @param   contextOptions Options (all optional); {@see WithContextOptions}.
         *
         * @returns                With-context interface; {@see WithContextInterface}.
         */
        public withContext(context: object, contextOptions?: WithContextOptions): WithContextInterface {
            const contextOpts = $obj.defaults({}, contextOptions || {}) as WithContextOptions,
                withContextInterface = {
                    /**
                     * Generates a with-subcontext logger interface.
                     *
                     * Subcontext; i.e., supports unlimited contextual layers.
                     *
                     * @param   subcontext        Subcontext object with arbitrary data.
                     * @param   subcontextOptions Options (all optional); {@see WithContextOptions}.
                     *
                     * @returns                   With-subcontext interface; {@see WithContextInterface}.
                     */
                    withContext: (subcontext: object, subcontextOptions?: WithContextOptions): WithContextInterface => {
                        // We wait until the point at which logging occurs to produce clones.
                        // i.e., Allowing context to mutate at runtime. So no snapshots here.

                        return this.withContext(
                            $obj.mergeDeep(context, subcontext || {}), // Inherits current context data/opts.
                            $obj.mergeDeep(contextOpts, subcontextOptions || {}) as unknown as WithContextOptions,
                        );
                    },

                    /**
                     * Creates a log entry.
                     *
                     * @param   message    Message string.
                     * @param   subcontext Optional subcontext data.
                     * @param   level      Optional level. Default is `info`.
                     *
                     * @returns            Boolean promise. True on success.
                     */
                    log: async (message: string, subcontext?: object, level?: string): Promise<boolean> => {
                        // We wait until the point at which logging occurs to produce clones.
                        // i.e., Allowing context to mutate at runtime, then snapshot here.

                        const withContext = $obj.mergeDeep(
                            jsonCloneObjectDeep(context), // Inherits current context data/opts.
                            contextOpts.request ? this.requestContext(contextOpts.request) : {}, // Returns a clone.
                            jsonCloneObjectDeep(subcontext || {}), // Optionally, subcontext data also.
                        );
                        const logged = this.log(message, withContext, level);

                        if (contextOpts.cfwExecutionContext) {
                            contextOpts.cfwExecutionContext.waitUntil(logged);
                            //
                        } else if (contextOpts.cfpExecutionContext) {
                            contextOpts.cfpExecutionContext.waitUntil(logged);
                        }
                        return logged;
                    },

                    /**
                     * Creates a debug entry.
                     *
                     * @param   message    Message string.
                     * @param   subcontext Optional subcontext data.
                     *
                     * @returns            Boolean promise. True on success.
                     */
                    debug: async (message: string, subcontext?: object): Promise<boolean> => {
                        return withContextInterface.log(message, subcontext, 'debug');
                    },

                    /**
                     * Creates an info entry.
                     *
                     * @param   message    Message string.
                     * @param   subcontext Optional subcontext data.
                     *
                     * @returns            Boolean promise. True on success.
                     */
                    info: async (message: string, subcontext?: object): Promise<boolean> => {
                        return withContextInterface.log(message, subcontext, 'info');
                    },

                    /**
                     * Creates an warn entry.
                     *
                     * @param   message    Message string.
                     * @param   subcontext Optional subcontext data.
                     *
                     * @returns            Boolean promise. True on success.
                     */
                    warn: async (message: string, subcontext?: object): Promise<boolean> => {
                        return withContextInterface.log(message, subcontext, 'warn');
                    },

                    /**
                     * Creates an error entry.
                     *
                     * @param   message    Message string.
                     * @param   subcontext Optional subcontext data.
                     *
                     * @returns            Boolean promise. True on success.
                     */
                    error: async (message: string, subcontext?: object): Promise<boolean> => {
                        return withContextInterface.log(message, subcontext, 'error');
                    },

                    /**
                     * Flushes the log entry queue.
                     *
                     * @returns Boolean promise. True on success.
                     */
                    flush: async (): Promise<boolean> => {
                        const flushed = this.flush();

                        if (contextOpts.cfwExecutionContext) {
                            contextOpts.cfwExecutionContext.waitUntil(flushed);
                            //
                        } else if (contextOpts.cfpExecutionContext) {
                            contextOpts.cfpExecutionContext.waitUntil(flushed);
                        }
                        return flushed;
                    },
                };
            return withContextInterface;
        }

        /**
         * Creates a log entry.
         *
         * @param   message Message string.
         * @param   context Optional context data.
         * @param   level   Optional level. Default is `info`.
         *
         * @returns         Boolean promise. True on success.
         */
        public async log(message: string, context?: object, level?: string): Promise<boolean> {
            // We wait until the point at which logging occurs to produce clones.
            // i.e., Allowing context to mutate at runtime, then snapshot here.

            const fullContext = $obj.mergeDeep(
                await this.appContext(), // Returns a clone.
                await this.envContext(), // Returns a clone.
                await this.userContext(), // Returns a clone.
                jsonCloneObjectDeep(context || {}),
            );
            if (!this.essential /* If non-essential, check consent state before logging. */) {
                const canUse = $obp.get(fullContext, '_.user.consentState.canUse') as undefined | $user.ConsentState['canUse'];
                if (!canUse || !canUse.thirdParty || !canUse.analytics) {
                    return false; // Disallowed by consent state.
                }
            }
            const logEntry: LogEntry = {
                level: level || 'info',
                dt: new Date().toISOString(),
                message, // A message string.
                context: fullContext,
            };
            this.queue.push(logEntry);
            return this.throttledFlush();
        }

        /**
         * Creates a debug entry.
         *
         * @param   message Message string.
         * @param   context Optional context data.
         *
         * @returns         Boolean promise. True on success.
         */
        public async debug(message: string, context?: object): Promise<boolean> {
            return this.log(message, context, 'debug');
        }

        /**
         * Creates an info entry.
         *
         * @param   message Message string.
         * @param   context Optional context data.
         *
         * @returns         Boolean promise. True on success.
         */
        public async info(message: string, context?: object): Promise<boolean> {
            return this.log(message, context, 'info');
        }

        /**
         * Creates an warn entry.
         *
         * @param   message Message string.
         * @param   context Optional context data.
         *
         * @returns         Boolean promise. True on success.
         */
        public async warn(message: string, context?: object): Promise<boolean> {
            return this.log(message, context, 'warn');
        }

        /**
         * Creates an error entry.
         *
         * @param   message Message string.
         * @param   context Optional context data.
         *
         * @returns         Boolean promise. True on success.
         */
        public async error(message: string, context?: object): Promise<boolean> {
            return this.log(message, context, 'error');
        }

        /**
         * Flushes the log entry queue.
         *
         * @returns Boolean promise. True on success.
         */
        public async flush(): Promise<boolean> {
            const currentQueue = this.queue;
            this.queue = []; // Empties queue.

            if (
                !this.endpointToken ||
                (this.maxRetryFailuresExpirationTime && //
                    Date.now() <= this.maxRetryFailuresExpirationTime)
            ) {
                return false; // Loss of data in these cases.
            }
            if (!currentQueue.length) return true;

            let retryTimeout: $type.Timeout,
                retryAttempts = 0; // Initialize.
            const jsonStringifiedQueue = jsonStringifyQueue(currentQueue);

            const httpPost = (): Promise<boolean> => {
                return new Promise((resolve): void => {
                    void fetch(this.endpoint, {
                        keepalive: true,
                        method: 'POST',
                        headers: {
                            authorization: this.endpointToken,
                            'content-type': $json.contentType(),
                        },
                        body: jsonStringifiedQueue,
                        //
                    }).then((response: Response): void => {
                        if (!response.ok) {
                            if (retryAttempts >= this.configMinutia.maxRetries) {
                                if (++this.retryFailures >= this.configMinutia.maxRetryFailures) {
                                    // After X retry failures, suspend for X milliseconds.
                                    this.maxRetryFailuresExpirationTime = Date.now() + this.configMinutia.maxRetryFailuresExpiresAfter;
                                }
                                resolve(false); // Retry failure.
                            } else {
                                retryAttempts++;
                                clearTimeout(retryTimeout);
                                retryTimeout = setTimeout((): void => void httpPost(), retryAttempts * this.configMinutia.retryAfterMultiplier);
                            }
                        } else {
                            this.retryFailures--;
                            this.maxRetryFailuresExpirationTime = 0;
                            resolve(true);
                        }
                    });
                });
            };
            return httpPost();
        }
    };
    return Object.defineProperty(Logger, 'name', {
        ...Object.getOwnPropertyDescriptor(Logger, 'name'),
        value: 'Logger',
    });
};

// ---
// Misc utilities.

/**
 * Listens for node errors.
 *
 * @param logger {@see Interface}.
 *
 * @requiredEnv node
 */
const listenForNodeErrors = (logger: Interface): void => {
    process.on('uncaughtExceptionMonitor', (error: Error, origin: string): void => {
        void logger.error('[Error Event]: ' + error.message, {
            event: { type: 'error', error: error, origin },
        });
    });
};

/**
 * Flushes queue before Node process exits.
 *
 * @param logger {@see Interface}.
 *
 * @requiredEnv node
 */
const flushBeforeNodeExits = (logger: Interface): void => {
    // Prevents an endless loop.
    let flushedBeforeExit = false;

    process.on('beforeExit', (): void => {
        if (flushedBeforeExit) return;
        flushedBeforeExit = true;
        void logger.flush();
    });
};

/**
 * Listens for web errors.
 *
 * @param logger {@see Interface}.
 *
 * @requiredEnv web
 */
const listenForWebErrors = (logger: Interface): void => {
    const listener = $dom.on(window, 'error', (event: Event): void => {
        if (!(event instanceof ErrorEvent)) return; // Not applicable.
        if (!event.filename && event.message.toLowerCase().startsWith('script error')) {
            return; // Cross-origin error with no insight; {@see https://o5p.me/V2sBVp}.
        }
        void logger.error('[Error Event]: ' + event.message, {
            event: {
                type: event.type,
                error: event.error as $type.Error,
                file: event.filename + ':' + String(event.lineno) + ':' + String(event.colno),
            },
        });
        listener.cancel(); // Initial errors only.
    });
};

/**
 * Flushes queue before web visitor exits.
 *
 * @param logger {@see Interface}.
 *
 * @requiredEnv web
 */
const flushBeforeWebExits = (logger: Interface): void => {
    $dom.on(document, 'visibilitychange', (): void => {
        if ('hidden' === document.visibilityState) void logger.flush();
    });
};

/**
 * Converts queue into a JSON-encoded string.
 *
 * @param   queue Queue to convert into a JSON string.
 *
 * @returns       Queue converted into a JSON-encoded string.
 */
const jsonStringifyQueue = (queue: LogEntry[]): string => {
    return $json.stringify(queue, { middleware: jsonStringifyMiddleware });
};

/**
 * Produces a deep object clone using JSON stringify/parse.
 *
 * @param   object Object to clone deeply using JSON stringify/parse.
 *
 * @returns        Deep object clone using JSON stringify/parse.
 */
const jsonCloneObjectDeep = (object: object): $type.Object => {
    return $json.cloneDeep(object, { stringifyMiddleware: jsonStringifyMiddleware }) as $type.Object;
};

/**
 * {@see JSON.stringify()} middleware.
 *
 * @param   key   A JSON string key.
 * @param   value Any arbitrary value.
 *
 * @returns       Value to JSON-encode.
 */
const jsonStringifyMiddleware = (key: string, value: unknown): unknown => {
    if ($is.error(value)) {
        return {
            name: value.name,
            message: value.message,
            cause: value.cause,
            stack: value.stack,
        };
    } else if ($is.request(value)) {
        return {
            ...$obj.pick(Object.fromEntries($obj.allEntries(value)), [
                'method', //
                'destination',
                'url',
                'referrer',
                'referrerPolicy',
                'mode',
                'credentials',
                'cache',
                'redirect',
                'integrity',
                'keepalive',
                'isReloadNavigation',
                'isHistoryNavigation',
                'cf', // Cloudflare-specific.
            ]),
            headers: $http.extractHeaders(value.headers),
        };
    } else if ($is.response(value)) {
        return {
            ...$obj.pick(Object.fromEntries($obj.allEntries(value)), [
                'type', //
                'url',
                'redirected',
                'ok',
                'status',
                'statusText',
                'bodyUsed',
            ]),
            headers: $http.extractHeaders(value.headers),
        };
    }
    return value;
};
