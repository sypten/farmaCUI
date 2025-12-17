import { e as createComponent, m as maybeRenderHead, h as addAttribute, r as renderTemplate, k as renderComponent } from './astro/server_B4bjZISI.mjs';
import 'piccolore';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import require$$0$1 from '@supabase/functions-js';
import require$$1 from '@supabase/postgrest-js';
import require$$2 from '@supabase/realtime-js';
import require$$3 from '@supabase/storage-js';
import require$$0 from '@supabase/auth-js';
import { persistentMap } from '@nanostores/persistent';
import 'clsx';
/* empty css                          */

function _mergeNamespaces(n, m) {
	for (var i = 0; i < m.length; i++) {
		const e = m[i];
		if (typeof e !== 'string' && !Array.isArray(e)) { for (const k in e) {
			if (k !== 'default' && !(k in n)) {
				const d = Object.getOwnPropertyDescriptor(e, k);
				if (d) {
					Object.defineProperty(n, k, d.get ? d : {
						enumerable: true,
						get: () => e[k]
					});
				}
			}
		} }
	}
	return Object.freeze(Object.defineProperty(n, Symbol.toStringTag, { value: 'Module' }));
}

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

var main = {};

var SupabaseClient$1 = {};

var constants = {};

var version = {};

var hasRequiredVersion;

function requireVersion () {
	if (hasRequiredVersion) return version;
	hasRequiredVersion = 1;
	Object.defineProperty(version, "__esModule", { value: true });
	version.version = void 0;
	// Generated automatically during releases by scripts/update-version-files.ts
	// This file provides runtime access to the package version for:
	// - HTTP request headers (e.g., X-Client-Info header for API requests)
	// - Debugging and support (identifying which version is running)
	// - Telemetry and logging (version reporting in errors/analytics)
	// - Ensuring build artifacts match the published package version
	version.version = '2.87.1';
	
	return version;
}

var hasRequiredConstants;

function requireConstants () {
	if (hasRequiredConstants) return constants;
	hasRequiredConstants = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.DEFAULT_REALTIME_OPTIONS = exports$1.DEFAULT_AUTH_OPTIONS = exports$1.DEFAULT_DB_OPTIONS = exports$1.DEFAULT_GLOBAL_OPTIONS = exports$1.DEFAULT_HEADERS = void 0;
		const version_1 = /*@__PURE__*/ requireVersion();
		let JS_ENV = '';
		// @ts-ignore
		if (typeof Deno !== 'undefined') {
		    JS_ENV = 'deno';
		}
		else if (typeof document !== 'undefined') {
		    JS_ENV = 'web';
		}
		else if (typeof navigator !== 'undefined' && navigator.product === 'ReactNative') {
		    JS_ENV = 'react-native';
		}
		else {
		    JS_ENV = 'node';
		}
		exports$1.DEFAULT_HEADERS = { 'X-Client-Info': `supabase-js-${JS_ENV}/${version_1.version}` };
		exports$1.DEFAULT_GLOBAL_OPTIONS = {
		    headers: exports$1.DEFAULT_HEADERS,
		};
		exports$1.DEFAULT_DB_OPTIONS = {
		    schema: 'public',
		};
		exports$1.DEFAULT_AUTH_OPTIONS = {
		    autoRefreshToken: true,
		    persistSession: true,
		    detectSessionInUrl: true,
		    flowType: 'implicit',
		};
		exports$1.DEFAULT_REALTIME_OPTIONS = {};
		
	} (constants));
	return constants;
}

var fetch$1 = {};

var hasRequiredFetch;

function requireFetch () {
	if (hasRequiredFetch) return fetch$1;
	hasRequiredFetch = 1;
	(function (exports$1) {
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.fetchWithAuth = exports$1.resolveHeadersConstructor = exports$1.resolveFetch = void 0;
		const resolveFetch = (customFetch) => {
		    if (customFetch) {
		        return (...args) => customFetch(...args);
		    }
		    return (...args) => fetch(...args);
		};
		exports$1.resolveFetch = resolveFetch;
		const resolveHeadersConstructor = () => {
		    return Headers;
		};
		exports$1.resolveHeadersConstructor = resolveHeadersConstructor;
		const fetchWithAuth = (supabaseKey, getAccessToken, customFetch) => {
		    const fetch = (0, exports$1.resolveFetch)(customFetch);
		    const HeadersConstructor = (0, exports$1.resolveHeadersConstructor)();
		    return async (input, init) => {
		        var _a;
		        const accessToken = (_a = (await getAccessToken())) !== null && _a !== void 0 ? _a : supabaseKey;
		        let headers = new HeadersConstructor(init === null || init === void 0 ? void 0 : init.headers);
		        if (!headers.has('apikey')) {
		            headers.set('apikey', supabaseKey);
		        }
		        if (!headers.has('Authorization')) {
		            headers.set('Authorization', `Bearer ${accessToken}`);
		        }
		        return fetch(input, Object.assign(Object.assign({}, init), { headers }));
		    };
		};
		exports$1.fetchWithAuth = fetchWithAuth;
		
	} (fetch$1));
	return fetch$1;
}

var helpers = {};

var hasRequiredHelpers;

function requireHelpers () {
	if (hasRequiredHelpers) return helpers;
	hasRequiredHelpers = 1;
	Object.defineProperty(helpers, "__esModule", { value: true });
	helpers.isBrowser = void 0;
	helpers.uuid = uuid;
	helpers.ensureTrailingSlash = ensureTrailingSlash;
	helpers.applySettingDefaults = applySettingDefaults;
	helpers.validateSupabaseUrl = validateSupabaseUrl;
	function uuid() {
	    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
	        var r = (Math.random() * 16) | 0, v = c == 'x' ? r : (r & 0x3) | 0x8;
	        return v.toString(16);
	    });
	}
	function ensureTrailingSlash(url) {
	    return url.endsWith('/') ? url : url + '/';
	}
	const isBrowser = () => typeof window !== 'undefined';
	helpers.isBrowser = isBrowser;
	function applySettingDefaults(options, defaults) {
	    var _a, _b;
	    const { db: dbOptions, auth: authOptions, realtime: realtimeOptions, global: globalOptions, } = options;
	    const { db: DEFAULT_DB_OPTIONS, auth: DEFAULT_AUTH_OPTIONS, realtime: DEFAULT_REALTIME_OPTIONS, global: DEFAULT_GLOBAL_OPTIONS, } = defaults;
	    const result = {
	        db: Object.assign(Object.assign({}, DEFAULT_DB_OPTIONS), dbOptions),
	        auth: Object.assign(Object.assign({}, DEFAULT_AUTH_OPTIONS), authOptions),
	        realtime: Object.assign(Object.assign({}, DEFAULT_REALTIME_OPTIONS), realtimeOptions),
	        storage: {},
	        global: Object.assign(Object.assign(Object.assign({}, DEFAULT_GLOBAL_OPTIONS), globalOptions), { headers: Object.assign(Object.assign({}, ((_a = DEFAULT_GLOBAL_OPTIONS === null || DEFAULT_GLOBAL_OPTIONS === void 0 ? void 0 : DEFAULT_GLOBAL_OPTIONS.headers) !== null && _a !== void 0 ? _a : {})), ((_b = globalOptions === null || globalOptions === void 0 ? void 0 : globalOptions.headers) !== null && _b !== void 0 ? _b : {})) }),
	        accessToken: async () => '',
	    };
	    if (options.accessToken) {
	        result.accessToken = options.accessToken;
	    }
	    else {
	        // hack around Required<>
	        delete result.accessToken;
	    }
	    return result;
	}
	/**
	 * Validates a Supabase client URL
	 *
	 * @param {string} supabaseUrl - The Supabase client URL string.
	 * @returns {URL} - The validated base URL.
	 * @throws {Error}
	 */
	function validateSupabaseUrl(supabaseUrl) {
	    const trimmedUrl = supabaseUrl === null || supabaseUrl === void 0 ? void 0 : supabaseUrl.trim();
	    if (!trimmedUrl) {
	        throw new Error('supabaseUrl is required.');
	    }
	    if (!trimmedUrl.match(/^https?:\/\//i)) {
	        throw new Error('Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.');
	    }
	    try {
	        return new URL(ensureTrailingSlash(trimmedUrl));
	    }
	    catch (_a) {
	        throw Error('Invalid supabaseUrl: Provided URL is malformed.');
	    }
	}
	
	return helpers;
}

var SupabaseAuthClient = {};

var hasRequiredSupabaseAuthClient;

function requireSupabaseAuthClient () {
	if (hasRequiredSupabaseAuthClient) return SupabaseAuthClient;
	hasRequiredSupabaseAuthClient = 1;
	Object.defineProperty(SupabaseAuthClient, "__esModule", { value: true });
	SupabaseAuthClient.SupabaseAuthClient = void 0;
	const auth_js_1 = require$$0;
	let SupabaseAuthClient$1 = class SupabaseAuthClient extends auth_js_1.AuthClient {
	    constructor(options) {
	        super(options);
	    }
	};
	SupabaseAuthClient.SupabaseAuthClient = SupabaseAuthClient$1;
	
	return SupabaseAuthClient;
}

var hasRequiredSupabaseClient;

function requireSupabaseClient () {
	if (hasRequiredSupabaseClient) return SupabaseClient$1;
	hasRequiredSupabaseClient = 1;
	Object.defineProperty(SupabaseClient$1, "__esModule", { value: true });
	const functions_js_1 = require$$0$1;
	const postgrest_js_1 = require$$1;
	const realtime_js_1 = require$$2;
	const storage_js_1 = require$$3;
	const constants_1 = /*@__PURE__*/ requireConstants();
	const fetch_1 = /*@__PURE__*/ requireFetch();
	const helpers_1 = /*@__PURE__*/ requireHelpers();
	const SupabaseAuthClient_1 = /*@__PURE__*/ requireSupabaseAuthClient();
	/**
	 * Supabase Client.
	 *
	 * An isomorphic Javascript client for interacting with Postgres.
	 */
	class SupabaseClient {
	    /**
	     * Create a new client for use in the browser.
	     * @param supabaseUrl The unique Supabase URL which is supplied when you create a new project in your project dashboard.
	     * @param supabaseKey The unique Supabase Key which is supplied when you create a new project in your project dashboard.
	     * @param options.db.schema You can switch in between schemas. The schema needs to be on the list of exposed schemas inside Supabase.
	     * @param options.auth.autoRefreshToken Set to "true" if you want to automatically refresh the token before expiring.
	     * @param options.auth.persistSession Set to "true" if you want to automatically save the user session into local storage.
	     * @param options.auth.detectSessionInUrl Set to "true" if you want to automatically detects OAuth grants in the URL and signs in the user.
	     * @param options.realtime Options passed along to realtime-js constructor.
	     * @param options.storage Options passed along to the storage-js constructor.
	     * @param options.global.fetch A custom fetch implementation.
	     * @param options.global.headers Any additional headers to send with each network request.
	     * @example
	     * ```ts
	     * import { createClient } from '@supabase/supabase-js'
	     *
	     * const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')
	     * const { data } = await supabase.from('profiles').select('*')
	     * ```
	     */
	    constructor(supabaseUrl, supabaseKey, options) {
	        var _a, _b, _c;
	        this.supabaseUrl = supabaseUrl;
	        this.supabaseKey = supabaseKey;
	        const baseUrl = (0, helpers_1.validateSupabaseUrl)(supabaseUrl);
	        if (!supabaseKey)
	            throw new Error('supabaseKey is required.');
	        this.realtimeUrl = new URL('realtime/v1', baseUrl);
	        this.realtimeUrl.protocol = this.realtimeUrl.protocol.replace('http', 'ws');
	        this.authUrl = new URL('auth/v1', baseUrl);
	        this.storageUrl = new URL('storage/v1', baseUrl);
	        this.functionsUrl = new URL('functions/v1', baseUrl);
	        // default storage key uses the supabase project ref as a namespace
	        const defaultStorageKey = `sb-${baseUrl.hostname.split('.')[0]}-auth-token`;
	        const DEFAULTS = {
	            db: constants_1.DEFAULT_DB_OPTIONS,
	            realtime: constants_1.DEFAULT_REALTIME_OPTIONS,
	            auth: Object.assign(Object.assign({}, constants_1.DEFAULT_AUTH_OPTIONS), { storageKey: defaultStorageKey }),
	            global: constants_1.DEFAULT_GLOBAL_OPTIONS,
	        };
	        const settings = (0, helpers_1.applySettingDefaults)(options !== null && options !== void 0 ? options : {}, DEFAULTS);
	        this.storageKey = (_a = settings.auth.storageKey) !== null && _a !== void 0 ? _a : '';
	        this.headers = (_b = settings.global.headers) !== null && _b !== void 0 ? _b : {};
	        if (!settings.accessToken) {
	            this.auth = this._initSupabaseAuthClient((_c = settings.auth) !== null && _c !== void 0 ? _c : {}, this.headers, settings.global.fetch);
	        }
	        else {
	            this.accessToken = settings.accessToken;
	            this.auth = new Proxy({}, {
	                get: (_, prop) => {
	                    throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(prop)} is not possible`);
	                },
	            });
	        }
	        this.fetch = (0, fetch_1.fetchWithAuth)(supabaseKey, this._getAccessToken.bind(this), settings.global.fetch);
	        this.realtime = this._initRealtimeClient(Object.assign({ headers: this.headers, accessToken: this._getAccessToken.bind(this) }, settings.realtime));
	        if (this.accessToken) {
	            // Start auth immediately to avoid race condition with channel subscriptions
	            this.accessToken()
	                .then((token) => this.realtime.setAuth(token))
	                .catch((e) => console.warn('Failed to set initial Realtime auth token:', e));
	        }
	        this.rest = new postgrest_js_1.PostgrestClient(new URL('rest/v1', baseUrl).href, {
	            headers: this.headers,
	            schema: settings.db.schema,
	            fetch: this.fetch,
	        });
	        this.storage = new storage_js_1.StorageClient(this.storageUrl.href, this.headers, this.fetch, options === null || options === void 0 ? void 0 : options.storage);
	        if (!settings.accessToken) {
	            this._listenForAuthEvents();
	        }
	    }
	    /**
	     * Supabase Functions allows you to deploy and invoke edge functions.
	     */
	    get functions() {
	        return new functions_js_1.FunctionsClient(this.functionsUrl.href, {
	            headers: this.headers,
	            customFetch: this.fetch,
	        });
	    }
	    /**
	     * Perform a query on a table or a view.
	     *
	     * @param relation - The table or view name to query
	     */
	    from(relation) {
	        return this.rest.from(relation);
	    }
	    // NOTE: signatures must be kept in sync with PostgrestClient.schema
	    /**
	     * Select a schema to query or perform an function (rpc) call.
	     *
	     * The schema needs to be on the list of exposed schemas inside Supabase.
	     *
	     * @param schema - The schema to query
	     */
	    schema(schema) {
	        return this.rest.schema(schema);
	    }
	    // NOTE: signatures must be kept in sync with PostgrestClient.rpc
	    /**
	     * Perform a function call.
	     *
	     * @param fn - The function name to call
	     * @param args - The arguments to pass to the function call
	     * @param options - Named parameters
	     * @param options.head - When set to `true`, `data` will not be returned.
	     * Useful if you only need the count.
	     * @param options.get - When set to `true`, the function will be called with
	     * read-only access mode.
	     * @param options.count - Count algorithm to use to count rows returned by the
	     * function. Only applicable for [set-returning
	     * functions](https://www.postgresql.org/docs/current/functions-srf.html).
	     *
	     * `"exact"`: Exact but slow count algorithm. Performs a `COUNT(*)` under the
	     * hood.
	     *
	     * `"planned"`: Approximated but fast count algorithm. Uses the Postgres
	     * statistics under the hood.
	     *
	     * `"estimated"`: Uses exact count for low numbers and planned count for high
	     * numbers.
	     */
	    rpc(fn, args = {}, options = {
	        head: false,
	        get: false,
	        count: undefined,
	    }) {
	        return this.rest.rpc(fn, args, options);
	    }
	    /**
	     * Creates a Realtime channel with Broadcast, Presence, and Postgres Changes.
	     *
	     * @param {string} name - The name of the Realtime channel.
	     * @param {Object} opts - The options to pass to the Realtime channel.
	     *
	     */
	    channel(name, opts = { config: {} }) {
	        return this.realtime.channel(name, opts);
	    }
	    /**
	     * Returns all Realtime channels.
	     */
	    getChannels() {
	        return this.realtime.getChannels();
	    }
	    /**
	     * Unsubscribes and removes Realtime channel from Realtime client.
	     *
	     * @param {RealtimeChannel} channel - The name of the Realtime channel.
	     *
	     */
	    removeChannel(channel) {
	        return this.realtime.removeChannel(channel);
	    }
	    /**
	     * Unsubscribes and removes all Realtime channels from Realtime client.
	     */
	    removeAllChannels() {
	        return this.realtime.removeAllChannels();
	    }
	    async _getAccessToken() {
	        var _a, _b;
	        if (this.accessToken) {
	            return await this.accessToken();
	        }
	        const { data } = await this.auth.getSession();
	        return (_b = (_a = data.session) === null || _a === void 0 ? void 0 : _a.access_token) !== null && _b !== void 0 ? _b : this.supabaseKey;
	    }
	    _initSupabaseAuthClient({ autoRefreshToken, persistSession, detectSessionInUrl, storage, userStorage, storageKey, flowType, lock, debug, throwOnError, }, headers, fetch) {
	        const authHeaders = {
	            Authorization: `Bearer ${this.supabaseKey}`,
	            apikey: `${this.supabaseKey}`,
	        };
	        return new SupabaseAuthClient_1.SupabaseAuthClient({
	            url: this.authUrl.href,
	            headers: Object.assign(Object.assign({}, authHeaders), headers),
	            storageKey: storageKey,
	            autoRefreshToken,
	            persistSession,
	            detectSessionInUrl,
	            storage,
	            userStorage,
	            flowType,
	            lock,
	            debug,
	            throwOnError,
	            fetch,
	            // auth checks if there is a custom authorizaiton header using this flag
	            // so it knows whether to return an error when getUser is called with no session
	            hasCustomAuthorizationHeader: Object.keys(this.headers).some((key) => key.toLowerCase() === 'authorization'),
	        });
	    }
	    _initRealtimeClient(options) {
	        return new realtime_js_1.RealtimeClient(this.realtimeUrl.href, Object.assign(Object.assign({}, options), { params: Object.assign({ apikey: this.supabaseKey }, options === null || options === void 0 ? void 0 : options.params) }));
	    }
	    _listenForAuthEvents() {
	        const data = this.auth.onAuthStateChange((event, session) => {
	            this._handleTokenChanged(event, 'CLIENT', session === null || session === void 0 ? void 0 : session.access_token);
	        });
	        return data;
	    }
	    _handleTokenChanged(event, source, token) {
	        if ((event === 'TOKEN_REFRESHED' || event === 'SIGNED_IN') &&
	            this.changedAccessToken !== token) {
	            this.changedAccessToken = token;
	            this.realtime.setAuth(token);
	        }
	        else if (event === 'SIGNED_OUT') {
	            this.realtime.setAuth();
	            if (source == 'STORAGE')
	                this.auth.signOut();
	            this.changedAccessToken = undefined;
	        }
	    }
	}
	SupabaseClient$1.default = SupabaseClient;
	
	return SupabaseClient$1;
}

var hasRequiredMain;

function requireMain () {
	if (hasRequiredMain) return main;
	hasRequiredMain = 1;
	(function (exports$1) {
		var __createBinding = (main && main.__createBinding) || (Object.create ? (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    var desc = Object.getOwnPropertyDescriptor(m, k);
		    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
		      desc = { enumerable: true, get: function() { return m[k]; } };
		    }
		    Object.defineProperty(o, k2, desc);
		}) : (function(o, m, k, k2) {
		    if (k2 === undefined) k2 = k;
		    o[k2] = m[k];
		}));
		var __exportStar = (main && main.__exportStar) || function(m, exports$1) {
		    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports$1, p)) __createBinding(exports$1, m, p);
		};
		var __importDefault = (main && main.__importDefault) || function (mod) {
		    return (mod && mod.__esModule) ? mod : { "default": mod };
		};
		Object.defineProperty(exports$1, "__esModule", { value: true });
		exports$1.createClient = exports$1.SupabaseClient = exports$1.FunctionRegion = exports$1.FunctionsError = exports$1.FunctionsRelayError = exports$1.FunctionsFetchError = exports$1.FunctionsHttpError = exports$1.PostgrestError = void 0;
		const SupabaseClient_1 = __importDefault(/*@__PURE__*/ requireSupabaseClient());
		__exportStar(require$$0, exports$1);
		var postgrest_js_1 = require$$1;
		Object.defineProperty(exports$1, "PostgrestError", { enumerable: true, get: function () { return postgrest_js_1.PostgrestError; } });
		var functions_js_1 = require$$0$1;
		Object.defineProperty(exports$1, "FunctionsHttpError", { enumerable: true, get: function () { return functions_js_1.FunctionsHttpError; } });
		Object.defineProperty(exports$1, "FunctionsFetchError", { enumerable: true, get: function () { return functions_js_1.FunctionsFetchError; } });
		Object.defineProperty(exports$1, "FunctionsRelayError", { enumerable: true, get: function () { return functions_js_1.FunctionsRelayError; } });
		Object.defineProperty(exports$1, "FunctionsError", { enumerable: true, get: function () { return functions_js_1.FunctionsError; } });
		Object.defineProperty(exports$1, "FunctionRegion", { enumerable: true, get: function () { return functions_js_1.FunctionRegion; } });
		__exportStar(require$$2, exports$1);
		var SupabaseClient_2 = /*@__PURE__*/ requireSupabaseClient();
		Object.defineProperty(exports$1, "SupabaseClient", { enumerable: true, get: function () { return __importDefault(SupabaseClient_2).default; } });
		/**
		 * Creates a new Supabase Client.
		 *
		 * @example
		 * ```ts
		 * import { createClient } from '@supabase/supabase-js'
		 *
		 * const supabase = createClient('https://xyzcompany.supabase.co', 'public-anon-key')
		 * const { data, error } = await supabase.from('profiles').select('*')
		 * ```
		 */
		const createClient = (supabaseUrl, supabaseKey, options) => {
		    return new SupabaseClient_1.default(supabaseUrl, supabaseKey, options);
		};
		exports$1.createClient = createClient;
		// Check for Node.js <= 18 deprecation
		function shouldShowDeprecationWarning() {
		    // Skip in browser environments
		    if (typeof window !== 'undefined') {
		        return false;
		    }
		    // Skip if process is not available (e.g., Edge Runtime)
		    if (typeof process === 'undefined') {
		        return false;
		    }
		    // Use dynamic property access to avoid Next.js Edge Runtime static analysis warnings
		    const processVersion = process['version'];
		    if (processVersion === undefined || processVersion === null) {
		        return false;
		    }
		    const versionMatch = processVersion.match(/^v(\d+)\./);
		    if (!versionMatch) {
		        return false;
		    }
		    const majorVersion = parseInt(versionMatch[1], 10);
		    return majorVersion <= 18;
		}
		if (shouldShowDeprecationWarning()) {
		    console.warn(`⚠️  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. ` +
		        `Please upgrade to Node.js 20 or later. ` +
		        `For more information, visit: https://github.com/orgs/supabase/discussions/37217`);
		}
		
	} (main));
	return main;
}

var mainExports = /*@__PURE__*/ requireMain();
const index = /*@__PURE__*/getDefaultExportFromCjs(mainExports);

const index$1 = /*#__PURE__*/_mergeNamespaces({
	__proto__: null,
	default: index
}, [mainExports]);

const {
  PostgrestError,
  FunctionsHttpError,
  FunctionsFetchError,
  FunctionsRelayError,
  FunctionsError,
  FunctionRegion,
  SupabaseClient,
  createClient,
  GoTrueAdminApi,
  GoTrueClient,
  AuthAdminApi,
  AuthClient,
  navigatorLock,
  NavigatorLockAcquireTimeoutError,
  lockInternals,
  processLock,
  SIGN_OUT_SCOPES,
  AuthError,
  AuthApiError,
  AuthUnknownError,
  CustomAuthError,
  AuthSessionMissingError,
  AuthInvalidTokenResponseError,
  AuthInvalidCredentialsError,
  AuthImplicitGrantRedirectError,
  AuthPKCEGrantCodeExchangeError,
  AuthRetryableFetchError,
  AuthWeakPasswordError,
  AuthInvalidJwtError,
  isAuthError,
  isAuthApiError,
  isAuthSessionMissingError,
  isAuthImplicitGrantRedirectError,
  isAuthRetryableFetchError,
  isAuthWeakPasswordError,
  RealtimePresence,
  RealtimeChannel,
  RealtimeClient,
  REALTIME_LISTEN_TYPES,
  REALTIME_POSTGRES_CHANGES_LISTEN_EVENT,
  REALTIME_PRESENCE_LISTEN_EVENTS,
  REALTIME_SUBSCRIBE_STATES,
  REALTIME_CHANNEL_STATES,
} = index || index$1;

const supabaseUrl = "https://pksqsrkkkkbcylfrnzwd.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBrc3Fzcmtra2tiY3lsZnJuendkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2NDgwNDIsImV4cCI6MjA4MTIyNDA0Mn0.8nSNdxy13GTzMvL7VCNqGUKN_otHaesBmjkocm4g8mI";
const supabase = createClient(supabaseUrl, supabaseKey);

function SearchWidget() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef(null);
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);
  useEffect(() => {
    const timeOutId = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }
      setLoading(true);
      const { data, error } = await supabase.from("productos").select(`
            id, nombre, slug, precio,
            imagenes:imagenes_producto(url)
        `).ilike("nombre", `%${query}%`).limit(5);
      if (!error && data) {
        setResults(data);
        setShowDropdown(true);
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(timeOutId);
  }, [query]);
  const highlightMatch = (text, highlight) => {
    if (!highlight) return text;
    const regex = new RegExp(`(${highlight})`, "gi");
    const parts = text.split(regex);
    return parts.map(
      (part, index) => regex.test(part) ? /* @__PURE__ */ jsx("strong", { className: "text-farma-primary font-extrabold", children: part }, index) : part
    );
  };
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    window.location.href = `/buscar?q=${query}`;
  };
  return /* @__PURE__ */ jsxs("div", { ref: wrapperRef, className: "relative w-full max-w-lg", children: [
    /* @__PURE__ */ jsxs("form", { onSubmit: handleSearchSubmit, className: "relative", children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          value: query,
          onChange: (e) => {
            setQuery(e.target.value);
            setShowDropdown(true);
          },
          onFocus: () => query.length >= 2 && setShowDropdown(true),
          placeholder: "Buscar medicamentos, marcas...",
          className: "w-full border border-farma-muted rounded-full py-2 px-4 pl-10 focus:outline-none focus:border-farma-primary focus:ring-1 focus:ring-farma-primary bg-white text-farma-text"
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "absolute left-3 top-2.5 text-gray-400", children: loading ? /* @__PURE__ */ jsx("div", { className: "animate-spin h-5 w-5 border-2 border-farma-primary border-t-transparent rounded-full" }) : "🔍" })
    ] }),
    showDropdown && query.length >= 2 && /* @__PURE__ */ jsx("div", { className: "absolute top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden", children: loading ? (
      // Estado de carga (opcional, ya tenemos el spinner arriba, pero por si acaso)
      /* @__PURE__ */ jsx("div", { className: "p-4 text-center text-gray-400 text-sm", children: "Buscando..." })
    ) : results.length > 0 ? (
      // CASO A: HAY RESULTADOS
      /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("ul", { children: results.map((prod) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsxs(
          "a",
          {
            href: `/producto/${prod.slug}`,
            className: "flex items-center gap-4 p-3 hover:bg-farma-accent hover:bg-opacity-20 transition-colors border-b border-farma-muted last:border-0",
            children: [
              /* @__PURE__ */ jsx("div", { className: "flex-shrink-0 w-12 h-12 bg-white border border-farma-muted rounded overflow-hidden", children: /* @__PURE__ */ jsx(
                "img",
                {
                  src: prod.imagenes?.[0]?.url || "https://placehold.co/50",
                  alt: prod.nombre,
                  className: "w-full h-full object-cover"
                }
              ) }),
              /* @__PURE__ */ jsxs("div", { className: "flex-1 min-w-0", children: [
                /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-800 truncate", children: highlightMatch(prod.nombre, query) }),
                /* @__PURE__ */ jsxs("p", { className: "text-xs text-farma-primary font-bold", children: [
                  "$ ",
                  prod.precio.toLocaleString("es-AR")
                ] })
              ] })
            ]
          }
        ) }, prod.id)) }),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: `/buscar?q=${query}`,
            className: "block text-center text-xs text-farma-primary font-bold bg-white border-t border-farma-muted p-2 hover:underline",
            children: [
              'Ver todos los resultados para "',
              query,
              '"'
            ]
          }
        )
      ] })
    ) : (
      // CASO B: NO HAY RESULTADOS (NUEVO)
      /* @__PURE__ */ jsxs("div", { className: "p-6 text-center", children: [
        /* @__PURE__ */ jsx("p", { className: "text-4xl mb-2", children: "🤔" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-500 text-sm font-medium", children: "No encontramos coincidencias" }),
        /* @__PURE__ */ jsx("p", { className: "text-gray-400 text-xs mt-1", children: "Intenta con otro término o marca." })
      ] })
    ) })
  ] });
}

// 1. Creamos el almacén (Store)
// Usamos persistentMap para que se guarde en localStorage automáticamente.
// La clave 'farmacui-cart' es como se verá en el navegador.
const cart = persistentMap('farmacui-cart', {});

/**
 * Estructura de datos:
 * {
 * 'id_producto_1': { id, nombre, precio, imagen, cantidad: 2 },
 * 'id_producto_2': { id, nombre, precio, imagen, cantidad: 1 },
 * }
 */

// 2. Función para agregar productos
function addCartItem({ id, name, price, image, slug }) {
  const existingEntry = cart.get()[id];
  
  if (existingEntry) {
    // Si ya existe, le parseamos la info y sumamos 1
    // (localStorage guarda todo como texto, por eso JSON.parse/stringify)
    const item = JSON.parse(existingEntry);
    item.quantity += 1;
    cart.setKey(id, JSON.stringify(item));
  } else {
    // Si es nuevo, lo creamos con cantidad 1
    cart.setKey(id, JSON.stringify({
      id,
      name,
      price,
      image,
      slug,
      quantity: 1
    }));
  }
}

function CartCounter() {
  const [cartCount, setCartCount] = useState(0);
  const [session, setSession] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [userName, setUserName] = useState("");
  useEffect(() => {
    const unsubscribe = cart.subscribe((items) => {
      const values = Object.values(items).map((item) => JSON.parse(item));
      const total = values.reduce((acc, current) => acc + current.quantity, 0);
      setCartCount(total);
    });
    return () => unsubscribe();
  }, []);
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session: session2 } } = await supabase.auth.getSession();
      setSession(session2);
      if (session2) {
        const email = session2.user.email || "Usuario";
        const name = session2.user.user_metadata?.full_name || email.split("@")[0];
        setUserName(name);
        const { data: staff } = await supabase.from("usuarios_sistema").select("rol").eq("id", session2.user.id).single();
        setIsAdmin(!!staff);
      }
    };
    checkAuth();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === "SIGNED_OUT" || event === "SIGNED_IN") {
        checkAuth();
      }
    });
    return () => subscription?.unsubscribe();
  }, []);
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };
  return /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-4", children: [
    /* @__PURE__ */ jsxs(
      "a",
      {
        href: "/carrito",
        className: "relative p-2 text-farma-text hover:text-farma-primary transition",
        "aria-label": "Ver Carrito",
        children: [
          /* @__PURE__ */ jsx(
            "svg",
            {
              xmlns: "http://www.w3.org/2000/svg",
              className: "h-6 w-6",
              fill: "none",
              viewBox: "0 0 24 24",
              stroke: "currentColor",
              children: /* @__PURE__ */ jsx(
                "path",
                {
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  strokeWidth: "2",
                  d: "M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                }
              )
            }
          ),
          cartCount > 0 && /* @__PURE__ */ jsx("span", { className: "absolute -top-1 -right-1 bg-farma-error text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-bounce", children: cartCount })
        ]
      }
    ),
    /* @__PURE__ */ jsx("div", { className: "flex items-center gap-2 text-sm", children: session ? /* @__PURE__ */ jsxs("div", { className: "flex items-center gap-3", children: [
      /* @__PURE__ */ jsx("span", { className: "text-farma-text font-medium hidden lg:block truncate max-w-[100px]", children: userName }),
      isAdmin && /* @__PURE__ */ jsx(
        "a",
        {
          href: "/admin",
          className: "bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700 flex items-center gap-1 text-xs font-bold",
          title: "Admin",
          children: "⚙️"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/perfil",
          className: "bg-farma-accent/20 p-2 rounded-full hover:bg-farma-accent/40 transition text-farma-primary",
          title: "Mi Perfil",
          children: "👤"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleLogout,
          className: "text-farma-error hover:text-red-700 font-bold text-xs",
          children: "Salir"
        }
      )
    ] }) : /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/login",
          className: "font-medium text-farma-text hover:text-farma-primary px-2",
          children: "Ingresar"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          href: "/registro",
          className: "hidden sm:block bg-farma-primary text-white px-4 py-1.5 rounded-full font-bold hover:bg-farma-secondary transition shadow-sm text-xs",
          children: "Registrarse"
        }
      )
    ] }) })
  ] });
}

const $$CategoryNav = createComponent(async ($$result, $$props, $$slots) => {
  const { data: categorias } = await supabase.from("categorias").select("nombre, slug").order("nombre", { ascending: true });
  return renderTemplate`${maybeRenderHead()}<nav class="bg-farma-secondary text-white shadow-inner w-full border-t border-farma-secondary" data-astro-cid-t5k2tvbq> <div class="container mx-auto px-4" data-astro-cid-t5k2tvbq> <ul class="flex gap-6 overflow-x-auto text-sm font-medium whitespace-nowrap py-0 no-scrollbar" data-astro-cid-t5k2tvbq> <li class="flex-shrink-0" data-astro-cid-t5k2tvbq> <a href="/" class="block py-3 hover:text-farma-accent border-b-2 border-transparent hover:border-farma-accent transition-colors" data-astro-cid-t5k2tvbq>
Todas
</a> </li> ${categorias && categorias.map((cat) => renderTemplate`<li class="flex-shrink-0" data-astro-cid-t5k2tvbq> <a${addAttribute(`/categoria/${cat.slug}`, "href")} class="block py-3 hover:text-farma-accent border-b-2 border-transparent hover:border-farma-accent transition-colors capitalize" data-astro-cid-t5k2tvbq> ${cat.nombre} </a> </li>`)} </ul> </div> </nav> `;
}, "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/CategoryNav.astro", void 0);

const $$Header = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${maybeRenderHead()}<header class="bg-white shadow-sm sticky top-0 z-50"> <div class="container mx-auto px-4 py-3 flex items-center justify-between gap-4"> <a href="/" class="text-2xl font-black text-farma-primary flex items-center gap-2 hover:opacity-80 transition">
💊 FarmaCUI
</a> <div class="flex-1 max-w-lg hidden md:block mx-4"> ${renderComponent($$result, "SearchWidget", SearchWidget, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/SearchWidget.jsx", "client:component-export": "default" })} </div> ${renderComponent($$result, "CartCounter", CartCounter, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/CartCounter.jsx", "client:component-export": "default" })} </div> <div class="md:hidden px-4 pb-3"> ${renderComponent($$result, "SearchWidget", SearchWidget, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/SearchWidget.jsx", "client:component-export": "default" })} </div> ${renderComponent($$result, "CategoryNav", $$CategoryNav, {})} </header>`;
}, "C:/Users/yomin/Documents/Proyectos/farmaCUI/src/components/Header.astro", void 0);

export { $$Header as $, addCartItem as a, supabase as s };
