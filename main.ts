// Project: https://github.com/davetemplin/web-request/
// Written by: Dave Templin <https://github.com/davetemplin/>

import * as fs from 'fs';
import * as WebRequest from './index';

(async function () {
    var result = await WebRequest.get('http://www.google.com/');
    console.log(result.content);
    process.exit();
})();