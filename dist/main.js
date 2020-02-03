"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const WebRequest = require("./index");
(async function () {
    var result = await WebRequest.get('http://www.google.com/');
    console.log(result.content);
    process.exit();
})();
//# sourceMappingURL=main.js.map