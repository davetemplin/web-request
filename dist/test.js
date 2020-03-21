"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const chai_1 = require("chai");
const WebRequest = require("./index");
describe('all', function () {
    it('get', async function () {
        var response = await WebRequest.get('http://www.google.com/');
        chai_1.assert(response.contentType === 'text/html', 'contentType');
        chai_1.assert(response.charset === 'ISO-8859-1', 'charset');
        chai_1.assert(response.statusCode === 200, 'statusCode');
        chai_1.assert(response.statusMessage === 'OK', 'statusMessage');
        chai_1.assert(response.method === 'GET', 'method');
        chai_1.assert(response.headers['content-type'] === 'text/html; charset=ISO-8859-1', 'headers');
        chai_1.assert(response.uri.protocol === 'http:', 'uri.protocol');
        chai_1.assert(response.uri.host === 'www.google.com', 'uri.host');
        chai_1.assert(response.uri.path === '/', 'uri.path');
        chai_1.assert(response.contentLength > 1000, 'contentLength');
        chai_1.assert(response.content.indexOf('<!doctype html>') === 0, 'content');
    });
    it('404', async function () {
        var response = await WebRequest.get('http://www.google.com/invalid');
        chai_1.assert(response.statusCode === 404);
    });
    it('error', async function () {
        try {
            var response = await WebRequest.get('');
            chai_1.assert(false, 'Expected exception did not occur');
        }
        catch (err) {
            chai_1.assert(err instanceof WebRequest.RequestError, 'instanceof');
            chai_1.assert(err.message === 'options.uri is a required argument', 'message');
        }
    });
    it('json1', async function () {
        var result = await WebRequest.json('http://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.quotes+where+symbol+IN+(%22YHOO%22,%22AAPL%22)&format=json&env=http://datatables.org/alltables.env');
        chai_1.assert(result.query.results.quote[0].Symbol === 'YHOO', 'YHOO');
        chai_1.assert(result.query.results.quote[1].Symbol === 'AAPL', 'AAPL');
    });
    it('json2', async function () {
        var result = await WebRequest.json('http://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.quotes+where+symbol+IN+(%22YHOO%22,%22AAPL%22)&format=json&env=http://datatables.org/alltables.env');
        chai_1.assert(result.query.results.quote[0].Symbol === 'YHOO', 'YHOO');
        chai_1.assert(result.query.results.quote[1].Symbol === 'AAPL', 'AAPL');
    });
    it('cookies', async function () {
        var response = await WebRequest.get('http://www.google.com/', { jar: true });
        chai_1.assert(response.cookies.length > 0, response.cookies.length.toString() + ' cookies');
    });
    it('stream', async function () {
        var file = 'google.png';
        var request = WebRequest.stream('https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png');
        var w = fs.createWriteStream(file);
        request.pipe(w);
        var response = await request.response;
        await new Promise(resolve => w.on('finish', () => resolve()));
        var stat = fs.statSync(file);
        chai_1.assert(stat.size > 10000, 'file-size');
        chai_1.assert(response.content === null, 'null content');
        fs.unlinkSync(file);
    });
    it('throwResponseError', async function () {
        try {
            await WebRequest.get('http://xyzzy.com/123', { throwResponseError: true });
            chai_1.assert(false, 'Expected exception did not occur');
        }
        catch (err) {
            chai_1.assert(err instanceof WebRequest.ResponseError, 'instanceof');
            chai_1.assert(err.response.statusCode === 404, 'statusCode');
        }
    });
});
//# sourceMappingURL=test.js.map