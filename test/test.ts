// Project: https://github.com/davetemplin/web-request/
// Written by: Dave Templin <https://github.com/davetemplin/>

import * as fs from 'fs';
import * as path from 'path';
import {assert} from 'chai';
import * as WebRequest from '../index';

describe('all', function () {
    
    it('get', async function () {
        var response = await WebRequest.get('http://www.google.com/');
        assert(response.contentType === 'text/html'); //text/html
        assert(response.charset === 'ISO-8859-1');
        assert(response.statusCode === 200);
        assert(response.statusMessage === 'OK');
        assert(response.method === 'GET');
        assert(response.headers['content-type'] === 'text/html; charset=ISO-8859-1');        
        assert(response.uri.protocol === 'http:');    
        assert(response.uri.port === 80);    
        assert(response.uri.host === 'www.google.com');    
        assert(response.uri.path === '/');    
        assert(response.contentLength > 1000);
        assert(response.content.indexOf('<!doctype html>') === 0);
    });

    it('404', async function () {
        var response = await WebRequest.get('http://www.google.com/yahoo');
        assert(response.statusCode === 404);
    });

    it('json1', async function () {
        var result = await WebRequest.json<any>('http://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.quotes+where+symbol+IN+(%22YHOO%22,%22AAPL%22)&format=json&env=http://datatables.org/alltables.env');
        assert(result.query.results.quote[0].Symbol === 'YHOO');
        assert(result.query.results.quote[1].Symbol === 'AAPL');
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
        assert(result.query.results.quote[0].Symbol === 'YHOO');
        assert(result.query.results.quote[1].Symbol === 'AAPL');
    });                
    
    it('cookies', async function () {
        var response = await WebRequest.get('http://www.google.com/', {jar: true});
        assert(response.cookies.length > 0);
    });

    it('stream', async function () {
        const file = 'test/google.png';
        var request = WebRequest.create('https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png');
        var w = fs.createWriteStream(file);
        request.pipe(w);
        await Promise.all([
            request.response,
            new Promise(resolve => w.on('finish', () => resolve()))    
        ]);        
        var stat = fs.statSync(file);
        assert(stat.size > 10000);
        fs.unlinkSync(file);
    });

    it('throw', async function () {
        WebRequest.throwResponseError = true;
        try {
            await WebRequest.get('http://www.google.com/yahoo');
            assert(false, 'Expected exception did not occur');
        }
        catch (err) {
            assert(err instanceof WebRequest.ResponseError, 'err not an instace of ResponseError');
            assert((<WebRequest.ResponseError<string>>err).response.statusCode === 404);
        }        
    });
});