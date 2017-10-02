// Project: https://github.com/davetemplin/web-request/
// Written by: Dave Templin <https://github.com/davetemplin/>

import * as http from 'http';
import * as _stream from 'stream';
import {Url} from 'url';
//import * as FormData from 'form-data';
var request = require('request');

export var throwResponseError = false;

export async function get(uri: string, options?: RequestOptions): Promise<Response<string>> { return await create<string>(uri, Object.assign({}, options, {method: 'GET'})).response; }
export async function post(uri: string, options?: RequestOptions, content?: any): Promise<Response<string>> { return await create<string>(uri, Object.assign({}, options, {method: 'POST'}), content).response; }
export async function put(uri: string, options?: RequestOptions, content?: any): Promise<Response<string>> { return await create<string>(uri, Object.assign({}, options, {method: 'PUT'}), content).response; }
export async function patch(uri: string, options?: RequestOptions, content?: any): Promise<Response<string>> { return await create<string>(uri, Object.assign({}, options, {method: 'PATCH'}), content).response; }
export async function head(uri: string, options?: RequestOptions): Promise<Response<void>> { return await create<void>(uri, Object.assign({}, options, {method: 'HEAD'})).response; }
export async function del(uri: string, options?: RequestOptions): Promise<Response<string>> { return await create<string>(uri, Object.assign({}, options, {method: 'DELETE'})).response; }
export async function json<T>(uri: string, options?: RequestOptions): Promise<T> { return (await create<T>(uri, Object.assign({}, options, {json: true})).response).content; }
export {del as delete};

export function create<T>(uri: string, options?: RequestOptions, content?: any): Request<T> {
    options = Object.assign({}, options, {uri: uri});    
    if (options.jar === true)
        options.jar = request.jar();    
    if (content !== undefined)
        options.body = content;
    var throwEnabled = throwResponseError;
    if (options.throwResponseError !== undefined)
        throwEnabled = options.throwResponseError;
       
    var instance: Request<T>; 
    var promise = new Promise<Response<T>>((resolve, reject) => {
        instance = request(options, (err: Error, message: http.IncomingMessage, body: T) => {
            if (!err) {
                var response = new Response<T>(instance, message, body);
                if (message.statusCode < 400 || !throwEnabled)
                    resolve(response);
                else
                    reject(new ResponseError(response));
            }
            else {
                reject(new RequestError(err, instance));
            }
        });        
    });
    
    instance.options = options;
    instance.response = promise;
    
    return instance;
}

export function stream(uri: string, options?: RequestOptions, content?: any): Request<void> {
    options = Object.assign({}, options, {uri: uri});    
    if (options.jar === true)
        options.jar = request.jar();
    if (content !== undefined)
        options.body = content;
    
    var instance: Request<void> = request(options);
    instance.options = options;
    instance.response = new Promise<Response<void>>((resolve, reject) =>
        instance
            .on('complete', message => {
                var response = new Response<void>(instance, message, null);
                if (message.statusCode < 400 || !throwResponseError)
                    resolve(response);
                else
                    reject(new ResponseError<void>(response));
            })
            .on('error', err => reject(new RequestError(err, instance))));
        
    return instance;
}

export function defaults(options: RequestOptions): void {
    if (options.throwResponseError !== undefined)
        throwResponseError = options.throwResponseError;
    request.defaults(options);
}

export function debug(value?: boolean): boolean {
    if (value === undefined)
        return request.debug;
    else
        request.debug = value;
}

export interface AuthOptions {
    user?: string;
    username?: string;
    pass?: string;
    password?: string;
    sendImmediately?: boolean;
    bearer?: string;
}

export interface AWSOptions {
    secret: string;
    bucket?: string;
}

export interface Cookie extends Array<CookieValue> {
    //constructor(name: string, req: Request): void;
    str: string;
    expires: Date;
    path: string;
    domain: string;
    toString(): string;
}

export interface CookieJar {
    setCookie(cookie: Cookie, uri: string | Url, options?: any): void
    getCookieString(uri: string | Url): string
    getCookies(uri: string | Url): Cookie[]
}

export interface CookieValue {
    name: string;
    value: any;
    httpOnly: boolean;
}

export interface Headers {
    [key: string]: any;
}

export interface HttpArchiveRequest {
    url?: string;
    method?: string;
    headers?: NameValuePair[];
    postData?: {
        mimeType?: string;
        params?: NameValuePair[];
    }
}

export interface Multipart {
    chunked?: boolean;
    data?: {
        'content-type'?: string,
        body: string
    }[];
}

export interface NameValuePair {
    name: string;
    value: string;
}

export interface RequestPart {
    headers?: Headers;
    body: any;
}

export interface OAuthOptions {
    callback?: string;
    consumer_key?: string;
    consumer_secret?: string;
    token?: string;
    token_secret?: string;
    verifier?: string;
}

export interface Request<T> extends _stream.Stream {
    headers: Headers;
    method: string;
    readable: boolean;
    uri: Url;
    writable: boolean;

    getAgent(): http.Agent;
    pipeDest(dest: any): void;
    setHeader(name: string, value: string, clobber?: boolean): this;
    setHeaders(headers: Headers): this;
    qs(q: Object, clobber?: boolean): this;
    form(): any; //FormData.FormData;
    form(form: any): this;
    multipart(multipart: RequestPart[]): this;
    json(val: any): this;
    aws(opts: AWSOptions, now?: boolean): this;
    auth(username: string, password: string, sendImmediately?: boolean, bearer?: string): this;
    oauth(oauth: OAuthOptions): this;
    jar(jar: CookieJar): this;

    on(event: string, listener: Function): this;
    on(event: 'request', listener: (req: http.ClientRequest) => void): this;
    on(event: 'response', listener: (resp: http.IncomingMessage) => void): this;
    on(event: 'data', listener: (data: Buffer | string) => void): this;
    on(event: 'error', listener: (err: Error) => void): this;
    on(event: 'complete', listener: (resp: http.IncomingMessage, body?: string | Buffer) => void): this;

    write(buffer: Buffer, cb?: Function): boolean;
    write(str: string, cb?: Function): boolean;
    write(str: string, encoding: string, cb?: Function): boolean;
    write(str: string, encoding?: string, fd?: string): boolean;
    end(): void;
    end(chunk: Buffer, cb?: Function): void;
    end(chunk: string, cb?: Function): void;
    end(chunk: string, encoding: string, cb?: Function): void;
    pause(): void;
    resume(): void;
    abort(): void;
    destroy(): void;
    toJSON(): Object;
    
    options: RequestOptions; // extension
    response: Promise<Response<T>>; // extension
}

export interface RequestOptions {
    baseUrl?: string;
    jar?: CookieJar|boolean;
    formData?: Object;
    form?: Object|string;
    auth?: AuthOptions;
    oauth?: OAuthOptions;
    aws?: {secret: string; bucket?: string;};
    hawk?: {credentials: any;};
    qs?: any;
    json?: any;
    multipart?: RequestPart[]|Multipart;
    agentOptions?: any;
    agentClass?: any;
    forever?: any;
    host?: string;
    port?: number;
    method?: string;
    headers?: Headers;
    body?: any;
    followRedirect?: boolean|((response: http.IncomingMessage) => boolean);
    followAllRedirects?: boolean;
    maxRedirects?: number;
    encoding?: string | null;
    pool?: any;
    timeout?: number;
    proxy?: any;
    strictSSL?: boolean;
    rejectUnauthorized?: boolean;
    gzip?: boolean;
    preambleCRLF?: boolean;
    postambleCRLF?: boolean;
    key?: Buffer;
    cert?: Buffer;
    passphrase?: string;
    ca?: Buffer;
    har?: HttpArchiveRequest;
    useQuerystring?: boolean;
    uri?: string; // extension
    throwResponseError?: boolean; // extension
}

export class RequestError<T> extends Error {
    request: Request<T>;
    innerError: Error;
    constructor(err: Error, request: Request<T>) {
        super(err.message);
        this.request = request;
        this.innerError = err;
    }
}

export class Response<T> {
    request: Request<T>;
    message: http.IncomingMessage;
    private body: T;
    
    constructor(request: Request<T>, message: http.IncomingMessage, body: T) {
        this.request = request;
        this.message = message;
        this.body = body;
    }
    
    get charset(): string { return parseContentType(<string>this.message.headers['content-type']).charset; }
    get content(): T { 
        return <T>this.body; }  
    get contentLength(): number { 
        if ('content-length' in this.message.headers)
            return parseInt(<string>this.message.headers['content-length']);
        else if (typeof this.body === 'string')
            return (<any>this.body).length;
     }
    get contentType(): string { return parseContentType(<string>this.message.headers['content-type']).contentType; }
    get cookies(): Cookie[] {
        if (typeof this.request.options.jar === 'object') {
            var jar = <CookieJar>this.request.options.jar;
            return jar.getCookies(this.request.options.uri); 
        }
    }
    get headers(): Headers { return this.message.headers; }
    get httpVersion(): string { return this.message.httpVersion; }
    get lastModified(): Date { return new Date(this.message.headers['last-modified']); }    
    get method(): string { return this.message.method || (<any>this.message).request.method; }
    get server(): string { return <string>this.message.headers['server']; }
    get statusCode(): number { return this.message.statusCode; }
    get statusMessage(): string { return this.message.statusMessage; }        
    get uri(): Url { return (<any>this.message).request.uri; }
}

export class ResponseError<T> extends Error {
    response: Response<T>;
    statusCode: number;
    constructor(response: Response<T>) {
        super(response.statusMessage);
        this.response = response;
        this.statusCode = response.statusCode;
    }
}

function parseKeyValue(text: string): {key: string; value: string} {
    var i = text.indexOf('=');
    return {
        key: i > 0 ? text.substring(0, i) : text,
        value: i > 0 ? text.substring(i + 1) : null
    };
}

function parseContentType(text: string): {contentType: string; charset: string;} {
    var list = text ? text.split('; ') : [];
    var tuple1 = list.length > 0 ? parseKeyValue(list[0]) : null;
    var tuple2 = list.length > 1 ? parseKeyValue(list[1]) : null;    
    return {
        contentType: tuple1 ? tuple1.key : null,
        charset: tuple2 && tuple2.key.toLowerCase() === 'charset' ? tuple2.value : null
    };
}
