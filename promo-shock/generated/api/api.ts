/* tslint:disable */
/* eslint-disable */
/**
 * FastAPI
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 0.1.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */


import type { Configuration } from './configuration';
import type { AxiosPromise, AxiosInstance, RawAxiosRequestConfig } from 'axios';
import globalAxios from 'axios';
// Some imports not used depending on template conditions
// @ts-ignore
import { DUMMY_BASE_URL, assertParamExists, setApiKeyToObject, setBasicAuthToObject, setBearerAuthToObject, setOAuthToObject, setSearchParams, serializeDataIfNeeded, toPathString, createRequestFunction } from './common';
import type { RequestArgs } from './base';
// @ts-ignore
import { BASE_PATH, COLLECTION_FORMATS, BaseAPI, RequiredError, operationServerMap } from './base';

/**
 * 
 * @export
 * @interface HTTPValidationError
 */
export interface HTTPValidationError {
    /**
     * 
     * @type {Array<ValidationError>}
     * @memberof HTTPValidationError
     */
    'detail'?: Array<ValidationError>;
}
/**
 * 
 * @export
 * @interface ResponseGetStreamTicketTicketAddrGet
 */
export interface ResponseGetStreamTicketTicketAddrGet {
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'owner_address': any;
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'sale_address': any;
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'ticket_address': any;
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'payment_token_address': any;
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'name': any;
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'description': any;
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'banner': any;
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'start_date': any;
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'sale_start_date': any;
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'sale_end_date': any;
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'stream_link': any;
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'streamer_link': any;
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'price': any;
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'total_amount': any;
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'reserved_amount': any;
    /**
     * 
     * @type {any}
     * @memberof ResponseGetStreamTicketTicketAddrGet
     */
    'purchased': any;
}
/**
 * 
 * @export
 * @interface Stream
 */
export interface Stream {
    /**
     * 
     * @type {File}
     * @memberof Stream
     */
    'owner_address': File;
    /**
     * 
     * @type {File}
     * @memberof Stream
     */
    'sale_address': File;
    /**
     * 
     * @type {File}
     * @memberof Stream
     */
    'ticket_address': File;
    /**
     * 
     * @type {File}
     * @memberof Stream
     */
    'payment_token_address': File;
    /**
     * 
     * @type {string}
     * @memberof Stream
     */
    'name': string;
    /**
     * 
     * @type {string}
     * @memberof Stream
     */
    'description': string;
    /**
     * 
     * @type {string}
     * @memberof Stream
     */
    'banner': string;
    /**
     * 
     * @type {number}
     * @memberof Stream
     */
    'start_date': number;
    /**
     * 
     * @type {number}
     * @memberof Stream
     */
    'sale_start_date': number;
    /**
     * 
     * @type {number}
     * @memberof Stream
     */
    'sale_end_date': number;
    /**
     * 
     * @type {string}
     * @memberof Stream
     */
    'stream_link': string;
    /**
     * 
     * @type {string}
     * @memberof Stream
     */
    'streamer_link': string;
    /**
     * 
     * @type {string}
     * @memberof Stream
     */
    'price': string;
    /**
     * 
     * @type {number}
     * @memberof Stream
     */
    'total_amount': number;
    /**
     * 
     * @type {number}
     * @memberof Stream
     */
    'reserved_amount': number;
    /**
     * 
     * @type {boolean}
     * @memberof Stream
     */
    'purchased': boolean;
}
/**
 * 
 * @export
 * @interface ValidationError
 */
export interface ValidationError {
    /**
     * 
     * @type {Array<ValidationErrorLocInner>}
     * @memberof ValidationError
     */
    'loc': Array<ValidationErrorLocInner>;
    /**
     * 
     * @type {string}
     * @memberof ValidationError
     */
    'msg': string;
    /**
     * 
     * @type {string}
     * @memberof ValidationError
     */
    'type': string;
}
/**
 * 
 * @export
 * @interface ValidationErrorLocInner
 */
export interface ValidationErrorLocInner {
}

/**
 * DefaultApi - axios parameter creator
 * @export
 */
export const DefaultApiAxiosParamCreator = function (configuration?: Configuration) {
    return {
        /**
         * 
         * @summary All Promos
         * @param {any} [stream] 
         * @param {any} [owner] 
         * @param {any} [offset] 
         * @param {any} [limit] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        allPromosPromoGet: async (stream?: any, owner?: any, offset?: any, limit?: any, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/promo`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (stream !== undefined) {
                for (const [key, value] of Object.entries(stream)) {
                    localVarQueryParameter[key] = value;
                }
            }

            if (owner !== undefined) {
                for (const [key, value] of Object.entries(owner)) {
                    localVarQueryParameter[key] = value;
                }
            }

            if (offset !== undefined) {
                for (const [key, value] of Object.entries(offset)) {
                    localVarQueryParameter[key] = value;
                }
            }

            if (limit !== undefined) {
                for (const [key, value] of Object.entries(limit)) {
                    localVarQueryParameter[key] = value;
                }
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary All Tickets
         * @param {any} [owner] 
         * @param {any} [offset] 
         * @param {any} [limit] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        allTicketsTicketGet: async (owner?: any, offset?: any, limit?: any, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/ticket`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (owner !== undefined) {
                for (const [key, value] of Object.entries(owner)) {
                    localVarQueryParameter[key] = value;
                }
            }

            if (offset !== undefined) {
                for (const [key, value] of Object.entries(offset)) {
                    localVarQueryParameter[key] = value;
                }
            }

            if (limit !== undefined) {
                for (const [key, value] of Object.entries(limit)) {
                    localVarQueryParameter[key] = value;
                }
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Get Stream
         * @param {string} ticketAddr 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getStreamTicketTicketAddrGet: async (ticketAddr: string, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            // verify required parameter 'ticketAddr' is not null or undefined
            assertParamExists('getStreamTicketTicketAddrGet', 'ticketAddr', ticketAddr)
            const localVarPath = `/ticket/{ticket_addr}`
                .replace(`{${"ticket_addr"}}`, encodeURIComponent(String(ticketAddr)));
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'GET', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Index Promo
         * @param {any} [fromBlock] 
         * @param {any} [toBlock] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        indexPromoIndexPromoPost: async (fromBlock?: any, toBlock?: any, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/index/promo`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (fromBlock !== undefined) {
                for (const [key, value] of Object.entries(fromBlock)) {
                    localVarQueryParameter[key] = value;
                }
            }

            if (toBlock !== undefined) {
                for (const [key, value] of Object.entries(toBlock)) {
                    localVarQueryParameter[key] = value;
                }
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Index Ticket
         * @param {any} [fromBlock] 
         * @param {any} [toBlock] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        indexTicketIndexTicketPost: async (fromBlock?: any, toBlock?: any, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/index/ticket`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (fromBlock !== undefined) {
                for (const [key, value] of Object.entries(fromBlock)) {
                    localVarQueryParameter[key] = value;
                }
            }

            if (toBlock !== undefined) {
                for (const [key, value] of Object.entries(toBlock)) {
                    localVarQueryParameter[key] = value;
                }
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
        /**
         * 
         * @summary Start Index
         * @param {any} [fromBlock] 
         * @param {any} [toBlock] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        startIndexIndexStartPost: async (fromBlock?: any, toBlock?: any, options: RawAxiosRequestConfig = {}): Promise<RequestArgs> => {
            const localVarPath = `/index/start`;
            // use dummy base URL string because the URL constructor only accepts absolute URLs.
            const localVarUrlObj = new URL(localVarPath, DUMMY_BASE_URL);
            let baseOptions;
            if (configuration) {
                baseOptions = configuration.baseOptions;
            }

            const localVarRequestOptions = { method: 'POST', ...baseOptions, ...options};
            const localVarHeaderParameter = {} as any;
            const localVarQueryParameter = {} as any;

            if (fromBlock !== undefined) {
                for (const [key, value] of Object.entries(fromBlock)) {
                    localVarQueryParameter[key] = value;
                }
            }

            if (toBlock !== undefined) {
                for (const [key, value] of Object.entries(toBlock)) {
                    localVarQueryParameter[key] = value;
                }
            }


    
            setSearchParams(localVarUrlObj, localVarQueryParameter);
            let headersFromBaseOptions = baseOptions && baseOptions.headers ? baseOptions.headers : {};
            localVarRequestOptions.headers = {...localVarHeaderParameter, ...headersFromBaseOptions, ...options.headers};

            return {
                url: toPathString(localVarUrlObj),
                options: localVarRequestOptions,
            };
        },
    }
};

/**
 * DefaultApi - functional programming interface
 * @export
 */
export const DefaultApiFp = function(configuration?: Configuration) {
    const localVarAxiosParamCreator = DefaultApiAxiosParamCreator(configuration)
    return {
        /**
         * 
         * @summary All Promos
         * @param {any} [stream] 
         * @param {any} [owner] 
         * @param {any} [offset] 
         * @param {any} [limit] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async allPromosPromoGet(stream?: any, owner?: any, offset?: any, limit?: any, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.allPromosPromoGet(stream, owner, offset, limit, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DefaultApi.allPromosPromoGet']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary All Tickets
         * @param {any} [owner] 
         * @param {any} [offset] 
         * @param {any} [limit] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async allTicketsTicketGet(owner?: any, offset?: any, limit?: any, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<Array<Stream>>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.allTicketsTicketGet(owner, offset, limit, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DefaultApi.allTicketsTicketGet']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Get Stream
         * @param {string} ticketAddr 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async getStreamTicketTicketAddrGet(ticketAddr: string, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<ResponseGetStreamTicketTicketAddrGet>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.getStreamTicketTicketAddrGet(ticketAddr, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DefaultApi.getStreamTicketTicketAddrGet']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Index Promo
         * @param {any} [fromBlock] 
         * @param {any} [toBlock] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async indexPromoIndexPromoPost(fromBlock?: any, toBlock?: any, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.indexPromoIndexPromoPost(fromBlock, toBlock, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DefaultApi.indexPromoIndexPromoPost']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Index Ticket
         * @param {any} [fromBlock] 
         * @param {any} [toBlock] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async indexTicketIndexTicketPost(fromBlock?: any, toBlock?: any, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.indexTicketIndexTicketPost(fromBlock, toBlock, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DefaultApi.indexTicketIndexTicketPost']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
        /**
         * 
         * @summary Start Index
         * @param {any} [fromBlock] 
         * @param {any} [toBlock] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        async startIndexIndexStartPost(fromBlock?: any, toBlock?: any, options?: RawAxiosRequestConfig): Promise<(axios?: AxiosInstance, basePath?: string) => AxiosPromise<any>> {
            const localVarAxiosArgs = await localVarAxiosParamCreator.startIndexIndexStartPost(fromBlock, toBlock, options);
            const localVarOperationServerIndex = configuration?.serverIndex ?? 0;
            const localVarOperationServerBasePath = operationServerMap['DefaultApi.startIndexIndexStartPost']?.[localVarOperationServerIndex]?.url;
            return (axios, basePath) => createRequestFunction(localVarAxiosArgs, globalAxios, BASE_PATH, configuration)(axios, localVarOperationServerBasePath || basePath);
        },
    }
};

/**
 * DefaultApi - factory interface
 * @export
 */
export const DefaultApiFactory = function (configuration?: Configuration, basePath?: string, axios?: AxiosInstance) {
    const localVarFp = DefaultApiFp(configuration)
    return {
        /**
         * 
         * @summary All Promos
         * @param {any} [stream] 
         * @param {any} [owner] 
         * @param {any} [offset] 
         * @param {any} [limit] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        allPromosPromoGet(stream?: any, owner?: any, offset?: any, limit?: any, options?: any): AxiosPromise<any> {
            return localVarFp.allPromosPromoGet(stream, owner, offset, limit, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary All Tickets
         * @param {any} [owner] 
         * @param {any} [offset] 
         * @param {any} [limit] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        allTicketsTicketGet(owner?: any, offset?: any, limit?: any, options?: any): AxiosPromise<Array<Stream>> {
            return localVarFp.allTicketsTicketGet(owner, offset, limit, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Get Stream
         * @param {string} ticketAddr 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        getStreamTicketTicketAddrGet(ticketAddr: string, options?: any): AxiosPromise<ResponseGetStreamTicketTicketAddrGet> {
            return localVarFp.getStreamTicketTicketAddrGet(ticketAddr, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Index Promo
         * @param {any} [fromBlock] 
         * @param {any} [toBlock] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        indexPromoIndexPromoPost(fromBlock?: any, toBlock?: any, options?: any): AxiosPromise<any> {
            return localVarFp.indexPromoIndexPromoPost(fromBlock, toBlock, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Index Ticket
         * @param {any} [fromBlock] 
         * @param {any} [toBlock] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        indexTicketIndexTicketPost(fromBlock?: any, toBlock?: any, options?: any): AxiosPromise<any> {
            return localVarFp.indexTicketIndexTicketPost(fromBlock, toBlock, options).then((request) => request(axios, basePath));
        },
        /**
         * 
         * @summary Start Index
         * @param {any} [fromBlock] 
         * @param {any} [toBlock] 
         * @param {*} [options] Override http request option.
         * @throws {RequiredError}
         */
        startIndexIndexStartPost(fromBlock?: any, toBlock?: any, options?: any): AxiosPromise<any> {
            return localVarFp.startIndexIndexStartPost(fromBlock, toBlock, options).then((request) => request(axios, basePath));
        },
    };
};

/**
 * DefaultApi - object-oriented interface
 * @export
 * @class DefaultApi
 * @extends {BaseAPI}
 */
export class DefaultApi extends BaseAPI {
    /**
     * 
     * @summary All Promos
     * @param {any} [stream] 
     * @param {any} [owner] 
     * @param {any} [offset] 
     * @param {any} [limit] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public allPromosPromoGet(stream?: any, owner?: any, offset?: any, limit?: any, options?: RawAxiosRequestConfig) {
        return DefaultApiFp(this.configuration).allPromosPromoGet(stream, owner, offset, limit, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary All Tickets
     * @param {any} [owner] 
     * @param {any} [offset] 
     * @param {any} [limit] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public allTicketsTicketGet(owner?: any, offset?: any, limit?: any, options?: RawAxiosRequestConfig) {
        return DefaultApiFp(this.configuration).allTicketsTicketGet(owner, offset, limit, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Get Stream
     * @param {string} ticketAddr 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public getStreamTicketTicketAddrGet(ticketAddr: string, options?: RawAxiosRequestConfig) {
        return DefaultApiFp(this.configuration).getStreamTicketTicketAddrGet(ticketAddr, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Index Promo
     * @param {any} [fromBlock] 
     * @param {any} [toBlock] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public indexPromoIndexPromoPost(fromBlock?: any, toBlock?: any, options?: RawAxiosRequestConfig) {
        return DefaultApiFp(this.configuration).indexPromoIndexPromoPost(fromBlock, toBlock, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Index Ticket
     * @param {any} [fromBlock] 
     * @param {any} [toBlock] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public indexTicketIndexTicketPost(fromBlock?: any, toBlock?: any, options?: RawAxiosRequestConfig) {
        return DefaultApiFp(this.configuration).indexTicketIndexTicketPost(fromBlock, toBlock, options).then((request) => request(this.axios, this.basePath));
    }

    /**
     * 
     * @summary Start Index
     * @param {any} [fromBlock] 
     * @param {any} [toBlock] 
     * @param {*} [options] Override http request option.
     * @throws {RequiredError}
     * @memberof DefaultApi
     */
    public startIndexIndexStartPost(fromBlock?: any, toBlock?: any, options?: RawAxiosRequestConfig) {
        return DefaultApiFp(this.configuration).startIndexIndexStartPost(fromBlock, toBlock, options).then((request) => request(this.axios, this.basePath));
    }
}



