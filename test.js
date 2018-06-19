"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require("fs");
var chai_1 = require("chai");
var WebRequest = require("./index");
describe('all', function () {
    it('get', function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, WebRequest.get('http://www.google.com/')];
                    case 1:
                        response = _a.sent();
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
                        return [2];
                }
            });
        });
    });
    it('404', function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, WebRequest.get('http://www.google.com/invalid')];
                    case 1:
                        response = _a.sent();
                        chai_1.assert(response.statusCode === 404);
                        return [2];
                }
            });
        });
    });
    it('error', function () {
        return __awaiter(this, void 0, void 0, function () {
            var response, err_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, WebRequest.get('')];
                    case 1:
                        response = _a.sent();
                        chai_1.assert(false, 'Expected exception did not occur');
                        return [3, 3];
                    case 2:
                        err_1 = _a.sent();
                        chai_1.assert(err_1 instanceof WebRequest.RequestError, 'instanceof');
                        chai_1.assert(err_1.message === 'options.uri is a required argument', 'message');
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    });
    it('json1', function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, WebRequest.json('http://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.quotes+where+symbol+IN+(%22YHOO%22,%22AAPL%22)&format=json&env=http://datatables.org/alltables.env')];
                    case 1:
                        result = _a.sent();
                        chai_1.assert(result.query.results.quote[0].Symbol === 'YHOO', 'YHOO');
                        chai_1.assert(result.query.results.quote[1].Symbol === 'AAPL', 'AAPL');
                        return [2];
                }
            });
        });
    });
    it('json2', function () {
        return __awaiter(this, void 0, void 0, function () {
            var result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        return [4, WebRequest.json('http://query.yahooapis.com/v1/public/yql?q=select+*+from+yahoo.finance.quotes+where+symbol+IN+(%22YHOO%22,%22AAPL%22)&format=json&env=http://datatables.org/alltables.env')];
                    case 1:
                        result = _a.sent();
                        chai_1.assert(result.query.results.quote[0].Symbol === 'YHOO', 'YHOO');
                        chai_1.assert(result.query.results.quote[1].Symbol === 'AAPL', 'AAPL');
                        return [2];
                }
            });
        });
    });
    it('cookies', function () {
        return __awaiter(this, void 0, void 0, function () {
            var response;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4, WebRequest.get('http://www.google.com/', { jar: true })];
                    case 1:
                        response = _a.sent();
                        chai_1.assert(response.cookies.length > 0, response.cookies.length.toString() + ' cookies');
                        return [2];
                }
            });
        });
    });
    it('stream', function () {
        return __awaiter(this, void 0, void 0, function () {
            var file, request, w, response, stat;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        file = 'google.png';
                        request = WebRequest.stream('https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png');
                        w = fs.createWriteStream(file);
                        request.pipe(w);
                        return [4, request.response];
                    case 1:
                        response = _a.sent();
                        return [4, new Promise(function (resolve) { return w.on('finish', function () { return resolve(); }); })];
                    case 2:
                        _a.sent();
                        stat = fs.statSync(file);
                        chai_1.assert(stat.size > 10000, 'file-size');
                        chai_1.assert(response.content === null, 'null content');
                        fs.unlinkSync(file);
                        return [2];
                }
            });
        });
    });
    it('throwResponseError', function () {
        return __awaiter(this, void 0, void 0, function () {
            var err_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4, WebRequest.get('http://xyzzy.com/123', { throwResponseError: true })];
                    case 1:
                        _a.sent();
                        chai_1.assert(false, 'Expected exception did not occur');
                        return [3, 3];
                    case 2:
                        err_2 = _a.sent();
                        chai_1.assert(err_2 instanceof WebRequest.ResponseError, 'instanceof');
                        chai_1.assert(err_2.response.statusCode === 404, 'statusCode');
                        return [3, 3];
                    case 3: return [2];
                }
            });
        });
    });
});
//# sourceMappingURL=test.js.map