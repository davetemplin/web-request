"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var request = require('request');
exports.throwResponseError = false;
function get(uri, options) {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, create(uri, Object.assign({}, options, { method: 'GET' })).response];
            case 1: return [2, _a.sent()];
        }
    }); });
}
exports.get = get;
function post(uri, options, content) {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, create(uri, Object.assign({}, options, { method: 'POST' }), content).response];
            case 1: return [2, _a.sent()];
        }
    }); });
}
exports.post = post;
function put(uri, options, content) {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, create(uri, Object.assign({}, options, { method: 'PUT' }), content).response];
            case 1: return [2, _a.sent()];
        }
    }); });
}
exports.put = put;
function patch(uri, options, content) {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, create(uri, Object.assign({}, options, { method: 'PATCH' }), content).response];
            case 1: return [2, _a.sent()];
        }
    }); });
}
exports.patch = patch;
function head(uri, options) {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, create(uri, Object.assign({}, options, { method: 'HEAD' })).response];
            case 1: return [2, _a.sent()];
        }
    }); });
}
exports.head = head;
function del(uri, options) {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, create(uri, Object.assign({}, options, { method: 'DELETE' })).response];
            case 1: return [2, _a.sent()];
        }
    }); });
}
exports.del = del;
exports.delete = del;
function json(uri, options) {
    return __awaiter(this, void 0, void 0, function () { return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4, create(uri, Object.assign({}, options, { json: true })).response];
            case 1: return [2, (_a.sent()).content];
        }
    }); });
}
exports.json = json;
function create(uri, options, content) {
    options = Object.assign({}, options, { uri: uri });
    if (options.jar === true)
        options.jar = request.jar();
    if (content !== undefined)
        options.body = content;
    var throwEnabled = exports.throwResponseError;
    if (options.throwResponseError !== undefined)
        throwEnabled = options.throwResponseError;
    var instance;
    var promise = new Promise(function (resolve, reject) {
        instance = request(options, function (err, message, body) {
            if (!err) {
                var response = new Response(instance, message, body);
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
exports.create = create;
function stream(uri, options, content) {
    options = Object.assign({}, options, { uri: uri });
    if (options.jar === true)
        options.jar = request.jar();
    if (content !== undefined)
        options.body = content;
    var instance = request(options);
    instance.options = options;
    instance.response = new Promise(function (resolve, reject) {
        return instance
            .on('complete', function (message) {
            var response = new Response(instance, message, null);
            if (message.statusCode < 400 || !exports.throwResponseError)
                resolve(response);
            else
                reject(new ResponseError(response));
        })
            .on('error', function (err) { return reject(new RequestError(err, instance)); });
    });
    return instance;
}
exports.stream = stream;
function defaults(options) {
    if (options.throwResponseError !== undefined)
        exports.throwResponseError = options.throwResponseError;
    request.defaults(options);
}
exports.defaults = defaults;
function debug(value) {
    if (value === undefined)
        return request.debug;
    else
        request.debug = value;
}
exports.debug = debug;
var RequestError = (function (_super) {
    __extends(RequestError, _super);
    function RequestError(err, request) {
        var _this = _super.call(this, err.message) || this;
        _this.request = request;
        _this.innerError = err;
        return _this;
    }
    return RequestError;
}(Error));
exports.RequestError = RequestError;
var Response = (function () {
    function Response(request, message, body) {
        this.request = request;
        this.message = message;
        this.body = body;
    }
    Object.defineProperty(Response.prototype, "charset", {
        get: function () { return parseContentType(this.message.headers['content-type']).charset; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "content", {
        get: function () {
            return this.body;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "contentLength", {
        get: function () {
            if ('content-length' in this.message.headers)
                return parseInt(this.message.headers['content-length']);
            else if (typeof this.body === 'string')
                return this.body.length;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "contentType", {
        get: function () { return parseContentType(this.message.headers['content-type']).contentType; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "cookies", {
        get: function () {
            if (typeof this.request.options.jar === 'object') {
                var jar = this.request.options.jar;
                return jar.getCookies(this.request.options.uri);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "headers", {
        get: function () { return this.message.headers; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "httpVersion", {
        get: function () { return this.message.httpVersion; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "lastModified", {
        get: function () { return new Date(this.message.headers['last-modified']); },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "method", {
        get: function () { return this.message.method || this.message.request.method; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "server", {
        get: function () { return this.message.headers['server']; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "statusCode", {
        get: function () { return this.message.statusCode; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "statusMessage", {
        get: function () { return this.message.statusMessage; },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Response.prototype, "uri", {
        get: function () { return this.message.request.uri; },
        enumerable: true,
        configurable: true
    });
    return Response;
}());
exports.Response = Response;
var ResponseError = (function (_super) {
    __extends(ResponseError, _super);
    function ResponseError(response) {
        var _this = _super.call(this, response.statusMessage) || this;
        _this.response = response;
        _this.statusCode = response.statusCode;
        return _this;
    }
    return ResponseError;
}(Error));
exports.ResponseError = ResponseError;
function parseKeyValue(text) {
    var i = text.indexOf('=');
    return {
        key: i > 0 ? text.substring(0, i) : text,
        value: i > 0 ? text.substring(i + 1) : null
    };
}
function parseContentType(text) {
    var list = text ? text.split('; ') : [];
    var tuple1 = list.length > 0 ? parseKeyValue(list[0]) : null;
    var tuple2 = list.length > 1 ? parseKeyValue(list[1]) : null;
    return {
        contentType: tuple1 ? tuple1.key : null,
        charset: tuple2 && tuple2.key.toLowerCase() === 'charset' ? tuple2.value : null
    };
}
//# sourceMappingURL=index.js.map