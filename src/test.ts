// Project: https://github.com/davetemplin/web-request/
// Written by: Dave Templin <https://github.com/davetemplin/>

import * as fs from 'fs';
import * as path from 'path';
import {assert} from 'chai';
import * as WebRequest from './index';

describe('all', function () {
    
    it('get', async function () {
        var response = await WebRequest.get('http://www.google.com/');
        assert(response.contentType === 'text/html', 'contentType');
        assert(response.charset === 'ISO-8859-1', 'charset');
        assert(response.statusCode === 200, 'statusCode');
        assert(response.statusMessage === 'OK', 'statusMessage');
        assert(response.method === 'GET', 'method');
        assert(response.headers['content-type'] === 'text/html; charset=ISO-8859-1', 'headers');        
        assert(response.uri.protocol === 'http:', 'uri.protocol');
        assert(response.uri.host === 'www.google.com', 'uri.host');    
        assert(response.uri.path === '/', 'uri.path');    
        assert(response.contentLength > 1000, 'contentLength');
        assert(response.content.indexOf('<!doctype html>') === 0, 'content');
    });

    it('404', async function () {
        var response = await WebRequest.get('http://www.google.com/invalid');
        assert(response.statusCode === 404);
    });

    it('error', async function () {
        try {
            var response = await WebRequest.get('');
            assert(false, 'Expected exception did not occur');    
        }        
        catch (err) {
            assert(err instanceof WebRequest.RequestError, 'instanceof');
            assert(err.message === 'options.uri is a required argument', 'message');
        }
    });

    it('json1', async function () {
        var result = await WebRequest.json<any>('http://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.quotes+where+symbol+IN+(%22YHOO%22,%22AAPL%22)&format=json&env=http://datatables.org/alltables.env');
        assert(result.query.results.quote[0].Symbol === 'YHOO', 'YHOO');
        assert(result.query.results.quote[1].Symbol === 'AAPL', 'AAPL');
    });
    
    it('json2', async function () {
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
        var result = await WebRequest.json<QuoteResult>('http://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.quotes+where+symbol+IN+(%22YHOO%22,%22AAPL%22)&format=json&env=http://datatables.org/alltables.env');
        assert(result.query.results.quote[0].Symbol === 'YHOO', 'YHOO');
        assert(result.query.results.quote[1].Symbol === 'AAPL', 'AAPL');
    });                
    
    it('cookies', async function () {
        var response = await WebRequest.get('http://www.google.com/', {jar: true});
        assert(response.cookies.length > 0, response.cookies.length.toString() + ' cookies');
    });

    it('stream', async function () {
        var file = 'google.png';
        var request = WebRequest.stream('https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png');        
        var w = fs.createWriteStream(file);
        request.pipe(w);
        var response = await request.response;
        await new Promise(resolve => w.on('finish', () => resolve()));
        var stat = fs.statSync(file);
        assert(stat.size > 10000, 'file-size');
        assert(response.content === null, 'null content');
        fs.unlinkSync(file);
    });

    it('throwResponseError', async function () {
        try {
            await WebRequest.get('http://xyzzy.com/123', {throwResponseError: true});
            assert(false, 'Expected exception did not occur');
        }
        catch (err) {
            assert(err instanceof WebRequest.ResponseError, 'instanceof');
            assert((<WebRequest.ResponseError<string>>err).response.statusCode === 404, 'statusCode');
        }        
    });
});