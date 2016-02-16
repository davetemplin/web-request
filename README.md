# web-request
> Simplifies making web requests with TypeScript async/await

This package makes it easier to perform web requests using [TypeScript](http://www.typescriptlang.org/) and [**async-await**](https://blogs.msdn.microsoft.com/typescript/2015/11/03/what-about-asyncawait/).
It wraps the popular [request](https://www.npmjs.com/package/request) package, extending it with an interface that facilitates async-await and strong-typing.

## Examples

Fetch web-page content as a string...
```js
import {WebRequest} from 'web-request';
var result = await WebRequest.get('http://www.google.com/');
console.log(result.statusCode);
console.log(result.content);
```

Fetch json data...
```js
import {WebRequest} from 'web-request';
var url = 'http://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.quotes+where+symbol+IN+(%22YHOO%22,%22AAPL%22)&format=json&env=http://datatables.org/alltables.env';
var result = await WebRequest.json<any>(url);
for (var quote of result.query.results.quote)
    console.log(quote.Symbol, quote.Bid, 'low='+quote.DaysLow, 'high='+quote.DaysHigh, 'vol='+quote.Volume);  
```

Fetch json data with a strongly typed result...
```js
import {WebRequest} from 'web-request';
interface QuoteResult {
    query: {
        results: {
            quote: Array<{
                Symbol: string;
                Bid: string;
                DaysHigh: string;
                DaysLow: string;
                Volume: string;
            }>
        }
    }
}    
var url = 'http://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.quotes+where+symbol+IN+(%22YHOO%22,%22AAPL%22)&format=json&env=http://datatables.org/alltables.env';
var result = await WebRequest.json<QuoteResult>(url);
for (var quote of result.query.results.quote)
    console.log(quote.Symbol, quote.Bid, 'low='+quote.DaysLow, 'high='+quote.DaysHigh, 'vol='+quote.Volume);  
```

Perform a series of REST operations, one-by-one...
```js
// Transfer all orders from customer #123 to customer #321 and then delete customer #123...
var orders = await WebRequest.json<Order[]>('http://www.example.com/customers/123/orders');
// Change status of all orders to backorder...
for (var order of orders)
    order.status = "backorder";
await WebRequest.post('http://www.example.com/customers/321/orders', null, orders);
await WebRequest.del('http://www.example.com/customers/123');
// Flag order #98765 as shipped...
await WebRequest.patch('http://www.example.com/customers/321/orders/98765', null, {status: "shipped"});
```

## Getting Started

Make sure you're running Node v4 and TypeScript 1.7 or higher...
```
$ node -v
v4.2.6
$ npm install -g typescript
$ tsc -v
Version 1.7.5
```

Install the *web-request* package...
```
$ npm install web-request
```

Write some code...
```js
import {WebRequest} from 'web-request';
var result = await WebRequest.get('http://www.google.com/');
console.log(result.content);
```

Save the above to a file (index.ts), build and run it!
```
$ tsc index.ts --target es6 --module commonjs
$ node index.js
YHOO 26.90 low=26.72 high=27.32 vol=13011853
AAPL 93.77 low=93.01 high=94.50 vol=40351381
```

## API Documentation

```js
async function get(uri: string, options?: RequestOptions): Promise<Response<string>>;
async function post(uri: string, options?: RequestOptions, content?: any): Promise<Response<string>>;
async function put(uri: string, options?: RequestOptions, content?: any): Promise<Response<string>>;
async function patch(uri: string, options?: RequestOptions, content?: any): Promise<Response<string>>;
async function head(uri: string, options?: RequestOptions): Promise<Response<void>>;
async function del(uri: string, options?: RequestOptions): Promise<Response<string>>;
async function json<T>(uri: string, options?: RequestOptions): Promise<T>;
async function create<T>(uri: string, options?: RequestOptions, content?: any): Promise<Response<T>>;
function defaults(options: RequestOptions): void;
var throwResponseError = false;

interface Request<T> extends request.Request {
    options: RequestOptions;
    response: Promise<Response<T>>;
}

class Response<T> {
    request: Request<T>;
    message: http.IncomingMessage;
    get charset(): string;
    get content(): T;  
    get contentLength(): number; 
    get contentType(): string;
    get cookies(): Cookie[];
    get headers(): Headers;
    get httpVersion(): string;
    get lastModified(): Date;    
    get method(): string;
    get server(): string;
    get statusCode(): number;
    get statusMessage(): string;        
    get uri(): Uri;
}
```

Note the following interfaces are as defined by *request*...

* [RequestOptions](https://www.npmjs.com/package/request#requestoptions-callback)
* [http.IncomingMessage](https://nodejs.org/api/http.html#http_http_incomingmessage)

## Notes
* Setting **WebRequest.throwResponseError=true** will cause any response with a 400 or 500 level status to throw an exception.

## More Examples

Setting defaults for all requests is supported...
```js
WebRequest.defaults({
    'proxy': 'http://localproxy.com',
    'baseUrl': 'https://example.com/api/'
});
```

Adapted [HTTP Authentication](https://www.npmjs.com/package/request#http-authentication) example...
```js
await WebRequest.get('http://some.server.com/', {
  auth: {
    user: 'username',
    pass: 'password',
    sendImmediately: false
  }});
```

Adapted [Custom HTTP Headers](https://www.npmjs.com/package/request#custom-http-headers) example...
```js
await WebRequest.get('https://api.github.com/repos/request/request', {headers: {'User-Agent': 'request'}});
```

To enable cookies, set jar to true or specify a custom cookie jar...
```js
var response = await WebRequest.get('https://www.google.com/', {jar: true});
console.log(response.cookies);
```

[Streaming](https://www.npmjs.com/package/request#streaming) is possible using create...
```js
var request = WebRequest.create('http://img15.hostingpics.net/pics/944021EarthHighRes.png'); // 4.3Mb
var w = fs.createWriteStream('earth.png');
request.pipe(w);
await Promise.all([
    request.response,
    new Promise(resolve => w.on('finish', () => resolve()))    
]);
```

```js
var request = WebRequest.create('http://mysite.com/obj.json', {method:'put'});
fs.createReadStream('file.json').pipe(request);
await request.response;
```

```js
var request1 = WebRequest.create('http://google.com/img.png', {method:'get'});
var request2 = WebRequest.create('http://mysite.com/img.png', {method:'put'});
request1.pipe(request2);
await Promise.all([request1.response, request2.response]);
```

Accessing chunked data...
```js
var request = WebRequest.create('http://www.google.com', {method: 'GET', gzip: true}); 

// decompressed data as it is received
request.on('data', data =>     
    console.log('decoded chunk: ' + data)); 

// unmodified http.IncomingMessage object
request.on('response', response =>     
    response.on('data', (data:any) =>          
        console.log('received ' + data.length + ' bytes of compressed data'))); // compressed data as it is received


var response = await request.response;

// body is the decompressed response body 
console.log('server encoded the data as: ' + (response.headers['content-encoding'] || 'identity'));
console.log('the decoded data is: ' + response.content);
```

Adapted [multipart](https://www.npmjs.com/package/request#multipartrelated) example...
```js
var rand = Math.floor(Math.random()*100000000).toString();
var url = 'http://mikeal.iriscouch.com/testjs/' + rand;
var response = await WebRequest.create(url, {
    method: 'PUT', 
    multipart: [
        { 
            'content-type': 'application/json', 
            body: JSON.stringify({foo: 'bar', _attachments: {'message.txt': {follows: true, length: 18, 'content_type': 'text/plain' }}})
        },
        {
            body: 'I am an attachment' 
        }
    ]}).response;
if (response.statusCode == 201) {
    console.log('document saved as: http://mikeal.iriscouch.com/testjs/'+ rand);
}
else {
    console.log('error: ' + response.statusCode);
    console.log(response.content);
}
```