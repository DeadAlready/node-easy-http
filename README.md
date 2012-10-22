[easy-http](https://github.com/DeadAlready/node-easy-http) is a middleware for express or restify creating convenience methods for HTTP codes.

# Installation

    $ npm install easy-http

# Usage

easy-http module will return a function for creating the middleware. 

## Default usage

    var easyHttp = require('easy-http');
    app.use(easyHttp());

    app.get('/', function(req, res, next){
      res.OK();
    });

The functions are also usable via the HTTP codes

    app.get('/', function(req, res, next){
      res[404]();
    });

All status codes 300 and up will send a serialized HttpError object as the body of the response.

All status codes are enumerable on the function.

    console.log(require('easy-http').OK); //Prints 200

## HttpError

The HttpError object is a custom error object that also holds the HTTP code.
It extends the regular Error object with the following properties

+ body: *Error body
+ statusCode: *HTTP status code
+ httpCode: *HTTP status code

### codeToHttpError

Besides exporting the HttpError object, easy-http also exports the codeToHttpError function,
which creates the HttpError object. The function takes 2 parameters

+ code: *HTTP status code, default 500
+ message: *Error message, default 'Server Internal Error'

## Configuring

You can also configure the easy-http middleware to change the function names or messages or add custom ones.

This is done by invoking the easy-http function with an object 
containing information about the functions in the following format:

    {
      [code]:{
        name:[name],
        message:[message]
      }
    }

Where [code] is the HTTP code, [name] is the name the function will be given 
and [message] the default message sent.

## Default functions

The following is a JSON description of all the default functions that are created

    {
      "CONTINUE": {"code": "100","message": "Continue"},
      "S_PROTOCOLS": {"code": "101","message": "Switching Protocols"},
      "PROCESSING": {"code": "102","message": "Processing"},
      "OK": {"code": "200","message": "OK"},
      "CREATED": {"code": "201","message": "Created"},
      "ACCEPTED": {"code": "202","message": "Accepted"},
      "N_INFORMATION": {"code": "203","message": "Non-Authoritative Information"},
      "NO_CONTENT": {"code": "204","message": "No Content"},
      "R_CONTENT": {"code": "205","message": "Reset Content"},
      "P_CONTENT": {"code": "206","message": "Partial Content"},
      "MULTISTATUS": {"code": "207","message": "Multi-Status"},
      "M_CHOICES": {"code": "300","message": "Multiple Choices"},
      "M_PERMANENTLY": {"code": "301","message": "Moved Permanently"},
      "M_TEMPORARILY": {"code": "302","message": "Moved Temporarily"},
      "SEE_OTHER": {"code": "303","message": "See Other"},
      "NOT_MODIFIED": {"code": "304","message": "Not Modified"},
      "USE_PROXY": {"code": "305","message": "Use Proxy"},
      "T_REDIRECT": {"code": "307","message": "Temporary Redirect"},
      "BAD_REQUEST": {"code": "400","message": "Bad Request"},
      "UNAUTHORIZED": {"code": "401","message": "Unauthorized"},
      "P_REQUIRED": {"code": "428","message": "Precondition Required"},
      "FORBIDDEN": {"code": "403","message": "Forbidden"},
      "NOT_FOUND": {"code": "404","message": "Not Found"},
      "M_N_ALLOWED": {"code": "405","message": "Method Not Allowed"},
      "N_ACCEPTABLE": {"code": "406","message": "Not Acceptable"},
      "P_A_REQUIRED": {"code": "407","message": "Proxy Authentication Required"},
      "R_TIMEOUT": {"code": "408","message": "Request Time-out"},
      "CONFLICT": {"code": "409","message": "Conflict"},
      "GONE": {"code": "410","message": "Gone"},
      "L_REQUIRED": {"code": "411","message": "Length Required"},
      "P_FAILED": {"code": "412","message": "Precondition Failed"},
      "R_E_T_LARGE": {"code": "413","message": "Request Entity Too Large"},
      "R_T_LARGE": {"code": "414","message": "Request-URI Too Large"},
      "U_M_TYPE": {"code": "415","message": "Unsupported Media Type"},
      "R_R_N_SATISFIABLE": {"code": "416","message": "Requested Range Not Satisfiable"},
      "E_FAILED": {"code": "417","message": "Expectation Failed"},
      "IM_A_TEAPOT": {"code": "418","message": "I'm a teapot"},
      "U_ENTITY": {"code": "422","message": "Unprocessable Entity"},
      "LOCKED": {"code": "423","message": "Locked"},
      "F_DEPENDENCY": {"code": "424","message": "Failed Dependency"},
      "U_COLLECTION": {"code": "425","message": "Unordered Collection"},
      "U_REQUIRED": {"code": "426","message": "Upgrade Required"},
      "T_M_REQUESTS": {"code": "429","message": "Too Many Requests"},
      "R_H_F_T_LARGE": {"code": "431","message": "Request Header Fields Too Large"},
      "I_S_ERROR": {"code": "500","message": "Internal Server Error"},
      "N_IMPLEMENTED": {"code": "501","message": "Not Implemented"},
      "BAD_GATEWAY": {"code": "502","message": "Bad Gateway"},
      "S_UNAVAILABLE": {"code": "503","message": "Service Unavailable"},
      "G_TIMEOUT": {"code": "504","message": "Gateway Time-out"},
      "H_V_N_SUPPORTED": {"code": "505","message": "HTTP Version not supported"},
      "V_A_NEGOTIATES": {"code": "506","message": "Variant Also Negotiates"},
      "I_STORAGE": {"code": "507","message": "Insufficient Storage"},
      "B_L_EXCEEDED": {"code": "509","message": "Bandwidth Limit Exceeded"},
      "NOT_EXTENDED": {"code": "510","message": "Not Extended"},
      "N_A_REQUIRED": {"code": "511","message": "Network Authentication Required"}
    }

## License

The MIT License (MIT)
Copyright (c) 2012 Karl Düüna

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.