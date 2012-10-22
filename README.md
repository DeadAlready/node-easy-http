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