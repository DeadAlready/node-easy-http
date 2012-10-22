
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
module.exports.beforeRequest = function(codes){
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
 * Function for creating res object methods based on codes
 * 
 * @param {Object}  res - response object
 * @return {Object} modified response object
 */
function WrapResponse(res){
  var FUNCS = createFuncs();
  
  FUNCS.forEach(function(func){
    res[func.name] = res[func.code] = _wrapMethod(func);
  });
  return res;
}

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
    
    var str = CODES[i].toUpperCase();
    if(str.length > 12){
      var arr = str.split(' ');
      if(arr.length <2){
        arr = str.split('-');
      }
      var str2 = arr.pop();
      arr.forEach(function(el){
        if(el !== ''){
        str2 = el.charAt(0)+ '_' + str2;
        }
      });
    } else {
      str2 = str.replace(/\s/g, '_');
    }
    funcs.push({
      code: i,
      name: str2,
      message: CODES[i]
    });
  }
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
    this.send(new HTTPError(func.code, message));
  }
}