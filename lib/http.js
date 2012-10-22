/* 
 * Copyright 2012 Karl Düüna <karl.dyyna@gmail.com> All rights reserved.
 */
'use strict';

var util = require('util');
var http = require('http');
var CODES = http.STATUS_CODES;
var REMAP = {};

function HttpError(code, message, body, constructorOpt) {
  if (Error.captureStackTrace)
    Error.captureStackTrace(this, constructorOpt || HttpError);

  code = parseInt(code, 10);

  this.message = message || '';
  this.body = body || (message ? { message: message } : '');
  this.statusCode = this.httpCode = code;
}
util.inherits(HttpError, Error);
HttpError.prototype.name = 'HttpError';

// Provide function for restify to wrap 
module.exports = function(codes){
  if(codes){
    for(var i in codes){
      var prev = CODES[i] ? CODES[i] : '';
      CODES[i] = codes[i].message || prev;
      if(codes[i].name){
        REMAP[i] = codes[i].name;
      }
    }
  }
  return function(req, res, next){
    res.log = req.log;
    res = WrapResponse(res);
    next();
  }
}

/**
 * Function for creating a HttpError based on the error code
 * 
 * @param {Number} [code=500] HTTP status code
 * @param {String} [message='Internal Server Error'
 * 
 * @return HttpError
 */
function codeToHttpError(code, message){
  code = code || 500;
  message = message || CODES[code];
  
  return new HttpError(code, message);
}

Object.defineProperty(module.exports, 'HttpError',{value:HttpError});
Object.defineProperty(module.exports, 'codeToHttpError',{value:codeToHttpError});

/**
 * Function for creating res object methods based on codes
 * 
 * @param {Object}  res - response object
 * @return {Object} modified response object
 */
function WrapResponse(res){
  var FUNCS = _createFuncs();
  
  FUNCS.forEach(function(func){
    res[func.name] = res[func.code] = _wrapMethod(func);
  });
  res.CODES = CODES;
  return res;
}

/**
 * Function creating an object containing the info about functions
 * 
 * @return {Object}
 */
function _createFuncs(){
  var funcs = [];
  for(var i in CODES){
    if(REMAP[i]){
      funcs.push({
        code: i,
        name: REMAP[i],
        message: CODES[i]
      });
      continue;
    }
    
    var str = CODES[i].toUpperCase().replace(/[\'-]/g,'');
    var name;
    if(str.length > 12){
      var arr = str.split(' ');
      name = arr.pop();
      arr.forEach(function(el){
        if(el !== ''){
          name = el.charAt(0)+ '_' + name;
        }
      });
    } else {
      name = str.replace(/\s/g, '_');
    }
    
    funcs.push({
      code: i,
      name: name,
      message: CODES[i]
    });
  }
  funcs.forEach(function(func){
    module.exports[func.name] = func.code;
  });
  return funcs;
}

/**
 * Function for creating a single method 
 * 
 * @param {Object} object describing the function
 * @return {Function}
 */
function _wrapMethod(func){
  // Non error codes
  if(func.code < 300){
    return function(message){
      if(this.log){
        // Log method
        this.log.debug(message);
      }
      message = message || func.message;
      // If we are dealing with json response then set correct header
      if(typeof message !== 'string' && typeof message !== 'number'){
        this.contentType = 'json';
      }
      // Relay
      this.send(func.code, message);
    }
  }
  // Error responses
  return function(message){
    if(this.log){
      // Log method
      this.log.error(message);
    }
    // If error object then take message
    if(message instanceof Error){
      message = message.message;
    } else {
      message = message || func.message;
    }
    // Send custom Error message
    this.send(new HttpError(func.code, message));
  }
}